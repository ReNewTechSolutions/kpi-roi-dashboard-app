<!-- ======================================================
File: ROADMAP.md
====================================================== -->

# Roadmap — KPI + ROI Dashboard SaaS Starter

This roadmap is organized to maximize product value, speed-to-deploy, and “asset quality” for buyers.

---

## Guiding Principles
- **Deploy in under 30 minutes**
- **Security first** (RLS + org membership)
- **Modular architecture** (UI / data / business logic)
- **Demo-first** (screenshots + onboarding without needing real data)
- **SaaS-ready** (Stripe scaffold can be added cleanly)

---

## Phase 1 — “Buyer Proof” MVP (1–2 days)
### Goal
Polish the starter into a clean, predictable baseline that any buyer can run immediately.

### Deliverables
- ✅ Setup docs complete: `SETUP_GUIDE.md`, `supabase/README.md`
- ✅ Database scripts: `schema.sql`, `rls.sql`, optional `db_reset.sql`
- ✅ Protected routing + sign out
- ✅ Modular components for auth and layout
- ⬜ Typed data layer wrappers (`src/data/*`) for KPI + ROI + orgs
- ⬜ App-side Demo Mode toggle (`NEXT_PUBLIC_DEMO_MODE=true`)

---

## Phase 2 — KPI Dashboard (Core Product) (2–4 days)
### Goal
Make KPI tracking feel “real SaaS” with clear UX and basic reporting.

### Features
- KPI list by month (revenue/cost/notes)
- KPI create/update (upsert by org + month)
- KPI charts (simple line charts for revenue/cost trends)
- KPI CSV export
- KPI “seed starter months” in UI for new orgs

### Nice-to-haves
- Year selector
- Filters (month range)
- Summary cards (MRR, Profit, Margin)

---

## Phase 3 — ROI Calculator (Core Product) (2–4 days)
### Goal
A polished ROI calculator that stores scenarios per org.

### Features
- ROI input form with validation
- Save ROI model scenarios (`roi_models.inputs`)
- Computed ROI summary (e.g. ROI %, payback period)
- “Scenario compare” view

### Nice-to-haves
- Custom ROI formulas (advanced users)
- Export ROI report (PDF/CSV)

---

## Phase 4 — Organization Management (Multi-Tenant) (3–6 days)
### Goal
Enable teams and org switching for real multi-tenant SaaS.

### Features
- Org switcher (persisted selection)
- Member list + roles (owner/member)
- Invite flow:
  - Simple: owner adds by email (if user exists)
  - Better: email invite link + accept flow

### Nice-to-haves
- Role: admin (optional)
- Activity log

---

## Phase 5 — Demo Mode + Marketing Assets (Flippa Conversion) (1–3 days)
### Goal
High-quality screenshots + walkthrough that sells.

### Deliverables
- Demo mode UX:
  - “Continue in Demo” on login
  - Fake org + KPI + ROI data rendered locally
  - Writes disabled or simulated
- Screenshot kit:
  - Dashboard, KPI table, ROI calculator, org management, settings
- Walkthrough script + caption pack
- High-conversion listing copy (already started in `docs/FLIPPA_LISTING.md`)

---

## Phase 6 — Stripe Monetization Scaffolding (Optional) (4–10 days)
### Goal
Add subscription billing and feature gating.

### Features
- Stripe Checkout + Billing Portal
- Plans: Free / Pro / Team
- Entitlements:
  - team members limit
  - number of orgs
  - export/report features
- Webhooks + plan sync table in Supabase

### Nice-to-haves
- Trial flow
- Annual plan discounts
- In-app upgrade prompts

---

## Phase 7 — Quality + Automation (Optional) (2–6 days)
### Goal
Raise buyer confidence with tests and CI.

### Deliverables
- Unit tests for data layer
- Basic E2E tests for auth + protected routes
- CI workflow (GitHub Actions)
- Lint/format + strict TS checks

---

## “What’s Next” (Suggested Buyer Pitch)
If you’re selling this as an asset, recommend next steps to the buyer:
- Add demo mode screenshots
- Add Stripe subscriptions
- Add KPI charts + export
- Add org invites + role management

---

## Success Criteria
- ✅ New buyer can deploy and login within ~30 minutes
- ✅ Demo screenshots can be produced without friction
- ✅ Multi-tenant data is secure under RLS
- ✅ Repo feels like a product, not a prototype