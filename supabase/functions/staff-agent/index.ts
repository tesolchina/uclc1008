import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const poeApiKey = Deno.env.get("POE_API_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("staff-agent: SUPABASE_URL or SUPABASE_ANON_KEY is not configured");
}

if (!poeApiKey) {
  console.error("staff-agent: POE_API_KEY is not configured");
}

type FolderRow = {
  id: string;
  name: string;
  parent_id: string | null;
};

type FileRow = {
  id: string;
  filename: string;
  folder_id: string | null;
  thread_id: string | null;
  is_archived: boolean;
  original_content: string | null;
  markdown_content: string | null;
};

type AgentOperation =
  | { type: "create_folder"; path: string }
  | { type: "create_file"; path: string; content?: string | null; markdown?: string | null; linkToThread?: boolean }
  | { type: "move_file"; from: string; to: string }
  | { type: "rename_file"; path: string; new_name: string }
  | { type: "archive_file"; path: string }
  | { type: "link_file_to_thread"; path: string; link?: boolean }
  | { type: "convert_file_to_markdown"; path: string };

type ApplyContext = {
  currentThreadId: string | null;
};

type OperationResult = {
  operation: AgentOperation;
  status: "ok" | "error";
  message?: string;
};

function normalizePath(rawPath: string): string {
  let path = rawPath.trim();
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path.replace(/\/{2,}/g, "/");
}

function splitPath(path: string): { parentPath: string; name: string } {
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return { parentPath: "/", name: "" };
  }
  const parts = normalized.split("/").filter(Boolean);
  const name = parts.pop() ?? "";
  const parentPath = parts.length ? `/${parts.join("/")}` : "/";
  return { parentPath, name };
}

function getFolderPath(folder: FolderRow, folders: FolderRow[]): string {
  const byId = new Map<string, FolderRow>();
  for (const f of folders) byId.set(f.id, f);

  const segments: string[] = [];
  let current: FolderRow | undefined = folder;
  let safety = 0;

  while (current && safety < 50) {
    segments.unshift(current.name);
    current = current.parent_id ? byId.get(current.parent_id) : undefined;
    safety += 1;
  }

  return "/" + segments.join("/");
}

function getFilePath(file: FileRow, folders: FolderRow[]): string {
  if (!file.folder_id) return normalizePath(`/${file.filename}`);
  const folder = folders.find((f) => f.id === file.folder_id);
  if (!folder) return normalizePath(`/${file.filename}`);
  const base = getFolderPath(folder, folders);
  return normalizePath(base === "/" ? `/${file.filename}` : `${base}/${file.filename}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchLibrary(supabase: any) {
  const [{ data: folders, error: foldersError }, { data: files, error: filesError }] = await Promise.all([
    supabase
      .from("staff_library_folders")
      .select("id, name, parent_id")
      .order("created_at", { ascending: true }),
    supabase
      .from("staff_library_files")
      .select("id, filename, folder_id, thread_id, is_archived, original_content, markdown_content")
      .order("created_at", { ascending: true }),
  ]);

  if (foldersError) throw foldersError;
  if (filesError) throw filesError;

  return {
    folders: folders ?? [],
    files: files ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureFolderExists(
  path: string, 
  folders: FolderRow[], 
  supabase: any
): Promise<{ folder: FolderRow | null; folders: FolderRow[] }> {
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return { folder: null, folders };
  }

  const existing = folders.find((f) => getFolderPath(f, folders) === normalized);
  if (existing) {
    return { folder: existing, folders };
  }

  const { parentPath, name } = splitPath(normalized);
  const parentResult = await ensureFolderExists(parentPath, folders, supabase);
  const parentFolder = parentResult.folder;
  folders = parentResult.folders;

  const { data, error } = await supabase
    .from("staff_library_folders")
    .insert({
      name,
      parent_id: parentFolder ? parentFolder.id : null,
    })
    .select("id, name, parent_id")
    .single();

  if (error) throw error;

  const newFolder: FolderRow = data as FolderRow;
  return { folder: newFolder, folders: [...folders, newFolder] };
}

async function convertTextToMarkdown(text: string): Promise<string> {
  if (!poeApiKey) throw new Error("POE_API_KEY is not configured");

  const response = await fetch("https://api.poe.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${poeApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://uclc1008-1.replit.app",
      "X-Title": "UCLC1008 Staff Library Agent",
    },
    body: JSON.stringify({
      model: "Claude-Sonnet-4.5",
      messages: [
        {
          role: "system",
          content:
            "You are a careful writing assistant for university English teachers. Convert the provided teaching materials into clean, well-structured Markdown suitable for a learning hub. " +
            "Preserve headings, lists, tables, and examples. Do not add extra commentary, just return the Markdown.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Poe markdown conversion error", response.status, errorText);
    throw new Error("Poe API error during Markdown conversion");
  }

  const data = await response.json();
  const markdown = data?.choices?.[0]?.message?.content ?? "";
  return typeof markdown === "string" ? markdown : String(markdown);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function applyOperations(
  operations: AgentOperation[],
  folders: FolderRow[],
  files: FileRow[],
  context: ApplyContext,
  supabase: any,
): Promise<{ results: OperationResult[] }> {
  const results: OperationResult[] = [];

  for (const op of operations) {
    try {
      if (op.type === "create_folder") {
        const { folder, folders: updatedFolders } = await ensureFolderExists(op.path, folders, supabase);
        folders = updatedFolders;
        results.push({ operation: op, status: "ok", message: folder ? `Folder ensured at ${normalizePath(op.path)}` : "Root folder exists" });
        continue;
      }

      if (op.type === "create_file") {
        const { parentPath, name } = splitPath(op.path);
        const folderResult = await ensureFolderExists(parentPath, folders, supabase);
        const parentFolder = folderResult.folder;
        folders = folderResult.folders;

        const existingPath = normalizePath(op.path);
        const already = files.find((f) => getFilePath(f, folders) === existingPath && !f.is_archived);
        if (already) {
          results.push({ operation: op, status: "ok", message: `File already exists at ${existingPath}` });
          continue;
        }

        const { data, error } = await supabase
          .from("staff_library_files")
          .insert({
            filename: name,
            folder_id: parentFolder ? parentFolder.id : null,
            thread_id: op.linkToThread && context.currentThreadId ? context.currentThreadId : null,
            original_content: op.content ?? null,
            markdown_content: op.markdown ?? null,
          })
          .select("id, filename, folder_id, thread_id, is_archived, original_content, markdown_content")
          .single();

        if (error) throw error;
        const newFile = data as FileRow;
        files = [...files, newFile];
        results.push({ operation: op, status: "ok", message: `Created file at ${existingPath}` });
        continue;
      }

      if (op.type === "move_file") {
        const fromPath = normalizePath(op.from);
        const toPath = normalizePath(op.to);
        const file = files.find((f) => getFilePath(f, folders) === fromPath && !f.is_archived);
        if (!file) {
          results.push({ operation: op, status: "error", message: `No file found at ${fromPath}` });
          continue;
        }

        const { parentPath, name } = splitPath(toPath);
        const folderResult = await ensureFolderExists(parentPath, folders, supabase);
        const parentFolder = folderResult.folder;
        folders = folderResult.folders;

        const { error } = await supabase
          .from("staff_library_files")
          .update({ filename: name, folder_id: parentFolder ? parentFolder.id : null })
          .eq("id", file.id);

        if (error) throw error;

        file.filename = name;
        file.folder_id = parentFolder ? parentFolder.id : null;
        results.push({ operation: op, status: "ok", message: `Moved file to ${toPath}` });
        continue;
      }

      if (op.type === "rename_file") {
        const targetPath = normalizePath(op.path);
        const file = files.find((f) => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) {
          results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` });
          continue;
        }

        const { error } = await supabase
          .from("staff_library_files")
          .update({ filename: op.new_name })
          .eq("id", file.id);

        if (error) throw error;

        file.filename = op.new_name;
        results.push({ operation: op, status: "ok", message: `Renamed file at ${targetPath}` });
        continue;
      }

      if (op.type === "archive_file") {
        const targetPath = normalizePath(op.path);
        const file = files.find((f) => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) {
          results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` });
          continue;
        }

        const { error } = await supabase
          .from("staff_library_files")
          .update({ is_archived: true })
          .eq("id", file.id);

        if (error) throw error;

        file.is_archived = true;
        results.push({ operation: op, status: "ok", message: `Archived file at ${targetPath}` });
        continue;
      }

      if (op.type === "link_file_to_thread") {
        const targetPath = normalizePath(op.path);
        const file = files.find((f) => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) {
          results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` });
          continue;
        }

        const threadId = op.link === false ? null : context.currentThreadId;
        const { error } = await supabase
          .from("staff_library_files")
          .update({ thread_id: threadId })
          .eq("id", file.id);

        if (error) throw error;

        file.thread_id = threadId;
        results.push({ operation: op, status: "ok", message: threadId ? `Linked file to thread` : "Unlinked file from thread" });
        continue;
      }

      if (op.type === "convert_file_to_markdown") {
        const targetPath = normalizePath(op.path);
        const file = files.find((f) => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) {
          results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` });
          continue;
        }

        if (!file.original_content) {
          results.push({ operation: op, status: "error", message: "File has no original_content to convert" });
          continue;
        }

        const markdown = await convertTextToMarkdown(file.original_content);

        const { error } = await supabase
          .from("staff_library_files")
          .update({ markdown_content: markdown })
          .eq("id", file.id);

        if (error) throw error;

        file.markdown_content = markdown;
        results.push({ operation: op, status: "ok", message: `Converted file at ${targetPath} to Markdown` });
        continue;
      }

      results.push({ operation: op, status: "error", message: "Unknown operation type" });
    } catch (error) {
      console.error("staff-agent operation error", op, error);
      results.push({ operation: op, status: "error", message: error instanceof Error ? error.message : String(error) });
    }
  }

  return { results };
}

async function planOperations(instruction: string, folders: FolderRow[], files: FileRow[]): Promise<AgentOperation[]> {
  if (!poeApiKey) throw new Error("POE_API_KEY is not configured");

  const lines: string[] = [];
  for (const folder of folders) {
    lines.push(`FOLDER ${getFolderPath(folder, folders)}`);
  }
  for (const file of files) {
    const path = getFilePath(file, folders);
    const flags = [file.is_archived ? "archived" : "active", file.thread_id ? "linked-to-thread" : "unlinked"]
      .filter(Boolean)
      .join(", ");
    lines.push(`FILE ${path} [${flags}]`);
  }

  const libraryOverview = lines.join("\n");

  const systemPrompt =
    "You are an AI agent helping two university English teachers manage a shared file library. " +
    "You receive a textual overview of the current folders and files plus a natural language instruction. " +
    "You must respond ONLY with strict JSON (no Markdown, no commentary, no code fences) describing the actions to take.\n\n" +
    "The JSON must have the shape: {\"operations\": [ ... ] }. Each operation is one of:\n" +
    "1) { \"type\": \"create_folder\", \"path\": \"/Week 3/reading\" }\n" +
    "2) { \"type\": \"create_file\", \"path\": \"/Week 3/reading/guide.md\", \"content\": " +
    "optional_string_or_null, \"markdown\": optional_string_or_null, \"linkToThread\": optional_boolean }\n" +
    "3) { \"type\": \"move_file\", \"from\": \"/Old/name.txt\", \"to\": \"/New/name.txt\" }\n" +
    "4) { \"type\": \"rename_file\", \"path\": \"/Week 3/reading.txt\", \"new_name\": \"reading-updated.txt\" }\n" +
    "5) { \"type\": \"archive_file\", \"path\": \"/Old/file.txt\" }\n" +
    "6) { \"type\": \"link_file_to_thread\", \"path\": \"/Week 3/reading/guide.md\", \"link\": true_or_false } \n" +
    "7) { \"type\": \"convert_file_to_markdown\", \"path\": \"/Week 3/notes.txt\" }\n\n" +
    "Always use absolute paths starting with '/', and only refer to folders/files that exist in the overview unless the " +
    "instruction clearly asks you to create new ones. Keep the number of operations reasonable (at most 30).";

  const userPrompt =
    `Current library (folders and files):\n${libraryOverview || "<empty>"}\n\n` +
    `User instruction (natural language):\n"""\n${instruction}\n"""\n\n` +
    "Respond now with a single JSON object of the form {\"operations\": [ ... ] } and nothing else.";

  const response = await fetch("https://api.poe.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${poeApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://uclc1008-1.replit.app",
      "X-Title": "UCLC1008 Staff Library Agent",
    },
    body: JSON.stringify({
      model: "Claude-Sonnet-4.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Poe planning error", response.status, errorText);
    throw new Error("Poe API error while planning operations");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(typeof content === "string" ? content : String(content));
    if (Array.isArray(parsed?.operations)) {
      return parsed.operations as AgentOperation[];
    }
    console.error("staff-agent: Parsed content missing operations", parsed);
    throw new Error("Model did not return an operations array");
  } catch (error) {
    console.error("staff-agent: Failed to parse model JSON", error, content);
    throw new Error("Failed to parse JSON response from model");
  }
}

/**
 * Verify the user is authenticated and has teacher/admin role.
 * SECURITY: This prevents unauthorized access to the staff-agent endpoint.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyTeacherAuth(req: Request): Promise<{ userId: string; supabase: any } | Response> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized - missing or invalid authorization header" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.replace("Bearer ", "");
  
  // Create a Supabase client with the user's token
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  // Verify the JWT and get claims
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  
  if (claimsError || !claimsData?.claims) {
    console.error("staff-agent: JWT verification failed", claimsError);
    return new Response(
      JSON.stringify({ error: "Unauthorized - invalid token" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const userId = claimsData.claims.sub;
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized - no user ID in token" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check if user has teacher or admin role
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("profile_id", userId);

  if (rolesError) {
    console.error("staff-agent: Error fetching user roles", rolesError);
    return new Response(
      JSON.stringify({ error: "Error verifying permissions" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const isAuthorized = roles?.some((r) => r.role === "teacher" || r.role === "admin");
  
  if (!isAuthorized) {
    console.log("staff-agent: User not authorized", userId, roles);
    return new Response(
      JSON.stringify({ error: "Forbidden - teachers and admins only" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return { userId, supabase };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: "Supabase client is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!poeApiKey) {
      return new Response(JSON.stringify({ error: "POE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SECURITY: Verify authentication and authorization
    const authResult = await verifyTeacherAuth(req);
    if (authResult instanceof Response) {
      return authResult; // Return the error response
    }
    
    const { supabase } = authResult;

    const { instruction, currentThreadId } = await req.json();

    if (!instruction || typeof instruction !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid 'instruction' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { folders, files } = await fetchLibrary(supabase);

    const operations = await planOperations(instruction, folders, files);

    if (!operations || operations.length === 0) {
      return new Response(JSON.stringify({ operations: [], results: [], message: "No operations suggested" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { results } = await applyOperations(operations, folders, files, {
      currentThreadId: typeof currentThreadId === "string" ? currentThreadId : null,
    }, supabase);

    return new Response(JSON.stringify({ operations, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("staff-agent error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error in staff-agent" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
