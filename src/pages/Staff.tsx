import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StaffLibrarySidebar } from "@/components/staff/StaffLibrarySidebar";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import mammoth from "mammoth";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

const STAFF_PASSWORD = "ue2026";

type StaffThread = {
  id: string;
  title: string;
  description: string | null;
  is_decided: boolean;
  decided_summary: string | null;
  created_at: string;
};

type StaffComment = {
  id: string;
  thread_id: string;
  author_name: string | null;
  content: string;
  created_at: string;
};

type StaffMaterial = {
  id: string;
  thread_id: string;
  title: string;
  original_content: string | null;
  markdown_content: string | null;
  created_at: string;
};

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const StaffSpace = () => {
  const { toast } = useToast();
  const [threads, setThreads] = useState<StaffThread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadDescription, setNewThreadDescription] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const [comments, setComments] = useState<StaffComment[]>([]);
  const [materials, setMaterials] = useState<StaffMaterial[]>([]);

  const [decisionSummary, setDecisionSummary] = useState("");
  const [isDecided, setIsDecided] = useState(false);
  const [isSavingDecision, setIsSavingDecision] = useState(false);

  const [commentAuthor, setCommentAuthor] = useState("Simon");
  const [commentContent, setCommentContent] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);

  const [materialTitle, setMaterialTitle] = useState("");
  const [materialOriginal, setMaterialOriginal] = useState("");
  const [materialMarkdown, setMaterialMarkdown] = useState("");
  const [isConvertingMaterial, setIsConvertingMaterial] = useState(false);
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);
  const [deletingMaterialId, setDeletingMaterialId] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const loadThreads = async () => {
    setIsLoadingThreads(true);
    const { data, error } = await supabase
      .from("staff_threads")
      .select("id, title, description, is_decided, decided_summary, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading threads", error);
      toast({
        variant: "destructive",
        title: "Could not load staff threads",
        description: error.message,
      });
      setIsLoadingThreads(false);
      return;
    }

    setThreads(data || []);

    if (!selectedThreadId && data && data.length > 0) {
      setSelectedThreadId(data[0].id);
      setIsDecided(data[0].is_decided);
      setDecisionSummary(data[0].decided_summary ?? "");
    }

    setIsLoadingThreads(false);
  };

  const loadThreadDetails = async (threadId: string) => {
    const [{ data: commentsData, error: commentsError }, { data: materialsData, error: materialsError }] = await Promise.all([
      supabase
        .from("staff_comments")
        .select("id, thread_id, author_name, content, created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true }),
      supabase
        .from("staff_materials")
        .select("id, thread_id, title, original_content, markdown_content, created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true }),
    ]);

    if (commentsError) {
      console.error("Error loading comments", commentsError);
      toast({
        variant: "destructive",
        title: "Could not load comments",
        description: commentsError.message,
      });
    } else {
      setComments(commentsData || []);
    }

    if (materialsError) {
      console.error("Error loading materials", materialsError);
      toast({
        variant: "destructive",
        title: "Could not load materials",
        description: materialsError.message,
      });
    } else {
      setMaterials(materialsData || []);
    }
  };

  useEffect(() => {
    void loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const thread = threads.find((t) => t.id === selectedThreadId);
    if (thread) {
      setIsDecided(thread.is_decided);
      setDecisionSummary(thread.decided_summary ?? "");
      void loadThreadDetails(thread.id);
    } else {
      setComments([]);
      setMaterials([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThreadId]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Thread title is required",
      });
      return;
    }

    setIsCreatingThread(true);
    const { data, error } = await supabase
      .from("staff_threads")
      .insert({ title: newThreadTitle.trim(), description: newThreadDescription.trim() || null })
      .select("id, title, description, is_decided, decided_summary, created_at")
      .single();

    setIsCreatingThread(false);

    if (error) {
      console.error("Error creating thread", error);
      toast({
        variant: "destructive",
        title: "Could not create thread",
        description: error.message,
      });
      return;
    }

    if (data) {
      setThreads((prev) => [data, ...prev]);
      setSelectedThreadId(data.id);
      setIsDecided(data.is_decided);
      setDecisionSummary(data.decided_summary ?? "");
      setNewThreadTitle("");
      setNewThreadDescription("");
    }
  };

  const handleSaveDecision = async () => {
    if (!selectedThreadId) return;

    setIsSavingDecision(true);
    const { data, error } = await supabase
      .from("staff_threads")
      .update({ is_decided: isDecided, decided_summary: decisionSummary.trim() || null })
      .eq("id", selectedThreadId)
      .select("id, title, description, is_decided, decided_summary, created_at")
      .single();

    setIsSavingDecision(false);

    if (error) {
      console.error("Error saving decision", error);
      toast({
        variant: "destructive",
        title: "Could not save decision",
        description: error.message,
      });
      return;
    }

    if (data) {
      setThreads((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      toast({ title: "Decision updated for this thread." });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadId || !commentContent.trim()) return;

    setIsSavingComment(true);
    const { data, error } = await supabase
      .from("staff_comments")
      .insert({
        thread_id: selectedThreadId,
        author_name: commentAuthor.trim() || null,
        content: commentContent.trim(),
      })
      .select("id, thread_id, author_name, content, created_at")
      .single();

    setIsSavingComment(false);

    if (error) {
      console.error("Error saving comment", error);
      toast({
        variant: "destructive",
        title: "Could not save comment",
        description: error.message,
      });
      return;
    }

    if (data) {
      setComments((prev) => [...prev, data]);
      setCommentContent("");
    }
  };

  const handleConvertMaterial = async () => {
    if (!materialOriginal.trim()) {
      toast({
        variant: "destructive",
        title: "Paste some material first",
      });
      return;
    }

    setIsConvertingMaterial(true);
    const { data, error } = await supabase.functions.invoke("poe-markdown", {
      body: { text: materialOriginal },
    });
    setIsConvertingMaterial(false);

    if (error) {
      console.error("Error converting material", error);
      toast({
        variant: "destructive",
        title: "AI conversion failed",
        description: error.message ?? "Please try again or check the Poe API key.",
      });
      return;
    }

    const markdown = (data as { markdown?: string } | null)?.markdown ?? "";
    setMaterialMarkdown(markdown);
    toast({ title: "Material converted to Markdown." });
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadId || !materialTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Material needs a title and thread",
      });
      return;
    }

    setIsSavingMaterial(true);
    const { data, error } = await supabase
      .from("staff_materials")
      .insert({
        thread_id: selectedThreadId,
        title: materialTitle.trim(),
        original_content: materialOriginal.trim() || null,
        markdown_content: materialMarkdown.trim() || null,
      })
      .select("id, thread_id, title, original_content, markdown_content, created_at")
      .single();

    setIsSavingMaterial(false);

    if (error) {
      console.error("Error saving material", error);
      toast({
        variant: "destructive",
        title: "Could not save material",
        description: error.message,
      });
      return;
    }

    if (data) {
      setMaterials((prev) => [...prev, data]);
      setMaterialTitle("");
      setMaterialOriginal("");
      setMaterialMarkdown("");
      toast({ title: "Material saved to this thread." });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.toLowerCase().split(".").pop() ?? "";

    try {
      let text = "";

      if (extension === "pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
        let combined = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const pageText = (content.items ?? [])
            .map((item: any) => (typeof item.str === "string" ? item.str : (item.string as string | undefined) ?? ""))
            .join(" ");
          combined += pageText + "\n\n";
        }

        text = combined.trim();
      } else if (extension === "docx" || extension === "doc") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await (mammoth as any).extractRawText({ arrayBuffer });
        text = (result?.value as string | undefined)?.trim() ?? "";
      } else {
        text = (await file.text()).trim();
      }

      if (!text) {
        toast({
          variant: "destructive",
          title: "Could not read file",
          description: "Please check the file and try again, or paste the text manually.",
        });
        return;
      }

      setMaterialOriginal(text);
      if (!materialTitle) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setMaterialTitle(nameWithoutExt);
      }
      toast({
        title: "File loaded into materials editor.",
        description:
          extension === "pdf" || extension === "docx" || extension === "doc"
            ? "We have extracted the text from your document."
            : undefined,
      });
    } catch (error) {
      console.error("File read error", error);
      toast({
        variant: "destructive",
        title: "File read error",
        description: "PDF and Word support basic text extraction only. If this fails, please paste the text manually.",
      });
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const confirmed = window.confirm("Delete this material from the database? This cannot be undone.");
    if (!confirmed) return;

    setDeletingMaterialId(materialId);
    const { error } = await supabase.from("staff_materials").delete().eq("id", materialId);
    setDeletingMaterialId(null);

    if (error) {
      console.error("Error deleting material", error);
      toast({
        variant: "destructive",
        title: "Could not delete material",
        description: error.message,
      });
      return;
    }

    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    toast({ title: "Material deleted." });
  };

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Staff space</p>
            <h1 className="text-2xl font-semibold tracking-tight">Planning & materials workspace</h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsLibraryOpen(true)}
          >
            Open library & AI agent
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          A private area for Simon and Naina to discuss lessons, record decisions, and build shared materials for
          UCLC&nbsp;1008.
        </p>
      </header>

      <div className="grid gap-6">
        <Card className="border-border/70 bg-card/60 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">Discussion threads</CardTitle>
            <CardDescription className="text-xs">
              Group ideas by theme, week, or assessment. Mark a thread as decided once you reach agreement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateThread} className="space-y-2 rounded-md border border-dashed border-border/70 bg-background/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">Start a new thread</p>
              <Input
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="e.g. Week 4 group discussion rubric, or Writing assignment brief"
                className="text-sm"
              />
              <Textarea
                value={newThreadDescription}
                onChange={(e) => setNewThreadDescription(e.target.value)}
                placeholder="Optional: quick context for this discussion"
                className="text-xs"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button type="submit" size="sm" disabled={isCreatingThread}>
                  {isCreatingThread ? "Creating a0 a0 a0" : "Create thread"}
                </Button>
              </div>
            </form>

            <Separator className="my-2" />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Existing threads</p>
              {isLoadingThreads ? (
                <p className="text-xs text-muted-foreground">Loading threads a0 a0 a0</p>
              ) : threads.length === 0 ? (
                <p className="text-xs text-muted-foreground">No threads yet. Start one above to begin planning.</p>
              ) : (
                <ul className="space-y-1">
                  {threads.map((thread) => (
                    <li key={thread.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={`flex w-full items-start justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                          selectedThreadId === thread.id
                            ? "bg-primary/10 text-foreground"
                            : "hover:bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-medium">{thread.title}</p>
                          {thread.description && (
                            <p className="truncate text-[11px] text-muted-foreground">{thread.description}</p>
                          )}
                        </div>
                        {thread.is_decided && (
                          <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            Decided
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/60 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">Thread details</CardTitle>
            <CardDescription className="text-xs">
              Capture decisions, comments, and attach materials. AI can help you convert raw notes into clean Markdown.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedThread ? (
              <p className="text-xs text-muted-foreground">Select a thread on the left to see details.</p>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Active thread
                      </p>
                      <h2 className="truncate text-sm font-semibold">{selectedThread.title}</h2>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Created {formatDateTime(selectedThread.created_at)}</p>
                  </div>

                  {selectedThread.description && (
                    <p className="text-xs text-muted-foreground">{selectedThread.description}</p>
                  )}
                </div>

                <Separator className="my-1" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-muted-foreground">Decision for this thread</p>
                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-border bg-background text-primary"
                        checked={isDecided}
                        onChange={(e) => setIsDecided(e.target.checked)}
                      />
                      Mark as decided
                    </label>
                  </div>
                  <Textarea
                    value={decisionSummary}
                    onChange={(e) => setDecisionSummary(e.target.value)}
                    placeholder="Summarise the decision you've made here so future you remembers the reasoning."
                    className="text-xs"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={handleSaveDecision} disabled={isSavingDecision}>
                      {isSavingDecision ? "Saving a0 a0 a0" : "Save decision"}
                    </Button>
                  </div>
                </div>

                <Separator className="my-1" />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium text-muted-foreground">Comments</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>Posting as</span>
                      <Select value={commentAuthor} onValueChange={setCommentAuthor}>
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simon">Simon</SelectItem>
                          <SelectItem value="Naina">Naina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-md border border-border/70 bg-background/60 p-2">
                    {comments.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">No comments yet. Add one below.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {comments.map((comment) => (
                          <li key={comment.id} className="rounded-md bg-muted/60 px-2 py-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium text-muted-foreground">
                                {comment.author_name || "Unknown"}
                              </p>
                              <p className="text-[10px] text-muted-foreground/80">
                                {formatDateTime(comment.created_at)}
                              </p>
                            </div>
                            <p className="mt-0.5 text-xs text-foreground">{comment.content}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="space-y-1.5">
                    <Textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={`Add a quick note or idea as ${commentAuthor}`}
                      className="text-xs"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={isSavingComment}>
                        {isSavingComment ? "Posting a0 a0 a0" : "Post comment"}
                      </Button>
                    </div>
                  </form>
                </div>

                <Separator className="my-1" />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium text-muted-foreground">Materials attached to this thread</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {materials.length === 0 ? "No materials yet" : `${materials.length} material(s) saved in the database`}
                    </p>
                  </div>

                  {materials.length > 0 && (
                    <div className="space-y-2 rounded-md border border-border/70 bg-background/50 p-2">
                      {materials.map((material) => (
                        <div key={material.id} className="space-y-1 rounded-md bg-card/80 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold">{material.title}</p>
                              <p className="text-[10px] text-muted-foreground/80">
                                Saved {formatDateTime(material.created_at)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDeleteMaterial(material.id)}
                              disabled={deletingMaterialId === material.id}
                              aria-label="Delete material"
                            >
                              {deletingMaterialId === material.id ? " a0 a0 a0" : " d7"}
                            </Button>
                          </div>
                          {material.original_content && (
                            <details className="group text-[11px] text-muted-foreground">
                              <summary className="cursor-pointer select-none font-medium text-foreground">
                                Original notes
                              </summary>
                              <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted/60 p-2 text-[11px] text-muted-foreground">
                                {material.original_content}
                              </pre>
                            </details>
                          )}
                          {material.markdown_content && (
                            <details className="group text-[11px] text-muted-foreground">
                              <summary className="cursor-pointer select-none font-medium text-foreground">
                                Markdown version
                              </summary>
                              <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted/60 p-2 text-[11px] text-muted-foreground">
                                {material.markdown_content}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={handleSaveMaterial}
                    className="space-y-2 rounded-md border border-dashed border-border/70 bg-background/60 p-3"
                  >
                    <p className="text-xs font-medium text-muted-foreground">Add new material</p>
                    <Input
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="Title for this material (e.g. Week 3 reading guide)"
                      className="text-sm"
                    />
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">
                        Upload text, PDF, or Word file (optional)
                      </label>
                      <Input
                        type="file"
                        accept=".txt,.md,.markdown,.html,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="h-8 text-xs"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        We will pull out the text for you. For complex layouts, you can also paste the text manually.
                      </p>
                    </div>
                    <Textarea
                      value={materialOriginal}
                      onChange={(e) => setMaterialOriginal(e.target.value)}
                      placeholder="Paste raw notes, bullet points, or copied text here. AI can turn this into Markdown."
                      className="text-xs"
                      rows={4}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleConvertMaterial}
                        disabled={isConvertingMaterial}
                      >
                        {isConvertingMaterial ? "Converting a0 a0 a0" : "Convert to Markdown with AI"}
                      </Button>
                      <p className="text-[11px] text-muted-foreground">
                        Uses the shared Poe API key stored securely in the backend.
                      </p>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Step 2  2014 review and edit the Markdown before saving
                    </p>
                    <Textarea
                      value={materialMarkdown}
                      onChange={(e) => setMaterialMarkdown(e.target.value)}
                      placeholder="Markdown will appear here. You can edit before saving."
                      className="text-xs font-mono"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={isSavingMaterial}>
                        {isSavingMaterial ? "Saving a0 a0 a0" : "Save reviewed material to thread"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <SheetContent
          side="right"
          className="flex w-full max-w-md flex-col gap-3 border-l border-border/70 bg-background/95 p-4 sm:max-w-lg"
        >
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-sm font-semibold">Library & AI agent</SheetTitle>
            <SheetDescription className="text-xs">
              Shared file library for staff. Use natural language instructions to create folders and files,
              move items, archive them, or link them to the active thread.
            </SheetDescription>
          </SheetHeader>
          <StaffLibrarySidebar selectedThreadId={selectedThreadId} />
        </SheetContent>
      </Sheet>
    </section>
  );
};

const Staff = () => {
  const { toast } = useToast();
  const [isAuthed, setIsAuthed] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("staffAuthed") === "true");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    const trimmed = password.trim();
    if (trimmed === STAFF_PASSWORD) {
      sessionStorage.setItem("staffAuthed", "true");
      setIsAuthed(true);
      setIsChecking(false);
      setPassword("");
      toast({ title: "Welcome to the staff workspace." });
    } else {
      setIsChecking(false);
      toast({ variant: "destructive", title: "Incorrect staff password" });
    }
  };

  if (!isAuthed) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md border-border/80 bg-card/70 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">Staff workspace access</CardTitle>
            <CardDescription className="text-xs">
              This area is for Simon and Naina only. Enter the shared staff password to open the internal discussion and
              materials space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="staff-password">
                  Staff password
                </label>
                <Input
                  id="staff-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isChecking}>
                {isChecking ? "Checking a0 a0 a0" : "Enter staff space"}
              </Button>
              <p className="text-[11px] text-muted-foreground">
                Tip: you can change the password by updating the <code>STAFF_PASSWORD</code> constant in the staff page
                component.
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return <StaffSpace />;
};

export default Staff;
