import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface MCOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface MCQuestion {
  id: string;
  category: string;
  question: string;
  context?: string;
  options: MCOption[];
  insight: string;
}

const mcQuestions: MCQuestion[] = [
  {
    id: "mc1",
    category: "Summary Accuracy",
    question: "Which of the following is a problem in this summary excerpt?",
    context: `"FRT is clearly beneficial for schools as it can reduce school shooting incidents and save teachers' time."`,
    options: [
      { id: "a", text: "Missing citation", isCorrect: false, feedback: "While citations are important, there's a bigger issue here." },
      { id: "b", text: "Adding personal opinion ('clearly beneficial')", isCorrect: true, feedback: "Correct! The source doesn't claim FRT is 'beneficial' - it describes how it's marketed and used. This is your evaluation, not a summary." },
      { id: "c", text: "Grammar error", isCorrect: false, feedback: "The grammar is fine here." },
      { id: "d", text: "Too short", isCorrect: false, feedback: "Length isn't the main issue with this excerpt." }
    ],
    insight: "A summary should only report what the source says, not evaluate or judge it. Remove words like 'beneficial', 'good', 'bad', 'should', or 'clearly'."
  },
  {
    id: "mc2",
    category: "Paraphrasing",
    question: "Which paraphrase best demonstrates effective rewording?",
    context: `Original: "Facial recognition systems have now been sold to thousands of US schools."`,
    options: [
      { id: "a", text: `"Facial recognition systems have now been sold to thousands of US school."`, isCorrect: false, feedback: "This is direct copying with only one word changed (and creates a grammar error)." },
      { id: "b", text: `"Face recognition systems have been marketed to thousands of American schools."`, isCorrect: false, feedback: "This is patchwriting - only a few words changed while keeping the same structure." },
      { id: "c", text: `"Thousands of American educational institutions have purchased technology that identifies students by their faces."`, isCorrect: true, feedback: "Correct! This completely restructures the sentence, uses different vocabulary, and preserves the meaning." },
      { id: "d", text: `"In the US, thousands of schools have bought facial recognition systems."`, isCorrect: false, feedback: "Better than direct copying, but still uses key phrases from the original." }
    ],
    insight: "Effective paraphrasing changes BOTH vocabulary AND sentence structure. Read, understand, look away, then write from memory."
  },
  {
    id: "mc3",
    category: "Academic Tone",
    question: "Which sentence uses appropriate academic tone?",
    options: [
      { id: "a", text: `"FRT is a really big deal in schools nowadays."`, isCorrect: false, feedback: "'Really big deal' and 'nowadays' are informal expressions." },
      { id: "b", text: `"What's more, it can also be used for attendance."`, isCorrect: false, feedback: "'What's more' is conversational. Use 'Furthermore' or 'Additionally' instead." },
      { id: "c", text: `"FRT has become increasingly significant in educational settings."`, isCorrect: true, feedback: "Correct! Formal vocabulary, clear structure, no contractions or slang." },
      { id: "d", text: `"Schools are using this tech a lot these days."`, isCorrect: false, feedback: "'Tech' is informal and 'a lot' is vague. 'These days' is also conversational." }
    ],
    insight: "Academic writing uses formal transitions (Furthermore, Additionally, Moreover), avoids contractions, and replaces vague words with precise language."
  },
  {
    id: "mc4",
    category: "In-text Citation",
    question: "Which citation format is correct in APA 7th edition?",
    options: [
      { id: "a", text: `"According to Andrejevic and Selwyn (2020), FRT is increasingly used in schools."`, isCorrect: true, feedback: "Correct! Signal phrase with 'and' between authors, year in parentheses after names." },
      { id: "b", text: `"(Andrejevic & Selwyn, 2020) FRT is increasingly used in schools."`, isCorrect: false, feedback: "Citation should come after the information, not before it." },
      { id: "c", text: `"FRT is increasingly used in schools (Andrejevic and Selwyn, 2020)."`, isCorrect: false, feedback: "In parenthetical citations, use '&' not 'and' between authors." },
      { id: "d", text: `"Mark Andrejevic and Selwyn(2020) state that FRT is used in schools."`, isCorrect: false, feedback: "Don't use first names, and add a space before the parentheses." }
    ],
    insight: "Use 'and' in signal phrases, '&' in parenthetical citations. Never use first names. Always add a space before parentheses."
  },
  {
    id: "mc5",
    category: "Summary Accuracy",
    question: "The source describes four main applications of FRT. Which application is MISSING from this list?",
    context: `"Campus security, attendance monitoring, and virtual learning integrity..."`,
    options: [
      { id: "a", text: "Student grading automation", isCorrect: false, feedback: "This is not mentioned in the source article." },
      { id: "b", text: "Engagement detection (emotion/attention monitoring)", isCorrect: true, feedback: "Correct! The fourth application is using facial detection to gauge student engagement through micro-expressions and attention levels." },
      { id: "c", text: "Teacher performance evaluation", isCorrect: false, feedback: "This is not mentioned in the source article." },
      { id: "d", text: "Cafeteria payment systems", isCorrect: false, feedback: "While this exists in some schools, it's not one of the four applications in this article." }
    ],
    insight: "The four required applications are: (1) Campus Security, (2) Attendance Monitoring, (3) Virtual Learning Integrity, and (4) Engagement Detection. Many students missed the fourth one!"
  }
];

export function InsightsMCSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowFeedback(prev => ({ ...prev, [questionId]: true }));
  };

  const getSelectedOption = (question: MCQuestion) => {
    const selectedId = answers[question.id];
    return question.options.find(o => o.id === selectedId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Test Your Understanding
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Try these questions to check your understanding of common issues and how to fix them.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {mcQuestions.map((q, idx) => {
          const selected = getSelectedOption(q);
          const isAnswered = showFeedback[q.id];

          return (
            <div key={q.id} className="space-y-3 p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{q.category}</Badge>
                <span className="text-sm font-medium">Question {idx + 1}</span>
              </div>
              
              <p className="font-medium">{q.question}</p>
              
              {q.context && (
                <div className="p-3 rounded bg-muted/50 border text-sm italic">
                  {q.context}
                </div>
              )}

              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  const showResult = isAnswered && isSelected;
                  
                  return (
                    <Button
                      key={opt.id}
                      variant={isSelected ? (opt.isCorrect ? "default" : "destructive") : "outline"}
                      className={`justify-start text-left h-auto py-3 px-4 ${
                        isAnswered && opt.isCorrect && !isSelected ? "border-primary/50 bg-primary/5" : ""
                      }`}
                      onClick={() => !isAnswered && handleSelect(q.id, opt.id)}
                      disabled={isAnswered}
                    >
                      <span className="font-medium mr-2">{opt.id.toUpperCase()}.</span>
                      <span className="flex-1">{opt.text}</span>
                      {showResult && (
                        opt.isCorrect 
                          ? <CheckCircle2 className="h-4 w-4 ml-2 shrink-0" />
                          : <XCircle className="h-4 w-4 ml-2 shrink-0" />
                      )}
                      {isAnswered && opt.isCorrect && !isSelected && (
                        <CheckCircle2 className="h-4 w-4 ml-2 text-primary shrink-0" />
                      )}
                    </Button>
                  );
                })}
              </div>

              {isAnswered && selected && (
                <div className={`p-3 rounded-lg text-sm space-y-2 ${
                  selected.isCorrect ? "bg-primary/10 border border-primary/30" : "bg-destructive/10 border border-destructive/30"
                }`}>
                  <p className={selected.isCorrect ? "text-primary" : "text-destructive"}>
                    {selected.feedback}
                  </p>
                  <p className="text-muted-foreground border-t pt-2 mt-2">
                    <span className="font-medium">💡 Key Insight:</span> {q.insight}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
