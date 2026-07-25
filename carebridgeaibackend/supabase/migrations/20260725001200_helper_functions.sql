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
