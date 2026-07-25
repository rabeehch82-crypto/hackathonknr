# CareBridge AI — Backend

Supabase backend (Postgres schema, Row Level Security, and Edge Functions) for
**CareBridge AI**, a senior-friendly AI healthcare coordination platform
connecting patients, doctors, caregivers, hospitals, labs, and pharmacies.

This repo contains the *backend* only: database schema/migrations, RLS
policies, triggers, and Edge Functions. There is no frontend here.

## Stack

- **Database**: Postgres (via Supabase) — see `supabase/migrations/`
- **Auth**: Supabase Auth (email/password), a `profiles` table extends
  `auth.users` with app data
- **Storage**: Supabase Storage buckets `medical-records` (private) and
  `avatars` (public)
- **AI**: OpenAI (chat completions for the health assistant, prescription
  explanations, symptom checker; Whisper for speech-to-text; TTS for
  text-to-speech) plus Google Cloud Vision (OCR), with a GPT-vision fallback
  if no Vision API key is configured
- **Business logic / AI orchestration**: Supabase Edge Functions (Deno +
  TypeScript) — see `supabase/functions/`

## Prerequisites

- A Supabase project ([supabase.com](https://supabase.com)) — free tier is fine
- [Supabase CLI](https://supabase.com/docs/guides/cli) `npm install -g supabase`
- An OpenAI API key
- (Optional) A Google Cloud Vision API key for OCR

## 1. Link the project

```bash
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
# SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD from your Supabase project settings

supabase login
npm run link          # supabase link --project-ref $SUPABASE_PROJECT_REF
```

## 2. Apply the database schema

```bash
npm run db:push       # supabase db push — applies every file in supabase/migrations/
```

This creates all tables, enums, RLS policies, triggers, and the two storage
buckets. To also load sample data (a test admin/doctor/patient/caregiver plus
a hospital, pharmacy, lab, appointment, prescription, and vitals) when
developing locally:

```bash
npm run db:start      # spins up the full local stack (Postgres, Auth, Storage, Studio)
npm run db:reset       # re-applies migrations AND supabase/seed.sql
```

Seeded logins (local only, password `Password123!` for all): `admin@carebridge.ai`,
`doctor@carebridge.ai`, `patient@carebridge.ai`, `caregiver@carebridge.ai`.

## 3. Configure secrets and deploy Edge Functions

```bash
npm run secrets:push   # supabase secrets set --env-file .env
npm run functions:deploy
```

For local development, run functions against your local stack instead:

```bash
npm run functions:serve
```

## Database schema

| Table | Purpose |
|---|---|
| `profiles` | One row per authenticated user (extends `auth.users`); role drives access (`patient`, `doctor`, `caregiver`, `hospital_admin`, `pharmacy_staff`, `lab_staff`, `admin`) |
| `hospitals`, `pharmacies`, `labs` | Organization directory |
| `doctors`, `hospital_staff`, `pharmacy_staff`, `lab_staff` | Professional/staff extensions of `profiles` |
| `appointments` | Patient ↔ doctor bookings |
| `medical_records` | Uploaded reports/scans + OCR text + AI summary |
| `prescriptions`, `medications` | Doctor-issued prescriptions and their line items |
| `medication_reminders` | Auto-generated dose schedule per medication, tracked pending/taken/missed |
| `health_metrics`, `health_scores` | Vitals log and computed personalized health score |
| `notifications` | In-app notifications (appointments, medication, AI summaries, caregiver requests, emergencies) |
| `ai_conversations`, `ai_messages` | AI Health Assistant chat history |
| `emergency_contacts`, `emergency_qr_cards` | Emergency SOS contacts and the QR medical card |
| `caregiver_access` | Patient ↔ caregiver linking with granular permissions |

Every table has RLS enabled. Access generally follows: a user always sees
their own data; doctors see data for patients they have an appointment or
prescription with; caregivers see data for patients who accepted their
`caregiver_access` link (gated per-permission: records/medications/alerts);
admins see everything. See `supabase/migrations/20260725001300_rls_policies.sql`
and the helper functions in `20260725001200_helper_functions.sql` /
`20260725001500_lookup_helpers.sql`.

### Automatic behavior (DB triggers)

- Signing up creates a `profiles` row automatically (role/name come from the
  signup call's user metadata).
- Adding a `medication` auto-generates its full `medication_reminders`
  schedule from `times_per_day` × `duration_days`.
- Appointment creation/status changes, new prescriptions, missed medication
  reminders, and caregiver access requests/responses all create
  `notifications` rows automatically.

## Edge Functions

| Function | Auth | Purpose |
|---|---|---|
| `ai-chat` | user | AI Health Assistant — persists a conversation, replies via GPT |
| `analyze-report` | user | OCR + plain-language AI summary of an uploaded medical record |
| `explain-prescription` | user | Explains a prescription in the patient's preferred language |
| `speech-to-text` | user | Whisper transcription for voice input (multipart `audio` field) |
| `text-to-speech` | user | Returns spoken audio (`audio/mpeg`) for any text |
| `symptom-checker` | user | AI triage: returns `emergency` / `see_doctor_soon` / `self_care` / `unclear` |
| `compute-health-score` | user | Computes a 0-100 health score from vitals + medication adherence, plus an AI insight |
| `book-appointment` | user | Books an appointment with double-booking prevention |
| `generate-emergency-qr` | user | (Re)generates the patient's emergency QR card snapshot |
| `read-emergency-qr` | **public** | Resolves a scanned QR token to the emergency medical summary — no login |
| `caregiver-invite` | user | Links a caregiver ↔ patient by email (direction inferred from caller's role) |
| `caregiver-respond` | user | Accept / decline / revoke a caregiver link |
| `medication-reminders` | shared secret (`x-cron-secret` header) | Scheduled sweep: marks overdue reminders missed, notifies upcoming doses. Invoke every 5-10 min via an external scheduler or `pg_cron` + `pg_net` |

All functions expect a Supabase user JWT in the `Authorization: Bearer <token>`
header except `read-emergency-qr` (public) and `medication-reminders` (cron
secret). Example:

```bash
curl -X POST "$SUPABASE_URL/functions/v1/ai-chat" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache and feel dizzy"}'
```

## Storage

- `medical-records` (private): objects stored at `{patient_id}/{filename}`;
  only the owning patient (or an admin) can read/write directly. Doctors and
  caregivers access files via the `analyze-report` function.
- `avatars` (public): objects stored at `{user_id}/{filename}`; readable by
  anyone, writable only by the owner.

## Validation performed

Every migration and the seed script were executed against a real local
Postgres 16 instance (with minimal `auth`/`storage` schema stand-ins) to
confirm they apply cleanly end-to-end, and RLS behavior was verified directly
(patient/doctor/caregiver/admin/stranger access checks, insert/update
isolation, and trigger side effects like auto-generated medication reminders
and notifications) before this was committed. All Edge Function TypeScript
was syntax-checked with esbuild.
