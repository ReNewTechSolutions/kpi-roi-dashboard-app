<!-- ======================================================
File: supabase/README.md
====================================================== -->

# Supabase Setup

This folder contains the database scripts for the KPI + ROI Dashboard.

## Files

- `schema.sql` — tables, triggers, and helper functions
- `rls.sql` — row level security + policies
- `seed.sql` — optional (demo seed notes)

## Run Order

In Supabase **SQL Editor**, run:

1) `schema.sql`  
2) `rls.sql`  
3) `seed.sql` *(optional)*

## Notes / Gotchas

### `created_by` and `ON DELETE SET NULL`
If your tables use `ON DELETE SET NULL`, ensure the referenced column is nullable.
If you keep `created_by` as `NOT NULL`, use `ON DELETE CASCADE` instead.

### Demo Data
Under RLS, demo rows must be accessible by a real auth user with membership.
The recommended approach is **app-side demo mode** for screenshots/onboarding.

## Verification Queries

After creating an account, verify you have an org + membership:

```sql
select * from public.organizations order by created_at desc limit 5;
select * from public.org_members order by created_at desc limit 10;