# Student Dashboard Module

## Purpose

Provides a personal dashboard where students can view assigned tasks, track progress, and access linked content with instructions.

## File Structure

```
src/features/student-dashboard/
├── README.md                        # Documentation
├── index.ts                         # Public exports
├── types.ts                         # TypeScript interfaces
├── hooks/
│   ├── useStudentTasks.ts           # Fetch assigned tasks
│   ├── useStudentProgress.ts        # Fetch/update progress
│   └── useTaskFilters.ts            # Filter/sort logic
├── components/
│   ├── TaskList.tsx                 # Main task list view
│   ├── TaskCard.tsx                 # Individual task card
│   ├── TaskFilters.tsx              # Filter by status/week
│   ├── ProgressOverview.tsx         # Progress summary
│   ├── WeeklyProgress.tsx           # Week-by-week view
│   ├── UpcomingDeadlines.tsx        # Deadline reminders
│   └── QuickAccessLinks.tsx         # Navigation shortcuts
└── pages/
    └── StudentDashboardPage.tsx     # Main page component
```

## Code Examples with Comments

### types.ts
```typescript
/**
 * Student Dashboard Module - Type Definitions
 * 
 * These types define the structure of tasks and progress tracking.
 * They map to the database schema and are used throughout the module.
 */

/**
 * Represents a task assigned by a teacher.
 * Maps to the assigned_tasks database table.
 */
export interface AssignedTask {
  id: string;
  teacherId: string;
  
  // Who should see this task
  targetType: 'individual' | 'section' | 'all';
  targetStudentId?: string;      // For individual assignments
  targetSection?: string;        // For section assignments
  
  // Task content
  title: string;
  description?: string;
  instructions?: string;         // Detailed instructions shown to student
  
  // Links to content
  linkedPage?: string;           // Route path, e.g., "/week/1/unit/unit1_1"
  linkedAssignmentId?: string;   // Assignment ID, e.g., "pre-course-writing"
  linkedUnitId?: string;         // Unit ID, e.g., "unit1_1"
  
  // Timing
  dueDate?: Date;
  assignedAt: Date;
  
  // Status
  isActive: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

/**
 * Tracks a student's progress on a specific task.
 * Maps to the student_task_progress database table.
 */
export interface TaskProgress {
  id: string;
  studentUniqueId: string;       // Links to student_registrations.unique_id
  assignedTaskId: string;        // Links to assigned_tasks.id
  
  status: TaskStatus;
  startedAt?: Date;
  completedAt?: Date;
  
  // Optional response data (for tasks that collect input)
  responseData?: Record<string, unknown>;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

/**
 * Combined view of task with its progress.
 * Used by UI components to render task cards.
 */
export interface TaskWithProgress extends AssignedTask {
  progress: TaskProgress | null;
}

/**
 * Filter options for the task list.
 */
export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: AssignedTask['priority'] | 'all';
  weekNumber?: number;
  searchQuery?: string;
}
```

### hooks/useStudentTasks.ts
```typescript
/**
 * Hook: useStudentTasks
 * 
 * Fetches tasks assigned to the current student.
 * 
 * DEPENDENCIES:
 * - useStudentId() from student-id module (gets current student)
 * - supabase client for database queries
 * - React Query for caching and state management
 * 
 * QUERY LOGIC:
 * A task is visible to a student if:
 * 1. target_type = 'all' (assigned to everyone)
 * 2. target_type = 'section' AND target_section = student's section
 * 3. target_type = 'individual' AND target_student_id = student's unique_id
 * 
 * JOINS:
 * Fetches tasks with their progress in a single query to avoid N+1.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStudentId } from '@/features/student-id';
import type { TaskWithProgress, TaskFilters, TaskStatus } from '../types';

export function useStudentTasks(filters: TaskFilters = {}) {
  const { student, isRegistered } = useStudentId();
  const queryClient = useQueryClient();

  /**
   * Main query: Fetch all tasks visible to this student.
   * Joins with progress table to get completion status.
   */
  const tasksQuery = useQuery({
    queryKey: ['student-tasks', student?.uniqueId, student?.sectionNumber, filters],
    queryFn: async (): Promise<TaskWithProgress[]> => {
      if (!student) return [];

      // Build query for tasks targeting this student
      const { data: tasks, error } = await supabase
        .from('assigned_tasks')
        .select(`
          *,
          progress:student_task_progress!left(*)
        `)
        .eq('is_active', true)
        .or(`
          target_type.eq.all,
          and(target_type.eq.section,target_section.eq.${student.sectionNumber}),
          and(target_type.eq.individual,target_student_id.eq.${student.uniqueId})
        `)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;

      // Transform database response to our types
      return tasks.map(task => ({
        ...mapDbToTask(task),
        progress: task.progress?.[0] 
          ? mapDbToProgress(task.progress[0]) 
          : null,
      }));
    },
    enabled: isRegistered,
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  /**
   * Mutation: Update task progress.
   * Called when student starts, completes, or skips a task.
   */
  const updateProgress = useMutation({
    mutationFn: async ({ 
      taskId, 
      status 
    }: { 
      taskId: string; 
      status: TaskStatus;
    }) => {
      if (!student) throw new Error('Not logged in');

      const now = new Date().toISOString();
      const progressData = {
        student_unique_id: student.uniqueId,
        assigned_task_id: taskId,
        status,
        ...(status === 'in_progress' && { started_at: now }),
        ...(status === 'completed' && { completed_at: now }),
      };

      // Upsert: create if not exists, update if exists
      const { error } = await supabase
        .from('student_task_progress')
        .upsert(progressData, {
          onConflict: 'student_unique_id,assigned_task_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate cache to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
    },
  });

  /**
   * Filter tasks based on current filters.
   * Done client-side for fast UI updates.
   */
  const filteredTasks = tasksQuery.data?.filter(task => {
    if (filters.status && filters.status !== 'all') {
      const taskStatus = task.progress?.status || 'pending';
      if (taskStatus !== filters.status) return false;
    }
    
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) return false;
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDesc = task.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc) return false;
    }
    
    return true;
  }) ?? [];

  return {
    tasks: filteredTasks,
    allTasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending,
  };
}

// Helper functions to map database rows to TypeScript types
function mapDbToTask(row: any): AssignedTask { /* ... */ }
function mapDbToProgress(row: any): TaskProgress { /* ... */ }
```

### components/TaskCard.tsx
```typescript
/**
 * TaskCard Component
 * 
 * Displays a single assigned task with:
 * - Priority indicator (color-coded)
 * - Title and description
 * - Due date with countdown
 * - Instructions (expandable)
 * - Progress status
 * - Action buttons (Start, Complete, Go to Task)
 * 
 * CONNECTIONS:
 * - Uses TaskWithProgress type from types.ts
 * - Calls updateProgress from useStudentTasks hook
 * - Links to content pages via linkedPage prop
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent 
} from '@/components/ui/collapsible';
import { Clock, ChevronDown, ExternalLink, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { TaskWithProgress } from '../types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: TaskWithProgress;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

/**
 * Priority badge colors mapped to Tailwind classes.
 * Uses semantic tokens for consistency.
 */
const priorityColors = {
  urgent: 'bg-destructive text-destructive-foreground',
  high: 'bg-orange-500 text-white',
  normal: 'bg-muted text-muted-foreground',
  low: 'bg-secondary text-secondary-foreground',
};

export function TaskCard({ task, onUpdateStatus }: TaskCardProps) {
  // Track if instructions panel is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Derive current status from progress (default to pending)
  const status = task.progress?.status || 'pending';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  /**
   * Handle starting a task.
   * Updates status to in_progress and navigates to linked page.
   */
  function handleStart() {
    if (status === 'pending') {
      onUpdateStatus(task.id, 'in_progress');
    }
    // Navigation happens via Link component
  }

  /**
   * Handle marking task as complete.
   */
  function handleComplete() {
    onUpdateStatus(task.id, 'completed');
  }

  return (
    <Card className={cn(
      'transition-all',
      isCompleted && 'opacity-60 border-green-500/50'
    )}>
      <CardHeader className="pb-2">
        {/* Priority badge and status indicator */}
        <div className="flex items-center justify-between">
          <Badge className={priorityColors[task.priority]}>
            {task.priority.toUpperCase()}
          </Badge>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        
        {/* Task title */}
        <h3 className="font-semibold text-lg">{task.title}</h3>
        
        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Due date with countdown */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Due: {formatDistanceToNow(task.dueDate, { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Expandable instructions section */}
        {task.instructions && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                View Instructions
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded && 'rotate-180'
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
                {task.instructions}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              {task.linkedPage && (
                <Button asChild onClick={handleStart}>
                  <Link to={task.linkedPage}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {isInProgress ? 'Continue' : 'Start Task'}
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={handleComplete}>
                Mark Complete
              </Button>
            </>
          )}
          {isCompleted && task.linkedPage && (
            <Button variant="outline" asChild>
              <Link to={task.linkedPage}>Review Task</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### components/ProgressOverview.tsx
```typescript
/**
 * ProgressOverview Component
 * 
 * Shows a summary of the student's progress:
 * - Overall completion percentage
 * - Task counts by status
 * - Visual progress bar
 * 
 * REUSABILITY:
 * This component pattern works for any progress tracking:
 * 1. Accept items with a status field
 * 2. Calculate counts and percentages
 * 3. Render visual indicators
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TaskWithProgress } from '../types';

interface ProgressOverviewProps {
  tasks: TaskWithProgress[];
}

export function ProgressOverview({ tasks }: ProgressOverviewProps) {
  // Calculate status counts
  const counts = tasks.reduce(
    (acc, task) => {
      const status = task.progress?.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { pending: 0, in_progress: 0, completed: 0, skipped: 0 }
  );

  const total = tasks.length;
  const completed = counts.completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completed} of {total} tasks completed</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Completed: {counts.completed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>In Progress: {counts.in_progress}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span>Pending: {counts.pending}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span>Skipped: {counts.skipped}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Integration with Other Modules

### Using Student ID Module
```typescript
// The dashboard depends on student-id module for authentication
import { useStudentId, StudentIdCard } from '@/features/student-id';

function StudentDashboardPage() {
  const { student, isRegistered, isLoading } = useStudentId();

  // Redirect to registration if not logged in
  if (!isLoading && !isRegistered) {
    return <Navigate to="/student" />;
  }

  return (
    <div>
      {/* Show student's ID card in header */}
      <StudentIdCard />
      
      {/* Dashboard content */}
      <TaskList />
    </div>
  );
}
```

### Used by Teacher Dashboard
```typescript
// Teacher dashboard queries progress data
import type { TaskProgress } from '@/features/student-dashboard';

function StudentDetailView({ studentId }: { studentId: string }) {
  const { data: progress } = useQuery({
    queryKey: ['student-progress', studentId],
    queryFn: () => supabase
      .from('student_task_progress')
      .select('*, assigned_tasks(*)')
      .eq('student_unique_id', studentId),
  });

  return (
    <div>
      {progress?.map(p => (
        <div key={p.id}>
          {p.assigned_tasks.title}: {p.status}
        </div>
      ))}
    </div>
  );
}
```

## Customization Points

### Adding New Task Types
Edit `types.ts` to add custom task types:
```typescript
export interface AssignedTask {
  // ... existing fields
  
  // Add new task type field
  taskType: 'reading' | 'quiz' | 'writing' | 'discussion' | 'custom';
  
  // Add type-specific metadata
  metadata?: {
    quizId?: string;
    discussionTopicId?: string;
    wordLimit?: number;
  };
}
```

### Custom Task Card Variants
Create specialized card components for different task types:
```typescript
// components/QuizTaskCard.tsx
export function QuizTaskCard({ task }: { task: TaskWithProgress }) {
  // Specialized rendering for quiz tasks
  return (
    <Card>
      {/* Quiz-specific UI: question count, time limit, etc. */}
    </Card>
  );
}

// components/TaskCard.tsx - use a factory pattern
export function TaskCard({ task, ...props }: TaskCardProps) {
  switch (task.taskType) {
    case 'quiz':
      return <QuizTaskCard task={task} {...props} />;
    case 'writing':
      return <WritingTaskCard task={task} {...props} />;
    default:
      return <DefaultTaskCard task={task} {...props} />;
  }
}
```

### Adding Notifications
Create a notification hook that uses task deadlines:
```typescript
// hooks/useTaskNotifications.ts
export function useTaskNotifications() {
  const { tasks } = useStudentTasks();
  
  // Find tasks due soon (within 24 hours)
  const dueSoon = tasks.filter(task => {
    if (!task.dueDate || task.progress?.status === 'completed') return false;
    const hoursUntilDue = differenceInHours(task.dueDate, new Date());
    return hoursUntilDue > 0 && hoursUntilDue <= 24;
  });

  // Show browser notification
  useEffect(() => {
    if (dueSoon.length > 0 && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(`${dueSoon.length} tasks due soon!`);
        }
      });
    }
  }, [dueSoon.length]);

  return { dueSoon };
}
```
