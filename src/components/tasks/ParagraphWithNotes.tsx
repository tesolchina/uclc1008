import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Save, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ParagraphWithNotesProps {
  paragraphNumber: number;
  paragraphKey: string; // e.g., "w1h1-p1"
  content: string;
  studentId?: string;
  className?: string;
}

export function ParagraphWithNotes({
  paragraphNumber,
  paragraphKey,
  content,
  studentId,
  className,
}: ParagraphWithNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "unsaved">("idle");

  // Load saved notes
  useEffect(() => {
    if (!studentId) return;

    const loadNotes = async () => {
      const { data } = await supabase
        .from("paragraph_notes")
        .select("notes")
        .eq("student_id", studentId)
        .eq("paragraph_key", paragraphKey)
        .maybeSingle();

      if (data?.notes) {
        setNotes(data.notes);
        setSavedNotes(data.notes);
        setSaveStatus("saved");
      }
    };

    loadNotes();
  }, [studentId, paragraphKey]);

  // Track unsaved changes
  useEffect(() => {
    if (notes === savedNotes && savedNotes !== "") {
      setSaveStatus("saved");
    } else if (notes !== savedNotes && notes !== "") {
      setSaveStatus("unsaved");
    }
  }, [notes, savedNotes]);

  const handleSave = useCallback(async () => {
    if (!studentId || !notes.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("paragraph_notes")
        .upsert(
          {
            student_id: studentId,
            paragraph_key: paragraphKey,
            notes: notes.trim(),
          },
          { onConflict: "student_id,paragraph_key" }
        );

      if (!error) {
        setSavedNotes(notes.trim());
        setSaveStatus("saved");
      }
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setIsSaving(false);
    }
  }, [studentId, paragraphKey, notes]);

  const hasNotes = notes.trim().length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div
          className={cn(
            "p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 cursor-pointer hover:bg-purple-500/10 transition-colors",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-purple-600 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-purple-600 shrink-0" />
            )}
            <p className="font-bold text-purple-700 text-xs">
              Paragraph {paragraphNumber}
              {hasNotes && !isOpen && (
                <span className="ml-2 text-muted-foreground font-normal">(has notes)</span>
              )}
            </p>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-3 pl-4 border-l-2 border-purple-500/30">
        {/* Paragraph content */}
        <div className="p-3 rounded-lg bg-background border text-sm text-muted-foreground leading-relaxed">
          {content}
        </div>

        {/* Notes section */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-purple-700">Your Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes for this paragraph..."
            className="w-full min-h-[80px] p-2 rounded-lg border bg-background text-sm resize-y placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {!studentId && "Sign in to save notes"}
            </p>
            {studentId && (
              <Button
                size="sm"
                variant={saveStatus === "saved" ? "outline" : "default"}
                onClick={handleSave}
                disabled={isSaving || !notes.trim() || saveStatus === "saved"}
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
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
