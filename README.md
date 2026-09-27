# The Store 99

React/Vite storefront with Supabase Auth/Postgres/Storage, Paystack verification, admin inventory, WhatsApp chat and Gmail order notifications.

## Local
npm install
cp .env.example .env
npm run dev

Run `supabase/schema.sql` in the Supabase SQL Editor before using live catalog, auth, storage or checkout. Never expose `PAYSTACK_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Checkout backend
You do not need to deploy the backend separately while developing locally. `npm run dev` starts Vite and the local API together; Vite proxies `/api/*` requests to the local API, so leave `VITE_API_URL` empty in `.env`.

The local API verifies Paystack payments, creates orders in Supabase, and sends order emails. It reads `PAYSTACK_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `GMAIL_ORDER_RECIPIENT` from `.env`.

For Gmail, enable 2-Step Verification and create a Google **App Password** for the account in `GMAIL_USER`. Put the 16-character app password in `GMAIL_APP_PASSWORD` (spaces are accepted), set `GMAIL_ORDER_RECIPIENT` to the inbox that should receive orders, and restart `npm run dev`. The API prints `Gmail SMTP authentication is ready.` when this is working. A Gmail account password will not work.

## Notes
- The frontend is JSX.
- `backend/index.ts` is retained because the AppDeploy backend entrypoint requires that filename, but its logic is JavaScript-compatible.
- Add real Supabase/Paystack/Gmail credentials through your deployment environment. Set `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `GMAIL_ORDER_RECIPIENT`; do not commit `.env`.
