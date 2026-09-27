import { router, json, error, secrets } from '@appdeploy/sdk';
import nodemailer from 'nodemailer';

type ApiBody = { [key: string]: unknown };
type CheckoutBody = {
  reference: string;
  expectedAmount: number;
  userId: string;
  customer: { name: string; email: string; phone: string };
  delivery: { type: string; address?: string; notes?: string };
  items: Array<{
    product_id: string;
    product_name: string;
    size: string;
    quantity: number;
    unit_price: number;
  }>;
};
type RequestOptions = { method?: string; headers?: Record<string, string>; body?: string };

async function secret(name: string) {
  try { return await secrets.readSecret(name); } catch { return ''; }
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] || character));
}

async function sendGmail({ to, subject, html, replyTo }: { to: string; subject: string; html: string; replyTo?: string }) {
  const user = await secret('GMAIL_USER');
  const pass = await secret('GMAIL_APP_PASSWORD');
  if (!user || !pass || !to) throw new Error('Gmail is not configured.');
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  await transporter.sendMail({
    from: 'The Store 99 <' + user + '>',
    to,
    replyTo: replyTo || undefined,
    subject,
    html,
  });
}

async function supabaseRequest(url: string, key: string, path: string, options: RequestOptions = {}) {
  return fetch(url + '/rest/v1/' + path, {
    ...options,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
}

function emailHtml(order: CheckoutBody & {
  id: string; total_amount: number; paystack_reference: string;
  customer_name?: string; customer_email?: string; customer_phone?: string;
  delivery_type?: string; delivery_address?: string;
}) {
  const rows = (order.items || []).map(item => '<tr><td>' + escapeHtml(item.product_name) + '</td><td>' + escapeHtml(item.size) + '</td><td>' + Number(item.quantity) + '</td><td>₦' + Number(item.unit_price).toLocaleString('en-NG') + '</td></tr>').join('');
  const customerName = order.customer_name || order.customer.name;
  const customerPhone = order.customer_phone || order.customer.phone;
  const customerEmail = order.customer_email || order.customer.email;
  const deliveryType = order.delivery_type || order.delivery.type;
  const notes = order.delivery.notes?.trim();
  return '<div style="font-family:Arial;color:#111"><h1 style="background:#000;color:#D4AF37;padding:20px">THE STORE 99</h1><h2>New Order - ' + escapeHtml(order.id) + '</h2><p><b>Paystack:</b> ' + escapeHtml(order.paystack_reference) + '</p><p><b>Customer:</b> ' + escapeHtml(customerName) + ' · ' + escapeHtml(customerPhone) + ' · ' + escapeHtml(customerEmail) + '</p><p><b>Type:</b> ' + escapeHtml(deliveryType) + (order.delivery_address ? ' · ' + escapeHtml(order.delivery_address) : '') + '</p>' + (notes ? '<p><b>Customer note:</b> ' + escapeHtml(notes) + '</p>' : '') + '<table border="1" cellpadding="8" cellspacing="0"><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr>' + rows + '</table><h2>Total: ₦' + Number(order.total_amount).toLocaleString('en-NG') + '</h2></div>';
}

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
  'GET /api/config': [async () => json({
    supabaseUrl: await secret('SUPABASE_URL'),
    supabaseAnonKey: await secret('SUPABASE_ANON_KEY'),
    paystackPublicKey: await secret('PAYSTACK_PUBLIC_KEY'),
    whatsappNumber: (await secret('WHATSAPP_NUMBER')) || '2349130730895',
    ownerEmail: (await secret('GMAIL_ORDER_RECIPIENT')) || 'agozieiwunna@gmail.com',
  })],
  'POST /api/contact': [async ({ body }) => {
    const b = body as ApiBody;
    const to = (await secret('GMAIL_ORDER_RECIPIENT')) || 'agozieiwunna@gmail.com';
    try {
      await sendGmail({
        to,
        replyTo: String(b.email || ''),
        subject: 'Store 99 Contact Message',
        html: '<h2>' + escapeHtml(b.name) + ' contacted The Store 99</h2><p>' + escapeHtml(b.message) + '</p><p>' + escapeHtml(b.email) + '</p>',
      });
      return json({ success: true });
    } catch (cause) {
      console.error('Contact email failed:', cause);
      return json({ success: false, message: 'Email service is not configured.' }, 503);
    }
  }],
  'POST /api/paystack/complete': [async ({ body }) => {
    const b = body as CheckoutBody;
    if (!b.reference || !b.expectedAmount || !b.userId || !Array.isArray(b.items) || !b.items.length) return error('Invalid checkout payload.', 400);
    const paystack = await secret('PAYSTACK_SECRET_KEY');
    const supabaseUrl = await secret('SUPABASE_URL');
    const serviceKey = await secret('SUPABASE_SERVICE_ROLE_KEY');
    if (!paystack || !supabaseUrl || !serviceKey) return error('Payment backend is not configured.', 503);
    const verifyResponse = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(b.reference), { headers: { Authorization: 'Bearer ' + paystack } });
    const paystackResponse = await verifyResponse.json();
    if (!verifyResponse.ok || !paystackResponse.status || paystackResponse.data?.status !== 'success') return error('Paystack verification failed.', 402);
    if (Number(paystackResponse.data.amount) !== Number(b.expectedAmount)) return error('Payment amount mismatch.', 400);
    const orderResponse = await supabaseRequest(supabaseUrl, serviceKey, 'rpc/process_paid_order', {
      method: 'POST',
      body: JSON.stringify({
        p_user_id: b.userId,
        p_customer_name: b.customer.name,
        p_customer_email: b.customer.email,
        p_customer_phone: b.customer.phone,
        p_delivery_type: b.delivery.type,
        p_delivery_address: b.delivery.address || null,
        p_notes: b.delivery.notes || null,
        p_total_amount: Number(b.expectedAmount) / 100,
        p_reference: b.reference,
        p_transaction_id: String(paystackResponse.data.id),
        p_items: b.items,
      }),
    });
    const data = await orderResponse.json();
    if (!orderResponse.ok) return error(data?.message || 'Order could not be created.', 409);
    const order = data?.[0] || data;
    const recipient = (await secret('GMAIL_ORDER_RECIPIENT')) || 'agozieiwunna@gmail.com';
    try {
      await sendGmail({
        to: recipient,
        subject: 'New Order - ' + order.id + ' - The Store 99',
        html: emailHtml({ ...b, ...order, items: b.items }),
      });
    } catch (cause) {
      // The payment and order have already been recorded; keep checkout successful and log the notification failure.
      console.error('Paid-order email failed:', cause);
    }
    return json({ success: true, order });
  }],
});
