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
