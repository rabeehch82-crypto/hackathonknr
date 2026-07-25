import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

/**
 * Client scoped to the calling user's JWT — respects RLS exactly as the
 * frontend would. Use this for anything that should be subject to the same
 * row-level security a direct client call would get.
 */
export function userClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization") ?? "";
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/**
 * Service-role client that bypasses RLS entirely. Use only for operations the
 * function itself must perform on behalf of the system (e.g. writing AI
 * results, cron-driven reminder scans, resolving an emergency QR token for an
 * unauthenticated first responder) — never to satisfy a shortcut around a
 * permission check the caller should have failed.
 */
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

export async function getAuthenticatedUser(req: Request) {
  const supabase = userClient(req);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
