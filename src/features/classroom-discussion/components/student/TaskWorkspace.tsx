/**
 * Workspace for students to work on a selected task
 */

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Loader2, Bot, Sparkles, ChevronDown, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { Hour3Task, StudentTaskProgress } from '@/features/classroom-discussion/types';

interface TaskWorkspaceProps {
  task: Hour3Task;
  progress: StudentTaskProgress;
  onSubmit: (taskId: string, response: string) => Promise<string | null>;
  onSaveDraft: (taskId: string, response: string) => void;
  onBack: () => void;
}

// Component for toggling excerpt preview/full
function ExcerptToggle({ excerpt }: { excerpt: { label: string; preview: string; full: string } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFullArticle = excerpt.label.includes('Full Article');

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className={cn(
        "border rounded-lg overflow-hidden",
        isFullArticle ? "bg-primary/5 border-primary/20" : "bg-background"
      )}>
        <CollapsibleTrigger asChild>
          <button className="w-full p-3 text-left hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                isFullArticle ? "text-primary" : "text-foreground"
              )}>
                {excerpt.label}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                isExpanded && "rotate-180"
              )} />
            </div>
            {!isExpanded && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {excerpt.preview}
              </p>
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 border-t bg-muted/30">
            <ScrollArea className={isFullArticle ? "h-[400px]" : "max-h-[300px]"}>
              <div className="prose prose-sm max-w-none dark:prose-invert pr-4">
                {excerpt.full.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function TaskWorkspace({ 
  task, 
  progress, 
  onSubmit, 
  onSaveDraft,
  onBack,
}: TaskWorkspaceProps) {
  const [response, setResponse] = useState(progress.response || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(progress.aiFeedback || null);

  // Word count
  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;
  const isOverLimit = task.wordLimit ? wordCount > task.wordLimit : false;

  // Auto-save draft on change (debounced via useEffect)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (response && response !== progress.response) {
        onSaveDraft(task.id, response);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [response, task.id, onSaveDraft, progress.response]);

  const handleSubmit = useCallback(async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      const feedback = await onSubmit(task.id, response);
      if (feedback) {
        setAiFeedback(feedback);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [response, task.id, onSubmit]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to tasks
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Task Prompt */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              {task.wordLimit && (
                <Badge variant="outline">{task.wordLimit} words max</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {task.skillFocus.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {task.prompt}
              </pre>
            </div>

            {/* Source Excerpts */}
            {task.excerpts && task.excerpts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Source Material
                </p>
                {task.excerpts.map((excerpt, i) => (
                  <ExcerptToggle key={i} excerpt={excerpt} />
                ))}
              </div>
            )}

            {task.rubricPoints && task.rubricPoints.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">What we're looking for:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {task.rubricPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Area */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Your Response
              <span className={`text-sm font-normal ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {wordCount}{task.wordLimit ? `/${task.wordLimit}` : ''} words
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-[200px] resize-none"
              disabled={isSubmitting}
            />

            <Button
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting AI Feedback...
                </>
              ) : progress.status === 'completed' ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Resubmit for New Feedback
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for AI Feedback
                </>
              )}
            </Button>

            {/* AI Feedback */}
            {aiFeedback && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    AI Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[300px]">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
