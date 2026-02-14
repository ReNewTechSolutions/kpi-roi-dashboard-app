<!-- ======================================================
File: docs/UPSELL_PACKAGES.md
====================================================== -->

# Upsell Packages — Fixed Scope Add-Ons (Flippa / Buyer Services)

These are optional paid add-ons you can offer after sale. Fixed scope increases conversion and reduces ambiguity.

---

## Package 1 — Stripe Monetization Scaffold
**Price:** $500–$1,500  
**Timeline:** 3–10 days

### Includes
- Stripe Checkout (subscription)
- Billing Portal
- Webhook handling (subscription status sync)
- Supabase tables:
  - customers
  - subscriptions
  - entitlements (optional)
- Feature gating hooks (exports, seats, orgs)

### Deliverables
- Working upgrade flow (Free → Pro/Team)
- Billing status displayed in Settings
- Documentation: “How to change plan pricing”

### Not included (unless requested)
- Tax/VAT handling
- Invoicing customization
- Custom metered billing

---

## Package 2 — Team Invites + Role Management
**Price:** $400–$1,200  
**Timeline:** 2–7 days

### Includes
- Invite table + flow
- Accept invite route
- Member management UI
- Role rules:
  - owner can invite/remove
  - member has read/write as allowed

### Deliverables
- Invite by email + accept link
- Roles persisted in DB
- Updated RLS policies if needed

---

## Package 3 — KPI Charts + Export Reports
**Price:** $300–$1,000  
**Timeline:** 2–6 days

### Includes
- KPI trend charts (revenue, cost, profit)
- CSV export (KPI entries)
- Optional: basic “summary cards”

### Deliverables
- KPI page looks “SaaS-polished”
- Exports gated by plan (if billing exists)

---

## Package 4 — ROI Calculator + Scenario Compare
**Price:** $300–$1,200  
**Timeline:** 2–7 days

### Includes
- ROI calculator UI (validated)
- Save scenarios per org
- Compare scenarios view
- Optional export (CSV)

### Deliverables
- ROI page ready for screenshots and use
- Scenarios persist per org

---

## Package 5 — Landing Page + Pricing Page + Onboarding
**Price:** $300–$1,000  
**Timeline:** 2–6 days

### Includes
- Public landing page
- Pricing page aligned to tiers
- Onboarding steps (first KPI entry, first ROI scenario)
- Screenshot-ready “demo mode” path (optional)

### Deliverables
- Marketing pages in `src/app/`
- CTA buttons link into app/signup

---

## Package 6 — Demo Mode (Screenshot + Onboarding Kit)
**Price:** $150–$600  
**Timeline:** 1–3 days

### Includes
- Demo toggle (`NEXT_PUBLIC_DEMO_MODE=true`)
- Demo dataset (KPI + ROI + orgs)
- “Continue in Demo” UX
- Screenshot checklist + captions

### Deliverables
- Buyer can produce screenshots immediately
- No Supabase data needed for demo visuals

---

## Package 7 — White-Label + Branding Pack
**Price:** $150–$700  
**Timeline:** 1–3 days

### Includes
- Swap logo + favicon
- Theme tokens or CSS variables
- Rename app throughout UI/docs
- Add “brand config” module

---

## Suggested Bundles (Higher Conversion)
### “Launch Bundle” — $900–$2,500
- Stripe scaffold + Landing page + Demo mode

### “Team Bundle” — $800–$2,200
- Team invites + Role management + KPI exports

---

## Terms (Template)
- 50% upfront, 50% on delivery (or your preference)
- One revision included
- Additional scope billed hourly or as add-on