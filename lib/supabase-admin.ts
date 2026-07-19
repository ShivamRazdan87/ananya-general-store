import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

// Server-only client with elevated privileges (bypasses Row Level Security).
// NEVER import this file from a "use client" component — it uses the secret
// service role key. Only use it inside app/api/** route handlers, which run
// on the server.
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-key",
  { auth: { persistSession: false } }
);
