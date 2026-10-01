# Yoldash Web Changelog

## 2026-10-01 — Production UX & Security Upgrade

### Product
- Redesigned Load Board with live metrics, responsive freight cards, route visualization, capacity, loading time and richer actions.
- Added full cargo details modal for loads and shipments.
- Home route preview now reflects a live open cargo instead of a fixed demo route.
- Connected shipment-specific chat rooms to the web interface alongside public chat.
- Turned Services into a live service center.
- Connected Turkey Insurance workflow to the existing Supabase backend:
  - live 3-month pricing/settings
  - document upload to private storage
  - payment receipt upload
  - request submission
  - tracking/status history
  - signed access to issued policy files
- Launched Driver & Vehicle Hub using the existing `driver_hub_listings` table.
- Completed password-recovery UI and new-password flow.
- Added Persian, Turkish and English copy for new web features.

### Security
- Added CSP and security headers on Vercel.
- Hardened `submit_cargo_offer` backend profile validation.
- Verified normal users cannot access admin dashboard RPCs.
- Verified unrelated profiles, private cargo and offers remain protected by RLS.
- Added 18 missing foreign-key indexes flagged by Supabase Advisor.
- No service-role or secret key is exposed in the browser bundle.

### Web / SEO
- Added sitemap and robots metadata.
- Added Open Graph / Twitter metadata.
- Added preconnect hints for Supabase and ESM.
- Canonical URL remains `https://www.getyoldash.com/`.
- Apex domain permanently redirects to `www`.

### Deployment
Production deploys automatically from:
`hazzardenizz-cpu/yoldash-legal` → `main` → Vercel `yoldash-web-v1`.
