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
