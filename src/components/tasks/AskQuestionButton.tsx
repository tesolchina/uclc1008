import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { HelpCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AskQuestionButtonProps {
  weekNumber: number;
  hourNumber?: number;
  studentId?: string;
  context?: string;
}

export function AskQuestionButton({
  weekNumber,
  hourNumber,
  studentId,
  context,
}: AskQuestionButtonProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("student_questions").insert({
        student_id: studentId || localStorage.getItem("student_id") || "anonymous",
        week_number: weekNumber,
        hour_number: hourNumber,
        question: question.trim(),
        context: context,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Question submitted! Your teacher will respond soon.");
      
      setTimeout(() => {
        setOpen(false);
        setQuestion("");
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting question:", err);
      toast.error("Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Ask Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ask Your Teacher</DialogTitle>
        </DialogHeader>
        
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-medium">Question Submitted!</p>
            <p className="text-sm text-muted-foreground">
              Your teacher will respond as soon as possible.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="text-xs text-muted-foreground">
                Week {weekNumber}{hourNumber ? `, Hour ${hourNumber}` : ""}
              </div>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask? Be specific about what you're confused about..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Your question will be visible to your teacher. They'll respond during or after class.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!question.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Submit Question
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}