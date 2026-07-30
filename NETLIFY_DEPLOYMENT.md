# Netlify Deployment Guide — LumenTarot

This guide walks through deploying LumenTarot from GitHub to Netlify,
configuring Supabase and Stripe for production, and verifying everything
works end to end.

---

## 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial LumenTarot scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/lumen-tarot.git
git push -u origin main
```

## 2. Connect the repo to Netlify

1. In the Netlify dashboard: **Add new site → Import an existing project → GitHub**.
2. Select your repository.
3. Netlify should auto-detect the Next.js build via `netlify.toml`
   (already included in this repo). Confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. The `@netlify/plugin-nextjs` plugin (declared in `netlify.toml`) handles
   the rest automatically:
   - API routes (`src/app/api/**/route.ts`) become Netlify Functions.
   - Dynamic routes (e.g. `/tarot-card-meanings/[card]`) are served
     correctly on refresh — no 404s, no extra redirect rules needed.
   - The Stripe webhook route preserves the raw request body required for
     signature verification (see `src/app/api/webhooks/stripe/route.ts`,
     which calls `req.text()` before any JSON parsing).

Do not set a custom publish directory or add an `output: 'export'` to
`next.config.js` — that would produce a static export incompatible with API
routes and server-rendered dynamic content.

## 3. Environment variables

In **Site settings → Environment variables**, add (see `.env.example` for
the full list with comments):

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://lumentarot.com`. Used for canonical URLs, auth redirects, and Stripe success/cancel URLs. |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings — safe for the client. |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase project settings — **server-only, never exposed to the browser.** Used only inside API routes (e.g. the Stripe webhook handler). |
| `ENABLE_PAYMENTS` | Set to `true` only once Stripe is fully configured and approved. Defaults to `false` (safe). |
| `STRIPE_SECRET_KEY` | From Stripe dashboard — server-only. |
| `STRIPE_WEBHOOK_SECRET` | From the Stripe webhook endpoint you create in step 5 — server-only. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard — safe for the client (currently unused by the checkout flow, which redirects to Stripe-hosted Checkout, but kept available for a future embedded flow). |
| `ENABLE_AI_READINGS` | Leave `false` to use the free template reading engine. Only set `true` once `AI_API_KEY` is configured. |
| `AI_API_KEY`, `AI_API_BASE_URL` | Only needed if `ENABLE_AI_READINGS=true`. |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` | Optional. |

`netlify.toml` also sets `NEXT_PUBLIC_SITE_URL` automatically for deploy
previews using Netlify's `$DEPLOY_PRIME_URL`; update the
`[context.production.environment]` block (or just set it in the Netlify UI)
with your real production domain.

Never commit real values for any of these — `.env.example` contains names
only, and `.env*` is git-ignored.

## 4. Configure Supabase for production

1. In your Supabase project, run `supabase/schema.sql` then
   `supabase/policies.sql` in the SQL editor (in that order).
2. Go to **Authentication → URL Configuration** and set:
   - **Site URL:** your production domain (e.g. `https://lumentarot.com`)
   - **Redirect URLs**, add all of:
     - `http://localhost:3000/**` (local development)
     - `https://<your-site>.netlify.app/**` (Netlify preview/default domain)
     - `https://<your-custom-domain>/**` (final production domain, once set up)
3. If enabling Google login: configure the Google OAuth provider under
   **Authentication → Providers**, using the same redirect URLs above.

## 5. Configure the Stripe webhook

1. In the Stripe dashboard: **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://<your-production-domain>/api/webhooks/stripe`
3. Select the events: `checkout.session.completed`,
   `checkout.session.expired`, `payment_intent.payment_failed`.
4. Copy the generated **Signing secret** into `STRIPE_WEBHOOK_SECRET` in
   Netlify's environment variables.
5. Create your Products/Prices in Stripe and update the `id` fields in
   `src/lib/payments/products.ts` to match the real Stripe Price IDs.
6. Set `ENABLE_PAYMENTS=true` once everything above is in place and your
   Stripe account is approved for live payments.

Until `ENABLE_PAYMENTS=true` and both Stripe keys are set, `/api/checkout`
and `/api/webhooks/stripe` return a clean "not yet available" response —
the rest of the app (free readings, daily card, yes/no, SEO pages) works
fully without Stripe.

## 6. Custom domain

1. In Netlify: **Domain settings → Add a custom domain**, follow the DNS
   instructions.
2. Update `NEXT_PUBLIC_SITE_URL` to the final domain.
3. Update the Supabase redirect URLs (step 4) to include the final domain.
4. Update the Stripe webhook endpoint URL (step 5) to the final domain.

No code changes are required for a domain change — every environment-
dependent URL in the app is derived from `NEXT_PUBLIC_SITE_URL`.

## 7. Production testing checklist

- [ ] `npm run build` succeeds locally (already verified for this scaffold)
- [ ] Homepage and all core routes load on the deployed Netlify URL
- [ ] Refreshing a dynamic route (e.g. `/tarot-card-meanings/the-fool`) does
      **not** 404
- [ ] Free reading flow: category → question → card selection → reveal →
      reading works end to end
- [ ] Daily Tarot draws one card per day and updates the streak
- [ ] Yes/No Tarot returns a symbolic answer
- [ ] Sign up / log in works (once Supabase is configured) and redirects
      correctly on both `localhost` and the production domain
- [ ] Dashboard shows reading history / premium readings for a signed-in
      user, and RLS prevents seeing another user's data (verify in the
      Supabase table editor with two different test accounts)
- [ ] Checkout button starts a real Stripe Checkout session (once Stripe is
      configured) and completing payment marks the `payments` row as
      `succeeded` only after the webhook fires — not immediately on
      redirect to the success URL
- [ ] Mobile layout (360–430px) works cleanly for the card selection grid
      and all primary CTAs

## Notes on Netlify + Next.js specifics

- Route handlers (`route.ts` files under `src/app/api/`) run as Netlify
  Functions automatically via the official Next.js runtime plugin — there
  is no separate serverless function configuration needed.
- The Stripe webhook route sets `export const dynamic = 'force-dynamic'`
  and reads the raw body with `await req.text()` before any parsing, which
  is required for Stripe's signature verification to succeed in this
  serverless environment.
- `src/middleware.ts` refreshes the Supabase session on every request; it
  no-ops safely if Supabase env vars are not set.
