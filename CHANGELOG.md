<!-- ======================================================
File: CHANGELOG.md
====================================================== -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [0.1.0] - 2026-02-13

### Added
- Next.js 16 App Router foundation
- Supabase Auth (signup/login)
- Multi-tenant database schema:
  - `organizations`
  - `org_members`
  - `kpi_entries` (monthly KPIs)
  - `roi_models` (JSON inputs)
- RLS policies for member/owner authorization
- Protected route layout for authenticated areas
- Navigation shell + profile dropdown + sign out
- Modular UI building blocks (auth UI, modal)

### Notes
- Intended as a production-ready starter and code asset (Flippa-ready).
- Stripe/monetization scaffolding is intentionally left as a next phase.

---

## [Unreleased]

### Planned
- Demo Mode (screenshots + onboarding)
- Organization switcher wired to real org rows + persisted selection
- KPI dashboard charts + exports (CSV)
- ROI calculator UI + saved scenarios
- Team invites (owner adds member)
- Stripe-ready monetization scaffolding
- Landing page + marketing pages
- Audit logging (optional)
- E2E tests and CI workflow