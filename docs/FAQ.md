<!-- ======================================================
File: docs/FAQ.md
====================================================== -->

# FAQ — Buyer & Developer Questions

## Setup / Deployment

### How do I deploy this?
- Create a Supabase project
- Run `schema.sql` then `rls.sql` in Supabase SQL Editor
- Add env vars to Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy
See `SETUP_GUIDE.md` for full steps.

### Why does login work locally but not on Vercel?
Usually Supabase redirect URLs are missing your Vercel domain.
Update **Supabase → Auth → URL Configuration**:
- Site URL: `https://YOUR_DOMAIN`
- Redirect URLs: `https://YOUR_DOMAIN/**`

---

## Product Customization

### Where do I change branding (name/logo)?
- Use `NEXT_PUBLIC_APP_NAME` and a central UI component (Nav/Title area)
- Add a logo asset under `public/` (e.g. `public/logo.svg`)
- Update `NavBar` and any landing page components

### Can I white-label this?
Yes.
- Update brand strings
- Replace UI theme variables
- Replace demo screenshots and README copy

---

## Multi-Tenancy / Orgs

### How does multi-tenancy work?
Every tenant-scoped row includes `org_id`.  
RLS policies restrict access to rows where the user is a member of the org.

### How do I add team invites?
Recommended approaches:
1) **Simple (fast)**: owner adds a member only if the user already exists.
2) **Proper invites**: create an `org_invites` table and email invite links.
3) Add “accept invite” flow that inserts into `org_members`.

---

## Payments / SaaS Monetization

### Does this include Stripe?
Not by default.
The architecture is built so Stripe can be added cleanly.

Suggested Stripe scope:
- subscription plans (Free/Pro/Team)
- checkout + billing portal
- webhooks to sync entitlement state
- feature gating (e.g. exports, team size, #orgs)

---

## Demo Mode / Screenshots

### How do I generate screenshots without real data?
Recommended: app-side **Demo Mode**.
- Toggle with `NEXT_PUBLIC_DEMO_MODE=true`
- Provide sample KPI/ROI data in memory
- Disable writes or simulate them locally

This avoids the complexity of seeding demo data under RLS.

---

## Security / RLS

### Is this secure for multi-tenant use?
Yes — RLS enforces tenant isolation at the database layer.
Still recommended:
- run dependency updates
- consider rate limiting on auth endpoints
- add audit logs for membership changes

### I’m getting “permission denied” errors from Supabase
Check:
- The logged-in user is a member in `org_members`
- The query includes tenant context (`org_id`)
- Policies exist and RLS is enabled on the tables

---

## Common Development Questions

### Where should I put database queries?
In `src/data/*` modules.
Avoid sprinkling raw `.from("table")` calls across UI components.

### Where should business logic go?
In `src/features/*`.
Keep UI components minimal and reusable.

### Why do I see build errors about `revalidate`?
Because `revalidate` exports must be in Server Components.
If a file starts with `"use client"`, move `revalidate/dynamic` exports into a server `page.tsx` and render a client component for interactivity.

---

## Support / Transfer (Flippa)

### What should I give the buyer?
- repo access or zip
- Supabase SQL scripts
- Vercel deployment instructions
- screenshots + demo video
- optional: post-sale support terms

### What’s a good “next step” upsell?
- Stripe subscriptions integration
- Landing page + onboarding flow
- Team invites and roles
- KPI charting + exports