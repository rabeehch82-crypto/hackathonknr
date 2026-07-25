-- Hospitals, pharmacies, labs and the staff who work at them
create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.labs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  created_at timestamptz not null default now()
);

-- Doctors are profiles (role = 'doctor') with extra professional info
create table public.doctors (
  id uuid primary key references public.profiles(id) on delete cascade,
  hospital_id uuid references public.hospitals(id) on delete set null,
  specialty text not null,
  license_number text not null unique,
  years_experience int,
  bio text,
  consultation_fee numeric(10,2),
  created_at timestamptz not null default now()
);

create index doctors_hospital_idx on public.doctors(hospital_id);
create index doctors_specialty_idx on public.doctors(specialty);

create table public.hospital_staff (
  id uuid primary key references public.profiles(id) on delete cascade,
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table public.pharmacy_staff (
  id uuid primary key references public.profiles(id) on delete cascade,
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.lab_staff (
  id uuid primary key references public.profiles(id) on delete cascade,
  lab_id uuid not null references public.labs(id) on delete cascade,
  created_at timestamptz not null default now()
);
