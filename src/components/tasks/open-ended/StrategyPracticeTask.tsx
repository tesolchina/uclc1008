import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PARAPHRASING_STRATEGIES = [
  {
    id: "synonyms",
    label: "Synonym Replacement",
    description: "Replace words with similar-meaning words",
    example: "introduced → implemented, various → numerous"
  },
  {
    id: "wordforms",
    label: "Word Form Changes",
    description: "Change word forms (verb → noun, adjective → adverb)",
    example: "impacts (verb) → impact (noun)"
  },
  {
    id: "voice",
    label: "Active ↔ Passive Voice",
    description: "Switch between active and passive voice",
    example: "Researchers collected → Data was collected by researchers"
  },
  {
    id: "structure",
    label: "Sentence Structure",
    description: "Reorder, combine, or split sentences",
    example: "Because X happened, Y resulted → Y was the result of X"
  }
];

interface StrategyPracticeTaskProps {
  taskId: string;
  originalSentence: string;
  citation: string;
  onComplete?: (taskId: string) => void;
  studentId?: string;
}

export function StrategyPracticeTask({
  taskId,
  originalSentence,
  citation,
  onComplete,
  studentId
}: StrategyPracticeTaskProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [paraphrase, setParaphrase] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId)
        ? prev.filter(s => s !== strategyId)
        : [...prev, strategyId]
    );
  };

  const getSelectedStrategyLabels = () => {
    return selectedStrategies.map(id => 
      PARAPHRASING_STRATEGIES.find(s => s.id === id)?.label
    ).filter(Boolean).join(", ");
  };

  const handleSubmit = async () => {
    if (!paraphrase.trim()) return;
    if (selectedStrategies.length === 0) {
      toast({
        title: "Select strategies first",
        description: "Please select at least one strategy you used in your paraphrase.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const strategiesUsed = getSelectedStrategyLabels();

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
              content: `You are an expert academic writing tutor assessing a student's paraphrasing practice.

ORIGINAL SENTENCE:
"${originalSentence}" (${citation})

STUDENT'S PARAPHRASE:
"${paraphrase}"

STRATEGIES THE STUDENT CLAIMS TO HAVE USED:
${strategiesUsed}

TASK: Provide focused feedback (4-6 sentences) addressing:

1. **Strategy Verification**: Did the student actually apply the strategies they selected? Be specific about what changes you observe (or don't observe) for each claimed strategy.

2. **Patchwriting Check**: Is this an acceptable paraphrase or too close to the original? If patchwriting, identify specific phrases that are too similar.

3. **Quick Tip**: Give ONE specific suggestion to improve (if needed).

Be direct and educational. If they claimed a strategy but didn't use it, point that out clearly.`
            }
          ],
          studentId: studentId || "anonymous",
          meta: { taskId, type: "strategy-practice" }
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
            paraphrase,
            selectedStrategies,
            strategiesUsed
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
      {/* Original sentence */}
      <div className="p-3 rounded-lg bg-muted/50 border text-sm">
        <p className="font-medium text-xs text-muted-foreground mb-1">Original:</p>
        <p className="italic">"{originalSentence}" ({citation})</p>
      </div>

      {/* Strategy Selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Step 1: Select the strategies you will use
        </p>
        <p className="text-xs text-muted-foreground">
          Choose at least 2 strategies before writing your paraphrase.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PARAPHRASING_STRATEGIES.map((strategy) => (
            <label
              key={strategy.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedStrategies.includes(strategy.id)
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-background hover:bg-muted/50"
              }`}
            >
              <Checkbox
                checked={selectedStrategies.includes(strategy.id)}
                onCheckedChange={() => handleStrategyToggle(strategy.id)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{strategy.label}</p>
                <p className="text-xs text-muted-foreground">{strategy.description}</p>
              </div>
            </label>
          ))}
        </div>
        {selectedStrategies.length > 0 && (
          <p className="text-xs text-green-600 font-medium">
            ✓ Selected: {getSelectedStrategyLabels()}
          </p>
        )}
      </div>

      {/* Writing Area */}
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green-600" />
          Step 2: Write your paraphrase
        </p>
        <Textarea
          value={paraphrase}
          onChange={(e) => setParaphrase(e.target.value)}
          placeholder="Write your paraphrase here using the strategies you selected. Don't forget to include a citation!"
          className="min-h-[120px]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic">
          {selectedStrategies.length < 2 && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Select at least 2 strategies
            </span>
          )}
        </p>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!paraphrase.trim() || selectedStrategies.length === 0 || isLoading}
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
