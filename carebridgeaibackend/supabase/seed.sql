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
