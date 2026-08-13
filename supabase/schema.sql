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



create table if not exists public.patient_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null, mobile_phone text not null,
  first_name text not null, last_name text not null, preferred_name text,
  date_of_birth date not null, language text, medical_record_id text,
  address text not null, city text not null, state text not null, zip text not null,
  pronouns text, translator text,
  emergency_name text not null, emergency_relationship text not null, emergency_phone text not null,
  referring_physician text,
  insurance_company text, insurance_member_id text, insurance_group text,
  subscriber_first text, subscriber_last text, subscriber_relationship text, subscriber_dob date,
  ethnicity text, gender_identity text, sex_at_birth text, veteran text,
  privacy_ack boolean not null default false,
  status text not null default 'new' check (status in ('new','reviewed','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
comment on table public.patient_intakes is 'Protected patient registration data. Service-role/admin access only; no public/client policies.';
alter table public.patient_intakes enable row level security;
revoke all on public.patient_intakes from anon, authenticated;
create index if not exists patient_intakes_created_idx on public.patient_intakes (created_at desc);

commit;
