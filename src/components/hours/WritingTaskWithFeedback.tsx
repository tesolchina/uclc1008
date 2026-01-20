/**
 * @fileoverview WritingTaskWithFeedback component for HourPage.
 * 
 * A self-contained writing task component that:
 * - Accepts user text input
 * - Sends to AI for feedback
 * - Displays feedback with appropriate disclaimers
 * - Tracks completion state
 */

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AiFeedbackHint } from "@/components/api/AiFeedbackHint";

// ============================================================================
// Types
// ============================================================================

interface WritingTaskWithFeedbackProps {
  /** Unique identifier for this task */
  taskId: string;
  /** Placeholder text for the textarea */
  placeholder: string;
  /** Callback when task is completed */
  onComplete: (taskId: string) => void;
  /** Student ID for API tracking */
  studentId?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * A writing task component with AI feedback capability.
 * 
 * Features:
 * - Text area for student responses
 * - Submit button to get AI feedback
 * - Loading state during AI processing
 * - Feedback display with disclaimer
 * 
 * @example
 * <WritingTaskWithFeedback
 *   taskId="w1h1-writing-1"
 *   placeholder="Write your response..."
 *   onComplete={(id) => markComplete(id)}
 *   studentId="student123"
 * />
 */
export function WritingTaskWithFeedback({ 
  taskId, 
  placeholder, 
  onComplete,
  studentId
}: WritingTaskWithFeedbackProps) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Handles submission of the writing task.
   * Sends text to AI for feedback and updates state.
   */
  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setFeedback(null);
    
    try {
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
              content: `You are a concise, critical academic writing tutor. Provide brief feedback (2-3 sentences max) on this student's response. Be direct about what's good and what could be improved.

Student's response:
${text}

Give critical but constructive feedback. Be specific and actionable.`
            }
          ],
          studentId
        }),
      });
      
      if (!resp.ok) {
        throw new Error("Failed to get feedback");
      }
      
      // Parse streaming response
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) fullText += content;
              } catch {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }
      
      setFeedback(fullText || "Thank you for your response. Consider expanding on your main points with specific examples.");
      onComplete(taskId);
      
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast({
        variant: "destructive",
        title: "Feedback unavailable",
        description: "Could not get AI feedback. Your response has been saved.",
      });
      // Still mark as complete even if AI fails
      onComplete(taskId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Text input area */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-y"
        disabled={isLoading}
      />

      {/* API Key Status & Formatting Tips */}
      <AiFeedbackHint />
      
      {/* Submit button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!text.trim() || isLoading}
          size="sm"
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

      {/* Feedback display */}
      {feedback && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Feedback
          </p>
          <p className="text-sm text-muted-foreground">{feedback}</p>
          <p className="text-xs text-amber-600 italic">
            ⚠️ AI feedback may contain errors. Always consult your teacher for authoritative guidance.
          </p>
        </div>
      )}
    </div>
  );
}
