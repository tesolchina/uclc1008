import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Save, CheckCircle2, Loader2, Sparkles, RefreshCw, ChevronDown, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WritingDraft {
  id: string;
  content: string;
  ai_feedback: string | null;
  version: number;
  is_submitted: boolean;
  created_at: string;
}

interface WritingPracticeWithHistoryProps {
  taskKey: string; // e.g., "w1h1-macro-structure"
  title: string;
  instructions: string;
  exampleFormat?: string;
  placeholder?: string;
  studentId?: string;
  className?: string;
}

export function WritingPracticeWithHistory({
  taskKey,
  title,
  instructions,
  exampleFormat,
  placeholder = "Write your response here...",
  studentId,
  className,
}: WritingPracticeWithHistoryProps) {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<WritingDraft[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "unsaved">("idle");
  const [showHistory, setShowHistory] = useState(false);

  // Load drafts
  useEffect(() => {
    if (!studentId) return;

    const loadDrafts = async () => {
      const { data } = await supabase
        .from("writing_drafts")
        .select("*")
        .eq("student_id", studentId)
        .eq("task_key", taskKey)
        .order("version", { ascending: false });

      if (data && data.length > 0) {
        setDrafts(data as WritingDraft[]);
        // Load latest draft
        const latest = data[0] as WritingDraft;
        setContent(latest.content);
        setSavedContent(latest.content);
        setAiFeedback(latest.ai_feedback);
        setCurrentVersion(latest.version);
        setSaveStatus("saved");
      }
    };

    loadDrafts();
  }, [studentId, taskKey]);

  // Track unsaved changes
  useEffect(() => {
    if (content === savedContent && savedContent !== "") {
      setSaveStatus("saved");
    } else if (content !== savedContent && content !== "") {
      setSaveStatus("unsaved");
    }
  }, [content, savedContent]);

  const handleSaveDraft = useCallback(async () => {
    if (!studentId || !content.trim()) return;

    setIsSaving(true);
    try {
      // Check if there's an existing draft for this version
      const existingDraft = drafts.find((d) => d.version === currentVersion && !d.is_submitted);

      if (existingDraft) {
        // Update existing draft
        await supabase
          .from("writing_drafts")
          .update({ content: content.trim() })
          .eq("id", existingDraft.id);
      } else {
        // Create new draft
        await supabase.from("writing_drafts").insert({
          student_id: studentId,
          task_key: taskKey,
          content: content.trim(),
          version: currentVersion,
        });
      }

      setSavedContent(content.trim());
      setSaveStatus("saved");
      toast({ title: "Draft saved" });

      // Reload drafts
      const { data } = await supabase
        .from("writing_drafts")
        .select("*")
        .eq("student_id", studentId)
        .eq("task_key", taskKey)
        .order("version", { ascending: false });

      if (data) setDrafts(data as WritingDraft[]);
    } catch (err) {
      console.error("Error saving draft:", err);
      toast({ variant: "destructive", title: "Failed to save draft" });
    } finally {
      setIsSaving(false);
    }
  }, [studentId, taskKey, content, currentVersion, drafts, toast]);

  const handleSubmitForFeedback = useCallback(async () => {
    if (!studentId || !content.trim()) return;

    setIsSubmitting(true);
    try {
      // First save the draft
      const { data: draftData, error: draftError } = await supabase
        .from("writing_drafts")
        .upsert(
          {
            student_id: studentId,
            task_key: taskKey,
            content: content.trim(),
            version: currentVersion,
            is_submitted: true,
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (draftError) {
        // Insert new if upsert failed
        const { data: newDraft } = await supabase
          .from("writing_drafts")
          .insert({
            student_id: studentId,
            task_key: taskKey,
            content: content.trim(),
            version: currentVersion,
            is_submitted: true,
          })
          .select()
          .single();
      }

      // Get AI feedback
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `You are a concise academic writing tutor. Provide brief feedback (3-4 sentences max) on this student's structural outline. Be direct about what's good and what could improve. Focus on: Does the summary correctly identify the structure and progression of ideas? Is it clear and accurate?

Task: ${title}
Instructions: ${instructions}

Student's response:
${content}

Provide constructive, specific feedback.`,
            },
          ],
          studentId,
          meta: { taskKey, type: "writing-feedback" },
        },
      });

      let feedback = "";
      if (response.data) {
        // Handle streaming response
        const reader = response.data?.getReader?.();
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const json = JSON.parse(line.slice(6));
                  const delta = json.choices?.[0]?.delta?.content;
                  if (delta) feedback += delta;
                } catch {}
              }
            }
          }
        } else if (typeof response.data === "string") {
          feedback = response.data;
        }
      }

      setAiFeedback(feedback);

      // Save feedback to draft
      await supabase
        .from("writing_drafts")
        .update({ ai_feedback: feedback, is_submitted: true })
        .eq("student_id", studentId)
        .eq("task_key", taskKey)
        .eq("version", currentVersion);

      setSavedContent(content.trim());
      setSaveStatus("saved");

      // Reload drafts
      const { data } = await supabase
        .from("writing_drafts")
        .select("*")
        .eq("student_id", studentId)
        .eq("task_key", taskKey)
        .order("version", { ascending: false });

      if (data) setDrafts(data as WritingDraft[]);

      toast({ title: "Feedback received!" });
    } catch (err) {
      console.error("Error getting feedback:", err);
      toast({ variant: "destructive", title: "Failed to get feedback" });
    } finally {
      setIsSubmitting(false);
    }
  }, [studentId, taskKey, content, currentVersion, title, instructions, toast]);

  const handleStartOver = useCallback(() => {
    // Increment version to start a new draft while keeping history
    const newVersion = currentVersion + 1;
    setCurrentVersion(newVersion);
    setContent("");
    setSavedContent("");
    setAiFeedback(null);
    setSaveStatus("idle");
    toast({ title: "New draft started", description: `Version ${newVersion}` });
  }, [currentVersion, toast]);

  const handleLoadDraft = useCallback((draft: WritingDraft) => {
    setContent(draft.content);
    setSavedContent(draft.content);
    setAiFeedback(draft.ai_feedback);
    setCurrentVersion(draft.version);
    setSaveStatus("saved");
    setShowHistory(false);
  }, []);

  return (
    <div className={cn("p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          {title}
        </h4>
        <Badge variant="outline" className="text-xs">
          Version {currentVersion}
        </Badge>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: instructions }} />

      {/* Example format */}
      {exampleFormat && (
        <div className="p-3 rounded bg-background/80 text-xs text-muted-foreground space-y-2">
          <p className="font-medium">Example format:</p>
          <p className="italic">{exampleFormat}</p>
        </div>
      )}

      {/* Writing area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-3 rounded-lg border bg-background text-sm resize-y placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      />

      {/* AI Feedback */}
      {aiFeedback && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Feedback
          </p>
          <p className="text-sm text-muted-foreground">{aiFeedback}</p>
          <p className="text-xs text-amber-600 italic">
            ⚠️ AI feedback may contain errors. Always consult your teacher for authoritative guidance.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {studentId ? (
          <>
            <Button
              size="sm"
              variant={saveStatus === "saved" ? "outline" : "default"}
              onClick={handleSaveDraft}
              disabled={isSaving || !content.trim() || saveStatus === "saved"}
              className="gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  Save Draft
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleSubmitForFeedback}
              disabled={isSubmitting || !content.trim()}
              className="gap-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Getting Feedback...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Submit for AI Feedback
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleStartOver}
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Start New Draft
            </Button>

            {drafts.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-1"
              >
                <History className="h-3 w-3" />
                History ({drafts.length})
              </Button>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Sign in to save drafts and get AI feedback
          </p>
        )}
      </div>

      {/* Draft history */}
      {showHistory && drafts.length > 0 && (
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleContent>
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium text-purple-700">Previous Drafts:</p>
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={cn(
                    "p-2 rounded border text-xs cursor-pointer hover:bg-accent/50 transition-colors",
                    draft.version === currentVersion && "border-purple-500 bg-purple-500/5"
                  )}
                  onClick={() => handleLoadDraft(draft)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Version {draft.version}</span>
                    <span className="text-muted-foreground">
                      {new Date(draft.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate mt-1">
                    {draft.content.substring(0, 100)}...
                  </p>
                  {draft.is_submitted && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      Has Feedback
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      <p className="text-xs text-muted-foreground italic">
        💡 Your drafts are saved and you can start new versions while keeping your history.
      </p>
    </div>
  );
}
