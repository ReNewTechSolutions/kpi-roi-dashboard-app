-- =========================================================
-- File: supabase/billing.sql
-- Stripe billing tables + basic RLS (org-member read, owner manage)
-- Run AFTER your existing schema.sql + rls.sql
-- =========================================================

begin;

create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  unique (org_id)
);

create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id)
);

create table if not exists public.entitlements (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  max_orgs int not null default 1,
  max_seats_per_org int not null default 1,
  max_kpi_months_history int not null default 3,   -- -1 for unlimited
  max_roi_models_per_org int not null default 1,    -- -1 for unlimited
  exports_csv_enabled boolean not null default false,
  exports_pdf_enabled boolean not null default false,
  charts_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger trg_billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_entitlements_updated_at on public.entitlements;
create trigger trg_entitlements_updated_at
before update on public.entitlements
for each row execute function public.set_updated_at();

commit;

-- =========================================================
-- RLS for billing tables
-- =========================================================
begin;

alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;
alter table public.entitlements enable row level security;

-- Members can read billing info for their org (optional; many SaaS do this).
-- Owners can create/update.
drop policy if exists "billing_customers_select_member" on public.billing_customers;
create policy "billing_customers_select_member"
on public.billing_customers
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "billing_customers_insert_owner" on public.billing_customers;
create policy "billing_customers_insert_owner"
on public.billing_customers
for insert
to authenticated
with check (public.is_org_owner(org_id) and created_by = auth.uid());

drop policy if exists "billing_customers_update_owner" on public.billing_customers;
create policy "billing_customers_update_owner"
on public.billing_customers
for update
to authenticated
using (public.is_org_owner(org_id))
with check (public.is_org_owner(org_id));

drop policy if exists "billing_subscriptions_select_member" on public.billing_subscriptions;
create policy "billing_subscriptions_select_member"
on public.billing_subscriptions
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "billing_subscriptions_upsert_owner" on public.billing_subscriptions;
create policy "billing_subscriptions_upsert_owner"
on public.billing_subscriptions
for insert
to authenticated
with check (public.is_org_owner(org_id));

drop policy if exists "billing_subscriptions_update_owner" on public.billing_subscriptions;
create policy "billing_subscriptions_update_owner"
on public.billing_subscriptions
for update
to authenticated
using (public.is_org_owner(org_id))
with check (public.is_org_owner(org_id));

drop policy if exists "entitlements_select_member" on public.entitlements;
create policy "entitlements_select_member"
on public.entitlements
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "entitlements_upsert_owner" on public.entitlements;
create policy "entitlements_upsert_owner"
on public.entitlements
for insert
to authenticated
with check (public.is_org_owner(org_id));

drop policy if exists "entitlements_update_owner" on public.entitlements;
create policy "entitlements_update_owner"
on public.entitlements
for update
to authenticated
using (public.is_org_owner(org_id))
with check (public.is_org_owner(org_id));

commit;