import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';

const root = process.cwd();
const env = loadEnv(path.join(root, '.env'));
const port = Number(env.API_PORT || 8787);

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).flatMap(line => {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    return match ? [[match[1], match[2].replace(/^(['"])(.*)\1$/, '$2')]] : [];
  }));
}

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function body(request) {
  let text = '';
  for await (const chunk of request) {
    text += chunk;
    if (text.length > 2_000_000) throw new Error('Request body is too large.');
  }
  return text ? JSON.parse(text) : {};
}

async function supabase(pathname, options = {}) {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
}

async function sendMail({ to, subject, html, replyTo }) {
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD || !to) throw new Error('Gmail is not configured.');
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === 'true',
    auth: { user: env.GMAIL_USER.trim(), pass: env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
  });
  await transporter.sendMail({ from: `The Store 99 <${env.GMAIL_USER.trim()}>`, to, replyTo, subject, html });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] || character));
}

function orderEmail(order, input) {
  const rows = input.items.map(item =>
    `<tr><td>${escapeHtml(item.product_name)}</td><td>${escapeHtml(item.size)}</td><td>${Number(item.quantity)}</td><td>₦${Number(item.unit_price).toLocaleString('en-NG')}</td></tr>`
  ).join('');
  const notes = input.delivery.notes?.trim();
  return `<h1>THE STORE 99</h1><h2>New Order - ${escapeHtml(order.id)}</h2><p>Paystack: ${escapeHtml(order.paystack_reference)}</p><p>Customer: ${escapeHtml(input.customer.name)} · ${escapeHtml(input.customer.phone)} · ${escapeHtml(input.customer.email)}</p><p>Type: ${escapeHtml(input.delivery.type)}${input.delivery.address ? ` · ${escapeHtml(input.delivery.address)}` : ''}</p>${notes ? `<p><b>Customer note:</b> ${escapeHtml(notes)}</p>` : ''}<table border="1" cellpadding="8"><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr>${rows}</table><h2>Total: ₦${Number(order.total_amount).toLocaleString('en-NG')}</h2>`;
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/api/_healthcheck') return send(response, 200, { message: 'Success' });
    if (request.method === 'GET' && request.url === '/api/config') return send(response, 200, {
      supabaseUrl: env.VITE_SUPABASE_URL || env.SUPABASE_URL || '',
      supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '',
      paystackPublicKey: env.VITE_PAYSTACK_PUBLIC_KEY || env.PAYSTACK_PUBLIC_KEY || '',
      whatsappNumber: env.VITE_WHATSAPP_NUMBER || env.WHATSAPP_NUMBER || '',
      ownerEmail: env.VITE_OWNER_EMAIL || env.GMAIL_ORDER_RECIPIENT || '',
    });

    if (request.method !== 'POST') return send(response, 404, { message: 'Not found.' });
    const input = await body(request);

    if (request.url === '/api/contact') {
      await sendMail({
        to: env.GMAIL_ORDER_RECIPIENT,
        replyTo: input.email,
        subject: 'Store 99 Contact Message',
        html: `<h2>${escapeHtml(input.name)} contacted The Store 99</h2><p>${escapeHtml(input.message)}</p><p>${escapeHtml(input.email)}</p>`,
      });
      return send(response, 200, { success: true });
    }

    if (request.url !== '/api/paystack/complete') return send(response, 404, { message: 'Not found.' });
    if (!input.reference || !input.expectedAmount || !input.userId || !Array.isArray(input.items) || !input.items.length) {
      return send(response, 400, { message: 'Invalid checkout payload.' });
    }
    if (!env.PAYSTACK_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return send(response, 503, { message: 'Payment backend is not configured.' });
    }

    const verification = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(input.reference)}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    const paystack = await verification.json();
    if (!verification.ok || !paystack.status || paystack.data?.status !== 'success') {
      return send(response, 402, { message: 'Paystack verification failed.' });
    }
    if (Number(paystack.data.amount) !== Number(input.expectedAmount)) {
      return send(response, 400, { message: 'Payment amount mismatch.' });
    }

    const orderResponse = await supabase('rpc/process_paid_order', {
      method: 'POST',
      body: JSON.stringify({
        p_user_id: input.userId,
        p_customer_name: input.customer.name,
        p_customer_email: input.customer.email,
        p_customer_phone: input.customer.phone,
        p_delivery_type: input.delivery.type,
        p_delivery_address: input.delivery.address || null,
        p_notes: input.delivery.notes || null,
        p_total_amount: Number(input.expectedAmount) / 100,
        p_reference: input.reference,
        p_transaction_id: String(paystack.data.id),
        p_items: input.items,
      }),
    });
    const data = await orderResponse.json();
    if (!orderResponse.ok) return send(response, 409, { message: data?.message || 'Order could not be created.' });
    const order = data?.[0] || data;
    let emailSent = true;
    try {
      await sendMail({
        to: env.GMAIL_ORDER_RECIPIENT,
        subject: `New Order - ${order.id} - The Store 99`,
        html: orderEmail(order, input),
      });
    } catch (error) {
      emailSent = false;
      console.error('Paid-order email failed:', error.code || 'UNKNOWN', error.message);
    }
    return send(response, 200, { success: true, order, emailSent });
  } catch (error) {
    console.error('Local API request failed:', error);
    return send(response, 500, { message: error.message || 'Local API request failed.' });
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.warn(`Local API is already running on http://localhost:${port}; reusing it.`);
    process.exit(0);
  }
  console.error('Local API failed to start:', error);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}`);
  if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD && env.GMAIL_ORDER_RECIPIENT) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === 'true',
      auth: { user: env.GMAIL_USER.trim(), pass: env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
    });
    transporter.verify()
      .then(() => console.log('Gmail SMTP authentication is ready.'))
      .catch(error => console.error('Gmail SMTP authentication failed:', error.code || 'UNKNOWN', error.message));
  } else {
    console.error('Gmail SMTP is not configured. Check GMAIL_USER, GMAIL_APP_PASSWORD, and GMAIL_ORDER_RECIPIENT.');
  }
});
