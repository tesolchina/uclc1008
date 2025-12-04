import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const STAFF_PASSWORD = "uclc1008-staff";

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

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Staff space</p>
        <h1 className="text-2xl font-semibold tracking-tight">Planning & materials workspace</h1>
        <p className="text-sm text-muted-foreground">
          A private area for Simon and Naina to discuss lessons, record decisions, and build shared materials for
          UCLC&nbsp;1008.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
                  <p className="text-xs font-medium text-muted-foreground">Comments</p>
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
                    <div className="flex gap-2">
                      <Input
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Name"
                        className="h-8 max-w-[120px] text-xs"
                      />
                      <Textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a quick note or idea"
                        className="text-xs"
                        rows={2}
                      />
                    </div>
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
                      {materials.length === 0 ? "No materials yet" : `${materials.length} material(s) saved`}
                    </p>
                  </div>

                  {materials.length > 0 && (
                    <div className="space-y-2 rounded-md border border-border/70 bg-background/50 p-2">
                      {materials.map((material) => (
                        <div key={material.id} className="space-y-1 rounded-md bg-card/80 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold">{material.title}</p>
                            <p className="text-[10px] text-muted-foreground/80">
                              Saved {formatDateTime(material.created_at)}
                            </p>
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

                  <form onSubmit={handleSaveMaterial} className="space-y-2 rounded-md border border-dashed border-border/70 bg-background/60 p-3">
                    <p className="text-xs font-medium text-muted-foreground">Add new material</p>
                    <Input
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="Title for this material (e.g. Week 3 reading guide)"
                      className="text-sm"
                    />
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
                    <Textarea
                      value={materialMarkdown}
                      onChange={(e) => setMaterialMarkdown(e.target.value)}
                      placeholder="Markdown will appear here. You can edit before saving."
                      className="text-xs font-mono"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={isSavingMaterial}>
                        {isSavingMaterial ? "Saving a0 a0 a0" : "Save material to thread"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
