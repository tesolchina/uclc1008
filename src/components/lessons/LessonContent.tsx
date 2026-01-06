import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Lightbulb, PenLine, MessageSquare, BookOpen, Bot, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface FillBlankQuestion {
  id: string;
  sentence: string;
  blanks: { position: number; answer: string }[];
}

interface OpenEndedQuestion {
  id: string;
  question: string;
  hints?: string[];
}

interface LessonContentProps {
  lessonId: string;
  notes: string[];
  keyConcepts: string[];
  mcQuestions: MCQuestion[];
  fillBlankQuestions: FillBlankQuestion[];
  openEndedQuestions: OpenEndedQuestion[];
  savedProgress?: {
    mcAnswers: Record<string, number>;
    fillBlankAnswers: Record<string, string[]>;
    openEndedResponses: { questionId: string; response: string; feedback?: string }[];
    reflection: string;
  };
  onSaveProgress: (progress: any) => void;
}

export function LessonContent({
  lessonId,
  notes,
  keyConcepts,
  mcQuestions,
  fillBlankQuestions,
  openEndedQuestions,
  savedProgress,
  onSaveProgress,
}: LessonContentProps) {
  const { toast } = useToast();
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>(savedProgress?.mcAnswers || {});
  const [mcFeedback, setMcFeedback] = useState<Record<string, boolean>>({});
  const [fillBlankAnswers, setFillBlankAnswers] = useState<Record<string, string[]>>(savedProgress?.fillBlankAnswers || {});
  const [openEndedResponses, setOpenEndedResponses] = useState<{ questionId: string; response: string; feedback?: string }[]>(
    savedProgress?.openEndedResponses || []
  );
  const [reflection, setReflection] = useState(savedProgress?.reflection || '');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const handleMCAnswer = (questionId: string, answerIndex: number) => {
    setMcAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    const question = mcQuestions.find(q => q.id === questionId);
    if (question) {
      setMcFeedback(prev => ({ ...prev, [questionId]: answerIndex === question.correctIndex }));
    }
  };

  const handleFillBlankChange = (questionId: string, blankIndex: number, value: string) => {
    setFillBlankAnswers(prev => {
      const current = prev[questionId] || [];
      const updated = [...current];
      updated[blankIndex] = value;
      return { ...prev, [questionId]: updated };
    });
  };

  const handleOpenEndedChange = (questionId: string, response: string) => {
    setOpenEndedResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, response } : r);
      }
      return [...prev, { questionId, response }];
    });
  };

  const getAIFeedback = async (questionId: string) => {
    const response = openEndedResponses.find(r => r.questionId === questionId);
    if (!response?.response) {
      toast({ title: 'Please write your response first', variant: 'destructive' });
      return;
    }

    setLoadingAI(questionId);
    try {
      // TODO: Integrate with AI feedback endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const feedback = "Great attempt! Consider expanding on your analysis by connecting the concept to specific examples from the reading. Think about how this applies to real-world academic writing scenarios.";
      
      setOpenEndedResponses(prev => 
        prev.map(r => r.questionId === questionId ? { ...r, feedback } : r)
      );
      
      toast({ title: 'AI feedback received!' });
    } catch (error) {
      toast({ title: 'Failed to get AI feedback', variant: 'destructive' });
    } finally {
      setLoadingAI(null);
    }
  };

  const saveAllProgress = () => {
    onSaveProgress({
      mcAnswers,
      fillBlankAnswers,
      openEndedResponses,
      reflection,
    });
    toast({ title: 'Progress saved!' });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Notes & Key Concepts */}
      <Accordion type="single" collapsible defaultValue="notes" className="space-y-2">
        <AccordionItem value="notes" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">Issues & Key Concepts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Key Points to Consider</h4>
                <ul className="space-y-2">
                  {notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Key Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {keyConcepts.map((concept, i) => (
                    <Badge key={i} variant="secondary">{concept}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: MC & Fill in Blank */}
        <AccordionItem value="practice" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">Practice Questions</span>
              {Object.keys(mcAnswers).length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {Object.values(mcFeedback).filter(Boolean).length}/{mcQuestions.length} correct
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              {/* Multiple Choice */}
              {mcQuestions.map((q, qIndex) => (
                <Card key={q.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {qIndex + 1}. {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={mcAnswers[q.id]?.toString()}
                      onValueChange={(value) => handleMCAnswer(q.id, parseInt(value))}
                    >
                      {q.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                          <Label 
                            htmlFor={`${q.id}-${i}`} 
                            className={`text-sm cursor-pointer ${
                              mcFeedback[q.id] !== undefined && i === q.correctIndex
                                ? 'text-green-600 font-medium'
                                : mcFeedback[q.id] === false && mcAnswers[q.id] === i
                                ? 'text-red-600'
                                : ''
                            }`}
                          >
                            {option}
                          </Label>
                          {mcFeedback[q.id] !== undefined && i === q.correctIndex && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {mcFeedback[q.id] === false && mcAnswers[q.id] === i && (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                    {mcFeedback[q.id] !== undefined && (
                      <p className={`mt-3 text-xs p-2 rounded ${mcFeedback[q.id] ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {mcFeedback[q.id] ? '✓ Correct!' : `✗ Incorrect. ${q.explanation}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Fill in the Blank */}
              {fillBlankQuestions.map((q, qIndex) => (
                <Card key={q.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Fill in the Blanks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      {q.sentence.split('____').map((part, i) => (
                        <span key={i}>
                          {part}
                          {i < q.blanks.length && (
                            <Input
                              className="inline-block w-32 mx-1 h-7 text-sm"
                              value={fillBlankAnswers[q.id]?.[i] || ''}
                              onChange={(e) => handleFillBlankChange(q.id, i, e.target.value)}
                              placeholder={`Blank ${i + 1}`}
                            />
                          )}
                        </span>
                      ))}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Open-ended with AI Feedback */}
        <AccordionItem value="open-ended" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-green-500" />
              <span className="font-semibold">Open-Ended Tasks (AI Feedback)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              {openEndedQuestions.map((q, qIndex) => {
                const response = openEndedResponses.find(r => r.questionId === q.id);
                return (
                  <Card key={q.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {qIndex + 1}. {q.question}
                      </CardTitle>
                      {q.hints && q.hints.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          💡 Hints: {q.hints.join(' • ')}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder="Write your response here..."
                        value={response?.response || ''}
                        onChange={(e) => handleOpenEndedChange(q.id, e.target.value)}
                        className="min-h-24"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => getAIFeedback(q.id)}
                          disabled={loadingAI === q.id}
                        >
                          {loadingAI === q.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-1" />
                          )}
                          Get AI Feedback
                        </Button>
                      </div>
                      {response?.feedback && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            AI Feedback
                          </p>
                          <p className="text-sm text-green-800 dark:text-green-300">{response.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Reflection */}
        <AccordionItem value="reflection" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">Reflection Notes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Take a moment to reflect on what you've learned. What are the key takeaways? What questions do you still have?
              </p>
              <Textarea
                placeholder="Write your reflections here..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-32"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Save Progress Button */}
      <div className="flex justify-end">
        <Button onClick={saveAllProgress}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Save Progress
        </Button>
      </div>
    </div>
  );
}