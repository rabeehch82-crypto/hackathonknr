create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  hospital_id uuid references public.hospitals(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 30,
  status public.appointment_status not null default 'requested',
  reason text,
  notes text,
  ai_visit_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_patient_idx on public.appointments(patient_id);
create index appointments_doctor_idx on public.appointments(doctor_id);
create index appointments_scheduled_idx on public.appointments(scheduled_at);
create index appointments_status_idx on public.appointments(status);
