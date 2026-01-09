import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, XCircle, Send, Loader2, Eye, Lock, 
  Clock, Users, Radio as RadioIcon, BookOpen, PenLine
} from 'lucide-react';
import { LiveSession, SessionResponse } from '@/hooks/useLiveSession';

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

interface LiveTaskViewProps {
  session: LiveSession;
  mcQuestions: MCQuestion[];
  openEndedQuestions: OpenEndedQuestion[];
  notes: string[];
  keyConcepts: string[];
  onSubmitResponse: (questionType: string, questionIndex: number, response: Record<string, unknown>, isCorrect?: boolean) => void;
  existingResponses?: SessionResponse[];
  isTeacher?: boolean;
  participantCount?: number;
  responseCount?: number;
  responses?: SessionResponse[];
}

// Calculate total pages and current page number
function usePageNumbers(
  currentType: string, 
  currentIndex: number, 
  mcCount: number, 
  writingCount: number
) {
  // Total pages = 1 (notes) + MC questions + writing tasks
  const totalPages = 1 + mcCount + writingCount;
  
  let currentPage = 1;
  if (currentType === 'notes') {
    currentPage = 1;
  } else if (currentType === 'mc') {
    currentPage = 2 + currentIndex; // 1 (notes) + 1 (base) + index
  } else if (currentType === 'writing') {
    currentPage = 2 + mcCount + currentIndex; // 1 (notes) + MC count + 1 (base) + index
  }
  
  return { currentPage, totalPages };
}

export function LiveTaskView({
  session,
  mcQuestions,
  openEndedQuestions,
  notes,
  keyConcepts,
  onSubmitResponse,
  existingResponses = [],
  isTeacher = false,
  participantCount = 0,
  responseCount = 0,
  responses = [],
}: LiveTaskViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentType = session.current_section || 'notes';
  const currentIndex = session.current_question_index || 0;
  
  // Get page numbers
  const { currentPage, totalPages } = usePageNumbers(
    currentType, 
    currentIndex, 
    mcQuestions.length, 
    openEndedQuestions.length
  );
  
  // Check if already submitted for this question
  const existingResponse = existingResponses.find(
    r => r.question_type === (currentType === 'writing' ? 'open_ended' : currentType) && 
         r.question_index === currentIndex
  );
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTextResponse('');
    setSubmitted(!!existingResponse);
    setShowFeedback(false);
    
    // Load existing response if any
    if (existingResponse) {
      const respData = existingResponse.response as Record<string, unknown>;
      if (currentType === 'mc' && respData.answerIndex !== undefined) {
        setSelectedAnswer(respData.answerIndex as number);
      } else if (currentType === 'writing' && respData.text) {
        setTextResponse(respData.text as string);
      }
    }
  }, [currentType, currentIndex, existingResponse]);
  
  const handleMCSubmit = () => {
    if (selectedAnswer === null) return;
    const question = mcQuestions[currentIndex];
    const isCorrect = selectedAnswer === question.correctIndex;
    onSubmitResponse('mc', currentIndex, { answerIndex: selectedAnswer, answer: question.options[selectedAnswer] }, isCorrect);
    setSubmitted(true);
    setShowFeedback(true);
  };
  
  const handleWritingSubmit = () => {
    if (!textResponse.trim()) return;
    onSubmitResponse('open_ended', currentIndex, { text: textResponse });
    setSubmitted(true);
  };
  
  // Session paused view
  if (session.status === 'paused') {
    return (
      <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-yellow-600 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Session Paused</h3>
          <p className="text-muted-foreground">
            The teacher has paused the session. Please wait...
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Notes view
  if (currentType === 'notes') {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Issues & Key Concepts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                Page {currentPage} of {totalPages}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <RadioIcon className="h-3 w-3 animate-pulse" />
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Key Points to Consider</h4>
            <ul className="space-y-2">
              {notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
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
                <Badge key={i} variant="outline">{concept}</Badge>
              ))}
            </div>
          </div>
          {!isTeacher && (
            <p className="text-xs text-muted-foreground text-center pt-4 border-t">
              <Eye className="h-3 w-3 inline mr-1" />
              Review these notes. The teacher will advance when ready.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // MC Question view
  if (currentType === 'mc') {
    const question = mcQuestions[currentIndex];
    if (!question) {
      return (
        <Card className="border-muted">
          <CardContent className="py-8 text-center text-muted-foreground">
            Question not found
          </CardContent>
        </Card>
      );
    }
    
    // Teacher view with responses
    if (isTeacher) {
      const questionResponses = responses.filter(
        r => r.question_type === 'mc' && r.question_index === currentIndex
      );
      const answerCounts = question.options.map((_, i) => 
        questionResponses.filter(r => (r.response as Record<string, unknown>).answerIndex === i).length
      );
      const totalResponses = questionResponses.length;
      
      return (
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600">MC Question {currentIndex + 1}/{mcQuestions.length}</Badge>
                <Badge variant="outline" className="font-mono">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {totalResponses}/{participantCount} responded
              </Badge>
            </div>
            <CardTitle className="text-lg mt-3">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, i) => {
              const count = answerCounts[i];
              const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
              
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{option}</span>
                    <span className="font-mono text-xs">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 bg-primary/60"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 border-t">
              <Progress 
                value={(totalResponses / Math.max(participantCount, 1)) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {participantCount - totalResponses} students still answering
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Student view
    return (
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600">MC Question {currentIndex + 1}/{mcQuestions.length}</Badge>
              <Badge variant="outline" className="font-mono">
                Page {currentPage} of {totalPages}
              </Badge>
            </div>
            <Badge variant="secondary" className="gap-1">
              <RadioIcon className="h-3 w-3 animate-pulse" />
              Live Task
            </Badge>
          </div>
          <CardTitle className="text-lg mt-3">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => !submitted && setSelectedAnswer(parseInt(value))}
            disabled={submitted}
          >
            {question.options.map((option, i) => (
              <div 
                key={i} 
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  submitted && i === question.correctIndex
                    ? 'bg-green-50 border-green-500 dark:bg-green-950/30'
                    : submitted && selectedAnswer === i && i !== question.correctIndex
                    ? 'bg-red-50 border-red-500 dark:bg-red-950/30'
                    : selectedAnswer === i
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                <Label 
                  htmlFor={`option-${i}`} 
                  className={`flex-1 cursor-pointer ${
                    submitted && i === question.correctIndex ? 'text-green-700 dark:text-green-400' : ''
                  }`}
                >
                  {option}
                </Label>
                {submitted && i === question.correctIndex && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {submitted && selectedAnswer === i && i !== question.correctIndex && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {!submitted ? (
            <Button 
              onClick={handleMCSubmit} 
              disabled={selectedAnswer === null}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Answer
            </Button>
          ) : (
            <div className={`p-3 rounded-lg ${
              selectedAnswer === question.correctIndex 
                ? 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300'
            }`}>
              <p className="text-sm font-medium flex items-center gap-2">
                {selectedAnswer === question.correctIndex ? (
                  <><CheckCircle2 className="h-4 w-4" /> Correct!</>
                ) : (
                  <><XCircle className="h-4 w-4" /> Not quite</>
                )}
              </p>
              <p className="text-sm mt-1">{question.explanation}</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground text-center border-t pt-3">
            <Lock className="h-3 w-3 inline mr-1" />
            This question is controlled by the teacher
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Writing task view
  if (currentType === 'writing') {
    const question = openEndedQuestions[currentIndex];
    if (!question) {
      return (
        <Card className="border-muted">
          <CardContent className="py-8 text-center text-muted-foreground">
            Task not found
          </CardContent>
        </Card>
      );
    }
    
    // Teacher view
    if (isTeacher) {
      const taskResponses = responses.filter(
        r => r.question_type === 'open_ended' && r.question_index === currentIndex
      );
      
      return (
        <Card className="border-green-500/30 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">Writing Task {currentIndex + 1}/{openEndedQuestions.length}</Badge>
                <Badge variant="outline" className="font-mono">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {taskResponses.length}/{participantCount} submitted
              </Badge>
            </div>
            <CardTitle className="text-lg mt-3">{question.question}</CardTitle>
            {question.hints && (
              <p className="text-xs text-muted-foreground">
                💡 Hints: {question.hints.join(' • ')}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-80 overflow-y-auto space-y-2">
              {taskResponses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Waiting for student responses...
                </p>
              ) : (
                taskResponses.map((r, i) => (
                  <div key={r.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                    <p className="text-xs text-muted-foreground mb-1">Response {i + 1}</p>
                    <p>{(r.response as Record<string, unknown>).text as string}</p>
                  </div>
                ))
              )}
            </div>
            <Progress 
              value={(taskResponses.length / Math.max(participantCount, 1)) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              {participantCount - taskResponses.length} students still writing
            </p>
          </CardContent>
        </Card>
      );
    }
    
    // Student view
    return (
      <Card className="border-green-500/30 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">Writing Task {currentIndex + 1}/{openEndedQuestions.length}</Badge>
              <Badge variant="outline" className="font-mono">
                Page {currentPage} of {totalPages}
              </Badge>
            </div>
            <Badge variant="secondary" className="gap-1">
              <PenLine className="h-3 w-3" />
              Live Task
            </Badge>
          </div>
          <CardTitle className="text-lg mt-3">{question.question}</CardTitle>
          {question.hints && (
            <p className="text-xs text-muted-foreground">
              💡 Hints: {question.hints.join(' • ')}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your response here..."
            value={textResponse}
            onChange={(e) => !submitted && setTextResponse(e.target.value)}
            disabled={submitted}
            className="min-h-32"
          />
          
          {!submitted ? (
            <Button 
              onClick={handleWritingSubmit} 
              disabled={!textResponse.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Response
            </Button>
          ) : (
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Response Submitted
              </p>
              <p className="text-sm mt-1">Your answer has been sent to the teacher.</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground text-center border-t pt-3">
            <Lock className="h-3 w-3 inline mr-1" />
            This task is controlled by the teacher
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Fallback
  return (
    <Card className="border-muted">
      <CardContent className="py-8 text-center text-muted-foreground">
        Waiting for teacher to select a task...
      </CardContent>
    </Card>
  );
}
