<!-- ======================================================
File: supabase/install_minimal.sql
One-click install (core app only, no Stripe billing)
====================================================== -->
begin;

-- Extensions
create extension if not exists "pgcrypto";

-- =========================================================
-- Core tables
-- =========================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.org_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.kpi_entries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  month date not null,
  revenue numeric not null default 0,
  cost numeric not null default 0,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, month)
);

create table if not exists public.roi_models (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null default 'Default ROI Model',
  inputs jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_kpi_entries_updated_at on public.kpi_entries;
create trigger trg_kpi_entries_updated_at
before update on public.kpi_entries
for each row execute function public.set_updated_at();

drop trigger if exists trg_roi_models_updated_at on public.roi_models;
create trigger trg_roi_models_updated_at
before update on public.roi_models
for each row execute function public.set_updated_at();

-- =========================================================
-- RLS helpers
-- =========================================================
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.kpi_entries enable row level security;
alter table public.roi_models enable row level security;

create or replace function public.is_org_member(_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.org_members m
    where m.org_id = _org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_owner(_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.org_members m
    where m.org_id = _org_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  );
$$;

-- =========================================================
-- Core RLS policies
-- =========================================================
drop policy if exists "org_select_member" on public.organizations;
create policy "org_select_member"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

drop policy if exists "org_insert_self" on public.organizations;
create policy "org_insert_self"
on public.organizations
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "org_update_owner" on public.organizations;
create policy "org_update_owner"
on public.organizations
for update
to authenticated
using (public.is_org_owner(id))
with check (public.is_org_owner(id));

drop policy if exists "members_select_self_or_owner" on public.org_members;
create policy "members_select_self_or_owner"
on public.org_members
for select
to authenticated
using (user_id = auth.uid() or public.is_org_owner(org_id));

drop policy if exists "members_insert_owner_only" on public.org_members;
create policy "members_insert_owner_only"
on public.org_members
for insert
to authenticated
with check (public.is_org_owner(org_id));

drop policy if exists "members_update_owner_only" on public.org_members;
create policy "members_update_owner_only"
on public.org_members
for update
to authenticated
using (public.is_org_owner(org_id))
with check (public.is_org_owner(org_id));

drop policy if exists "members_delete_owner_only" on public.org_members;
create policy "members_delete_owner_only"
on public.org_members
for delete
to authenticated
using (public.is_org_owner(org_id));

drop policy if exists "kpi_select_member" on public.kpi_entries;
create policy "kpi_select_member"
on public.kpi_entries
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "kpi_insert_member" on public.kpi_entries;
create policy "kpi_insert_member"
on public.kpi_entries
for insert
to authenticated
with check (public.is_org_member(org_id) and created_by = auth.uid());

drop policy if exists "kpi_update_member" on public.kpi_entries;
create policy "kpi_update_member"
on public.kpi_entries
for update
to authenticated
using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

drop policy if exists "kpi_delete_owner" on public.kpi_entries;
create policy "kpi_delete_owner"
on public.kpi_entries
for delete
to authenticated
using (public.is_org_owner(org_id));

drop policy if exists "roi_select_member" on public.roi_models;
create policy "roi_select_member"
on public.roi_models
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "roi_insert_member" on public.roi_models;
create policy "roi_insert_member"
on public.roi_models
for insert
to authenticated
with check (public.is_org_member(org_id) and created_by = auth.uid());

drop policy if exists "roi_update_member" on public.roi_models;
create policy "roi_update_member"
on public.roi_models
for update
to authenticated
using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

drop policy if exists "roi_delete_owner" on public.roi_models;
create policy "roi_delete_owner"
on public.roi_models
for delete
to authenticated
using (public.is_org_owner(org_id));

-- =========================================================
-- Auth trigger: auto-create org + membership + default ROI
-- =========================================================
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_create_org();

commit;