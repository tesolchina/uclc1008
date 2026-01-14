import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load saved notes - reset state first when studentId changes
  useEffect(() => {
    // Reset state when studentId changes
    setNotes("");
    setSavedNotes("");
    setSaveStatus("idle");
    
    if (!studentId) return;

    const loadNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("paragraph_notes")
          .select("notes")
          .eq("student_id", studentId)
          .eq("paragraph_key", paragraphKey)
          .maybeSingle();

        if (error) {
          console.error("Error loading paragraph notes:", error);
          return;
        }

        if (data?.notes) {
          setNotes(data.notes);
          setSavedNotes(data.notes);
          setSaveStatus("saved");
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    loadNotes();
  }, [studentId, paragraphKey]);

  // Autosave notes when they change
  useEffect(() => {
    if (!studentId || notes === savedNotes) return;
    
    if (notes.trim() === "") {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      handleSave();
    }, 1500);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [notes, savedNotes, studentId]);

  const handleSave = useCallback(async () => {
    if (!studentId || !notes.trim()) return;

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
      setSaveStatus("idle");
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
            <p className="font-bold text-purple-700 text-xs flex items-center gap-2">
              Paragraph {paragraphNumber}
              {hasNotes && !isOpen && (
                <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-normal">
                  <CheckCircle2 className="h-3 w-3" />
                  Notes saved
                </span>
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
            {studentId ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Saved automatically
                  </>
                )}
                {saveStatus === "idle" && notes.trim() === "" && "Notes save automatically"}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Sign in to save notes</p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
