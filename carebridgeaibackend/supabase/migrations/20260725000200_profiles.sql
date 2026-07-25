-- Profiles: extends auth.users with app-specific data for every role
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'patient',
  full_name text not null,
  phone text,
  date_of_birth date,
  gender text,
  avatar_url text,
  address text,
  preferred_language public.language_pref not null default 'ml',
  high_contrast boolean not null default false,
  large_font boolean not null default false,
  voice_navigation boolean not null default false,
  blood_group text,
  allergies text[] not null default '{}',
  chronic_conditions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);

comment on table public.profiles is 'One row per authenticated user; role drives access across the app (patient, doctor, caregiver, hospital_admin, pharmacy_staff, lab_staff, admin).';
