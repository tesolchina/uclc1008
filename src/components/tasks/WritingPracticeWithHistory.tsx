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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

const MAX_FOLLOWUP_ROUNDS = 3;

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
  // Track content that was last submitted for feedback to prevent duplicate submissions
  const [lastSubmittedContent, setLastSubmittedContent] = useState<string>("");
  // Follow-up chat state
  const [followUpMessages, setFollowUpMessages] = useState<ChatMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpRoundsUsed, setFollowUpRoundsUsed] = useState(0);

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

    // Prevent submitting the same content twice
    if (content.trim() === lastSubmittedContent) {
      toast({ 
        variant: "destructive", 
        title: "No changes detected", 
        description: "Please make changes to your outline before requesting new feedback." 
      });
      return;
    }

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

      // Get AI feedback (streaming)
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are a concise academic writing tutor. Provide brief feedback (3-4 sentences max) on this student's outline.

FOCUS ONLY ON: Does the student accurately cover all the key points from the source text? Are the main ideas identified correctly?

Do NOT evaluate: writing style, grammar, sentence structure, or how ideas are organized/progressed.

Task: ${title}
Instructions: ${instructions}

Student's response:
${content}

Provide constructive, specific feedback on key point coverage and accuracy only.`,
            },
          ],
          studentId,
          meta: { taskKey, type: "writing-feedback" },
        }),
      });

      if (!resp.ok) {
        let msg = `AI request failed (${resp.status})`;
        try {
          const j = await resp.json();
          msg = j?.error || msg;
        } catch {
          const t = await resp.text();
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      if (!resp.body) {
        throw new Error("AI stream unavailable");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let feedback = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":" ) || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.choices?.[0]?.delta?.content as string | undefined;
            if (delta) feedback += delta;
          } catch {
            // JSON can be split across chunks; put it back and wait for more data
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":" ) || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.choices?.[0]?.delta?.content as string | undefined;
            if (delta) feedback += delta;
          } catch {
            // ignore
          }
        }
      }

      feedback = feedback.trim();
      if (!feedback) {
        throw new Error("No AI feedback returned");
      }

      setAiFeedback(feedback);
      setLastSubmittedContent(content.trim());
      // Reset follow-up chat for new feedback
      setFollowUpMessages([]);
      setFollowUpRoundsUsed(0);

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
  }, [studentId, taskKey, content, currentVersion, title, instructions, lastSubmittedContent, toast]);

  // Follow-up chat handler
  const handleFollowUpSubmit = useCallback(async () => {
    if (!followUpInput.trim() || !aiFeedback || followUpRoundsUsed >= MAX_FOLLOWUP_ROUNDS) return;

    const userMessage: ChatMessage = { role: "user", content: followUpInput.trim() };
    setFollowUpMessages(prev => [...prev, userMessage]);
    setFollowUpInput("");
    setIsFollowUpLoading(true);

    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

      // Build conversation history
      const conversationHistory = [
        {
          role: "system" as const,
          content: `You are a helpful academic writing tutor. The student submitted an outline and received feedback. Now they have a follow-up question. Keep responses brief (2-3 sentences). Focus only on key point coverage and accuracy, not writing style or progression.`
        },
        {
          role: "user" as const,
          content: `Student's outline:\n${content}\n\nInitial feedback:\n${aiFeedback}`
        },
        ...followUpMessages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: followUpInput.trim() }
      ];

      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          studentId,
          meta: { taskKey, type: "writing-followup" },
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let response = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.choices?.[0]?.delta?.content as string | undefined;
            if (delta) response += delta;
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      response = response.trim();
      if (response) {
        setFollowUpMessages(prev => [...prev, { role: "assistant", content: response }]);
        setFollowUpRoundsUsed(prev => prev + 1);
      }
    } catch (err) {
      console.error("Follow-up error:", err);
      toast({ variant: "destructive", title: "Failed to get response" });
    } finally {
      setIsFollowUpLoading(false);
    }
  }, [followUpInput, aiFeedback, followUpMessages, followUpRoundsUsed, content, studentId, taskKey, toast]);

  const handleStartOver = useCallback(() => {
    // Increment version to start a new draft while keeping history
    const newVersion = currentVersion + 1;
    setCurrentVersion(newVersion);
    setContent("");
    setSavedContent("");
    setAiFeedback(null);
    setLastSubmittedContent("");
    setFollowUpMessages([]);
    setFollowUpRoundsUsed(0);
    setSaveStatus("idle");
    toast({ title: "New draft started", description: `Version ${newVersion}` });
  }, [currentVersion, toast]);

  const handleLoadDraft = useCallback((draft: WritingDraft) => {
    setContent(draft.content);
    setSavedContent(draft.content);
    setAiFeedback(draft.ai_feedback);
    setCurrentVersion(draft.version);
    setLastSubmittedContent(draft.is_submitted ? draft.content : "");
    setFollowUpMessages([]);
    setFollowUpRoundsUsed(0);
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
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-3">
          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Feedback
          </p>
          <p className="text-sm text-muted-foreground">{aiFeedback}</p>
          
          {/* Follow-up chat messages */}
          {followUpMessages.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-blue-500/20">
              {followUpMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "text-sm p-2 rounded",
                    msg.role === "user" 
                      ? "bg-purple-500/10 ml-4" 
                      : "bg-blue-500/5"
                  )}
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {msg.role === "user" ? "You:" : "AI:"}
                  </span>
                  <p className="mt-1">{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Follow-up input */}
          {followUpRoundsUsed < MAX_FOLLOWUP_ROUNDS ? (
            <div className="flex gap-2 pt-2 border-t border-blue-500/20">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-3 py-1.5 text-sm rounded border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                onKeyDown={(e) => e.key === "Enter" && !isFollowUpLoading && handleFollowUpSubmit()}
                disabled={isFollowUpLoading}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleFollowUpSubmit}
                disabled={isFollowUpLoading || !followUpInput.trim()}
              >
                {isFollowUpLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Ask"
                )}
              </Button>
              <span className="text-xs text-muted-foreground self-center">
                {MAX_FOLLOWUP_ROUNDS - followUpRoundsUsed} left
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground pt-2 border-t border-blue-500/20">
              Follow-up limit reached ({MAX_FOLLOWUP_ROUNDS} rounds). Start a new draft for more feedback.
            </p>
          )}

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
              disabled={isSubmitting || !content.trim() || content.trim() === lastSubmittedContent}
              className="gap-1"
              title={content.trim() === lastSubmittedContent ? "Make changes before requesting new feedback" : ""}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Getting Feedback...
                </>
              ) : content.trim() === lastSubmittedContent && lastSubmittedContent ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Feedback Received
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
