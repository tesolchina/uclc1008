import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

 type StaffLibraryFolder = {
  id: string;
  name: string;
  parent_id: string | null;
};

 type StaffLibraryFile = {
  id: string;
  filename: string;
  folder_id: string | null;
  thread_id: string | null;
  is_archived: boolean;
};

 interface StaffLibrarySidebarProps {
  selectedThreadId: string | null;
}

 type DisplayItem =
  | { kind: "folder"; id: string; name: string; path: string }
  | { kind: "file"; id: string; name: string; path: string; thread_id: string | null };

 function normalizePath(rawPath: string): string {
  let path = rawPath.trim();
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path.replace(/\/{2,}/g, "/");
}

export function StaffLibrarySidebar({ selectedThreadId }: StaffLibrarySidebarProps) {
  const { toast } = useToast();
  const [folders, setFolders] = useState<StaffLibraryFolder[]>([]);
  const [files, setFiles] = useState<StaffLibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [instruction, setInstruction] = useState("");

  const loadLibrary = useCallback(async () => {
    setIsLoading(true);
    const [{ data: folderData, error: folderError }, { data: fileData, error: fileError }] = await Promise.all([
      supabase
        .from("staff_library_folders")
        .select("id, name, parent_id")
        .order("created_at", { ascending: true }),
      supabase
        .from("staff_library_files")
        .select("id, filename, folder_id, thread_id, is_archived")
        .order("created_at", { ascending: true }),
    ]);
    setIsLoading(false);

    if (folderError || fileError) {
      console.error("Error loading library", folderError ?? fileError);
      toast({
        variant: "destructive",
        title: "Could not load library",
        description: folderError?.message ?? fileError?.message ?? "Please try again.",
      });
      return;
    }

    setFolders(folderData ?? []);
    setFiles((fileData ?? []).filter((f) => !f.is_archived));
  }, [toast]);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  const folderById = useMemo(() => {
    const map = new Map<string, StaffLibraryFolder>();
    for (const f of folders) map.set(f.id, f);
    return map;
  }, [folders]);

  const getFolderPath = useCallback(
    (folderId: string | null): string => {
      if (!folderId) return "/";
      const segments: string[] = [];
      let currentId: string | null = folderId;
      const safetyLimit = 50;
      let count = 0;

      while (currentId && count < safetyLimit) {
        const folder = folderById.get(currentId);
        if (!folder) break;
        segments.unshift(folder.name);
        currentId = folder.parent_id;
        count += 1;
      }

      return "/" + segments.join("/");
    },
    [folderById],
  );

  const items: DisplayItem[] = useMemo(() => {
    const folderItems: DisplayItem[] = folders.map((folder) => ({
      kind: "folder",
      id: folder.id,
      name: folder.name,
      path: normalizePath(getFolderPath(folder.id)),
    }));

    const fileItems: DisplayItem[] = files.map((file) => ({
      kind: "file",
      id: file.id,
      name: file.filename,
      path: normalizePath(
        getFolderPath(file.folder_id) === "/"
          ? `/${file.filename}`
          : `${getFolderPath(file.folder_id)}/${file.filename}`,
      ),
      thread_id: file.thread_id,
    }));

    return [...folderItems, ...fileItems].sort((a, b) => a.path.localeCompare(b.path));
  }, [folders, files, getFolderPath]);

  const handleCopyPath = async (path: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    const normalized = normalizePath(path);

    try {
      await navigator.clipboard.writeText(normalized);
      toast({
        title: "Path copied",
        description: normalized,
      });
    } catch (error) {
      console.error("Clipboard error", error);
      toast({
        variant: "destructive",
        title: "Could not copy path",
        description: "Your browser may be blocking clipboard access.",
      });
    }
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) {
      toast({
        variant: "destructive",
        title: "Type an instruction for the AI agent first",
      });
      return;
    }

    setIsRunningAgent(true);
    const { data, error } = await supabase.functions.invoke("staff-agent", {
      body: {
        instruction: instruction.trim(),
        currentThreadId: selectedThreadId,
      },
    });
    setIsRunningAgent(false);

    if (error) {
      console.error("staff-agent error", error);
      toast({
        variant: "destructive",
        title: "AI agent failed",
        description: error.message ?? "Please try again.",
      });
      return;
    }

    const result = data as { error?: string } | null;
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "AI agent error",
        description: result.error,
      });
      return;
    }

    toast({
      title: "AI agent finished",
      description: "The library has been updated based on your instruction.",
    });
    setInstruction("");
    void loadLibrary();
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shared library</p>
        <p className="text-xs text-muted-foreground">
          Right click any item to copy its path. The AI agent can use these paths to create, move, or archive items.
        </p>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border border-border/70 bg-card/60">
        <ScrollArea className="h-full max-h-[320px]">
          <div className="p-2 text-xs">
            {isLoading ? (
              <p className="text-muted-foreground">Loading library5</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground">
                Library is empty. Ask the AI agent below to create folders and files for you (for example, 2Create
                Week 113 folders with subfolders for reading, writing, and speaking2).
              </p>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => {
                  const depth = item.path === "/" ? 0 : item.path.split("/").length - 1;
                  const paddingLeft = 4 + depth * 8;

                  if (item.kind === "folder") {
                    return (
                      <li
                        key={`folder-${item.id}`}
                        onContextMenu={(event) => void handleCopyPath(item.path, event)}
                        className="group flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/60"
                        style={{ paddingLeft }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px]">
                            f4c1
                          </span>
                          <span className="truncate text-xs font-medium">{item.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => void handleCopyPath(item.path, event)}
                          className="ml-2 hidden rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted group-hover:inline-flex"
                        >
                          Copy path
                        </button>
                      </li>
                    );
                  }

                  const isLinkedHere = selectedThreadId && item.thread_id === selectedThreadId;
                  const isLinkedElsewhere = item.thread_id && item.thread_id !== selectedThreadId;

                  return (
                    <li
                      key={`file-${item.id}`}
                      onContextMenu={(event) => void handleCopyPath(item.path, event)}
                      className="group flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/60"
                      style={{ paddingLeft }}
                    >
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="text-[11px]">
                          f4c4
                        </span>
                        <span className="truncate text-xs">{item.name}</span>
                      </div>
                      <div className="ml-2 flex items-center gap-1.5">
                        {isLinkedHere && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                            Linked to this thread
                          </span>
                        )}
                        {isLinkedElsewhere && (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                            Linked to another thread
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(event) => void handleCopyPath(item.path, event)}
                          className="hidden rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted group-hover:inline-flex"
                        >
                          Copy path
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator className="my-1" />

      <form onSubmit={handleRunAgent} className="space-y-2 rounded-md border border-border/70 bg-background/80 p-2">
        <p className="text-xs font-medium text-muted-foreground">AI agent instructions</p>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder='Examples: "Create Week 113 folders", "Move all Week 4 reading files into /Week 4/reading", "Archive old mock exam files".'
          className="text-xs"
          rows={3}
        />
        <div className="flex items-center justify-between gap-2">
          <Button type="submit" size="sm" disabled={isRunningAgent}>
            {isRunningAgent ? "Running agent 85" : "Run AI agent"}
          </Button>
          <p className="text-[10px] text-muted-foreground">
            Uses the shared Poe API key in the backend to interpret your instructions and update the library
            automatically.
          </p>
        </div>
      </form>
    </div>
  );
}
