import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Radio, LogOut, Users, BookOpen, CheckCircle2, 
  Send, ChevronRight, AlertCircle, Clock, MessageSquare, X
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SessionWaitingRoom, getAnonymousAnimal } from './SessionWaitingRoom';
import { LiveSession, SessionResponse, SessionPrompt, SessionParticipant } from '@/hooks/useLiveSession';

interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface OpenEndedQuestion {
  id: string;
  question: string;
  hints?: string[];
}

interface SessionCanvasProps {
  session: LiveSession;
  participant: SessionParticipant | null;
  participants: SessionParticipant[];
  myDisplayName?: string;
  mcQuestions: MCQuestion[];
  openEndedQuestions: OpenEndedQuestion[];
  notes: string[];
  keyConcepts: string[];
  onSubmitResponse: (questionType: string, questionIndex: number, response: Record<string, unknown>, isCorrect?: boolean) => void;
  existingResponses: SessionResponse[];
  latestPrompt: SessionPrompt | null;
  onDismissPrompt: () => void;
  onLeave: () => void;
}

export function SessionCanvas({
  session,
  participant,
  participants,
  myDisplayName,
  mcQuestions,
  openEndedQuestions,
  notes,
  keyConcepts,
  onSubmitResponse,
  existingResponses,
  latestPrompt,
  onDismissPrompt,
  onLeave,
}: SessionCanvasProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPromptAlert, setShowPromptAlert] = useState(false);

  const currentType = session.current_section || 'notes';
  const currentIndex = session.current_question_index || 0;
  const isWaitingOrPaused = session.status === 'waiting' || session.status === 'paused';

  // Get other participant IDs for waiting room
  const otherParticipantIds = participants
    .filter(p => p.id !== participant?.id)
    .map(p => p.id);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTextResponse('');
    setSubmitted(false);

    // Load existing response if any
    const questionTypeForDb = currentType === 'writing' ? 'open_ended' : currentType;
    const existingResponse = existingResponses.find(
      r => r.question_type === questionTypeForDb && r.question_index === currentIndex
    );
    if (existingResponse) {
      setSubmitted(true);
      if (currentType === 'mc' && existingResponse.response) {
        const answer = (existingResponse.response as { answer?: number }).answer;
        if (typeof answer === 'number') setSelectedAnswer(answer);
      } else if (currentType === 'writing' && existingResponse.response) {
        const text = (existingResponse.response as { text?: string }).text;
        if (text) setTextResponse(text);
      }
    }
  }, [currentType, currentIndex, existingResponses]);

  // Handle prompt alerts
  useEffect(() => {
    if (latestPrompt) {
      setShowPromptAlert(true);
      if (latestPrompt.prompt_type !== 'focus') {
        const timer = setTimeout(() => {
          setShowPromptAlert(false);
          onDismissPrompt();
        }, 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestPrompt, onDismissPrompt]);

  // Calculate progress
  const totalPages = 1 + mcQuestions.length + openEndedQuestions.length;
  let currentPage = 1;
  if (currentType === 'notes') currentPage = 1;
  else if (currentType === 'mc') currentPage = 2 + currentIndex;
  else if (currentType === 'writing') currentPage = 2 + mcQuestions.length + currentIndex;
  const progressPercent = (currentPage / totalPages) * 100;

  // Show waiting room if session hasn't started or is paused
  if (isWaitingOrPaused) {
    return (
      <>
        {/* Prompt Alert */}
        {showPromptAlert && latestPrompt && (
          <PromptAlert prompt={latestPrompt} onDismiss={() => { setShowPromptAlert(false); onDismissPrompt(); }} />
        )}
        <SessionWaitingRoom
          sessionCode={session.session_code}
          sessionStatus={session.status}
          participantCount={participants.length}
          myDisplayName={myDisplayName}
          otherParticipantIds={otherParticipantIds}
          onLeave={onLeave}
        />
      </>
    );
  }

  const handleMCSubmit = () => {
    if (selectedAnswer === null) return;
    const question = mcQuestions[currentIndex];
    const isCorrect = selectedAnswer === question?.correctIndex;
    onSubmitResponse('mc', currentIndex, { answer: selectedAnswer }, isCorrect);
    setSubmitted(true);
  };

  const handleWritingSubmit = () => {
    if (!textResponse.trim()) return;
    onSubmitResponse('open_ended', currentIndex, { text: textResponse });
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      {/* Prompt Alert */}
      {showPromptAlert && latestPrompt && (
        <PromptAlert prompt={latestPrompt} onDismiss={() => { setShowPromptAlert(false); onDismissPrompt(); }} />
      )}

      {/* Main Canvas Card */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        {/* Header Bar */}
        <CardHeader className="py-3 px-4 bg-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-medium text-sm">Live</span>
              </div>
              <Badge variant="outline" className="font-mono">{session.session_code}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{participants.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{currentPage}/{totalPages}</span>
              <Button variant="ghost" size="sm" onClick={onLeave} className="h-7 px-2">
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Progress value={progressPercent} className="h-1 mt-2" />
        </CardHeader>

        {/* Content Area */}
        <CardContent className="p-6 min-h-[400px]">
          {/* Notes View */}
          {currentType === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Lead-in Notes</h2>
              </div>
              <div className="space-y-4">
                {notes.map((note, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                    <span className="text-primary font-bold text-lg">•</span>
                    <p className="text-sm leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
              {keyConcepts.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Key Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {keyConcepts.map((concept, i) => (
                      <Badge key={i} variant="secondary">{concept}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MC Question View */}
          {currentType === 'mc' && mcQuestions[currentIndex] && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">Question {currentIndex + 1} of {mcQuestions.length}</Badge>
                <h2 className="text-lg font-medium">{mcQuestions[currentIndex].question}</h2>
              </div>
              
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(v) => !submitted && setSelectedAnswer(parseInt(v))}
                disabled={submitted}
                className="space-y-3"
              >
                {mcQuestions[currentIndex].options.map((option, i) => (
                  <div
                    key={i}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      submitted && selectedAnswer === i
                        ? 'border-primary bg-primary/5'
                        : selectedAnswer === i
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/50'
                    }`}
                    onClick={() => !submitted && setSelectedAnswer(i)}
                  >
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                    <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-sm">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </Label>
                    {submitted && selectedAnswer === i && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </RadioGroup>

              {!submitted && (
                <Button 
                  onClick={handleMCSubmit} 
                  disabled={selectedAnswer === null}
                  className="w-full"
                  size="lg"
                >
                  Submit Answer
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {submitted && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">Answer Submitted</p>
                  <p className="text-sm text-muted-foreground">Waiting for teacher to continue...</p>
                </div>
              )}
            </div>
          )}

          {/* Writing Task View */}
          {currentType === 'writing' && openEndedQuestions[currentIndex] && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">Task {currentIndex + 1} of {openEndedQuestions.length}</Badge>
                <h2 className="text-lg font-medium">{openEndedQuestions[currentIndex].question}</h2>
                {openEndedQuestions[currentIndex].hints && (
                  <p className="text-sm text-muted-foreground">
                    💡 {openEndedQuestions[currentIndex].hints?.join(' • ')}
                  </p>
                )}
              </div>

              <div className="relative">
                <Textarea
                  placeholder={submitted ? "Response submitted" : "Write your response here..."}
                  value={textResponse}
                  onChange={(e) => !submitted && setTextResponse(e.target.value)}
                  className="min-h-[200px] text-base resize-none"
                  disabled={submitted}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {textResponse.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>

              {!submitted && (
                <Button 
                  onClick={handleWritingSubmit} 
                  disabled={!textResponse.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Response
                </Button>
              )}

              {submitted && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">Response Submitted</p>
                  <p className="text-sm text-muted-foreground">Waiting for teacher to continue...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Prompt Alert Component
function PromptAlert({ prompt, onDismiss }: { prompt: SessionPrompt; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
      <Alert 
        className={`max-w-md pointer-events-auto shadow-lg ${
          prompt.prompt_type === 'focus' 
            ? 'border-destructive bg-destructive/10' 
            : prompt.prompt_type === 'timer'
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            : 'border-primary bg-primary/10'
        }`}
      >
        <div className="flex items-start gap-3">
          {prompt.prompt_type === 'focus' && <AlertCircle className="h-5 w-5 text-destructive" />}
          {prompt.prompt_type === 'timer' && <Clock className="h-5 w-5 text-yellow-600" />}
          {prompt.prompt_type === 'message' && <MessageSquare className="h-5 w-5 text-primary" />}
          <div className="flex-1">
            <AlertTitle className="mb-1">
              {prompt.prompt_type === 'focus' && 'Attention!'}
              {prompt.prompt_type === 'timer' && 'Time Update'}
              {prompt.prompt_type === 'message' && 'From Teacher'}
            </AlertTitle>
            <AlertDescription>{prompt.content}</AlertDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
