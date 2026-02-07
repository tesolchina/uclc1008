import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target Supabase configuration
const TARGET_URL = "https://dlqnolcnkzmyeortwjhf.supabase.co";
const TARGET_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscW5vbGNua3pteWVvcnR3amhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ4ODUxNCwiZXhwIjoyMDg1MDY0NTE0fQ.nwFbIawNu-_ffNXV6HThTtkevqLvdiP0vHHMHp4dGQM";

// Tables in order respecting foreign keys
const TABLES_IN_ORDER = [
  // Base tables (no foreign keys)
  "profiles",
  "user_roles", 
  "students",
  "lessons",
  "teacher_sections",
  "system_settings",
  "api_keys",
  
  // Second tier
  "pending_teacher_requests",
  "lesson_progress",
  "hour_tasks",
  
  // Live sessions
  "live_sessions",
  "session_participants",
  "session_responses",
  "session_prompts",
  
  // Discussion
  "discussion_sessions",
  "discussion_threads",
  
  // AI sessions
  "ai_live_sessions",
  "ai_session_participants",
  "ai_conversation_messages",
  "ai_message_queue",
  
  // Student data
  "student_task_responses",
  "student_questions",
  "student_ocr_records",
  "paragraph_notes",
  "writing_drafts",
  "assignment_chat_history",
  "ai_tutor_reports",
  
  // Staff
  "staff_threads",
  "staff_comments",
  "staff_materials",
  "staff_library_folders",
  "staff_library_files",
  
  // Teacher
  "teacher_comments",
  "teacher_student_notes",
  "task_feedback",
  
  // Sessions and logs
  "user_sessions",
  "student_sessions",
  "student_id_merges",
  "student_api_usage",
  "process_logs",
];

const BATCH_SIZE = 50;

interface MigrationResult {
  table: string;
  sourceCount: number;
  migratedCount: number;
  error?: string;
}

async function fetchAllRows(supabase: any, tableName: string): Promise<any[]> {
  const allRows: any[] = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) break;
    
    allRows.push(...data);
    
    if (data.length < limit) break;
    offset += limit;
  }
  
  return allRows;
}

async function insertBatch(tableName: string, rows: any[]): Promise<{ success: boolean; error?: string }> {
  if (rows.length === 0) return { success: true };
  
  try {
    const response = await fetch(`${TARGET_URL}/rest/v1/${tableName}`, {
      method: "POST",
      headers: {
        "apikey": TARGET_SERVICE_KEY,
        "Authorization": `Bearer ${TARGET_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify(rows),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `${response.status}: ${errorText}` };
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function migrateTable(supabase: any, tableName: string): Promise<MigrationResult> {
  console.log(`Starting migration for table: ${tableName}`);
  
  try {
    // Fetch all rows from source
    const rows = await fetchAllRows(supabase, tableName);
    const sourceCount = rows.length;
    
    console.log(`  Found ${sourceCount} rows in ${tableName}`);
    
    if (sourceCount === 0) {
      return { table: tableName, sourceCount: 0, migratedCount: 0 };
    }
    
    // Insert in batches
    let migratedCount = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const result = await insertBatch(tableName, batch);
      
      if (result.success) {
        migratedCount += batch.length;
        console.log(`  Migrated batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)} for ${tableName}`);
      } else {
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.error}`);
        console.error(`  Error in batch for ${tableName}:`, result.error);
      }
    }
    
    return {
      table: tableName,
      sourceCount,
      migratedCount,
      error: errors.length > 0 ? errors.join("; ") : undefined,
    };
  } catch (err) {
    console.error(`Error migrating ${tableName}:`, err);
    return {
      table: tableName,
      sourceCount: 0,
      migratedCount: 0,
      error: String(err),
    };
  }
}

async function fetchAuthUsers(supabase: any): Promise<any[]> {
  // Use admin API to list users
  const { data, error } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  
  if (error) {
    console.error("Error fetching auth users:", error);
    return [];
  }
  
  // Extract relevant fields
  return (data?.users || []).map((user: any) => ({
    id: user.id,
    email: user.email,
    raw_user_meta_data: user.user_metadata,
    raw_app_meta_data: user.app_metadata,
    created_at: user.created_at,
  }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("Starting data migration...");

  try {
    // Create source Supabase client with service role
    const sourceUrl = Deno.env.get("SUPABASE_URL")!;
    const sourceServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(sourceUrl, sourceServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: MigrationResult[] = [];
    
    // Migrate each table in order
    for (const tableName of TABLES_IN_ORDER) {
      const result = await migrateTable(supabase, tableName);
      results.push(result);
    }
    
    // Fetch auth users
    const authUsers = await fetchAuthUsers(supabase);
    
    // Summary
    const summary = {
      timestamp: new Date().toISOString(),
      sourceUrl,
      targetUrl: TARGET_URL,
      tables: results,
      totalSourceRows: results.reduce((sum, r) => sum + r.sourceCount, 0),
      totalMigratedRows: results.reduce((sum, r) => sum + r.migratedCount, 0),
      tablesWithErrors: results.filter(r => r.error).map(r => r.table),
      authUsers: {
        count: authUsers.length,
        users: authUsers,
      },
    };
    
    console.log("Migration complete:", JSON.stringify(summary, null, 2));

    return new Response(JSON.stringify(summary, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
