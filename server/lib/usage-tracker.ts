import { supabaseAdmin } from "./supabase.js";

export async function checkSharedApiAccess(
  studentId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const { data: settings } = await supabaseAdmin
    .from("system_settings")
    .select("key, value");

  let enabled = true;
  let limit = 50;

  if (settings) {
    for (const s of settings) {
      if (s.key === "shared_api_enabled") enabled = s.value?.enabled ?? true;
      if (s.key === "shared_api_daily_limit") limit = s.value?.limit ?? 50;
    }
  }

  if (!enabled) {
    return { allowed: false, used: 0, limit };
  }

  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await supabaseAdmin
    .from("student_api_usage")
    .select("request_count")
    .eq("student_id", studentId)
    .eq("usage_date", today)
    .maybeSingle();

  const used = usage?.request_count ?? 0;
  return { allowed: used < limit, used, limit };
}

export async function incrementUsage(studentId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabaseAdmin
    .from("student_api_usage")
    .select("id, request_count")
    .eq("student_id", studentId)
    .eq("usage_date", today)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("student_api_usage")
      .update({ request_count: existing.request_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin
      .from("student_api_usage")
      .insert({ student_id: studentId, usage_date: today, request_count: 1 });
  }
}

export async function trackTokenUsage(
  studentId: string,
  promptTokens: number,
  completionTokens: number
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const totalTokens = promptTokens + completionTokens;

  const { data: existing } = await supabaseAdmin
    .from("student_api_usage")
    .select("id, prompt_tokens, completion_tokens, total_tokens")
    .eq("student_id", studentId)
    .eq("usage_date", today)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("student_api_usage")
      .update({
        prompt_tokens: (existing.prompt_tokens || 0) + promptTokens,
        completion_tokens: (existing.completion_tokens || 0) + completionTokens,
        total_tokens: (existing.total_tokens || 0) + totalTokens,
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin
      .from("student_api_usage")
      .insert({
        student_id: studentId,
        usage_date: today,
        request_count: 0,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
      });
  }
}
