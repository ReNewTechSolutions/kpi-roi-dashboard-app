<!-- ======================================================
File: docs/PRICING_STRATEGY.md
====================================================== -->

# Pricing Strategy — KPI + ROI Dashboard (SaaS Tiers + Gating)

This document proposes SaaS tiers and practical feature gating that fits the current architecture (Next.js + Supabase RLS + multi-tenant org model).

---

## 1) Recommended Pricing Tiers (Simple + High Conversion)

### Free — $0
Best for lead gen and onboarding.

**Suggested limits**
- 1 organization
- 1 seat (owner only)
- KPI history: last 3 months
- 1 ROI scenario/model
- No exports

---

### Pro — $19–$39 / month
For consultants, solo ops, and small teams.

**Suggested upgrades**
- Up to 3 organizations
- Up to 3 seats
- KPI history: 24 months
- Up to 10 ROI scenarios
- CSV exports
- Basic dashboard summaries

---

### Team — $79–$149 / month
For agencies and multi-user teams.

**Suggested upgrades**
- Unlimited organizations (or 10+)
- Up to 10 seats (or unlimited)
- Unlimited KPI history
- Unlimited ROI scenarios
- Exports + scheduled email report (future)
- Role management (owner/admin/member) (future)
- Audit log (future)

---

### Enterprise — custom
Only add if you plan to sell directly or do services.

**Suggested features**
- SSO/SAML (future)
- Dedicated support / SLA
- Custom KPI modules / integrations
- White-label + custom domain
- Data retention + backups

---

## 2) What to Gate (Aligned to Schema)

Your schema supports clean gating without complex migrations.

### A) Organization count
- Uses `organizations` and `org_members`
- Gate creation of additional orgs beyond plan limit

### B) Seat count per org
- Uses `org_members`
- Gate adding members beyond plan limit

### C) KPI history window
- Uses `kpi_entries.month`
- Gate reads to last N months on Free/Pro

Example rule:
- Free: last 3 months only
- Pro: last 24 months
- Team: unlimited

### D) ROI scenario count
- Uses `roi_models` (or add `roi_scenarios` later)
- Gate number of models/scenarios per org

If you keep `roi_models` as a single row per org:
- Gate “advanced scenarios” feature behind Pro/Team
- Or add `roi_scenarios` table in a later phase

### E) Export features (CSV/PDF)
- Gate UI-level export actions by plan
- Keep DB unchanged

---

## 3) Enforcement Layer Options (Best Practices)

### Option 1 — App-only gating (fastest MVP)
- Determine plan in app (e.g., in a `profiles` table or billing table)
- Hide/disable features in UI
- Add server-side checks in server actions/route handlers

Pros:
- Fast to implement
Cons:
- Must ensure server actions enforce limits (UI gating alone is insufficient)

---

### Option 2 — DB-enforced gating (strongest)
- Add an `entitlements` table keyed by org/user
- Use RLS + Postgres functions to enforce limits
- More complex, but strongest control

Pros:
- Hard to bypass
Cons:
- More engineering effort

Recommended approach:
- Start with Option 1 + server action checks
- Upgrade to Option 2 when Stripe is added

---

## 4) Stripe Mapping (Future Scaffolding)

When you add Stripe, store plan state in Supabase:

**Suggested tables**
- `billing_customers(user_id, stripe_customer_id)`
- `billing_subscriptions(org_id, stripe_subscription_id, plan, status, current_period_end)`
- `entitlements(org_id, max_orgs, max_seats, max_kpi_months, max_roi_models, exports_enabled)`

---

## 5) Suggested Default Entitlements (Copy/Paste)

### Free
- max_orgs: 1
- max_seats: 1
- max_kpi_months: 3
- max_roi_models: 1
- exports_enabled: false

### Pro
- max_orgs: 3
- max_seats: 3
- max_kpi_months: 24
- max_roi_models: 10
- exports_enabled: true

### Team
- max_orgs: 10 (or unlimited)
- max_seats: 10 (or unlimited)
- max_kpi_months: unlimited
- max_roi_models: unlimited
- exports_enabled: true

---

## 6) “Buyer Pitch” Pricing Copy
- “Start free, upgrade when you need team seats and exports.”
- “Pro unlocks history and ROI scenarios.”
- “Team unlocks collaboration + reporting features.”

---

## 7) Implementation Notes (Minimal Changes)
You can implement gating without schema changes initially:
- Keep gating checks inside server actions
- Block org creation, member adds, KPI range queries, ROI scenario saves as needed