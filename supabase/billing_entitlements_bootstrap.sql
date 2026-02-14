-- =========================================================
-- File: supabase/billing_entitlements_bootstrap.sql
-- Optional helper: ensure a FREE entitlements row exists per org.
-- Run after your schema.sql + rls.sql + billing.sql
-- =========================================================

begin;

create or replace function public.ensure_entitlements_for_org(_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.entitlements (
    org_id,
    plan,
    max_orgs,
    max_seats_per_org,
    max_kpi_months_history,
    max_roi_models_per_org,
    exports_csv_enabled,
    exports_pdf_enabled,
    charts_enabled
  )
  values (
    _org_id,
    'free',
    1,
    1,
    3,
    1,
    false,
    false,
    false
  )
  on conflict (org_id) do nothing;
end;
$$;

commit;