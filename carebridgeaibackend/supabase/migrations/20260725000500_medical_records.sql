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
