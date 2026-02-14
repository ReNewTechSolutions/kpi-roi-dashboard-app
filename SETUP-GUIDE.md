<!-- ======================================================
File: SETUP_GUIDE.md
Rewritten (clean structure + fixed code fences + billing + webhook troubleshooting)
====================================================== -->

# Setup Guide — KPI + ROI Dashboard (Next.js + Supabase + Vercel)

Deploy locally and to Vercel fast. This repo supports **one-click Supabase installs** (core-only or core+billing).

---

## 1) Prerequisites

- Node.js 18+ (recommended 20+)
- A Supabase project
- A Vercel account

---

## 2) Create a Supabase Project

1. Create a new project in Supabase.
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3) Install Database (One-Click)

In Supabase, open **SQL Editor** and run **one** of these:

### Option A — Core App Only (no Stripe billing)
Run:
- `supabase/install_minimal.sql`

### Option B — Core + Stripe Billing + Entitlements
Run:
- `supabase/install_billing.sql`

> If you already installed using older `schema.sql` + `rls.sql`, you can keep those — the one-click installs are for new buyers / fresh Supabase projects.

### What the install does
- Creates multi-tenant tables (orgs, members, KPI, ROI)
- Enables RLS + policies (member/owner rules)
- Adds `updated_at` triggers
- Adds an auth trigger that auto-creates:
  - an organization
  - org membership (owner)
  - a default ROI model
  - (billing install only) default **free** entitlements

---

## 4) Configure Auth Settings (Supabase)

Go to **Authentication → URL Configuration**:

### Local
- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/**`

### Production (Vercel)
- Add your Vercel domain:
  - `https://YOUR_VERCEL_DOMAIN/**`

### Email confirmation (optional)
Disable email confirmations for quicker testing:
- **Auth → Providers → Email → Confirm email** (toggle)

---

## 5) Configure Environment Variables

Create `.env.local` at repo root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxxxxxxxxxxxxxxxxx"

# Optional flags
NEXT_PUBLIC_DEMO_MODE="false"
NEXT_PUBLIC_APP_NAME="KPI + ROI Dashboard"