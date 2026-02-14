<!-- ======================================================
File: docs/SECURITY.md
====================================================== -->

# Security Policy

## Overview
This project is a multi-tenant KPI + ROI dashboard built on:
- Next.js (App Router)
- Supabase Auth + Postgres
- Supabase Row Level Security (RLS)

**Primary security goal:** prevent cross-tenant data access by enforcing org membership at the database layer.

---

## Data Isolation Model (Multi-Tenant)
All tenant-scoped tables include `org_id` and are protected by RLS policies.

### Key Tables
- `organizations`
- `org_members`
- `kpi_entries`
- `roi_models`

### Access Rules (High-Level)
- **Authenticated users** can access organization data only if they are an **org member**.
- **Owners** can manage org settings and membership.
- KPI/ROI data access is always scoped by `org_id` membership checks.

---

## RLS Policies
RLS is enabled on:
- `public.organizations`
- `public.org_members`
- `public.kpi_entries`
- `public.roi_models`

Helper predicates:
- `public.is_org_member(_org_id uuid)`
- `public.is_org_owner(_org_id uuid)`

These functions are used inside policies to ensure consistent enforcement.

---

## Application-Layer Safeguards
In addition to RLS:
- Protected routes require authenticated sessions.
- The UI should only query org-scoped data using the current org selection.
- Auth pages are isolated from protected layouts (reduces accidental leakage).

---

## Reporting a Vulnerability
If you discover a security issue, please report it responsibly.

**Preferred disclosure:**
- Open a private issue or contact the maintainer directly.
- Include:
  - steps to reproduce
  - affected endpoints/pages
  - any relevant logs or screenshots

### Response Targets (best effort)
- Acknowledge within 72 hours
- Patch or mitigation plan within 7–14 days depending on severity

---

## Supported Versions
This is a starter/template repo. Security updates are provided on a best-effort basis by the maintainer or buyer.

Recommended buyer practice:
- keep dependencies updated
- run `npm audit` periodically
- enable Supabase security advisories
- consider adding rate limiting and bot protections if public-facing

---

## Hardening Recommendations (Optional)
If launching as a public SaaS:
- Add rate limiting to auth-related actions (login/signup)
- Consider MFA
- Add audit logs for org membership changes and KPI/ROI edits
- Add an allowlist for redirect URLs (prevents open redirect bugs)
- Add monitoring (Sentry/Logflare/etc.)
- Set secure cookie flags and strict CSP headers (if applicable)

---

## Disclaimer
This software is provided “as is” without warranty. You are responsible for verifying security posture for your specific deployment and compliance requirements.