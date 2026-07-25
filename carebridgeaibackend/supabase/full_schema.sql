-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
create type public.user_role as enum (
  'patient',
  'doctor',
  'caregiver',
  'hospital_admin',
  'pharmacy_staff',
  'lab_staff',
  'admin'
);

create type public.appointment_status as enum (
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type public.record_type as enum (
  'lab_report',
  'prescription_scan',
  'discharge_summary',
  'imaging',
  'other'
);

create type public.prescription_status as enum (
  'active',
  'completed',
  'cancelled'
);

create type public.reminder_status as enum (
  'pending',
  'taken',
  'missed',
  'skipped'
);

create type public.notification_type as enum (
  'appointment',
  'medication',
  'ai_summary',
  'caregiver_request',
  'emergency',
  'system'
);

create type public.caregiver_access_status as enum (
  'pending',
  'accepted',
  'revoked',
  'declined'
);

create type public.language_pref as enum (
  'ml',
  'en',
  'hi',
  'ta',
  'te',
  'kn'
);

create type public.conversation_role as enum (
  'user',
  'assistant',
  'system'
);
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
-- Medical records: uploaded reports/scans plus AI-generated OCR text and summaries.
-- file_path points at an object in the 'medical-records' Storage bucket (see storage migration).
create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  record_type public.record_type not null default 'other',
  title text not null,
  file_path text not null,
  ocr_text text,
  ai_summary text,
  ai_analysis jsonb not null default '{}',
  shared_with_doctor_id uuid references public.doctors(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index medical_records_patient_idx on public.medical_records(patient_id, created_at desc);
create index medical_records_shared_doctor_idx on public.medical_records(shared_with_doctor_id);
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
create table public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  -- blood_pressure, blood_sugar, weight, heart_rate, spo2, temperature, steps, sleep_hours
  metric_type text not null,
  value numeric not null,
  secondary_value numeric,
  unit text not null,
  recorded_at timestamptz not null default now(),
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create index health_metrics_patient_idx on public.health_metrics(patient_id, metric_type, recorded_at desc);

create table public.health_scores (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score between 0 and 100),
  factors jsonb not null default '{}',
  computed_at timestamptz not null default now()
);

create index health_scores_patient_idx on public.health_scores(patient_id, computed_at desc);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  message text not null,
  data jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id, created_at desc);
create index notifications_unread_idx on public.notifications(user_id) where read = false;
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role public.conversation_role not null,
  content text not null,
  audio_url text,
  created_at timestamptz not null default now()
);

create index ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);
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
-- Security-definer helper functions used by RLS policies. security definer + a pinned
-- search_path lets these read tables the calling role couldn't otherwise, without
-- causing infinite recursion in the policies that call them.

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_doctor_of_patient(p_patient_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.appointments a
    where a.patient_id = p_patient_id and a.doctor_id = auth.uid()
  ) or exists (
    select 1 from public.prescriptions pr
    where pr.patient_id = p_patient_id and pr.doctor_id = auth.uid()
  );
$$;

create or replace function public.has_caregiver_access(p_patient_id uuid, p_permission text default null)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.caregiver_access ca
    where ca.patient_id = p_patient_id
      and ca.caregiver_id = auth.uid()
      and ca.status = 'accepted'
      and (
        p_permission is null
        or (p_permission = 'records' and ca.can_view_records)
        or (p_permission = 'medications' and ca.can_view_medications)
        or (p_permission = 'alerts' and ca.can_receive_alerts)
      )
  );
$$;

create or replace function public.can_view_prescription(p_prescription_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.prescriptions pr
    where pr.id = p_prescription_id
      and (
        pr.patient_id = auth.uid()
        or pr.doctor_id = auth.uid()
        or public.is_admin()
        or public.has_caregiver_access(pr.patient_id, 'medications')
      )
  );
$$;

create or replace function public.can_manage_prescription(p_prescription_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.prescriptions pr
    where pr.id = p_prescription_id
      and (pr.doctor_id = auth.uid() or public.is_admin())
  );
$$;

-- Generic updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.appointments
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.medical_records
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.prescriptions
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.ai_conversations
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.emergency_qr_cards
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
-- Role and full_name are read from the auth signup call's `options.data` (raw_user_meta_data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, preferred_language)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'patient'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'preferred_language')::public.language_pref, 'ml')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generate the medication_reminders schedule whenever a medication is prescribed.
create or replace function public.generate_medication_reminders()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_patient_id uuid;
  v_day int;
  v_time text;
  v_scheduled timestamptz;
begin
  select patient_id into v_patient_id
  from public.prescriptions
  where id = new.prescription_id;

  for v_day in 0 .. greatest(coalesce(new.duration_days, 1), 1) - 1 loop
    for v_time in select jsonb_array_elements_text(new.times_per_day) loop
      v_scheduled := (current_date + v_day) + v_time::time;
      insert into public.medication_reminders (medication_id, patient_id, scheduled_for)
      values (new.id, v_patient_id, v_scheduled);
    end loop;
  end loop;

  return new;
end;
$$;

create trigger on_medication_created
  after insert on public.medications
  for each row execute function public.generate_medication_reminders();

-- Notify the patient (and, best-effort, their doctor) whenever an appointment is created or its status changes.
create or replace function public.notify_appointment_change()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_doctor_name text;
  v_patient_name text;
begin
  select full_name into v_doctor_name from public.profiles where id = new.doctor_id;
  select full_name into v_patient_name from public.profiles where id = new.patient_id;

  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, type, title, message, data)
    values (
      new.doctor_id, 'appointment', 'New appointment request',
      format('%s requested an appointment on %s', coalesce(v_patient_name, 'A patient'), to_char(new.scheduled_at, 'FMDD Mon YYYY HH12:MI AM')),
      jsonb_build_object('appointment_id', new.id)
    );
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.notifications (user_id, type, title, message, data)
    values (
      new.patient_id, 'appointment', 'Appointment update',
      format('Your appointment with Dr. %s is now %s', coalesce(v_doctor_name, ''), new.status),
      jsonb_build_object('appointment_id', new.id, 'status', new.status)
    );
  end if;

  return new;
end;
$$;

create trigger on_appointment_change
  after insert or update on public.appointments
  for each row execute function public.notify_appointment_change();

-- Notify the patient when a doctor issues a new prescription.
create or replace function public.notify_new_prescription()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_doctor_name text;
begin
  select full_name into v_doctor_name from public.profiles where id = new.doctor_id;

  insert into public.notifications (user_id, type, title, message, data)
  values (
    new.patient_id, 'ai_summary', 'New prescription',
    format('Dr. %s issued a new prescription for you', coalesce(v_doctor_name, '')),
    jsonb_build_object('prescription_id', new.id)
  );

  return new;
end;
$$;

create trigger on_prescription_created
  after insert on public.prescriptions
  for each row execute function public.notify_new_prescription();

-- Notify caregivers with alert permission when a medication reminder is missed.
create or replace function public.notify_missed_reminder()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_med_name text;
  v_patient_name text;
  v_caregiver record;
begin
  if new.status = 'missed' and old.status is distinct from 'missed' then
    select name into v_med_name from public.medications where id = new.medication_id;
    select full_name into v_patient_name from public.profiles where id = new.patient_id;

    insert into public.notifications (user_id, type, title, message, data)
    values (
      new.patient_id, 'medication', 'Missed medication',
      format('You missed your %s dose scheduled for %s', coalesce(v_med_name, 'medication'), to_char(new.scheduled_for, 'FMDD Mon HH12:MI AM')),
      jsonb_build_object('reminder_id', new.id, 'medication_id', new.medication_id)
    );

    for v_caregiver in
      select caregiver_id from public.caregiver_access
      where patient_id = new.patient_id and status = 'accepted' and can_receive_alerts
    loop
      insert into public.notifications (user_id, type, title, message, data)
      values (
        v_caregiver.caregiver_id, 'medication', 'Missed medication alert',
        format('%s missed their %s dose scheduled for %s', coalesce(v_patient_name, 'Your patient'), coalesce(v_med_name, 'medication'), to_char(new.scheduled_for, 'FMDD Mon HH12:MI AM')),
        jsonb_build_object('reminder_id', new.id, 'patient_id', new.patient_id)
      );
    end loop;
  end if;

  return new;
end;
$$;

create trigger on_reminder_missed
  after update on public.medication_reminders
  for each row execute function public.notify_missed_reminder();

-- Notify the other party when a caregiver link is proposed or responded to.
create or replace function public.notify_caregiver_access_change()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_caregiver_name text;
  v_patient_name text;
begin
  select full_name into v_caregiver_name from public.profiles where id = new.caregiver_id;
  select full_name into v_patient_name from public.profiles where id = new.patient_id;

  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, type, title, message, data)
    values (
      new.patient_id, 'caregiver_request', 'Caregiver access request',
      format('%s requested caregiver access to your health data', coalesce(v_caregiver_name, 'Someone')),
      jsonb_build_object('caregiver_access_id', new.id)
    );
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.notifications (user_id, type, title, message, data)
    values (
      new.caregiver_id, 'caregiver_request', 'Caregiver access update',
      format('%s %s your caregiver access request', coalesce(v_patient_name, 'The patient'), new.status),
      jsonb_build_object('caregiver_access_id', new.id, 'status', new.status)
    );
  end if;

  return new;
end;
$$;

create trigger on_caregiver_access_change
  after insert or update on public.caregiver_access
  for each row execute function public.notify_caregiver_access_change();
-- Row Level Security: every table is locked down by default (RLS enabled),
-- then opened up per-role via the policies below.

alter table public.profiles enable row level security;
alter table public.hospitals enable row level security;
alter table public.pharmacies enable row level security;
alter table public.labs enable row level security;
alter table public.doctors enable row level security;
alter table public.hospital_staff enable row level security;
alter table public.pharmacy_staff enable row level security;
alter table public.lab_staff enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medications enable row level security;
alter table public.medication_reminders enable row level security;
alter table public.health_metrics enable row level security;
alter table public.health_scores enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.emergency_qr_cards enable row level security;
alter table public.caregiver_access enable row level security;

-- profiles --------------------------------------------------------------
create policy "profiles_select" on public.profiles for select
  using (
    id = auth.uid()
    or public.is_admin()
    or role in ('doctor', 'hospital_admin', 'pharmacy_staff', 'lab_staff')
    or public.is_doctor_of_patient(id)
    or public.has_caregiver_access(id)
  );

create policy "profiles_insert_self" on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_self_or_admin" on public.profiles for update
  using (id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin" on public.profiles for delete
  using (public.is_admin());

-- hospitals / pharmacies / labs: public read-only directory, admin-managed ----
create policy "hospitals_select_all" on public.hospitals for select using (true);
create policy "hospitals_write_admin" on public.hospitals for insert with check (public.is_admin());
create policy "hospitals_update_admin" on public.hospitals for update using (public.is_admin());
create policy "hospitals_delete_admin" on public.hospitals for delete using (public.is_admin());

create policy "pharmacies_select_all" on public.pharmacies for select using (true);
create policy "pharmacies_write_admin" on public.pharmacies for insert with check (public.is_admin());
create policy "pharmacies_update_admin" on public.pharmacies for update using (public.is_admin());
create policy "pharmacies_delete_admin" on public.pharmacies for delete using (public.is_admin());

create policy "labs_select_all" on public.labs for select using (true);
create policy "labs_write_admin" on public.labs for insert with check (public.is_admin());
create policy "labs_update_admin" on public.labs for update using (public.is_admin());
create policy "labs_delete_admin" on public.labs for delete using (public.is_admin());

-- doctors: public read (needed for booking directory), self/admin managed ----
create policy "doctors_select_all" on public.doctors for select using (true);
create policy "doctors_insert_self_or_admin" on public.doctors for insert
  with check (id = auth.uid() or public.is_admin());
create policy "doctors_update_self_or_admin" on public.doctors for update
  using (id = auth.uid() or public.is_admin());
create policy "doctors_delete_admin" on public.doctors for delete using (public.is_admin());

-- staff link tables: self, same-org staff, or admin ----------------------
create policy "hospital_staff_select" on public.hospital_staff for select
  using (id = auth.uid() or public.is_admin()
    or hospital_id in (select hospital_id from public.hospital_staff where id = auth.uid()));
create policy "hospital_staff_write" on public.hospital_staff for insert with check (id = auth.uid() or public.is_admin());
create policy "hospital_staff_update" on public.hospital_staff for update using (id = auth.uid() or public.is_admin());
create policy "hospital_staff_delete" on public.hospital_staff for delete using (public.is_admin());

create policy "pharmacy_staff_select" on public.pharmacy_staff for select
  using (id = auth.uid() or public.is_admin()
    or pharmacy_id in (select pharmacy_id from public.pharmacy_staff where id = auth.uid()));
create policy "pharmacy_staff_write" on public.pharmacy_staff for insert with check (id = auth.uid() or public.is_admin());
create policy "pharmacy_staff_update" on public.pharmacy_staff for update using (id = auth.uid() or public.is_admin());
create policy "pharmacy_staff_delete" on public.pharmacy_staff for delete using (public.is_admin());

create policy "lab_staff_select" on public.lab_staff for select
  using (id = auth.uid() or public.is_admin()
    or lab_id in (select lab_id from public.lab_staff where id = auth.uid()));
create policy "lab_staff_write" on public.lab_staff for insert with check (id = auth.uid() or public.is_admin());
create policy "lab_staff_update" on public.lab_staff for update using (id = auth.uid() or public.is_admin());
create policy "lab_staff_delete" on public.lab_staff for delete using (public.is_admin());

-- appointments ------------------------------------------------------------
create policy "appointments_select" on public.appointments for select
  using (
    patient_id = auth.uid()
    or doctor_id = auth.uid()
    or public.is_admin()
    or public.has_caregiver_access(patient_id)
  );

create policy "appointments_insert" on public.appointments for insert
  with check (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin());

create policy "appointments_update" on public.appointments for update
  using (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin());

create policy "appointments_delete" on public.appointments for delete
  using (public.is_admin());

-- medical_records -----------------------------------------------------------
create policy "medical_records_select" on public.medical_records for select
  using (
    patient_id = auth.uid()
    or uploaded_by = auth.uid()
    or shared_with_doctor_id = auth.uid()
    or public.is_admin()
    or public.is_doctor_of_patient(patient_id)
    or public.has_caregiver_access(patient_id, 'records')
  );

create policy "medical_records_insert" on public.medical_records for insert
  with check (patient_id = auth.uid() or uploaded_by = auth.uid() or public.is_admin());

create policy "medical_records_update" on public.medical_records for update
  using (patient_id = auth.uid() or uploaded_by = auth.uid() or public.is_admin());

create policy "medical_records_delete" on public.medical_records for delete
  using (patient_id = auth.uid() or public.is_admin());

-- prescriptions & medications -----------------------------------------------
create policy "prescriptions_select" on public.prescriptions for select
  using (
    patient_id = auth.uid()
    or doctor_id = auth.uid()
    or public.is_admin()
    or public.has_caregiver_access(patient_id, 'medications')
  );

create policy "prescriptions_insert" on public.prescriptions for insert
  with check (doctor_id = auth.uid() or public.is_admin());

create policy "prescriptions_update" on public.prescriptions for update
  using (doctor_id = auth.uid() or public.is_admin());

create policy "prescriptions_delete" on public.prescriptions for delete
  using (public.is_admin());

create policy "medications_select" on public.medications for select
  using (public.can_view_prescription(prescription_id));

create policy "medications_insert" on public.medications for insert
  with check (public.can_manage_prescription(prescription_id));

create policy "medications_update" on public.medications for update
  using (public.can_manage_prescription(prescription_id));

create policy "medications_delete" on public.medications for delete
  using (public.can_manage_prescription(prescription_id));

-- medication_reminders --------------------------------------------------------
create policy "medication_reminders_select" on public.medication_reminders for select
  using (patient_id = auth.uid() or public.is_admin() or public.has_caregiver_access(patient_id, 'alerts'));

create policy "medication_reminders_insert" on public.medication_reminders for insert
  with check (patient_id = auth.uid() or public.is_admin());

create policy "medication_reminders_update" on public.medication_reminders for update
  using (patient_id = auth.uid() or public.is_admin());

create policy "medication_reminders_delete" on public.medication_reminders for delete
  using (public.is_admin());

-- health_metrics & health_scores ------------------------------------------------
create policy "health_metrics_select" on public.health_metrics for select
  using (
    patient_id = auth.uid()
    or public.is_admin()
    or public.is_doctor_of_patient(patient_id)
    or public.has_caregiver_access(patient_id)
  );

create policy "health_metrics_insert" on public.health_metrics for insert
  with check (patient_id = auth.uid() or public.is_admin());

create policy "health_metrics_update" on public.health_metrics for update
  using (patient_id = auth.uid() or public.is_admin());

create policy "health_metrics_delete" on public.health_metrics for delete
  using (patient_id = auth.uid() or public.is_admin());

create policy "health_scores_select" on public.health_scores for select
  using (
    patient_id = auth.uid()
    or public.is_admin()
    or public.is_doctor_of_patient(patient_id)
    or public.has_caregiver_access(patient_id)
  );

create policy "health_scores_insert" on public.health_scores for insert
  with check (patient_id = auth.uid() or public.is_admin());

-- notifications ------------------------------------------------------------
create policy "notifications_select" on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

create policy "notifications_insert" on public.notifications for insert
  with check (user_id = auth.uid() or public.is_admin());

create policy "notifications_update" on public.notifications for update
  using (user_id = auth.uid() or public.is_admin());

create policy "notifications_delete" on public.notifications for delete
  using (user_id = auth.uid() or public.is_admin());

-- ai_conversations & ai_messages ---------------------------------------------
create policy "ai_conversations_select" on public.ai_conversations for select
  using (user_id = auth.uid() or public.is_admin());

create policy "ai_conversations_insert" on public.ai_conversations for insert
  with check (user_id = auth.uid());

create policy "ai_conversations_update" on public.ai_conversations for update
  using (user_id = auth.uid() or public.is_admin());

create policy "ai_conversations_delete" on public.ai_conversations for delete
  using (user_id = auth.uid() or public.is_admin());

create policy "ai_messages_select" on public.ai_messages for select
  using (
    public.is_admin()
    or exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid())
  );

create policy "ai_messages_insert" on public.ai_messages for insert
  with check (
    exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid())
  );

-- emergency_contacts & emergency_qr_cards --------------------------------------
create policy "emergency_contacts_select" on public.emergency_contacts for select
  using (patient_id = auth.uid() or public.is_admin() or public.has_caregiver_access(patient_id));

create policy "emergency_contacts_insert" on public.emergency_contacts for insert
  with check (patient_id = auth.uid() or public.is_admin());

create policy "emergency_contacts_update" on public.emergency_contacts for update
  using (patient_id = auth.uid() or public.is_admin());

create policy "emergency_contacts_delete" on public.emergency_contacts for delete
  using (patient_id = auth.uid() or public.is_admin());

create policy "emergency_qr_cards_select" on public.emergency_qr_cards for select
  using (patient_id = auth.uid() or public.is_admin());

create policy "emergency_qr_cards_insert" on public.emergency_qr_cards for insert
  with check (patient_id = auth.uid() or public.is_admin());

create policy "emergency_qr_cards_update" on public.emergency_qr_cards for update
  using (patient_id = auth.uid() or public.is_admin());

-- caregiver_access ------------------------------------------------------------
create policy "caregiver_access_select" on public.caregiver_access for select
  using (caregiver_id = auth.uid() or patient_id = auth.uid() or public.is_admin());

create policy "caregiver_access_insert" on public.caregiver_access for insert
  with check (caregiver_id = auth.uid() or patient_id = auth.uid() or public.is_admin());

create policy "caregiver_access_update" on public.caregiver_access for update
  using (caregiver_id = auth.uid() or patient_id = auth.uid() or public.is_admin());

create policy "caregiver_access_delete" on public.caregiver_access for delete
  using (caregiver_id = auth.uid() or patient_id = auth.uid() or public.is_admin());
-- Storage buckets: medical-records (private, per-patient folder) and avatars (public read).
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('medical-records', 'medical-records', false, 52428800),
  ('avatars', 'avatars', true, 5242880)
on conflict (id) do nothing;

-- medical-records: object path convention is "{patient_id}/{filename}".
-- Doctors/caregivers read files through the analyze-report / medical-records edge
-- functions (service role), so direct storage RLS only needs to cover the owning patient.
create policy "medical_records_storage_select" on storage.objects for select
  using (
    bucket_id = 'medical-records'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

create policy "medical_records_storage_insert" on storage.objects for insert
  with check (
    bucket_id = 'medical-records'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "medical_records_storage_update" on storage.objects for update
  using (
    bucket_id = 'medical-records'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "medical_records_storage_delete" on storage.objects for delete
  using (
    bucket_id = 'medical-records'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

-- avatars: anyone can view (public bucket), owner manages their own folder "{user_id}/{filename}".
create policy "avatars_storage_select" on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_storage_insert" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_storage_update" on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_storage_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
-- Lets an Edge Function resolve a profile id from an email address (e.g. when
-- a patient invites a caregiver, or a caregiver requests access to a patient)
-- without granting broad read access to auth.users.
create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql stable security definer set search_path = public, auth as $$
  select id from auth.users where email = p_email limit 1;
$$;

grant execute on function public.get_user_id_by_email(text) to authenticated;
-- Local development seed data. Run automatically by `supabase db reset`.
-- Creates a handful of auth users (password for all: "Password123!") so the
-- app has something to log in with immediately after a fresh local start.
-- The public.profiles rows are created automatically by the on_auth_user_created
-- trigger from each user's raw_user_meta_data.

do $$
declare
  v_admin_id uuid := '00000000-0000-0000-0000-000000000001';
  v_doctor_id uuid := '00000000-0000-0000-0000-000000000002';
  v_patient_id uuid := '00000000-0000-0000-0000-000000000003';
  v_caregiver_id uuid := '00000000-0000-0000-0000-000000000004';
  v_hospital_id uuid;
  v_pharmacy_id uuid;
  v_lab_id uuid;
  v_prescription_id uuid;
  v_medication_id uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values
    ('00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
     'admin@carebridge.ai', crypt('Password123!', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"admin","full_name":"Platform Admin"}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_doctor_id, 'authenticated', 'authenticated',
     'doctor@carebridge.ai', crypt('Password123!', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"doctor","full_name":"Dr. Anjali Menon"}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_patient_id, 'authenticated', 'authenticated',
     'patient@carebridge.ai', crypt('Password123!', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"patient","full_name":"Kunjamma Varghese","preferred_language":"ml"}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_caregiver_id, 'authenticated', 'authenticated',
     'caregiver@carebridge.ai', crypt('Password123!', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"caregiver","full_name":"Rahul Varghese"}', now(), now());

  insert into public.hospitals (name, address, phone, email)
  values ('CareBridge General Hospital', 'MG Road, Kochi, Kerala', '+91-484-1234567', 'contact@cbgh.example')
  returning id into v_hospital_id;

  insert into public.pharmacies (name, address, phone)
  values ('CareBridge Pharmacy', 'MG Road, Kochi, Kerala', '+91-484-7654321')
  returning id into v_pharmacy_id;

  insert into public.labs (name, address, phone)
  values ('CareBridge Diagnostics Lab', 'MG Road, Kochi, Kerala', '+91-484-9876543')
  returning id into v_lab_id;

  insert into public.doctors (id, hospital_id, specialty, license_number, years_experience, bio, consultation_fee)
  values (v_doctor_id, v_hospital_id, 'Geriatrics', 'KMC-2010-00123', 15,
    'Specialist in senior care, chronic disease management and preventive health.', 500.00);

  update public.profiles set
    phone = '+91-9820000001', date_of_birth = '1962-04-12', gender = 'female',
    blood_group = 'B+', allergies = array['Penicillin'], chronic_conditions = array['Hypertension', 'Type 2 Diabetes'],
    high_contrast = true, large_font = true, voice_navigation = true
  where id = v_patient_id;

  update public.profiles set phone = '+91-9820000002' where id = v_caregiver_id;

  insert into public.caregiver_access (caregiver_id, patient_id, status, responded_at)
  values (v_caregiver_id, v_patient_id, 'accepted', now());

  insert into public.appointments (patient_id, doctor_id, hospital_id, scheduled_at, status, reason)
  values (v_patient_id, v_doctor_id, v_hospital_id, now() + interval '3 days', 'confirmed',
    'Routine blood pressure and diabetes follow-up');

  insert into public.prescriptions (patient_id, doctor_id, status, diagnosis, ai_explanation, ai_explanation_language)
  values (v_patient_id, v_doctor_id, 'active', 'Hypertension, Type 2 Diabetes',
    'Take your blood pressure tablet every morning and your diabetes tablet after meals. Avoid salty food.', 'en')
  returning id into v_prescription_id;

  insert into public.medications (prescription_id, name, dosage, frequency, duration_days, instructions, times_per_day)
  values (v_prescription_id, 'Amlodipine', '5mg', 'Once daily', 30, 'Take in the morning with water', '["08:00"]')
  returning id into v_medication_id;

  insert into public.medications (prescription_id, name, dosage, frequency, duration_days, instructions, times_per_day)
  values (v_prescription_id, 'Metformin', '500mg', 'Twice daily', 30, 'Take after breakfast and dinner', '["08:30", "20:30"]');

  insert into public.health_metrics (patient_id, metric_type, value, secondary_value, unit, source)
  values
    (v_patient_id, 'blood_pressure', 138, 88, 'mmHg', 'manual'),
    (v_patient_id, 'blood_sugar', 142, null, 'mg/dL', 'manual'),
    (v_patient_id, 'weight', 68.5, null, 'kg', 'manual');

  insert into public.health_scores (patient_id, score, factors)
  values (v_patient_id, 72, '{"blood_pressure": "elevated", "medication_adherence": "good", "activity": "moderate"}');

  insert into public.emergency_contacts (patient_id, name, relation, phone, priority)
  values
    (v_patient_id, 'Rahul Varghese', 'Son', '+91-9820000002', 1),
    (v_patient_id, 'Dr. Anjali Menon', 'Primary Doctor', '+91-484-1234567', 2);

  insert into public.emergency_qr_cards (patient_id, medical_summary)
  values (v_patient_id, jsonb_build_object(
    'blood_group', 'B+',
    'allergies', jsonb_build_array('Penicillin'),
    'chronic_conditions', jsonb_build_array('Hypertension', 'Type 2 Diabetes'),
    'current_medications', jsonb_build_array('Amlodipine 5mg', 'Metformin 500mg')
  ));
end $$;
