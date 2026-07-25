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
