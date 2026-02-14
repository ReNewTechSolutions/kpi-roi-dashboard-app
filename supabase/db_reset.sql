-- =========================================================
-- File: supabase/db_reset.sql
-- ⚠️ DANGER: Drops app tables and helper functions.
-- Use only in development or when reinitializing the project.
-- =========================================================

begin;

-- Drop triggers first (safe if they don't exist)
drop trigger if exists trg_kpi_entries_updated_at on public.kpi_entries;
drop trigger if exists trg_roi_models_updated_at on public.roi_models;

-- Drop auth trigger (created in schema.sql)
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_new_user_create_org();
drop function if exists public.set_updated_at();
drop function if exists public.is_org_member(uuid);
drop function if exists public.is_org_owner(uuid);

-- Drop tables (order matters due to FK constraints)
drop table if exists public.kpi_entries cascade;
drop table if exists public.roi_models cascade;
drop table if exists public.org_members cascade;
drop table if exists public.organizations cascade;

commit;