create table public.caregiver_access (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  status public.caregiver_access_status not null default 'pending',
  can_view_records boolean not null default true,
  can_view_medications boolean not null default true,
  can_receive_alerts boolean not null default true,
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(caregiver_id, patient_id),
  check (caregiver_id <> patient_id)
);

create index caregiver_access_patient_idx on public.caregiver_access(patient_id);
create index caregiver_access_caregiver_idx on public.caregiver_access(caregiver_id);
