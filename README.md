# The Store 99

React/Vite storefront with Supabase Auth/Postgres/Storage, Paystack verification, admin inventory, WhatsApp chat and Gmail order notifications.

## Local
npm install
cp .env.example .env
npm run dev

Run `supabase/schema.sql` in the Supabase SQL Editor before using live catalog, auth, storage or checkout. For an existing project, run `supabase/category_migration.sql` once to apply the current product categories. Never expose `PAYSTACK_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Checkout backend
You do not need to deploy the backend separately while developing locally. `npm run dev` starts Vite and the local API together; Vite proxies `/api/*` requests to the local API, so leave `VITE_API_URL` empty in `.env`.

The local API verifies Paystack payments, creates orders in Supabase, and sends order emails. It reads `PAYSTACK_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `GMAIL_ORDER_RECIPIENT` from `.env`.

For Gmail, enable 2-Step Verification and create a Google **App Password** for the account in `GMAIL_USER`. Put the 16-character app password in `GMAIL_APP_PASSWORD` (spaces are accepted), set `GMAIL_ORDER_RECIPIENT` to the inbox that should receive orders, and restart `npm run dev`. The API prints `Gmail SMTP authentication is ready.` when this is working. A Gmail account password will not work.

## Notes
- The frontend is JSX.
- `backend/index.ts` is retained because the AppDeploy backend entrypoint requires that filename, but its logic is JavaScript-compatible.
- Add real Supabase/Paystack/Gmail credentials through your deployment environment. Set `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `GMAIL_ORDER_RECIPIENT`; do not commit `.env`.

## Deploy the website

### GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds the site and publishes it to GitHub Pages whenever `main` is updated. In the repository settings, open **Pages** and set **Build and deployment** to **GitHub Actions**. The project-site URL is `https://AgozieG.github.io/store99/`; app routes use hash URLs such as `/store99/#/products`.

Add these optional frontend values under **Settings → Secrets and variables → Actions → Variables** before deploying if you want the live catalog and payment UI configured:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`
- `VITE_WHATSAPP_NUMBER`
- `VITE_OWNER_EMAIL`
- `VITE_API_URL`

`VITE_*` values are compiled into public browser code. Never put `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, or email passwords in Actions variables or in a `VITE_*` variable.

### Render

Create a **Blueprint** in Render from this repository and Render will use `render.yaml` to build and publish the Vite site from `dist`. Enter the requested `VITE_*` values in Render when prompted; they are build-time settings, so trigger a new deploy after changing them.

These configurations deploy the frontend only. Contact email and payment verification require the API configured as `VITE_API_URL`; the local API started by `npm run dev` is for development and is not deployed by either static-site configuration. Keep all backend-only credentials in the API host's private environment.
