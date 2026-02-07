import { Router, Request, Response } from "express";
import { getPoeProvider } from "../lib/ai-providers.js";
import { supabaseAdmin } from "../lib/supabase.js";

export const staffAgentRouter = Router();

type FolderRow = { id: string; name: string; parent_id: string | null };
type FileRow = { id: string; filename: string; folder_id: string | null; thread_id: string | null; is_archived: boolean; original_content: string | null; markdown_content: string | null };
type AgentOperation =
  | { type: "create_folder"; path: string }
  | { type: "create_file"; path: string; content?: string | null; markdown?: string | null; linkToThread?: boolean }
  | { type: "move_file"; from: string; to: string }
  | { type: "rename_file"; path: string; new_name: string }
  | { type: "archive_file"; path: string }
  | { type: "link_file_to_thread"; path: string; link?: boolean }
  | { type: "convert_file_to_markdown"; path: string };
type OperationResult = { operation: AgentOperation; status: "ok" | "error"; message?: string };

function normalizePath(rawPath: string): string {
  let path = rawPath.trim();
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path.replace(/\/{2,}/g, "/");
}

function splitPath(path: string): { parentPath: string; name: string } {
  const normalized = normalizePath(path);
  if (normalized === "/") return { parentPath: "/", name: "" };
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
  while (current && safety < 50) { segments.unshift(current.name); current = current.parent_id ? byId.get(current.parent_id) : undefined; safety++; }
  return "/" + segments.join("/");
}

function getFilePath(file: FileRow, folders: FolderRow[]): string {
  if (!file.folder_id) return normalizePath(`/${file.filename}`);
  const folder = folders.find(f => f.id === file.folder_id);
  if (!folder) return normalizePath(`/${file.filename}`);
  const base = getFolderPath(folder, folders);
  return normalizePath(base === "/" ? `/${file.filename}` : `${base}/${file.filename}`);
}

async function fetchLibrary(supabase: any) {
  const [{ data: folders, error: foldersError }, { data: files, error: filesError }] = await Promise.all([
    supabase.from("staff_library_folders").select("id, name, parent_id").order("created_at", { ascending: true }),
    supabase.from("staff_library_files").select("id, filename, folder_id, thread_id, is_archived, original_content, markdown_content").order("created_at", { ascending: true }),
  ]);
  if (foldersError) throw foldersError;
  if (filesError) throw filesError;
  return { folders: folders ?? [], files: files ?? [] };
}

async function ensureFolderExists(path: string, folders: FolderRow[], supabase: any): Promise<{ folder: FolderRow | null; folders: FolderRow[] }> {
  const normalized = normalizePath(path);
  if (normalized === "/") return { folder: null, folders };
  const existing = folders.find(f => getFolderPath(f, folders) === normalized);
  if (existing) return { folder: existing, folders };
  const { parentPath, name } = splitPath(normalized);
  const parentResult = await ensureFolderExists(parentPath, folders, supabase);
  folders = parentResult.folders;
  const { data, error } = await supabase.from("staff_library_folders").insert({ name, parent_id: parentResult.folder?.id ?? null }).select("id, name, parent_id").single();
  if (error) throw error;
  return { folder: data, folders: [...folders, data] };
}

async function convertTextToMarkdown(text: string): Promise<string> {
  const poe = getPoeProvider();
  const response = await fetch(poe.endpoint, {
    method: "POST",
    headers: poe.headers,
    body: JSON.stringify({
      model: poe.model,
      messages: [
        { role: "system", content: "You are a careful writing assistant for university English teachers. Convert the provided teaching materials into clean, well-structured Markdown suitable for a learning hub. Preserve headings, lists, tables, and examples. Do not add extra commentary, just return the Markdown." },
        { role: "user", content: text },
      ],
    }),
  });
  if (!response.ok) { const errorText = await response.text(); console.error("Poe markdown conversion error", response.status, errorText); throw new Error("Poe API error during Markdown conversion"); }
  const data = await response.json();
  const markdown = data?.choices?.[0]?.message?.content ?? "";
  return typeof markdown === "string" ? markdown : String(markdown);
}

async function applyOperations(operations: AgentOperation[], folders: FolderRow[], files: FileRow[], context: { currentThreadId: string | null }, supabase: any): Promise<{ results: OperationResult[] }> {
  const results: OperationResult[] = [];
  for (const op of operations) {
    try {
      if (op.type === "create_folder") {
        const { folder, folders: uf } = await ensureFolderExists(op.path, folders, supabase); folders = uf;
        results.push({ operation: op, status: "ok", message: folder ? `Folder ensured at ${normalizePath(op.path)}` : "Root folder exists" }); continue;
      }
      if (op.type === "create_file") {
        const { parentPath, name } = splitPath(op.path);
        const fr = await ensureFolderExists(parentPath, folders, supabase); folders = fr.folders;
        const existingPath = normalizePath(op.path);
        const already = files.find(f => getFilePath(f, folders) === existingPath && !f.is_archived);
        if (already) { results.push({ operation: op, status: "ok", message: `File already exists at ${existingPath}` }); continue; }
        const { data, error } = await supabase.from("staff_library_files").insert({ filename: name, folder_id: fr.folder?.id ?? null, thread_id: op.linkToThread && context.currentThreadId ? context.currentThreadId : null, original_content: op.content ?? null, markdown_content: op.markdown ?? null }).select("id, filename, folder_id, thread_id, is_archived, original_content, markdown_content").single();
        if (error) throw error; files = [...files, data]; results.push({ operation: op, status: "ok", message: `Created file at ${existingPath}` }); continue;
      }
      if (op.type === "move_file") {
        const fromPath = normalizePath(op.from);
        const file = files.find(f => getFilePath(f, folders) === fromPath && !f.is_archived);
        if (!file) { results.push({ operation: op, status: "error", message: `No file found at ${fromPath}` }); continue; }
        const toPath = normalizePath(op.to);
        const { parentPath, name } = splitPath(toPath);
        const fr = await ensureFolderExists(parentPath, folders, supabase); folders = fr.folders;
        const { error } = await supabase.from("staff_library_files").update({ filename: name, folder_id: fr.folder?.id ?? null }).eq("id", file.id);
        if (error) throw error; file.filename = name; file.folder_id = fr.folder?.id ?? null;
        results.push({ operation: op, status: "ok", message: `Moved file to ${toPath}` }); continue;
      }
      if (op.type === "rename_file") {
        const targetPath = normalizePath(op.path);
        const file = files.find(f => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) { results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` }); continue; }
        const { error } = await supabase.from("staff_library_files").update({ filename: op.new_name }).eq("id", file.id);
        if (error) throw error; file.filename = op.new_name; results.push({ operation: op, status: "ok", message: `Renamed file at ${targetPath}` }); continue;
      }
      if (op.type === "archive_file") {
        const targetPath = normalizePath(op.path);
        const file = files.find(f => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) { results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` }); continue; }
        const { error } = await supabase.from("staff_library_files").update({ is_archived: true }).eq("id", file.id);
        if (error) throw error; file.is_archived = true; results.push({ operation: op, status: "ok", message: `Archived file at ${targetPath}` }); continue;
      }
      if (op.type === "link_file_to_thread") {
        const targetPath = normalizePath(op.path);
        const file = files.find(f => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) { results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` }); continue; }
        const threadId = op.link === false ? null : context.currentThreadId;
        const { error } = await supabase.from("staff_library_files").update({ thread_id: threadId }).eq("id", file.id);
        if (error) throw error; file.thread_id = threadId; results.push({ operation: op, status: "ok", message: threadId ? "Linked file to thread" : "Unlinked file from thread" }); continue;
      }
      if (op.type === "convert_file_to_markdown") {
        const targetPath = normalizePath(op.path);
        const file = files.find(f => getFilePath(f, folders) === targetPath && !f.is_archived);
        if (!file) { results.push({ operation: op, status: "error", message: `No file found at ${targetPath}` }); continue; }
        if (!file.original_content) { results.push({ operation: op, status: "error", message: "File has no original_content to convert" }); continue; }
        const markdown = await convertTextToMarkdown(file.original_content);
        const { error } = await supabase.from("staff_library_files").update({ markdown_content: markdown }).eq("id", file.id);
        if (error) throw error; file.markdown_content = markdown; results.push({ operation: op, status: "ok", message: `Converted file at ${targetPath} to Markdown` }); continue;
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
  const poe = getPoeProvider();
  const lines: string[] = [];
  for (const folder of folders) lines.push(`FOLDER ${getFolderPath(folder, folders)}`);
  for (const file of files) {
    const path = getFilePath(file, folders);
    const flags = [file.is_archived ? "archived" : "active", file.thread_id ? "linked-to-thread" : "unlinked"].join(", ");
    lines.push(`FILE ${path} [${flags}]`);
  }

  const systemPrompt = "You are an AI agent helping two university English teachers manage a shared file library. You receive a textual overview of the current folders and files plus a natural language instruction. You must respond ONLY with strict JSON (no Markdown, no commentary, no code fences) describing the actions to take.\n\nThe JSON must have the shape: {\"operations\": [ ... ] }. Each operation is one of:\n1) { \"type\": \"create_folder\", \"path\": \"/Week 3/reading\" }\n2) { \"type\": \"create_file\", \"path\": \"/Week 3/reading/guide.md\", \"content\": optional_string_or_null, \"markdown\": optional_string_or_null, \"linkToThread\": optional_boolean }\n3) { \"type\": \"move_file\", \"from\": \"/Old/name.txt\", \"to\": \"/New/name.txt\" }\n4) { \"type\": \"rename_file\", \"path\": \"/Week 3/reading.txt\", \"new_name\": \"reading-updated.txt\" }\n5) { \"type\": \"archive_file\", \"path\": \"/Old/file.txt\" }\n6) { \"type\": \"link_file_to_thread\", \"path\": \"/Week 3/reading/guide.md\", \"link\": true_or_false }\n7) { \"type\": \"convert_file_to_markdown\", \"path\": \"/Week 3/notes.txt\" }\n\nAlways use absolute paths starting with '/', and only refer to folders/files that exist in the overview unless the instruction clearly asks you to create new ones. Keep the number of operations reasonable (at most 30).";

  const userPrompt = `Current library (folders and files):\n${lines.join("\n") || "<empty>"}\n\nUser instruction (natural language):\n"""\n${instruction}\n"""\n\nRespond now with a single JSON object of the form {"operations": [ ... ] } and nothing else.`;

  const response = await fetch(poe.endpoint, {
    method: "POST",
    headers: poe.headers,
    body: JSON.stringify({ model: poe.model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }] }),
  });

  if (!response.ok) { const errorText = await response.text(); console.error("Poe planning error", response.status, errorText); throw new Error("Poe API error while planning operations"); }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(typeof content === "string" ? content : String(content));
    if (Array.isArray(parsed?.operations)) return parsed.operations;
    throw new Error("Model did not return an operations array");
  } catch (error) {
    console.error("staff-agent: Failed to parse model JSON", error, content);
    throw new Error("Failed to parse JSON response from model");
  }
}

staffAgentRouter.post("/", async (req: Request, res: Response) => {
  try {
    let poe;
    try { poe = getPoeProvider(); } catch { res.status(500).json({ error: "POE_API_KEY is not configured" }); return; }

    const { instruction, currentThreadId } = req.body;
    if (!instruction || typeof instruction !== "string") {
      res.status(400).json({ error: "Missing or invalid 'instruction' field" });
      return;
    }

    const { folders, files } = await fetchLibrary(supabaseAdmin);
    const operations = await planOperations(instruction, folders, files);

    if (!operations || operations.length === 0) {
      res.json({ operations: [], results: [], message: "No operations suggested" });
      return;
    }

    const { results } = await applyOperations(operations, folders, files, {
      currentThreadId: typeof currentThreadId === "string" ? currentThreadId : null,
    }, supabaseAdmin);

    res.json({ operations, results });
  } catch (error) {
    console.error("staff-agent error", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unexpected error in staff-agent" });
  }
});
