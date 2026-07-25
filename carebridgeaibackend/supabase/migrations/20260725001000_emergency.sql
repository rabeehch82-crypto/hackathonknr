create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relation text not null,
  phone text not null,
  priority int not null default 1,
  created_at timestamptz not null default now()
);

create index emergency_contacts_patient_idx on public.emergency_contacts(patient_id, priority);

-- One QR medical card per patient. qr_token is the opaque value embedded in the QR code;
-- the generate-emergency-qr / read-emergency-qr edge functions resolve it server-side with
-- the service role key so first responders don't need an authenticated session to scan it.
create table public.emergency_qr_cards (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null unique references public.profiles(id) on delete cascade,
  qr_token uuid not null default gen_random_uuid() unique,
  medical_summary jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
