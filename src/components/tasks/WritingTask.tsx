import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send, RotateCcw, Lightbulb, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface WritingTaskProps {
  id: string;
  type: "short-answer" | "sentence" | "paragraph";
  question: string;
  context?: string;
  wordLimit?: number;
  hints?: string[];
  modelAnswer?: string;
  rubricCriteria?: string[];
  onComplete?: (response: string, feedback: string) => void;
}

export function WritingTask({
  id,
  type,
  question,
  context,
  wordLimit = 100,
  hints,
  modelAnswer,
  rubricCriteria,
  onComplete,
}: WritingTaskProps) {
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  const handleGetFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are an academic writing tutor for university students preparing for an Academic Writing Quiz (AWQ). 
Provide constructive feedback on student writing. Be encouraging but specific about improvements.
Focus on: ${rubricCriteria?.join(", ") || "clarity, accuracy, academic tone, proper citation"}
Keep feedback concise (under 100 words) and actionable.`
            },
            {
              role: "user",
              content: `Task: ${question}
${context ? `Context: ${context}` : ""}
Word limit: ${wordLimit} words

Student's response:
"${response}"

Please provide feedback on this response.`
            }
          ]
        }
      });

      if (error) throw error;
      
      const feedbackText = data?.response || data?.message || "Feedback unavailable. Please try again.";
      setFeedback(feedbackText);
      setSubmitted(true);
      onComplete?.(response, feedbackText);
    } catch (err) {
      console.error("Error getting feedback:", err);
      setFeedback("Unable to get AI feedback at this time. Please check your response against the model answer.");
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResponse("");
    setFeedback("");
    setSubmitted(false);
    setShowModel(false);
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Question */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="font-medium text-sm">{question}</p>
            <p className="text-xs text-muted-foreground">
              {type === "paragraph" ? "Paragraph" : type === "sentence" ? "1-2 sentences" : "Short answer"} 
              {" • "}Word limit: {wordLimit}
            </p>
          </div>
          {hints && hints.length > 0 && !submitted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="shrink-0 h-7 px-2 text-xs"
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Hint
            </Button>
          )}
        </div>
        {context && (
          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{context}</p>
        )}
        {showHint && hints && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 space-y-1">
            {hints.map((hint, idx) => (
              <p key={idx}>💡 {hint}</p>
            ))}
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          disabled={submitted}
          placeholder={type === "paragraph" 
            ? "Write your paragraph here..." 
            : type === "sentence" 
            ? "Write your sentence(s) here..." 
            : "Type your answer..."}
          className={cn(
            "min-h-[100px] resize-none",
            type === "paragraph" && "min-h-[150px]"
          )}
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className={cn(
            wordCount > wordLimit && "text-destructive font-medium"
          )}>
            {wordCount} / {wordLimit} words
          </span>
          {rubricCriteria && (
            <span className="hidden sm:block">
              Criteria: {rubricCriteria.slice(0, 2).join(", ")}
              {rubricCriteria.length > 2 && "..."}
            </span>
          )}
        </div>
      </div>

      {/* AI Feedback */}
      {submitted && feedback && (
        <div className="p-3 rounded-md bg-primary/5 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">AI Feedback</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{feedback}</p>
        </div>
      )}

      {/* Model Answer */}
      {submitted && modelAnswer && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModel(!showModel)}
            className="text-xs h-7"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {showModel ? "Hide" : "Show"} Model Answer
          </Button>
          {showModel && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm">
              <p className="font-medium text-green-800 mb-1">Model Answer:</p>
              <p className="text-green-700">{modelAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!submitted ? (
          <Button
            onClick={handleGetFeedback}
            disabled={!response.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Getting Feedback...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                Get AI Feedback
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}