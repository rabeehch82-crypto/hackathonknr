create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  status public.prescription_status not null default 'active',
  diagnosis text,
  ai_explanation text,
  ai_explanation_language public.language_pref,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index prescriptions_patient_idx on public.prescriptions(patient_id, created_at desc);
create index prescriptions_doctor_idx on public.prescriptions(doctor_id);

create table public.medications (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  name text not null,
  dosage text not null,
  frequency text not null,
  duration_days int not null default 7,
  instructions text,
  -- times of day the medication should be taken, e.g. ["08:00", "14:00", "20:00"]
  times_per_day jsonb not null default '["09:00"]',
  created_at timestamptz not null default now()
);

create index medications_prescription_idx on public.medications(prescription_id);

create table public.medication_reminders (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  scheduled_for timestamptz not null,
  status public.reminder_status not null default 'pending',
  taken_at timestamptz,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create index medication_reminders_patient_idx on public.medication_reminders(patient_id, scheduled_for);
create index medication_reminders_scheduled_idx on public.medication_reminders(scheduled_for);
create index medication_reminders_status_idx on public.medication_reminders(status);
