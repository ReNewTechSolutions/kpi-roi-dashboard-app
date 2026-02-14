<!-- ======================================================
File: docs/ARCHITECTURE.md
====================================================== -->

# Architecture — KPI + ROI Dashboard (Next.js + Supabase)

This document explains how the app is structured to be:
- SSR/prerender safe
- Multi-tenant secure (RLS)
- Modular (UI / data / business logic)
- Buyer-friendly (easy to extend and deploy)

---

## 1) High-Level System Design

### Runtime Components
- **Next.js App Router** (server + client rendering)
- **Supabase Auth** (sessions, users)
- **Supabase Postgres** (tenant data)
- **Row Level Security (RLS)** enforces tenant isolation at the database layer
- **Vercel** deployment (serverless/edge)

### Security Boundary
**RLS is the final enforcement point.**  
Even if a UI bug exists, RLS prevents cross-tenant reads/writes.

---

## 2) Folder & Module Layout

Recommended layout:
src/
app/
(protected)/        # authenticated routes only
auth/               # signup/login
components/           # reusable UI building blocks
data/                 # typed DB interactions
features/             # domain modules (demo, billing, etc.)
lib/                  # environment + supabase clients + utilities
supabase/
schema.sql
rls.sql
docs/
*.md

---

### What Goes Where
- `components/` — purely UI (buttons, cards, nav, modal, forms)
- `data/` — database calls (queries/mutations), typed, minimal business logic
- `features/` — domain logic and higher-level flows (demo mode, billing, invites)
- `lib/` — infra utilities (env, supabase client factories, helpers)

---

## 3) SSR-Safe Supabase Patterns

### The Core Rule
**Do not initialize the browser client on the server.**  
In Next.js App Router, Server Components run on the server. Client Components run in the browser.

### Browser Client (Client Components only)
Use this when:
- handling auth UI
- calling Supabase from interactive client components
- reading client session state

Example usage:
- `getSupabaseBrowserClient()` inside `"use client"` components only

### Server Client (Server Components / Server Actions / Route Handlers)
Use this when:
- guarding routes (`redirect()` if not signed in)
- fetching user profile server-side
- reading secure cookies/session context
- building server actions for mutating data

Example usage:
- `getSupabaseServerClient()` inside server-only modules

---

## 4) Rendering Boundaries (Avoiding Build/Prerender Errors)

### Server-only exports must live in Server Components
Exports like:
- `export const revalidate = 0`
- `export const dynamic = "force-dynamic"`

Must be in files that are **not** `"use client"`.

**Correct pattern**
- `page.tsx` (Server Component): exports `revalidate/dynamic`, renders a client form component
- `LoginForm.tsx` (Client Component): handles state, user input, Supabase browser auth calls

---

## 5) Multi-Tenant Data Model

### Tenant Entities
- `organizations`
- `org_members`
- `kpi_entries` (tenant scoped by `org_id`)
- `roi_models` (tenant scoped by `org_id`)

### Tenant Isolation
RLS uses:
- `is_org_member(org_id)`
- `is_org_owner(org_id)`

All KPI/ROI queries must include an org context.

---

## 6) Org Context (Current Organization)

### Goal
The UI needs a current org selection so that KPI/ROI views are scoped consistently.

### Options
- **Cookie-based** org selection (recommended for SSR consistency)
- **localStorage-based** selection (fast MVP)

Recommended:
- store `current_org_id` in an **httpOnly cookie**
- server layout reads cookie
- client org-switch action updates cookie
- client calls `router.refresh()` to re-render server components with new org context

---

## 7) Data Layer Conventions (`src/data/*`)

Principles:
- typed inputs/outputs
- one module per table/domain
- no UI assumptions
- queries should be org-scoped by design

Example modules:
- `data/orgs.ts` — list orgs, manage members
- `data/kpi.ts` — get monthly KPI entries, upsert entry
- `data/roi.ts` — read/write ROI model(s)

---

## 8) Feature Modules (`src/features/*`)

Feature modules orchestrate:
- data calls
- business rules
- UI coordination

Examples:
- `features/demo/` — demo dataset + demo routing logic
- `features/billing/` — Stripe scaffolding (future)
- `features/invites/` — org invites (future)

---

## 9) Deployment Model (Vercel + Supabase)

- Vercel hosts the Next.js app
- Supabase hosts Auth + DB
- Environment variables in Vercel provide Supabase config

Key env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 10) Guardrails / Best Practices

- Keep `"use client"` as low in the tree as possible
- Prefer server guards for protected areas
- Always scope data by org
- Use RLS as the enforcement layer
- Keep business logic out of UI components