/**
 * Dashboard for teachers to view and manage student responses
 */

import { useState, useMemo } from 'react';
import { Copy, Users, Sparkles, XCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Hour3Task, DiscussionThread } from '@/features/classroom-discussion/types';
import type { Json } from '@/integrations/supabase/types';

interface SessionResponse {
  id: string;
  participant_id: string;
  response: Json;
  submitted_at: string;
  participant?: {
    display_name: string | null;
    student_identifier: string;
  };
}

interface ResponseDashboardProps {
  sessionCode: string;
  tasks: Hour3Task[];
  currentTaskId: string | null;
  responses: SessionResponse[];
  threads: DiscussionThread[];
  participantCount: number;
  onChangeTask: (taskId: string) => void;
  onGenerateAiCommentary: (responseIds: string[]) => Promise<string | null>;
  onAddComment: (content: string, parentId?: string) => Promise<boolean>;
  onToggleSpotlight: (threadId: string, isSpotlight: boolean) => void;
  onEndSession: () => void;
}

export function ResponseDashboard({
  sessionCode,
  tasks,
  currentTaskId,
  responses,
  threads,
  participantCount,
  onChangeTask,
  onGenerateAiCommentary,
  onAddComment,
  onToggleSpotlight,
  onEndSession,
}: ResponseDashboardProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCommentary, setAiCommentary] = useState<string | null>(null);
  const [teacherComment, setTeacherComment] = useState('');

  const currentTask = useMemo(() => 
    tasks.find(t => t.id === currentTaskId),
    [tasks, currentTaskId]
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast.success('Session code copied!');
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === responses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(responses.map(r => r.id)));
    }
  };

  const handleGenerateCommentary = async () => {
    if (selectedIds.size === 0) {
      toast.error('Select at least one response');
      return;
    }

    setIsGenerating(true);
    try {
      const commentary = await onGenerateAiCommentary(Array.from(selectedIds));
      setAiCommentary(commentary);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTeacherComment = async () => {
    if (!teacherComment.trim()) return;

    const success = await onAddComment(teacherComment);
    if (success) {
      setTeacherComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Session Header */}
      <Card className="bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="font-semibold">Session Active</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  Code: <span className="font-mono font-bold">{sessionCode}</span>
                  <Copy className="h-3 w-3" />
                </button>
              </div>

              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participantCount} joined
              </Badge>

              <Badge variant="outline">
                {responses.length} responses
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select value={currentTaskId || ''} onValueChange={onChangeTask}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="destructive" size="sm" onClick={onEndSession}>
                <XCircle className="h-4 w-4 mr-1" />
                End
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Responses Panel */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Student Responses</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedIds.size === responses.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  size="sm"
                  disabled={selectedIds.size === 0 || isGenerating}
                  onClick={handleGenerateCommentary}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {isGenerating ? 'Analyzing...' : `Send ${selectedIds.size} to AI`}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {responses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Waiting for student responses...
                </p>
              ) : (
                <div className="space-y-3">
                  {responses.map((response) => {
                    const responseText = typeof response.response === 'object' 
                      ? (response.response as Record<string, unknown>)?.text || JSON.stringify(response.response)
                      : String(response.response);

                    return (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedIds.has(response.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedIds.has(response.id)}
                            onCheckedChange={() => handleToggleSelect(response.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {response.participant?.display_name || 
                               response.participant?.student_identifier || 
                               'Student'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                              {String(responseText)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Commentary Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Discussion Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Task */}
            {currentTask && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">{currentTask.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {currentTask.prompt.slice(0, 100)}...
                </p>
              </div>
            )}

            {/* AI Commentary */}
            {aiCommentary && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Commentary
                </p>
                <p className="text-sm whitespace-pre-wrap">{aiCommentary}</p>
              </div>
            )}

            {/* Threads */}
            {threads.length > 0 && (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-3 rounded-lg ${
                        thread.author_type === 'ai' 
                          ? 'bg-primary/5' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">
                        {thread.author_type === 'ai' ? '🤖 AI' : '👩‍🏫 Teacher'}
                      </p>
                      <p className="text-sm">{thread.content}</p>
                      {!thread.is_spotlight && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={() => onToggleSpotlight(thread.id, true)}
                        >
                          Share with class
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Teacher Comment Input */}
            <div className="space-y-2">
              <Textarea
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
                placeholder="Add your comment..."
                className="min-h-[80px]"
              />
              <Button
                onClick={handleAddTeacherComment}
                disabled={!teacherComment.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
