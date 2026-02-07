import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabaseAdmin: SupabaseClient;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Supabase admin client initialized with service role key");
} else if (supabaseUrl) {
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  if (anonKey) {
    supabaseAdmin = createClient(supabaseUrl, anonKey);
    console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not set. Using anon key — admin operations will be limited by RLS.");
  } else {
    console.warn("Warning: No Supabase keys available. Supabase features will be unavailable.");
    supabaseAdmin = new Proxy({} as SupabaseClient, {
      get: () => () => {
        throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
      }
    });
  }
} else {
  console.warn("Warning: SUPABASE_URL not set. Supabase features will be unavailable.");
  supabaseAdmin = new Proxy({} as SupabaseClient, {
    get: () => () => {
      throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
  });
}

export { supabaseAdmin };
