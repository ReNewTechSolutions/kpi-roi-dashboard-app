<!-- ======================================================
File: docs/ONE_PAGER.md
====================================================== -->

# KPI + ROI Dashboard — One-Pager

## What It Is
A production-ready **multi-tenant KPI + ROI dashboard SaaS starter** built with **Next.js 16 (App Router)** and **Supabase (Auth + Postgres + RLS)**. Designed to deploy quickly, generate clean demo screenshots, and serve as a strong base for monetized SaaS or licensed software.

---

## Who It’s For
- Indie hackers shipping micro-SaaS quickly
- Agencies packaging KPI reporting for clients
- Consultants productizing ROI reporting
- SMBs needing internal KPI + ROI tracking

---

## Core Features
### Multi-Tenant Foundation
- Organizations + member roles (owner/member)
- Data scoped by org via **Row Level Security**
- Secure by default (database-enforced isolation)

### KPI Tracking
- Monthly KPI entries (revenue, cost, notes)
- Easily extendable KPI schema + UI

### ROI Models
- Store ROI model inputs (JSONB)
- Supports ROI scenario expansion and saved calculations

### Auth + Protected Routes
- Supabase email/password auth
- Protected app shell + sign out
- SSR/prerender-safe Next.js patterns

---

## Tech Stack
- Next.js 16 (App Router)
- Supabase Auth + Postgres
- TypeScript
- Vercel deployment

---

## Why This Asset Is Valuable
- **Multi-tenant + RLS included** (hard part done)
- **Deploy in ~30 minutes** (setup guide included)
- Clean architecture: UI / data / business logic separation
- Easy path to monetize:
  - Stripe subscriptions
  - feature gating by plan
  - team invites + roles

---

## Deployment Summary
1) Create Supabase project  
2) Run `schema.sql` then `rls.sql`  
3) Set env vars on Vercel  
4) Deploy

---

## Next Expansion Ideas (Optional)
- Demo mode for screenshots/onboarding
- KPI charts + exports
- ROI scenario compare + PDF report
- Team invites (email invite flow)
- Stripe subscriptions (Free/Pro/Team)