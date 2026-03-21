-- Base schema for the LIFKO resources module.
-- Run this script inside the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.resource_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.resource_folders(id) on delete set null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.resource_folders(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text,
  file_path text,
  file_name text,
  mime_type text,
  file_size bigint,
  cover_image_path text,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_resource_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_resource_admin() from public;
grant execute on function public.is_resource_admin() to anon, authenticated, service_role;

create or replace function public.handle_resource_publish_timestamp()
returns trigger
language plpgsql
as $$
begin
  if new.is_published = true and old.is_published = false then
    new.published_at = timezone('utc', now());
  elsif new.is_published = false then
    new.published_at = null;
  end if;

  return new;
end;
$$;

create or replace trigger set_resource_folders_updated_at
before update on public.resource_folders
for each row
execute function public.set_updated_at();

create or replace trigger set_resources_updated_at
before update on public.resources
for each row
execute function public.set_updated_at();

create or replace trigger handle_resource_publish_timestamp
before update on public.resources
for each row
execute function public.handle_resource_publish_timestamp();

create index if not exists resource_folders_parent_idx on public.resource_folders(parent_id);
create index if not exists resource_folders_published_idx on public.resource_folders(is_published, sort_order);
create index if not exists resources_folder_idx on public.resources(folder_id);
create index if not exists resources_published_idx on public.resources(is_published, sort_order);

alter table public.resource_folders enable row level security;
alter table public.resources enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read published folders" on public.resource_folders;
create policy "Public can read published folders"
on public.resource_folders
for select
using (is_published = true);

drop policy if exists "Public can read published resources" on public.resources;
create policy "Public can read published resources"
on public.resources
for select
using (is_published = true);

drop policy if exists "Admins can manage folders" on public.resource_folders;
create policy "Admins can manage folders"
on public.resource_folders
for all
using (public.is_resource_admin())
with check (public.is_resource_admin());

drop policy if exists "Admins can manage resources" on public.resources;
create policy "Admins can manage resources"
on public.resources
for all
using (public.is_resource_admin())
with check (public.is_resource_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
using (public.is_resource_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
using (public.is_resource_admin())
with check (public.is_resource_admin());

insert into storage.buckets (id, name, public)
values ('resources', 'resources', false)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 6291456,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
where id = 'resources';

drop policy if exists "Admins can manage resource storage" on storage.objects;
create policy "Admins can manage resource storage"
on storage.objects
for all
using (bucket_id = 'resources' and public.is_resource_admin())
with check (bucket_id = 'resources' and public.is_resource_admin());

drop policy if exists "Public can read published resource files through signed URLs" on storage.objects;
create policy "Public can read published resource files through signed URLs"
on storage.objects
for select
using (
  bucket_id = 'resources'
  and exists (
    select 1
    from public.resources
    where public.resources.file_path = storage.objects.name
      and public.resources.is_published = true
  )
);

insert into public.admin_users (email)
values ('ingrrnn.correaj@gmail.com')
on conflict (email) do nothing;
