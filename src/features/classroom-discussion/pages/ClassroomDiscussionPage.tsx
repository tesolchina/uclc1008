/**
 * ClassroomDiscussionPage - Main entry for Hour 3 Practice Sessions
 * 
 * Provides parallel learning modes:
 * - Self-study: Students browse tasks, work independently with AI feedback
 * - Live session: Optional overlay when teacher starts a session
 * 
 * Both modes coexist - live sessions are an invitation, not a takeover.
 */

import { useMemo } from 'react';
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, BookOpen } from "lucide-react";

// Student components
import { 
  LiveSessionBanner, 
  TaskSelectDropdown, 
  TaskWorkspace 
} from "../components/student";

// Teacher components
import { 
  SessionLauncher, 
  ResponseDashboard 
} from "../components/teacher";

// Hooks
import { useActiveSession } from "../hooks/useActiveSession";
import { useStudentDiscussion } from "../hooks/useStudentDiscussion";
import { useDiscussionSession } from "../hooks/useDiscussionSession";

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
  const { user, isTeacher, studentId: authStudentId } = useAuth();
  const studentId = propStudentId || authStudentId || "anonymous";
  const teacherId = user?.id || "";
  
  // Get tasks for this week
  const tasks = getHour3Tasks(weekNumber);
  
  // Check for active session (for students)
  const { 
    activeSession, 
    isLoading: sessionLoading,
    isDismissed,
    dismissSession,
    showSession,
  } = useActiveSession(weekNumber);
  
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
  } = studentDiscussion;

  // Get the selected task object
  const selectedTask = useMemo(() => 
    selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null,
    [selectedTaskId, tasks]
  );
  
  // Teacher session management
  const teacherSession = useDiscussionSession({ weekNumber, teacherId });
  const {
    session,
    sessionCode,
    responses,
    threads,
    isLoading: teacherLoading,
    participantCount,
    createSession,
    setCurrentTask,
    endSession,
    generateAiCommentary,
    addTeacherComment,
    toggleSpotlight,
  } = teacherSession;

  const isSessionActive = !!session;

  // Teacher View
  if (isTeacher) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Hour 3: Classroom Discussion</CardTitle>
                  <CardDescription>
                    Week {weekNumber} • {tasks.length} practice tasks available
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Teacher View
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Session Launcher or Dashboard */}
        {!isSessionActive ? (
          <SessionLauncher
            tasks={tasks}
            onStartSession={createSession}
            isLoading={teacherLoading}
          />
        ) : (
          <ResponseDashboard
            sessionCode={sessionCode || ""}
            tasks={tasks}
            currentTaskId={session.current_task_id}
            responses={responses}
            threads={threads}
            participantCount={participantCount}
            onChangeTask={setCurrentTask}
            onGenerateAiCommentary={generateAiCommentary}
            onAddComment={addTeacherComment}
            onToggleSpotlight={toggleSpotlight}
            onEndSession={endSession}
          />
        )}
      </div>
    );
  }

  // Student View
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
                <CardTitle className="text-lg">Hour 3: Practice & Consolidation</CardTitle>
                <CardDescription>
                  Week {weekNumber} • Apply what you've learned with AI feedback
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Session Banner (if active) */}
      {activeSession && (
        <LiveSessionBanner
          session={activeSession}
          onJoin={() => {
            // For now, just show the session - full join logic can be added later
            showSession();
          }}
          onDismiss={dismissSession}
          isDismissed={isDismissed}
          onRestore={showSession}
        />
      )}

      {/* Main Content */}
      {selectedTask ? (
        <TaskWorkspace
          task={selectedTask}
          progress={getTaskProgress(selectedTask.id)}
          onSubmit={submitResponse}
          onSaveDraft={saveDraft}
          onBack={() => setSelectedTaskId(null)}
        />
      ) : (
        <TaskSelectDropdown
          tasks={tasks}
          getProgress={getTaskProgress}
          onSelectTask={setSelectedTaskId}
          selectedTaskId={selectedTaskId}
        />
      )}
    </div>
  );
}

export default ClassroomDiscussionPage;
