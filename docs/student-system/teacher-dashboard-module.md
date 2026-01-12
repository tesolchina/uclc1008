# Teacher Dashboard Module

## Purpose

Provides teachers and administrators with tools to:
- View all registered students and their progress
- Assign tasks to individuals, sections, or all students
- Monitor completion rates and engagement
- Export data for reporting

## File Structure

```
src/features/teacher-dashboard/
├── README.md                        # Documentation
├── index.ts                         # Public exports
├── types.ts                         # TypeScript interfaces
├── hooks/
│   ├── useStudentList.ts            # Fetch student registrations
│   ├── useStudentProgress.ts        # Fetch progress data
│   ├── useStudentFilters.ts         # Filter/search logic
│   └── useAssignTasks.ts            # Create/manage assignments
├── components/
│   ├── StudentListTable.tsx         # Main data table
│   ├── StudentListFilters.tsx       # Search/filter controls
│   ├── StudentDetailCard.tsx        # Individual student view
│   ├── ProgressSummary.tsx          # Progress charts
│   ├── SessionHistoryList.tsx       # Past session list
│   ├── ExportButton.tsx             # CSV export
│   ├── SectionSummaryCards.tsx      # Section-level stats
│   ├── AssignTaskModal.tsx          # Task creation dialog
│   └── TaskAssignmentForm.tsx       # Task form fields
└── pages/
    └── TeacherDashboardPage.tsx     # Main page component
```

## Code Examples with Comments

### types.ts
```typescript
/**
 * Teacher Dashboard Module - Type Definitions
 * 
 * These types extend and complement types from other modules.
 * They're optimized for teacher-facing views with aggregated data.
 */

// Re-export types from other modules for convenience
export type { StudentRegistration } from '@/features/student-id';
export type { AssignedTask, TaskProgress } from '@/features/student-dashboard';

/**
 * Student with aggregated progress information.
 * Used in the student list table.
 */
export interface StudentWithStats extends StudentRegistration {
  // Aggregated task stats
  tasksCompleted: number;
  tasksTotal: number;
  completionPercentage: number;
  
  // Activity metrics
  totalSessions: number;
  lastSessionAt?: Date;
  totalAiInteractions: number;
}

/**
 * Filters for the student list.
 */
export interface StudentFilters {
  sectionNumber?: string;
  teacherName?: string;
  searchQuery?: string;          // Search by ID, initials
  activityStatus?: 'active' | 'inactive' | 'all';
  sortBy?: 'lastActive' | 'name' | 'progress' | 'section';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Section summary for overview cards.
 */
export interface SectionSummary {
  sectionNumber: string;
  studentCount: number;
  activeCount: number;           // Active in last 7 days
  averageProgress: number;       // 0-100
  tasksAssigned: number;
}

/**
 * Form data for creating a new task assignment.
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  instructions?: string;
  
  // Target selection
  targetType: 'individual' | 'section' | 'all';
  targetStudentId?: string;
  targetSection?: string;
  
  // Content link
  linkedPage?: string;
  linkedUnitId?: string;
  linkedAssignmentId?: string;
  
  // Timing
  dueDate?: Date;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}
```

### hooks/useStudentList.ts
```typescript
/**
 * Hook: useStudentList
 * 
 * Fetches registered students with aggregated statistics.
 * 
 * SECURITY:
 * - RLS policies ensure only teachers/admins can access this data
 * - Teachers see all students (could be restricted to their sections)
 * 
 * PERFORMANCE:
 * - Uses database aggregation where possible
 * - Client-side filtering for fast UI updates
 * - Caches results with React Query
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentWithStats, StudentFilters } from '../types';

export function useStudentList(filters: StudentFilters = {}) {
  /**
   * Main query: Fetch all students with stats.
   * 
   * APPROACH:
   * We fetch students and their related data in one query,
   * then calculate stats client-side. For large datasets,
   * consider moving aggregation to a database view or function.
   */
  const query = useQuery({
    queryKey: ['teacher-students', filters],
    queryFn: async (): Promise<StudentWithStats[]> => {
      // Fetch students with related data
      const { data: students, error } = await supabase
        .from('student_registrations')
        .select(`
          *,
          task_progress:student_task_progress(count),
          sessions:student_sessions(count)
        `)
        .eq('is_active', true)
        .order('last_active_at', { ascending: false });

      if (error) throw error;

      // Fetch total tasks count for percentage calculation
      const { count: totalTasks } = await supabase
        .from('assigned_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Map to StudentWithStats
      return students.map(student => ({
        ...mapDbToStudent(student),
        tasksCompleted: student.task_progress?.[0]?.count || 0,
        tasksTotal: totalTasks || 0,
        completionPercentage: totalTasks 
          ? Math.round((student.task_progress?.[0]?.count || 0) / totalTasks * 100)
          : 0,
        totalSessions: student.sessions?.[0]?.count || 0,
        lastSessionAt: student.last_active_at,
        totalAiInteractions: 0, // Would need separate query
      }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  /**
   * Apply client-side filters for fast UI updates.
   */
  const filteredStudents = query.data?.filter(student => {
    // Section filter
    if (filters.sectionNumber && student.sectionNumber !== filters.sectionNumber) {
      return false;
    }

    // Teacher filter
    if (filters.teacherName && student.teacherName !== filters.teacherName) {
      return false;
    }

    // Search filter (ID or initials)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesId = student.uniqueId.toLowerCase().includes(query);
      const matchesInitials = `${student.firstInitial}${student.lastInitial}`
        .toLowerCase()
        .includes(query);
      if (!matchesId && !matchesInitials) return false;
    }

    // Activity status filter
    if (filters.activityStatus && filters.activityStatus !== 'all') {
      const isActive = student.lastActiveAt && 
        differenceInDays(new Date(), student.lastActiveAt) <= 7;
      if (filters.activityStatus === 'active' && !isActive) return false;
      if (filters.activityStatus === 'inactive' && isActive) return false;
    }

    return true;
  }) ?? [];

  /**
   * Sort filtered results.
   */
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    
    switch (filters.sortBy) {
      case 'progress':
        return (a.completionPercentage - b.completionPercentage) * order;
      case 'section':
        return (a.sectionNumber || '').localeCompare(b.sectionNumber || '') * order;
      case 'name':
        const nameA = `${a.firstInitial}${a.lastInitial}`;
        const nameB = `${b.firstInitial}${b.lastInitial}`;
        return nameA.localeCompare(nameB) * order;
      case 'lastActive':
      default:
        const dateA = a.lastActiveAt?.getTime() || 0;
        const dateB = b.lastActiveAt?.getTime() || 0;
        return (dateB - dateA) * order;
    }
  });

  return {
    students: sortedStudents,
    allStudents: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### hooks/useAssignTasks.ts
```typescript
/**
 * Hook: useAssignTasks
 * 
 * Provides functionality to create and manage task assignments.
 * 
 * CONNECTIONS:
 * - Creates records in assigned_tasks table
 * - These are then visible to students via student-dashboard module
 * - Can link to existing units/assignments in the content system
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateTaskData, AssignedTask } from '../types';

export function useAssignTasks() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /**
   * Mutation: Create a new task assignment.
   * 
   * FLOW:
   * 1. Validate input data
   * 2. Insert into assigned_tasks
   * 3. Invalidate relevant caches
   * 4. Return created task
   */
  const createTask = useMutation({
    mutationFn: async (data: CreateTaskData): Promise<AssignedTask> => {
      if (!user) throw new Error('Must be logged in');

      // Build database record
      const taskRecord = {
        teacher_id: user.id,
        target_type: data.targetType,
        target_student_id: data.targetStudentId || null,
        target_section: data.targetSection || null,
        title: data.title,
        description: data.description || null,
        instructions: data.instructions || null,
        linked_page: data.linkedPage || null,
        linked_unit_id: data.linkedUnitId || null,
        linked_assignment_id: data.linkedAssignmentId || null,
        due_date: data.dueDate?.toISOString() || null,
        priority: data.priority || 'normal',
        is_active: true,
      };

      const { data: created, error } = await supabase
        .from('assigned_tasks')
        .insert(taskRecord)
        .select()
        .single();

      if (error) throw error;
      return mapDbToTask(created);
    },
    onSuccess: () => {
      // Invalidate both teacher and student task caches
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
    },
  });

  /**
   * Mutation: Update an existing task.
   */
  const updateTask = useMutation({
    mutationFn: async ({ 
      taskId, 
      updates 
    }: { 
      taskId: string; 
      updates: Partial<CreateTaskData>;
    }) => {
      const { error } = await supabase
        .from('assigned_tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
    },
  });

  /**
   * Mutation: Deactivate a task (soft delete).
   */
  const deactivateTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('assigned_tasks')
        .update({ is_active: false })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
    },
  });

  return {
    createTask: createTask.mutate,
    createTaskAsync: createTask.mutateAsync,
    isCreating: createTask.isPending,
    
    updateTask: updateTask.mutate,
    isUpdating: updateTask.isPending,
    
    deactivateTask: deactivateTask.mutate,
    isDeactivating: deactivateTask.isPending,
  };
}
```

### components/AssignTaskModal.tsx
```typescript
/**
 * AssignTaskModal Component
 * 
 * Modal dialog for creating new task assignments.
 * 
 * FEATURES:
 * - Target selection (all, section, individual)
 * - Content linking (pages, units, assignments)
 * - Due date picker
 * - Priority selection
 * 
 * CONNECTIONS:
 * - Uses useAssignTasks hook for submission
 * - Uses existing content data for linking options
 * - Validates input with Zod schema
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignTasks } from '../hooks/useAssignTasks';
import { TaskAssignmentForm } from './TaskAssignmentForm';

/**
 * Validation schema for task creation.
 */
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  instructions: z.string().max(2000).optional(),
  targetType: z.enum(['individual', 'section', 'all']),
  targetStudentId: z.string().optional(),
  targetSection: z.string().optional(),
  linkedPage: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
}).refine(
  // Ensure target is specified when type is individual or section
  (data) => {
    if (data.targetType === 'individual' && !data.targetStudentId) return false;
    if (data.targetType === 'section' && !data.targetSection) return false;
    return true;
  },
  { message: 'Target must be specified for individual or section assignments' }
);

type TaskFormData = z.infer<typeof taskSchema>;

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignTaskModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: AssignTaskModalProps) {
  const { createTaskAsync, isCreating } = useAssignTasks();
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      targetType: 'all',
      priority: 'normal',
    },
  });

  /**
   * Handle form submission.
   */
  async function handleSubmit(data: TaskFormData) {
    try {
      await createTaskAsync(data);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create task:', error);
      // Show error toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <TaskAssignmentForm form={form} />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### components/StudentListTable.tsx
```typescript
/**
 * StudentListTable Component
 * 
 * Displays a sortable, filterable table of registered students.
 * 
 * FEATURES:
 * - Sortable columns (click headers)
 * - Row click to view student details
 * - Progress bar in each row
 * - Quick actions (view, message)
 * 
 * CONNECTIONS:
 * - Uses useStudentList hook for data
 * - Opens StudentDetailCard on row click
 * - Receives filters from StudentListFilters
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { StudentWithStats, StudentFilters } from '../types';
import { cn } from '@/lib/utils';

interface StudentListTableProps {
  students: StudentWithStats[];
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
  onSelectStudent: (student: StudentWithStats) => void;
}

export function StudentListTable({
  students,
  filters,
  onFiltersChange,
  onSelectStudent,
}: StudentListTableProps) {
  /**
   * Handle column header click for sorting.
   */
  function handleSort(column: StudentFilters['sortBy']) {
    const newOrder = 
      filters.sortBy === column && filters.sortOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    onFiltersChange({ ...filters, sortBy: column, sortOrder: newOrder });
  }

  /**
   * Render sort indicator for column headers.
   */
  function SortIndicator({ column }: { column: StudentFilters['sortBy'] }) {
    return (
      <ArrowUpDown className={cn(
        'ml-2 h-4 w-4',
        filters.sortBy === column ? 'opacity-100' : 'opacity-30'
      )} />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Sortable column headers */}
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Student
                <SortIndicator column="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('section')}
            >
              <div className="flex items-center">
                Section
                <SortIndicator column="section" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('progress')}
            >
              <div className="flex items-center">
                Progress
                <SortIndicator column="progress" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('lastActive')}
            >
              <div className="flex items-center">
                Last Active
                <SortIndicator column="lastActive" />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => (
            <TableRow 
              key={student.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectStudent(student)}
            >
              {/* Student ID and initials */}
              <TableCell>
                <div className="font-medium">{student.uniqueId}</div>
                <div className="text-sm text-muted-foreground">
                  {student.firstInitial}.{student.lastInitial}.
                </div>
              </TableCell>

              {/* Section */}
              <TableCell>
                {student.sectionNumber ? (
                  <Badge variant="outline">{student.sectionNumber}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Progress */}
              <TableCell>
                <div className="w-32 space-y-1">
                  <Progress 
                    value={student.completionPercentage} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {student.tasksCompleted}/{student.tasksTotal} tasks
                  </div>
                </div>
              </TableCell>

              {/* Last active */}
              <TableCell>
                {student.lastActiveAt ? (
                  <span className="text-sm">
                    {formatDistanceToNow(student.lastActiveAt, { 
                      addSuffix: true 
                    })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Never</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStudent(student);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

## Integration with Other Modules

### Connecting to Student ID Module
```typescript
// types.ts - Re-export for convenience
export type { StudentRegistration } from '@/features/student-id';

// hooks/useStudentList.ts - Query the same table
const { data } = await supabase
  .from('student_registrations')  // Same table as student-id module
  .select('*');
```

### Connecting to Student Dashboard Module
```typescript
// The tasks created here appear in student dashboards
// via the assigned_tasks table

// When teacher creates a task:
await supabase.from('assigned_tasks').insert({
  target_type: 'section',
  target_section: 'A01',
  title: 'Complete Unit 1',
  // ...
});

// Student dashboard fetches:
await supabase.from('assigned_tasks')
  .select('*')
  .or(`target_type.eq.all,target_section.eq.${studentSection}`);
```

## Customization Points

### Adding Role-Based Restrictions
```typescript
// Restrict teachers to only see their sections
export function useStudentList(filters: StudentFilters = {}) {
  const { user, profile } = useAuth();
  
  const query = useQuery({
    queryFn: async () => {
      let query = supabase
        .from('student_registrations')
        .select('*');
      
      // Teachers only see their assigned sections
      if (profile?.role === 'teacher') {
        const { data: sections } = await supabase
          .from('teacher_sections')
          .select('section_number')
          .eq('teacher_id', user.id);
        
        const sectionNumbers = sections?.map(s => s.section_number) || [];
        query = query.in('section_number', sectionNumbers);
      }
      
      // Admins see everything (no filter)
      
      return query;
    },
  });
}
```

### Adding Export Functionality
```typescript
// components/ExportButton.tsx
export function ExportButton({ students }: { students: StudentWithStats[] }) {
  function exportToCsv() {
    const headers = ['ID', 'Initials', 'Section', 'Progress', 'Last Active'];
    const rows = students.map(s => [
      s.uniqueId,
      `${s.firstInitial}.${s.lastInitial}.`,
      s.sectionNumber || '',
      `${s.completionPercentage}%`,
      s.lastActiveAt?.toISOString() || '',
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  return (
    <Button variant="outline" onClick={exportToCsv}>
      Export CSV
    </Button>
  );
}
```

### Adding Real-Time Updates
```typescript
// hooks/useStudentListRealtime.ts
export function useStudentListRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to changes in student_registrations
    const channel = supabase
      .channel('student-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_registrations' },
        (payload) => {
          // Invalidate cache to refetch
          queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
```
