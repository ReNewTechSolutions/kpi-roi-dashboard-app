<!-- ======================================================
File: docs/BILLING_REQUIREMENTS.md
====================================================== -->

# Billing Requirements — Stripe Scaffold (SaaS-Ready)

This document defines the minimum billing system required to support:
- subscriptions (Pro/Team)
- plan gating (entitlements)
- customer portal management
- webhook-driven sync into Supabase

This is intentionally “scaffold-first”: small surface area, production-safe patterns.

---

## 1) Goals

### Must-Have
- Create Stripe customer
- Start subscription checkout
- Receive webhook events
- Persist subscription state in Supabase
- Derive and store entitlements per org
- Gate features in server actions

### Nice-to-Have (Later)
- Trials
- Annual plans
- Coupons
- Metered usage
- Invoices display
- Multi-currency/taxes

---

## 2) Billing Ownership Model (Org-based)

Recommended: bill **per organization** (workspace), not per user.

Why:
- Matches multi-tenant structure
- Easiest for “team” plans
- Clean entitlement checks at org_id level

Mapping:
- `billing_customer` can be created per org owner (or org)
- `billing_subscription` always ties to `org_id`

---

## 3) Required Stripe Objects

### Products
- `KPI+ROI Pro`
- `KPI+ROI Team`

### Prices
- monthly Pro price (e.g. $29/mo)
- monthly Team price (e.g. $99/mo)
- optional annual versions

Store in env:
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_TEAM`

---

## 4) Required Supabase Tables

### A) `billing_customers`
Tracks Stripe customer identity.

Columns (recommended):
- `id uuid pk default gen_random_uuid()`
- `org_id uuid not null references organizations(id)`
- `created_by uuid not null references auth.users(id)`
- `stripe_customer_id text not null unique`
- `created_at timestamptz default now()`

Indexes:
- unique(`org_id`)
- unique(`stripe_customer_id`)

---

### B) `billing_subscriptions`
Tracks subscription state.

Columns (recommended):
- `id uuid pk default gen_random_uuid()`
- `org_id uuid not null references organizations(id)`
- `stripe_subscription_id text not null unique`
- `stripe_price_id text not null`
- `status text not null`  
  values: `active | trialing | past_due | canceled | unpaid | incomplete | incomplete_expired`
- `current_period_end timestamptz`
- `cancel_at_period_end boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Indexes:
- unique(`org_id`) if you want “one subscription per org” (recommended)
- unique(`stripe_subscription_id`)

---

### C) `entitlements`
Stores limits for gating (derived from plan).

Columns (recommended):
- `org_id uuid pk references organizations(id)`
- `plan text not null` (`free|pro|team`)
- `max_orgs int not null`
- `max_seats_per_org int not null`
- `max_kpi_months_history int not null` (use `-1` for unlimited)
- `max_roi_models_per_org int not null` (use `-1` for unlimited)
- `exports_csv_enabled boolean not null`
- `exports_pdf_enabled boolean not null`
- `charts_enabled boolean not null`
- `updated_at timestamptz default now()`

---

## 5) Server Endpoints (Next.js)

### Route Handlers / Server Actions
Recommended minimal set:

1) `POST /api/billing/create-checkout-session`
- inputs: `orgId`, `plan`
- creates/retrieves Stripe customer
- creates checkout session for subscription
- returns `checkoutUrl`

2) `GET /api/billing/portal`
- inputs: `orgId`
- returns Stripe Billing Portal URL

3) `POST /api/billing/webhook`
- receives Stripe events
- verifies signature
- updates `billing_subscriptions` + `entitlements`

---

## 6) Webhook Events to Handle (Minimum)

### MUST handle
- `checkout.session.completed`
  - subscription created; fetch subscription and persist
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### Useful (optional)
- `invoice.payment_failed` (set status, show banner)
- `invoice.paid` (confirm active)
- `customer.updated`

---

## 7) Entitlements Derivation

Create one function:
- `deriveEntitlementsFromPriceId(priceId) -> entitlements`

Example:
- if `priceId == STRIPE_PRICE_PRO` → plan `pro` with Pro limits
- if `priceId == STRIPE_PRICE_TEAM` → plan `team` with Team limits
- else → `free`

Always write entitlements to `entitlements` table for the org.

---

## 8) Feature Gating Enforcement (Critical)

### Where to enforce
- Server Actions (preferred)
- Route Handlers (exports, invites, etc.)

### Examples
- Create Org: check `current_org_count < max_orgs`
- Invite Member: check `member_count < max_seats_per_org`
- KPI fetch: restrict by `month` range if limited
- ROI scenario create: check count < `max_roi_models_per_org`
- Exports: require `exports_*_enabled`

UI gating should mirror server checks (disable buttons + upsell banners).

---

## 9) Security Considerations

- Webhook signature verification required
- Do not trust client-side plan claims
- Only owners should manage billing for an org
- Avoid open redirects in billing return URLs

---

## 10) Buyer-Friendly Minimal Flow (Suggested)

1) Settings → Billing page
2) Click “Upgrade to Pro/Team”
3) Stripe Checkout
4) Return to app (success page)
5) Webhook updates entitlements
6) UI unlocks gated features automatically

---

## 11) Testing Checklist

- Checkout completes and subscription appears in DB
- Webhook updates status on cancel
- Portal link works
- Gated action blocked for Free plan
- Pro/Team unlocks expected features