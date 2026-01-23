/**
 * ClassroomDiscussionPage - Main entry for Hour 3 Practice Sessions
 * 
 * Self-study mode: Students browse tasks, work independently with AI feedback
 */

import { useMemo } from 'react';
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen } from "lucide-react";

// Student components
import { 
  TaskSelectDropdown, 
  TaskWorkspace 
} from "../components/student";

// Hooks
import { useStudentDiscussion } from "../hooks/useStudentDiscussion";

// Constants
import { getHour3Tasks } from "../constants/taskBank";

interface ClassroomDiscussionPageProps {
  weekNumber: number;
  studentId?: string;
  onComplete?: () => void;
}

export function ClassroomDiscussionPage({ 
  weekNumber, 
  studentId: propStudentId,
  onComplete 
}: ClassroomDiscussionPageProps) {
  const { studentId: authStudentId } = useAuth();
  const studentId = propStudentId || authStudentId || "anonymous";
  
  // Get tasks for this week
  const tasks = getHour3Tasks(weekNumber);
  
  // Student self-study state
  const studentDiscussion = useStudentDiscussion({ weekNumber, studentId });
  const {
    taskProgress,
    selectedTaskId,
    setSelectedTaskId,
    submitResponse,
    saveDraft,
    getTaskProgress,
    isLoading: studentLoading,
    overallProgress,
  } = studentDiscussion;

  // Get the selected task object
  const selectedTask = useMemo(() => 
    selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null,
    [selectedTaskId, tasks]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Hour 3: Practice & AI Feedback</CardTitle>
                <CardDescription>
                  Week {weekNumber} • {tasks.length} practice tasks available
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {overallProgress.completed}/{overallProgress.total} completed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Task Selection or Workspace */}
      {studentLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading tasks...
          </CardContent>
        </Card>
      ) : selectedTask ? (
        <TaskWorkspace
          task={selectedTask}
          progress={getTaskProgress(selectedTask.id)}
          onSubmit={submitResponse}
          onSaveDraft={saveDraft}
          onBack={() => setSelectedTaskId(null)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Select a Practice Task
            </CardTitle>
            <CardDescription>
              Choose a task to work on. Your responses will be saved automatically and you'll receive AI feedback upon submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskSelectDropdown
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              getProgress={getTaskProgress}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ClassroomDiscussionPage;
