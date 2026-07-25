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
