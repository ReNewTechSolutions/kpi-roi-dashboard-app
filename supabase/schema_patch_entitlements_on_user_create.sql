-- =========================================================
-- File: supabase/schema_patch_entitlements_on_user_create.sql
-- Patch your existing handle_new_user_create_org() to also seed entitlements.
-- Run AFTER your current schema.sql exists.
-- =========================================================

begin;

create or replace function public.handle_new_user_create_org()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name, created_by)
  values (coalesce(new.raw_user_meta_data->>'company', 'My Organization'), new.id)
  returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  insert into public.roi_models (org_id, name, inputs, created_by)
  values (
    new_org_id,
    'Default ROI Model',
    jsonb_build_object(
      'totalInvestment', 5000,
      'valueDelivered', 15000,
      'termMonths', 12,
      'upfrontPayment', 0,
      'outcomeBasedPayment', 0
    ),
    new.id
  );

  -- (a) Seed FREE entitlements so billing state always exists
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
    new_org_id,
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

  return new;
end;
$$;

commit;