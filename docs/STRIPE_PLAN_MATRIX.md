<!-- ======================================================
File: docs/STRIPE_PLAN_MATRIX.md
====================================================== -->

# Stripe Plan Matrix — Tiers → Entitlements → UI Gating

This matrix maps pricing tiers to **exact entitlements** and how to gate them in the UI + server actions.

> Recommended: enforce gates in **server actions / route handlers** (not just UI). UI gating improves UX; server gating prevents bypass.

---

## 1) Plans (Recommended)

| Plan | Price (suggested) | Target |
|------|--------------------|--------|
| Free | $0 | onboarding / solo |
| Pro  | $19–$39/mo | consultants / small ops |
| Team | $79–$149/mo | agencies / teams |
| Enterprise | custom | SSO / custom |

---

## 2) Entitlements (Exact Limits)

> “Unlimited” can be represented as `-1` in code (or `null`).

| Entitlement | Free | Pro | Team |
|------------|------:|----:|-----:|
| `max_orgs` | 1 | 3 | 10 (or -1) |
| `max_seats_per_org` | 1 | 3 | 10 (or -1) |
| `max_kpi_months_history` | 3 | 24 | -1 |
| `max_roi_models_per_org` | 1 | 10 | -1 |
| `exports_csv_enabled` | false | true | true |
| `exports_pdf_enabled` | false | false (optional) | true (optional) |
| `charts_enabled` | false | true | true |
| `audit_log_enabled` | false | false | true (optional) |
| `scheduled_reports_enabled` | false | false | true (optional) |

---

## 3) UI Gating Matrix (What Users See)

### Navigation / Pages
| Feature | Free | Pro | Team |
|--------|------|-----|------|
| Dashboard | ✅ | ✅ | ✅ |
| KPI List | ✅ (limited months) | ✅ | ✅ |
| KPI Charts | ❌ (upsell) | ✅ | ✅ |
| ROI Calculator | ✅ | ✅ | ✅ |
| ROI Multiple Scenarios | ❌ (upsell) | ✅ | ✅ |
| Org Switcher | ✅ (1 org) | ✅ | ✅ |
| Member Management | ❌ (upsell) | ✅ (limit) | ✅ |
| Exports | ❌ (upsell) | ✅ CSV | ✅ CSV (+PDF optional) |
| Billing Page | ✅ “Upgrade” | ✅ “Manage” | ✅ “Manage” |

### Buttons / Calls-to-Action
| UI Element | Free | Pro | Team |
|-----------|------|-----|------|
| “Create Organization” | disabled after 1 | disabled after 3 | allowed |
| “Invite Member” | hidden/disabled | disabled after 3 seats | allowed |
| “Export CSV” | disabled w/ upsell | enabled | enabled |
| “Export PDF” | upsell | optional upsell | enabled |
| “Enable Scheduled Reports” | upsell | upsell | enabled |

---

## 4) Server Enforcement (Recommended)

Implement checks in a single `entitlements` module and call it from:
- server actions (create org, add member, export)
- route handlers (if any)
- optionally: middleware (for page-level feature locking)

### Suggested Enforcement Points
- **Create org:** check `org_count < max_orgs`
- **Add member:** check `member_count < max_seats_per_org`
- **Fetch KPI:** apply `month >= now() - max_kpi_months_history`
- **Create ROI model/scenario:** check count < max_roi_models_per_org
- **Exports:** check `exports_csv_enabled` / `exports_pdf_enabled`

---

## 5) Stripe Objects → Entitlements

### Stripe Products
- `kpi-roi-free` (optional)
- `kpi-roi-pro`
- `kpi-roi-team`

### Stripe Price IDs
Store in env:
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_TEAM`

### Webhook Sync
On `checkout.session.completed`, `customer.subscription.updated`, etc.:
- update `billing_subscriptions` + `entitlements` in Supabase
- set `status` and `current_period_end`

---

## 6) Suggested DB Tables (When You Add Stripe)

### `billing_customers`
- `user_id`
- `stripe_customer_id`

### `billing_subscriptions`
- `org_id`
- `stripe_subscription_id`
- `plan`
- `status`
- `current_period_end`

### `entitlements`
- `org_id`
- `plan`
- limits/flags listed above

> Tie billing to `org_id` to keep multi-tenant consistent. For solo founders, org = workspace.

---

## 7) Upsell Copy (Quick)
- Free → Pro: “Unlock KPI history, charts, exports, and team seats.”
- Pro → Team: “Unlock team collaboration, multi-org, and reporting automation.”