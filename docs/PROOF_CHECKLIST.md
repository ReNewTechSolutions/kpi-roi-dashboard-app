<!-- ======================================================
File: docs/PROOF_CHECKLIST.md
====================================================== -->

# Proof Checklist — Pre-Sale QA (Flippa-Ready)

Use this checklist before listing or handing off to a buyer to reduce refunds and support load.

---

## 1) Repo Hygiene
- [ ] `README.md` present and accurate
- [ ] `SETUP_GUIDE.md` present and accurate
- [ ] `LICENSE` included
- [ ] `supabase/README.md` included
- [ ] No secrets committed (`.env.local` not tracked)
- [ ] Clear folder structure (`src/`, `supabase/`, `docs/`)

---

## 2) Local Build Proof
Run locally:

- [ ] `npm install`
- [ ] `npm run dev` works
- [ ] `npm run build` succeeds
- [ ] `npm run lint` (if configured) passes

Capture evidence:
- [ ] copy/paste build output into a note
- [ ] screenshot of app running locally

---

## 3) Supabase Proof
### SQL Scripts
- [ ] Run `schema.sql` successfully
- [ ] Run `rls.sql` successfully
- [ ] (Optional) `db_reset.sql` works in a fresh project

### Auth
- [ ] Email/password signup works
- [ ] Login works
- [ ] Logout works
- [ ] Redirect URLs configured for local + production

### Data
- [ ] New user has org created (if trigger enabled)
- [ ] `org_members` row exists for new user
- [ ] Default ROI model exists (if created by trigger)

---

## 4) RLS / Multi-Tenant Isolation Proof
Create two users in Supabase Auth:
- User A
- User B

Steps:
- [ ] User A creates KPI/ROI data in Org A
- [ ] User B cannot see Org A data
- [ ] Add User B to Org A as member
- [ ] User B can now see Org A data
- [ ] User B cannot change org membership unless owner (per policy)
- [ ] User B cannot delete owner-only rows (as configured)

Evidence:
- [ ] screenshot: User B sees nothing before membership
- [ ] screenshot: User B sees data after membership

---

## 5) Vercel Deploy Proof
- [ ] Deploy to Vercel from GitHub (preferred)
- [ ] Env vars set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] optional `NEXT_PUBLIC_DEMO_MODE`
- [ ] Build passes on Vercel
- [ ] Production URL loads
- [ ] Auth works on production domain
- [ ] Supabase redirect URLs updated for Vercel domain

Evidence:
- [ ] screenshot of Vercel deployment success
- [ ] screenshot of production app

---

## 6) UX Proof (Screenshots)
Create `docs/screenshots/` and capture:

- [ ] `login.png`
- [ ] `dashboard.png`
- [ ] `kpi.png`
- [ ] `roi.png`
- [ ] `org.png`
- [ ] `settings.png`

Check:
- [ ] consistent window size
- [ ] no personal data
- [ ] clean values (use `docs/DEMO_DATA_SCRIPT.md`)

---

## 7) Buyer Handoff Checklist
- [ ] Buyer receives repo access or zip
- [ ] Buyer receives Supabase SQL scripts (`schema.sql`, `rls.sql`, `db_reset.sql`)
- [ ] Buyer receives docs (`SETUP_GUIDE.md`, `README.md`, `docs/`)
- [ ] Buyer can deploy successfully within ~30 minutes
- [ ] Optional: provide a 60–120s Loom walkthrough

---

## 8) Optional Trust Boosters
- [ ] `docs/SECURITY.md` present
- [ ] `CHANGELOG.md` present
- [ ] `ROADMAP.md` present
- [ ] Add “Support / Add-ons” section to Flippa listing