/**
 * =============================================================================
 * AI LIVE CLASS - CHAT TASK DISPLAY
 * =============================================================================
 * 
 * Renders interactive tasks generated within the AI conversation.
 * Supports MCQ, Writing, Paragraph, and Poll task types.
 * 
 * @module ai-live-class/components/ChatTaskDisplay
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState } from 'react';
import { 
  CheckCircle2, 
  PenLine, 
  MessageSquare, 
  BarChart3,
  Send,
  Clock,
  Lightbulb,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { 
  GeneratedTask, 
  MCQTask, 
  WritingTask, 
  ParagraphTask, 
  PollTask,
  TaskRenderProps 
} from '../types/tasks';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ChatTaskDisplay({
  task,
  sessionId,
  participantId,
  isTeacher,
  onSubmit,
  onClose,
}: TaskRenderProps) {
  switch (task.type) {
    case 'mcq':
      return (
        <MCQTaskCard 
          task={task as MCQTask} 
          isTeacher={isTeacher}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      );
    case 'writing':
      return (
        <WritingTaskCard 
          task={task as WritingTask} 
          isTeacher={isTeacher}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      );
    case 'paragraph':
      return (
        <ParagraphTaskCard 
          task={task as ParagraphTask} 
          isTeacher={isTeacher}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      );
    case 'poll':
      return (
        <PollTaskCard 
          task={task as PollTask} 
          isTeacher={isTeacher}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      );
    default:
      return null;
  }
}

// =============================================================================
// MCQ TASK CARD
// =============================================================================

interface MCQTaskCardProps {
  task: MCQTask;
  isTeacher: boolean;
  onSubmit?: (response: unknown) => void;
  onClose?: () => void;
}

function MCQTaskCard({ task, isTeacher, onSubmit, onClose }: MCQTaskCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
    onSubmit?.({ optionId: selectedOption, isCorrect: selectedOption === task.correctOptionId });
  };
  
  const isCorrect = submitted && selectedOption === task.correctOptionId;
  
  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Multiple Choice
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {task.options.length} options
            </Badge>
            {isTeacher && onClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="font-medium">{task.prompt}</p>
        
        <RadioGroup 
          value={selectedOption || ''} 
          onValueChange={setSelectedOption}
          disabled={submitted}
          className="space-y-2"
        >
          {task.options.map((option) => (
            <div 
              key={option.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                !submitted && "hover:bg-muted/50 cursor-pointer",
                submitted && option.id === task.correctOptionId && "bg-green-50 border-green-500 dark:bg-green-950/30",
                submitted && selectedOption === option.id && option.id !== task.correctOptionId && "bg-red-50 border-red-500 dark:bg-red-950/30"
              )}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <span className="font-medium mr-2">{option.id}.</span>
                {option.label}
              </Label>
              {submitted && option.id === task.correctOptionId && (
                <Badge variant="default" className="bg-green-600">Correct</Badge>
              )}
            </div>
          ))}
        </RadioGroup>
        
        {submitted && task.explanation && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Explanation:</strong> {task.explanation}
            </p>
          </div>
        )}
        
        {!submitted && !isTeacher && (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOption}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// WRITING TASK CARD
// =============================================================================

interface WritingTaskCardProps {
  task: WritingTask;
  isTeacher: boolean;
  onSubmit?: (response: unknown) => void;
  onClose?: () => void;
}

function WritingTaskCard({ task, isTeacher, onSubmit, onClose }: WritingTaskCardProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  
  const handleSubmit = () => {
    if (!response.trim()) return;
    setSubmitted(true);
    onSubmit?.({ content: response, wordCount });
  };
  
  return (
    <Card className="border-2 border-emerald-500/30 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLine className="h-5 w-5 text-emerald-600" />
            Writing Task
          </CardTitle>
          <div className="flex items-center gap-2">
            {task.wordLimit && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                ~{task.wordLimit} words
              </Badge>
            )}
            {isTeacher && onClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="font-medium">{task.prompt}</p>
        
        {task.hints && task.hints.length > 0 && (
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHints(!showHints)}
              className="text-amber-600 hover:text-amber-700"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showHints ? 'Hide hints' : 'Show hints'}
            </Button>
            {showHints && (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {task.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {!isTeacher && (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your response here..."
              rows={3}
              disabled={submitted}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm",
                task.wordLimit && wordCount > task.wordLimit ? "text-red-500" : "text-muted-foreground"
              )}>
                {wordCount} / {task.wordLimit || '∞'} words
              </span>
              
              {!submitted && (
                <Button onClick={handleSubmit} disabled={!response.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
            
            {submitted && (
              <Badge variant="default" className="bg-emerald-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Submitted
              </Badge>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// PARAGRAPH TASK CARD
// =============================================================================

interface ParagraphTaskCardProps {
  task: ParagraphTask;
  isTeacher: boolean;
  onSubmit?: (response: unknown) => void;
  onClose?: () => void;
}

function ParagraphTaskCard({ task, isTeacher, onSubmit, onClose }: ParagraphTaskCardProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  
  const handleSubmit = () => {
    if (!response.trim()) return;
    setSubmitted(true);
    onSubmit?.({ content: response, wordCount });
  };
  
  return (
    <Card className="border-2 border-violet-500/30 bg-violet-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-violet-600" />
            Paragraph Writing
          </CardTitle>
          <div className="flex items-center gap-2">
            {task.wordLimit && (
              <Badge variant="outline" className="text-violet-600 border-violet-300">
                ~{task.wordLimit} words
              </Badge>
            )}
            {isTeacher && onClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="font-medium">{task.prompt}</p>
        
        {!isTeacher && (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your paragraph here..."
              rows={6}
              disabled={submitted}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm",
                task.wordLimit && wordCount > task.wordLimit ? "text-red-500" : "text-muted-foreground"
              )}>
                {wordCount} / {task.wordLimit || '∞'} words
              </span>
              
              {!submitted && (
                <Button onClick={handleSubmit} disabled={!response.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
            
            {submitted && (
              <Badge variant="default" className="bg-violet-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Submitted
              </Badge>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// POLL TASK CARD
// =============================================================================

interface PollTaskCardProps {
  task: PollTask;
  isTeacher: boolean;
  onSubmit?: (response: unknown) => void;
  onClose?: () => void;
}

function PollTaskCard({ task, isTeacher, onSubmit, onClose }: PollTaskCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
    onSubmit?.({ optionId: selectedOption });
  };
  
  return (
    <Card className="border-2 border-amber-500/30 bg-amber-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            Quick Poll
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {task.options.length} options
            </Badge>
            {isTeacher && onClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="font-medium">{task.prompt}</p>
        
        <div className="grid gap-2">
          {task.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOption === option.id ? "default" : "outline"}
              className={cn(
                "justify-start h-auto py-3 px-4",
                submitted && selectedOption === option.id && "bg-amber-600"
              )}
              onClick={() => !submitted && setSelectedOption(option.id)}
              disabled={submitted}
            >
              <span className="font-medium mr-2">{option.id}.</span>
              {option.label}
            </Button>
          ))}
        </div>
        
        {!submitted && !isTeacher && selectedOption && (
          <Button onClick={handleSubmit} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Vote
          </Button>
        )}
        
        {submitted && (
          <Badge variant="default" className="bg-amber-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Vote recorded
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
