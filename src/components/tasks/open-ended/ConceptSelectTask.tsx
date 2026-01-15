import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ConceptOption {
  id: string;
  label: string;
  description: string;
  example?: string;
}

interface ConceptSelectTaskProps {
  taskId: string;
  /** Title for the concept selection step */
  selectionTitle?: string;
  /** Description for concept selection */
  selectionDescription?: string;
  /** Available concepts/strategies to choose from */
  concepts: ConceptOption[];
  /** Minimum number of concepts to select (default: 1) */
  minSelection?: number;
  /** Optional context text (e.g., original sentence for paraphrasing) */
  contextText?: string;
  /** Label for context text (e.g., "Original:") */
  contextLabel?: string;
  /** Title for the writing step */
  writingTitle?: string;
  /** Placeholder for textarea */
  placeholder?: string;
  /** Custom AI prompt - use {concepts}, {response}, {context} as placeholders */
  aiPrompt?: string;
  /** Task type for metadata */
  taskType?: string;
  onComplete?: (taskId: string) => void;
  studentId?: string;
}

const DEFAULT_PROMPT = `You are an expert academic writing tutor. A student has completed a writing task.

CONTEXT:
{context}

STUDENT'S RESPONSE:
{response}

CONCEPTS/STRATEGIES THE STUDENT CLAIMS TO HAVE APPLIED:
{concepts}

TASK: Provide focused feedback (4-6 sentences) addressing:
1. Did the student actually demonstrate the concepts/strategies they selected? Be specific.
2. What was done well?
3. One specific suggestion for improvement.

Be direct and educational.`;

export function ConceptSelectTask({
  taskId,
  selectionTitle = "Select the concepts you will apply",
  selectionDescription = "Choose the relevant options before writing your response.",
  concepts,
  minSelection = 1,
  contextText,
  contextLabel = "Context:",
  writingTitle = "Write your response",
  placeholder = "Write your response here...",
  aiPrompt = DEFAULT_PROMPT,
  taskType = "concept-select",
  onComplete,
  studentId
}: ConceptSelectTaskProps) {
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConceptToggle = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId)
        ? prev.filter(c => c !== conceptId)
        : [...prev, conceptId]
    );
  };

  const getSelectedConceptLabels = () => {
    return selectedConcepts.map(id => 
      concepts.find(c => c.id === id)?.label
    ).filter(Boolean).join(", ");
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;
    if (selectedConcepts.length < minSelection) {
      toast({
        title: `Select at least ${minSelection} option(s)`,
        description: "Please select the relevant concepts before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const conceptsUsed = getSelectedConceptLabels();

      // Build prompt with replacements
      const prompt = aiPrompt
        .replace("{context}", contextText || "N/A")
        .replace("{response}", response)
        .replace("{concepts}", conceptsUsed);

      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          studentId: studentId || "anonymous",
          meta: { taskId, type: taskType }
        }),
      });

      if (!resp.ok) {
        throw new Error(`AI request failed (${resp.status})`);
      }

      if (!resp.body) {
        throw new Error("AI stream unavailable");
      }

      // Stream the response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
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
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setFeedback(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save to database
      if (studentId && fullText) {
        await supabase.from("student_task_responses").insert({
          student_id: studentId,
          question_key: taskId,
          response: JSON.stringify({
            text: response,
            selectedConcepts,
            conceptsUsed
          }),
          ai_feedback: fullText,
          is_correct: null,
        });
      }

      onComplete?.(taskId);
    } catch (err) {
      console.error("AI feedback error:", err);
      toast({
        title: "Feedback unavailable",
        description: "Could not get AI feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Context Text (if provided) */}
      {contextText && (
        <div className="p-3 rounded-lg bg-muted/50 border text-sm">
          <p className="font-medium text-xs text-muted-foreground mb-1">{contextLabel}</p>
          <p className="italic">{contextText}</p>
        </div>
      )}

      {/* Concept Selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          {selectionTitle}
        </p>
        <p className="text-xs text-muted-foreground">{selectionDescription}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {concepts.map((concept) => (
            <label
              key={concept.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedConcepts.includes(concept.id)
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-background hover:bg-muted/50"
              }`}
            >
              <Checkbox
                checked={selectedConcepts.includes(concept.id)}
                onCheckedChange={() => handleConceptToggle(concept.id)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{concept.label}</p>
                <p className="text-xs text-muted-foreground">{concept.description}</p>
                {concept.example && (
                  <p className="text-xs text-muted-foreground/70 italic">e.g., {concept.example}</p>
                )}
              </div>
            </label>
          ))}
        </div>
        {selectedConcepts.length > 0 && (
          <p className="text-xs text-green-600 font-medium">
            ✓ Selected: {getSelectedConceptLabels()}
          </p>
        )}
      </div>

      {/* Writing Area */}
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green-600" />
          {writingTitle}
        </p>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic">
          {selectedConcepts.length < minSelection && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Select at least {minSelection} option(s)
            </span>
          )}
        </p>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!response.trim() || selectedConcepts.length < minSelection || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Getting Feedback...
            </>
          ) : (
            "Submit for Feedback"
          )}
        </Button>
      </div>

      {/* AI Feedback */}
      {feedback && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Feedback
          </p>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {feedback}
          </div>
          <p className="text-xs text-amber-600 italic">
            ⚠️ AI feedback may contain errors. Always consult your teacher for authoritative guidance.
          </p>
        </div>
      )}
    </div>
  );
}
