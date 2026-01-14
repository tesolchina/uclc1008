import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  BookOpen,
  PenLine,
  Target
} from "lucide-react";
import { allHoursData, HourTask, HourData } from "@/data/hourContent";

interface TaskResponse {
  id: string;
  question_key: string | null;
  response: string;
  is_correct: boolean | null;
}

interface WritingDraft {
  id: string;
  task_key: string;
  content: string;
  is_submitted: boolean;
}

interface ParagraphNote {
  id: string;
  paragraph_key: string;
  notes: string;
}

interface StudentTaskProgressProps {
  responses: TaskResponse[];
  writingDrafts: WritingDraft[];
  paragraphNotes: ParagraphNote[];
}

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
const responseMatchesTask = (response: TaskResponse, taskId: string, weekNum: number, hourNum: number, taskIndex?: number, taskQuestion?: string): boolean => {
  const questionKey = response.question_key?.toLowerCase() || "";
  const patterns = [
    taskId.toLowerCase(),
    `week${weekNum}_hour${hourNum}_${taskId}`.toLowerCase(),
    `week${weekNum}-hour${hourNum}_${taskId}`.toLowerCase(),
    `w${weekNum}h${hourNum}_${taskId}`.toLowerCase(),
    `week${weekNum}-hour${hourNum}-${taskId}`.toLowerCase(),
  ];
  
  // Add question number patterns for QuickCheckMC
  if (taskIndex !== undefined) {
    patterns.push(`week${weekNum}-hour${hourNum}-q${taskIndex + 1}`.toLowerCase());
    patterns.push(`q${taskIndex + 1}-`); // Simple pattern without week/hour
  }
  
  if (patterns.some(p => questionKey.includes(p) || questionKey.startsWith(p))) {
    return true;
  }
  
  if (questionKey.includes(taskId.toLowerCase())) {
    return true;
  }
  
  try {
    const parsed = JSON.parse(response.response);
    if (parsed.taskId === taskId || parsed.questionId === taskId) {
      return true;
    }
    if (parsed.weekNumber === weekNum && parsed.hourNumber === hourNum) {
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
const draftMatchesTask = (draft: WritingDraft, taskId: string, weekNum: number, hourNum: number): boolean => {
  const taskKey = draft.task_key?.toLowerCase() || "";
  const patterns = [
    taskId.toLowerCase(),
    `week${weekNum}_hour${hourNum}`.toLowerCase(),
    `w${weekNum}h${hourNum}`.toLowerCase(),
  ];
  
  return patterns.some(p => taskKey.includes(p) || taskKey.includes(taskId.toLowerCase()));
};

const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case 'mc':
    case 'true-false':
    case 'fill-blank':
      return <Target className="h-3.5 w-3.5" />;
    case 'short-answer':
    case 'sentence':
    case 'paragraph':
      return <PenLine className="h-3.5 w-3.5" />;
    default:
      return <BookOpen className="h-3.5 w-3.5" />;
  }
};

const getTaskTypeLabel = (type: string): string => {
  switch (type) {
    case 'mc': return 'MC';
    case 'true-false': return 'T/F';
    case 'fill-blank': return 'Fill';
    case 'short-answer': return 'Short';
    case 'sentence': return 'Sentence';
    case 'paragraph': return 'Paragraph';
    default: return type;
  }
};

export function StudentTaskProgress({
  responses,
  writingDrafts,
  paragraphNotes,
}: StudentTaskProgressProps) {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
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

  // Check if task is completed
  const isTaskCompleted = (task: HourTask, weekNum: number, hourNum: number, taskIndex: number): boolean => {
    return responses.some(r => responseMatchesTask(r, task.id, weekNum, hourNum, taskIndex));
  };

  // Check if writing task is completed
  const isWritingCompleted = (weekNum: number, hourNum: number): boolean => {
    return writingDrafts.some(d => 
      draftMatchesTask(d, 'writing', weekNum, hourNum) && d.is_submitted
    );
  };

  // Calculate stats
  const getHourStats = (hour: HourData) => {
    const tasks = hour.tasks || [];
    let completed = 0;
    
    tasks.forEach((task, taskIndex) => {
      if (isTaskCompleted(task, hour.weekNumber, hour.hourNumber, taskIndex)) {
        completed++;
      }
    });

    const totalTasks = tasks.length + (hour.writingTask ? 1 : 0);
    if (hour.writingTask && isWritingCompleted(hour.weekNumber, hour.hourNumber)) {
      completed++;
    }

    return { completed, total: totalTasks };
  };

  const getWeekStats = (weekNum: number) => {
    const hours = weekGroups[weekNum] || [];
    let totalTasks = 0;
    let completed = 0;

    hours.forEach(hour => {
      const stats = getHourStats(hour);
      totalTasks += stats.total;
      completed += stats.completed;
    });

    return { completed, total: totalTasks };
  };

  // Get incomplete tasks for a week
  const getIncompleteTasks = (weekNum: number) => {
    const hours = weekGroups[weekNum] || [];
    const incomplete: { hour: HourData; task: HourTask; index: number }[] = [];

    hours.forEach(hour => {
      hour.tasks.forEach((task, idx) => {
        if (!isTaskCompleted(task, hour.weekNumber, hour.hourNumber, idx)) {
          incomplete.push({ hour, task, index: idx });
        }
      });
    });

    return incomplete;
  };

  return (
    <div className="space-y-4">
      {Object.keys(weekGroups).sort((a, b) => Number(a) - Number(b)).map(weekNumStr => {
        const weekNum = Number(weekNumStr);
        const hours = weekGroups[weekNum];
        const weekStats = getWeekStats(weekNum);
        const isWeekOpen = openWeeks.includes(weekNum);
        const progressPercent = weekStats.total > 0 ? (weekStats.completed / weekStats.total) * 100 : 0;
        const incompleteTasks = getIncompleteTasks(weekNum);

        return (
          <Card key={weekNum} className={progressPercent === 100 ? "border-green-200 bg-green-50/30" : ""}>
            <Collapsible open={isWeekOpen} onOpenChange={() => toggleWeek(weekNum)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {isWeekOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      Week {weekNum}
                      {progressPercent === 100 && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {weekStats.completed}/{weekStats.total} tasks
                      </div>
                      <div className="w-24">
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Quick action for incomplete tasks */}
                  {incompleteTasks.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            {incompleteTasks.length} task{incompleteTasks.length > 1 ? 's' : ''} remaining
                          </p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            Continue where you left off
                          </p>
                        </div>
                        <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700">
                          <Link to={`/week/${weekNum}/hour/${incompleteTasks[0].hour.hourNumber}`}>
                            Continue
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Hour breakdown */}
                  {hours.map(hour => {
                    const hourStats = getHourStats(hour);
                    const hourComplete = hourStats.completed === hourStats.total;

                    return (
                      <div key={`${weekNum}-${hour.hourNumber}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Link 
                            to={`/week/${weekNum}/hour/${hour.hourNumber}`}
                            className="text-sm font-medium hover:text-primary flex items-center gap-2"
                          >
                            <span className={hourComplete ? "text-green-600" : ""}>
                              Hour {hour.hourNumber}: {hour.title}
                            </span>
                            {hourComplete && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                          </Link>
                          <Badge variant={hourComplete ? "default" : "outline"} className="text-xs">
                            {hourStats.completed}/{hourStats.total}
                          </Badge>
                        </div>

                        {/* Task list */}
                        <div className="ml-4 grid gap-1.5">
                          {hour.tasks.map((task, idx) => {
                            const completed = isTaskCompleted(task, hour.weekNumber, hour.hourNumber, idx);
                            
                            return (
                              <Link
                                key={task.id}
                                to={`/week/${weekNum}/hour/${hour.hourNumber}`}
                                className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
                                  completed 
                                    ? "bg-green-50 text-green-700 hover:bg-green-100" 
                                    : "bg-muted/30 hover:bg-muted/50"
                                }`}
                              >
                                {completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <span className="flex items-center gap-1.5">
                                  {getTaskTypeIcon(task.type)}
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    {getTaskTypeLabel(task.type)}
                                  </Badge>
                                </span>
                                <span className="truncate flex-1">{task.question}</span>
                                {!completed && (
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                )}
                              </Link>
                            );
                          })}

                          {/* Writing task */}
                          {hour.writingTask && (
                            <Link
                              to={`/week/${weekNum}/hour/${hour.hourNumber}`}
                              className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
                                isWritingCompleted(hour.weekNumber, hour.hourNumber)
                                  ? "bg-green-50 text-green-700 hover:bg-green-100" 
                                  : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                              }`}
                            >
                              {isWritingCompleted(hour.weekNumber, hour.hourNumber) ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-blue-500 shrink-0" />
                              )}
                              <span className="flex items-center gap-1.5">
                                <PenLine className="h-3.5 w-3.5" />
                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-300 text-blue-600">
                                  Writing
                                </Badge>
                              </span>
                              <span className="truncate flex-1">{hour.writingTask.prompt}</span>
                              {!isWritingCompleted(hour.weekNumber, hour.hourNumber) && (
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
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
