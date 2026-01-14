import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Clock, ExternalLink, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { allHoursData, HourTask, HourData } from "@/data/hourContent";

interface StudentResponse {
  id: string;
  student_id: string;
  question_key: string | null;
  response: string;
  is_correct: boolean | null;
  ai_feedback: string | null;
  submitted_at: string;
}

interface WritingDraft {
  id: string;
  student_id: string;
  task_key: string;
  content: string;
  ai_feedback: string | null;
  version: number;
  is_submitted: boolean;
  created_at: string;
}

interface TaskFeedback {
  id: string;
  teacher_id: string;
  student_id: string;
  task_key: string;
  response_id: string | null;
  comment: string;
  created_at: string;
}

interface StudentTasksByWeekProps {
  studentId: string;
  studentResponses: StudentResponse[];
  writingDrafts: WritingDraft[];
  taskFeedback: TaskFeedback[];
  onAddFeedback: (studentId: string, taskKey: string, responseId?: string) => void;
}

// Get the task key format used in responses
const getTaskKeyPatterns = (weekNum: number, hourNum: number, taskId: string, taskIndex?: number): string[] => {
  const patterns = [
    taskId, // Original task id like "w1h1-scan1"
    `week${weekNum}_hour${hourNum}_${taskId}`,
    `week${weekNum}-hour${hourNum}_${taskId}`,
    `w${weekNum}h${hourNum}_${taskId}`,
    `w${weekNum}-h${hourNum}_${taskId}`,
    `week${weekNum}-hour${hourNum}-${taskId}`,
  ];
  
  // Add question number patterns for QuickCheckMC
  // These may or may not have week/hour prefix depending on how they were saved
  if (taskIndex !== undefined) {
    patterns.push(`week${weekNum}-hour${hourNum}-q${taskIndex + 1}`);
    patterns.push(`q${taskIndex + 1}-`); // Simple pattern without week/hour
  }
  
  return patterns;
};

// Check if a response matches a task based on question text similarity
const matchesByQuestionText = (responseJson: string, taskQuestion: string): boolean => {
  try {
    const parsed = JSON.parse(responseJson);
    if (parsed.question) {
      // Check if the first 30 chars of questions match
      const responseQ = parsed.question.toLowerCase().slice(0, 30);
      const taskQ = taskQuestion.toLowerCase().slice(0, 30);
      return responseQ === taskQ;
    }
  } catch {}
  return false;
};

// Check if a response matches a task
const responseMatchesTask = (response: StudentResponse, taskId: string, weekNum: number, hourNum: number, taskIndex?: number, taskQuestion?: string): boolean => {
  const questionKey = response.question_key?.toLowerCase() || "";
  const patterns = getTaskKeyPatterns(weekNum, hourNum, taskId, taskIndex).map(p => p.toLowerCase());
  
  // Check if question_key contains any pattern
  if (patterns.some(p => questionKey.includes(p) || questionKey.startsWith(p))) {
    return true;
  }
  
  // Check if taskId is contained in questionKey
  if (questionKey.includes(taskId.toLowerCase())) {
    return true;
  }
  
  // Also check the response JSON for embedded task info
  try {
    const parsed = JSON.parse(response.response);
    if (parsed.taskId === taskId || parsed.questionId === taskId) {
      return true;
    }
    // Check weekNumber/hourNumber match
    if (parsed.weekNumber === weekNum && parsed.hourNumber === hourNum) {
      // If we have taskIndex, check if this is the right question
      if (taskIndex !== undefined) {
        const qNumMatch = questionKey.match(/q(\d+)/);
        if (qNumMatch && parseInt(qNumMatch[1]) === taskIndex + 1) {
          return true;
        }
      }
    }
  } catch {}
  
  // Check by question text similarity if provided
  if (taskQuestion && matchesByQuestionText(response.response, taskQuestion)) {
    return true;
  }
  
  return false;
};

// Check if a writing draft matches a task
const draftMatchesTask = (draft: WritingDraft, taskId: string, weekNum: number, hourNum: number, taskIndex?: number): boolean => {
  const taskKey = draft.task_key?.toLowerCase() || "";
  const patterns = getTaskKeyPatterns(weekNum, hourNum, taskId, taskIndex).map(p => p.toLowerCase());
  
  return patterns.some(p => taskKey.includes(p) || taskKey.includes(taskId.toLowerCase()));
};

const getTaskTypeLabel = (type: string): string => {
  switch (type) {
    case 'mc': return 'Multiple Choice';
    case 'true-false': return 'True/False';
    case 'fill-blank': return 'Fill in the Blank';
    case 'short-answer': return 'Short Answer';
    case 'sentence': return 'Sentence';
    case 'paragraph': return 'Paragraph';
    default: return type;
  }
};

const getTaskTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
  switch (type) {
    case 'mc':
    case 'true-false':
    case 'fill-blank':
      return 'secondary';
    case 'short-answer':
    case 'sentence':
    case 'paragraph':
      return 'outline';
    default:
      return 'default';
  }
};

export function StudentTasksByWeek({
  studentId,
  studentResponses,
  writingDrafts,
  taskFeedback,
  onAddFeedback,
}: StudentTasksByWeekProps) {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);
  const [openHours, setOpenHours] = useState<string[]>([]);

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const toggleHour = (key: string) => {
    setOpenHours(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Group hours by week
  const weekGroups = allHoursData.reduce((acc, hour) => {
    if (!acc[hour.weekNumber]) {
      acc[hour.weekNumber] = [];
    }
    acc[hour.weekNumber].push(hour);
    return acc;
  }, {} as Record<number, HourData[]>);

  // Get attempt status for a task
  const getTaskAttemptInfo = (task: HourTask, weekNum: number, hourNum: number, taskIndex: number) => {
    const matchingResponses = studentResponses.filter(r => 
      responseMatchesTask(r, task.id, weekNum, hourNum, taskIndex)
    );
    
    const matchingDrafts = writingDrafts.filter(d =>
      draftMatchesTask(d, task.id, weekNum, hourNum, taskIndex)
    );

    const feedback = taskFeedback.filter(f => 
      f.task_key.includes(task.id) || f.task_key.includes(`w${weekNum}h${hourNum}`)
    );

    if (matchingResponses.length > 0) {
      const latestResponse = matchingResponses[0];
      return {
        attempted: true,
        response: latestResponse,
        isCorrect: latestResponse.is_correct,
        submittedAt: latestResponse.submitted_at,
        type: 'response' as const,
        feedback,
      };
    }

    if (matchingDrafts.length > 0) {
      const latestDraft = matchingDrafts[0];
      return {
        attempted: true,
        draft: latestDraft,
        isSubmitted: latestDraft.is_submitted,
        submittedAt: latestDraft.created_at,
        type: 'draft' as const,
        feedback,
      };
    }

    return {
      attempted: false,
      type: 'none' as const,
      feedback,
    };
  };

  // Calculate week/hour stats
  const getHourStats = (hour: HourData) => {
    const tasks = hour.tasks || [];
    let attempted = 0;
    let correct = 0;
    
    tasks.forEach((task, taskIndex) => {
      const info = getTaskAttemptInfo(task, hour.weekNumber, hour.hourNumber, taskIndex);
      if (info.attempted) {
        attempted++;
        if (info.type === 'response' && info.isCorrect) {
          correct++;
        } else if (info.type === 'draft' && info.isSubmitted) {
          correct++;
        }
      }
    });

    // Also count writing task if exists
    const totalTasks = tasks.length + (hour.writingTask ? 1 : 0);

    return { attempted, correct, total: totalTasks };
  };

  const getWeekStats = (weekNum: number) => {
    const hours = weekGroups[weekNum] || [];
    let totalTasks = 0;
    let attempted = 0;
    let correct = 0;

    hours.forEach(hour => {
      const stats = getHourStats(hour);
      totalTasks += stats.total;
      attempted += stats.attempted;
      correct += stats.correct;
    });

    return { attempted, correct, total: totalTasks };
  };

  return (
    <div className="space-y-4">
      {Object.keys(weekGroups).sort((a, b) => Number(a) - Number(b)).map(weekNumStr => {
        const weekNum = Number(weekNumStr);
        const hours = weekGroups[weekNum];
        const weekStats = getWeekStats(weekNum);
        const isWeekOpen = openWeeks.includes(weekNum);

        return (
          <Card key={weekNum}>
            <Collapsible open={isWeekOpen} onOpenChange={() => toggleWeek(weekNum)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {isWeekOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      Week {weekNum}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={weekStats.attempted === weekStats.total ? "default" : "secondary"}>
                        {weekStats.attempted}/{weekStats.total} attempted
                      </Badge>
                      {weekStats.correct > 0 && (
                        <Badge variant="outline" className="text-green-600">
                          {weekStats.correct} correct
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-3">
                  {hours.map(hour => {
                    const hourKey = `${weekNum}-${hour.hourNumber}`;
                    const isHourOpen = openHours.includes(hourKey);
                    const hourStats = getHourStats(hour);

                    return (
                      <Collapsible 
                        key={hourKey} 
                        open={isHourOpen} 
                        onOpenChange={() => toggleHour(hourKey)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              {isHourOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              <span className="font-medium text-sm">Hour {hour.hourNumber}: {hour.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={hourStats.attempted === hourStats.total ? "default" : "outline"} className="text-xs">
                                {hourStats.attempted}/{hourStats.total}
                              </Badge>
                              <Link 
                                to={`/week/${weekNum}/hour/${hour.hourNumber}`}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-6 mt-2 space-y-2">
                            {hour.tasks.map((task, idx) => {
                              const attemptInfo = getTaskAttemptInfo(task, hour.weekNumber, hour.hourNumber, idx);
                              
                              return (
                                <div 
                                  key={task.id} 
                                  className="flex items-start justify-between p-2 rounded border bg-background"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant={getTaskTypeBadgeVariant(task.type)} className="text-xs">
                                        {getTaskTypeLabel(task.type)}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                                    </div>
                                    <p className="text-sm truncate">{task.question}</p>
                                    
                                    {attemptInfo.attempted && attemptInfo.type === 'response' && (
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        Attempted: {new Date(attemptInfo.submittedAt!).toLocaleDateString()}
                                        {attemptInfo.response && (
                                          <span className="ml-2">
                                            {(() => {
                                              try {
                                                const parsed = JSON.parse(attemptInfo.response.response);
                                                if (parsed.attempts) {
                                                  return `Answers: ${parsed.attempts.join(' → ')}`;
                                                }
                                              } catch {}
                                              return null;
                                            })()}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    
                                    {attemptInfo.attempted && attemptInfo.type === 'draft' && (
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        Draft saved: {new Date(attemptInfo.submittedAt!).toLocaleDateString()}
                                        {attemptInfo.isSubmitted && <span className="ml-1">(submitted)</span>}
                                      </div>
                                    )}

                                    {attemptInfo.feedback.length > 0 && (
                                      <div className="mt-1 text-xs text-green-600">
                                        {attemptInfo.feedback.length} feedback comment(s)
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 ml-2">
                                    {!attemptInfo.attempted ? (
                                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Not attempted
                                      </Badge>
                                    ) : attemptInfo.type === 'response' ? (
                                      attemptInfo.isCorrect ? (
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Correct
                                        </Badge>
                                      ) : (
                                        <Badge variant="destructive">
                                          <XCircle className="h-3 w-3 mr-1" />
                                          Incorrect
                                        </Badge>
                                      )
                                    ) : (
                                      <Badge variant={attemptInfo.isSubmitted ? "default" : "secondary"}>
                                        {attemptInfo.isSubmitted ? "Submitted" : "Draft"}
                                      </Badge>
                                    )}
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      onClick={() => onAddFeedback(
                                        studentId, 
                                        task.id,
                                        attemptInfo.type === 'response' ? attemptInfo.response?.id : undefined
                                      )}
                                    >
                                      <MessageSquarePlus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {/* Writing task if exists */}
                            {hour.writingTask && (
                              <div className="flex items-start justify-between p-2 rounded border bg-background border-blue-200">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                                      Writing Task
                                    </Badge>
                                  </div>
                                  <p className="text-sm truncate">{hour.writingTask.prompt}</p>
                                  
                                  {/* Check for writing drafts for this hour's writing task */}
                                  {(() => {
                                    const writingTaskKey = `week${weekNum}_hour${hour.hourNumber}_writing`;
                                    const matchingDrafts = writingDrafts.filter(d => 
                                      d.task_key.includes(`w${weekNum}h${hour.hourNumber}`) ||
                                      d.task_key.includes(`week${weekNum}_hour${hour.hourNumber}`)
                                    );
                                    
                                    if (matchingDrafts.length > 0) {
                                      const latest = matchingDrafts[0];
                                      return (
                                        <div className="mt-1 text-xs text-muted-foreground">
                                          Draft saved: {new Date(latest.created_at).toLocaleDateString()}
                                          {latest.is_submitted && <span className="ml-1">(submitted)</span>}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                
                                <div className="flex items-center gap-2 ml-2">
                                  {(() => {
                                    const matchingDrafts = writingDrafts.filter(d => 
                                      d.task_key.includes(`w${weekNum}h${hour.hourNumber}`) ||
                                      d.task_key.includes(`week${weekNum}_hour${hour.hourNumber}`)
                                    );
                                    
                                    if (matchingDrafts.length === 0) {
                                      return (
                                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                          <Clock className="h-3 w-3 mr-1" />
                                          Not attempted
                                        </Badge>
                                      );
                                    }
                                    
                                    const latest = matchingDrafts[0];
                                    return (
                                      <Badge variant={latest.is_submitted ? "default" : "secondary"}>
                                        {latest.is_submitted ? "Submitted" : "Draft"}
                                      </Badge>
                                    );
                                  })()}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => onAddFeedback(
                                      studentId,
                                      `week${weekNum}_hour${hour.hourNumber}_writing`
                                    )}
                                  >
                                    <MessageSquarePlus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
