begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Patients can read their own profile" on public.profiles;
create policy "Patients can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Patients can update their own profile" on public.profiles;
create policy "Patients can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text,
  phone text,
  preferred_contact text not null check (preferred_contact in ('phone', 'email')),
  request_type text not null check (request_type in ('appointment', 'forms', 'language', 'volunteer', 'donation', 'general')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

comment on table public.contact_requests is
  'Basic callback details only. Do not add symptoms, diagnoses, medications, insurance identifiers, or free-text medical fields.';

alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from anon, authenticated;

create index if not exists contact_requests_status_created_idx
  on public.contact_requests (status, created_at desc);

commit;
