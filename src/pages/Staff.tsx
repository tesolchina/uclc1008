import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StaffLibrarySidebar } from "@/components/staff/StaffLibrarySidebar";
import { Loader2, ShieldAlert } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import mammoth from "mammoth";

type PdfTextItem = { str?: string; string?: string };
type PdfTextContent = { items?: PdfTextItem[] };
type PdfPageProxy = { getTextContent: () => Promise<PdfTextContent> };
type PdfDocumentProxy = { numPages: number; getPage: (pageNumber: number) => Promise<PdfPageProxy> };
type PdfjsModule = typeof pdfjsLib & {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<PdfDocumentProxy> };
};
type MammothModule = {
  extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value?: string }>;
};

const pdfjs = pdfjsLib as unknown as PdfjsModule;
const mammothModule = mammoth as unknown as MammothModule;

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let combined = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const pageText = (content.items ?? [])
            .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
            .filter((chunk) => chunk.length > 0)
            .join(" ");
          combined += pageText + "\n\n";
        }

        text = combined.trim();
      } else if (extension === "docx" || extension === "doc") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammothModule.extractRawText({ arrayBuffer });
        text = result.value?.trim() ?? "";
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
                  {isCreatingThread ? "Creating..." : "Create thread"}
                </Button>
              </div>
            </form>

            <Separator className="my-2" />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Existing threads</p>
              {isLoadingThreads ? (
                <p className="text-xs text-muted-foreground">Loading threads...</p>
              ) : threads.length === 0 ? (
                <p className="text-xs text-muted-foreground">No threads yet. Create your first one above.</p>
              ) : (
                <Select value={selectedThreadId ?? ""} onValueChange={setSelectedThreadId}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Choose a thread" />
                  </SelectTrigger>
                  <SelectContent>
                    {threads.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                        {t.is_decided && " ✓"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedThread && (
          <>
            <Card className="border-border/70 bg-card/60 backdrop-blur">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{selectedThread.title}</CardTitle>
                {selectedThread.description && (
                  <CardDescription className="text-xs">{selectedThread.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is-decided"
                      checked={isDecided}
                      onChange={(e) => setIsDecided(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="is-decided" className="text-xs font-medium">
                      Mark this thread as decided
                    </label>
                  </div>
                  <Textarea
                    value={decisionSummary}
                    onChange={(e) => setDecisionSummary(e.target.value)}
                    placeholder="What was the final decision or outcome?"
                    className="text-xs"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSaveDecision} disabled={isSavingDecision}>
                      {isSavingDecision ? "Saving..." : "Save decision"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/60 backdrop-blur">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Comments</CardTitle>
                <CardDescription className="text-xs">
                  Chat about this thread. Comments are saved immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No comments yet on this thread.</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="rounded-md border border-border/60 bg-background/70 p-2">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-semibold">{c.author_name ?? "Anonymous"}</span>
                          <span>{formatDateTime(c.created_at)}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-xs">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <form onSubmit={handleAddComment} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select value={commentAuthor} onValueChange={setCommentAuthor}>
                      <SelectTrigger className="w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simon">Simon</SelectItem>
                        <SelectItem value="Naina">Naina</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">says:</span>
                  </div>
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add your thoughts..."
                    className="text-xs"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={isSavingComment || !commentContent.trim()}>
                      {isSavingComment ? "Posting..." : "Post comment"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/60 backdrop-blur">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Materials</CardTitle>
                <CardDescription className="text-xs">
                  Paste raw content (Word, PDF text) and convert to Markdown for the learning hub.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {materials.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No materials saved for this thread.</p>
                  ) : (
                    materials.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between gap-2 rounded-md border border-border/60 bg-background/70 p-2"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium">{m.title}</p>
                          <p className="text-[11px] text-muted-foreground">{formatDateTime(m.created_at)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[11px] text-destructive"
                          disabled={deletingMaterialId === m.id}
                          onClick={() => handleDeleteMaterial(m.id)}
                        >
                          {deletingMaterialId === m.id ? "..." : "Delete"}
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <form onSubmit={handleSaveMaterial} className="space-y-3">
                  <Input
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="Material title"
                    className="text-sm"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Upload or paste original content
                    </label>
                    <Input type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={handleFileUpload} className="text-xs" />
                  </div>

                  <Textarea
                    value={materialOriginal}
                    onChange={(e) => setMaterialOriginal(e.target.value)}
                    placeholder="Paste raw text here..."
                    className="min-h-[100px] text-xs"
                  />

                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={handleConvertMaterial} disabled={isConvertingMaterial}>
                      {isConvertingMaterial ? "Converting..." : "Convert to Markdown"}
                    </Button>
                  </div>

                  <Textarea
                    value={materialMarkdown}
                    onChange={(e) => setMaterialMarkdown(e.target.value)}
                    placeholder="Markdown output will appear here..."
                    className="min-h-[100px] text-xs"
                  />

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={isSavingMaterial || !materialTitle.trim()}>
                      {isSavingMaterial ? "Saving..." : "Save material"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Staff library</SheetTitle>
            <SheetDescription className="text-xs">
              Organise files across threads using natural language. The AI agent can move, rename, or archive items.
            </SheetDescription>
          </SheetHeader>
          <StaffLibrarySidebar selectedThreadId={selectedThreadId} />
        </SheetContent>
      </Sheet>
    </section>
  );
};

/**
 * Staff page component with proper OAuth-based role authentication.
 * SECURITY: Replaces client-side password with server-validated role checks.
 */
const Staff = () => {
  const { isAuthenticated, isLoading, isTeacher, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if user is not a teacher or admin
  if (!isTeacher && !isAdmin) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md border-border/80 bg-card/70 backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-base">Access Denied</CardTitle>
            <CardDescription className="text-xs">
              This area is restricted to teachers and administrators. If you believe you should have access, 
              please contact your system administrator to update your role.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // User is authenticated and has teacher/admin role
  return <StaffSpace />;
};

export default Staff;
