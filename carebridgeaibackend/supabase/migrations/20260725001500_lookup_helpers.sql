-- Lets an Edge Function resolve a profile id from an email address (e.g. when
-- a patient invites a caregiver, or a caregiver requests access to a patient)
-- without granting broad read access to auth.users.
create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql stable security definer set search_path = public, auth as $$
  select id from auth.users where email = p_email limit 1;
$$;

grant execute on function public.get_user_id_by_email(text) to authenticated;
