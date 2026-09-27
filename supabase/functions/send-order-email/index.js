import nodemailer from 'npm:nodemailer@10.0.10';

const GMAIL_USER = Deno.env.get('GMAIL_USER') || '';
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD') || '';
const GMAIL_ORDER_RECIPIENT = Deno.env.get('GMAIL_ORDER_RECIPIENT') || 'agozieiwunna@gmail.com';
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character));

Deno.serve(async request => {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) throw new Error('Gmail is not configured.');
    const order = await request.json();
    const rows = (order.items || []).map(item => '<tr><td>' + escapeHtml(item.product_name) + '</td><td>' + escapeHtml(item.size) + '</td><td>' + Number(item.quantity) + '</td><td>₦' + Number(item.unit_price).toLocaleString('en-NG') + '</td></tr>').join('');
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
    await transporter.sendMail({
      from: 'The Store 99 <' + GMAIL_USER + '>',
      to: GMAIL_ORDER_RECIPIENT,
      subject: 'New Order - ' + escapeHtml(order.id) + ' - The Store 99',
      html: '<h1>THE STORE 99</h1><h2>New order ' + escapeHtml(order.id) + '</h2><p>Customer: ' + escapeHtml(order.customer_name) + ' · ' + escapeHtml(order.customer_phone) + ' · ' + escapeHtml(order.customer_email) + '</p><p>Type: ' + escapeHtml(order.delivery_type) + ' ' + escapeHtml(order.delivery_address) + '</p><table border="1" cellpadding="8"><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr>' + rows + '</table><h2>Total: ₦' + Number(order.total_amount).toLocaleString('en-NG') + '</h2><p>Paystack reference: ' + escapeHtml(order.paystack_reference) + '</p>',
    });
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (cause) {
    console.error('Order email failed:', cause);
    return new Response(JSON.stringify({ error: 'Order email could not be sent.' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
});
