import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface LogEntry {
  operation: string;
  step: string;
  status: "info" | "success" | "warning" | "error";
  message: string;
  details?: Record<string, unknown>;
  sessionId?: string;
}

export async function logProcess(entry: LogEntry): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials for logging");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    await supabase.from("process_logs").insert({
      operation: entry.operation,
      step: entry.step,
      status: entry.status,
      message: entry.message,
      details: entry.details || {},
      session_id: entry.sessionId || null,
    });
  } catch (err) {
    console.error("Failed to write process log:", err);
  }
}

// Cleanup old logs (keep last 500)
export async function cleanupOldLogs(): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) return;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get the 500th newest log's timestamp
    const { data } = await supabase
      .from("process_logs")
      .select("created_at")
      .order("created_at", { ascending: false })
      .range(499, 499)
      .single();

    if (data?.created_at) {
      // Delete logs older than the 500th
      await supabase
        .from("process_logs")
        .delete()
        .lt("created_at", data.created_at);
    }
  } catch {
    // Ignore cleanup errors
  }
}
