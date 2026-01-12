# Integration Guide

## Overview

This guide explains how to integrate the student system modules into an existing React application.

## Prerequisites

- React 18+
- React Router v6
- Tanstack Query v5
- Supabase client configured
- shadcn/ui components installed

## Step-by-Step Integration

### Step 1: Add Feature Folders

Copy the feature folders to your project:

```
src/features/
├── student-id/
├── student-dashboard/
└── teacher-dashboard/
```

### Step 2: Run Database Migrations

Apply the migrations in order:

```sql
-- 1. Student registrations table
-- See database-schema.md for full SQL

-- 2. Assigned tasks table
-- See database-schema.md for full SQL

-- 3. Student task progress table
-- See database-schema.md for full SQL
```

### Step 3: Configure App.tsx

```tsx
/**
 * App.tsx - Root Application Component
 * 
 * INTEGRATION POINTS:
 * 1. Wrap app with StudentProvider for global student state
 * 2. Add routes for student and teacher pages
 * 3. Conditionally render based on user role
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import student system providers
import { StudentProvider } from '@/features/student-id';

// Import pages
import { StudentIdPage } from '@/features/student-id';
import { StudentDashboardPage } from '@/features/student-dashboard';
import { TeacherDashboardPage } from '@/features/teacher-dashboard';

// Import existing components
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* 
          AuthProvider: For teacher/admin authentication (email/password)
          StudentProvider: For student identification (unique ID system)
          
          Both can coexist - teachers use auth, students use unique IDs
        */}
        <AuthProvider>
          <StudentProvider>
            <Routes>
              {/* 
                Student routes - accessible without auth
                Students identify themselves via unique ID
              */}
              <Route path="student" element={<StudentIdPage />} />
              <Route path="dashboard" element={<StudentDashboardPage />} />
              
              {/* 
                Teacher routes - require auth
                Protected by RoleGuard component
              */}
              <Route 
                path="teacher-dashboard" 
                element={
                  <RoleGuard roles={['teacher', 'admin']}>
                    <TeacherDashboardPage />
                  </RoleGuard>
                } 
              />
              
              {/* Other routes wrapped in layout */}
              <Route element={<AppLayout />}>
                {/* ... existing routes ... */}
              </Route>
            </Routes>
          </StudentProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### Step 4: Update AppLayout for Student Status

```tsx
/**
 * AppLayout.tsx - Main Layout Component
 * 
 * INTEGRATION: Show student status bar when student is registered
 */

import React from 'react';
import { useStudentId, StudentStatusBar } from '@/features/student-id';
import { useAuth } from '@/contexts/AuthContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isRegistered } = useStudentId();
  const { user } = useAuth();
  
  // Determine if we should show student UI or teacher UI
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />
          
          {/* 
            Show student status for students
            Show user menu for teachers
          */}
          {!isTeacher && isRegistered && <StudentStatusBar />}
          {isTeacher && <UserMenu />}
        </div>
      </header>

      {/* Sidebar + Main content */}
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
```

### Step 5: Update AppSidebar with Dashboard Links

```tsx
/**
 * AppSidebar.tsx - Navigation Sidebar
 * 
 * INTEGRATION: Add links to student and teacher dashboards
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import { useStudentId } from '@/features/student-id';
import { useAuth } from '@/contexts/AuthContext';

export function AppSidebar() {
  const { isRegistered } = useStudentId();
  const { user } = useAuth();
  
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        {/* 
          Student Dashboard Link
          Only shown when student is registered
        */}
        {isRegistered && !isTeacher && (
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            My Dashboard
          </NavLink>
        )}

        {/* 
          Teacher Dashboard Link
          Only shown for teachers and admins
        */}
        {isTeacher && (
          <NavLink 
            to="/teacher-dashboard"
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <Users className="h-4 w-4" />
            Student Records
          </NavLink>
        )}

        {/* ... other navigation items ... */}
      </nav>
    </aside>
  );
}
```

### Step 6: Protect Content Pages

```tsx
/**
 * WeekPage.tsx (or any content page)
 * 
 * INTEGRATION: Require student registration before accessing content
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStudentId } from '@/features/student-id';
import { useAuth } from '@/contexts/AuthContext';

export function WeekPage() {
  const { isRegistered, isLoading: studentLoading } = useStudentId();
  const { user, loading: authLoading } = useAuth();

  // Show loading while checking status
  if (studentLoading || authLoading) {
    return <LoadingSpinner />;
  }

  // Teachers don't need student registration
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  // Redirect students to registration if not registered
  if (!isTeacher && !isRegistered) {
    return <Navigate to="/student" replace />;
  }

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Step 7: Track Task Progress in Content Pages

```tsx
/**
 * InteractiveUnitViewer.tsx (or any learning content component)
 * 
 * INTEGRATION: Report progress when student completes content
 */

import React, { useEffect } from 'react';
import { useStudentId } from '@/features/student-id';
import { useStudentTasks } from '@/features/student-dashboard';

interface InteractiveUnitViewerProps {
  unitId: string;
  // ... other props
}

export function InteractiveUnitViewer({ unitId }: InteractiveUnitViewerProps) {
  const { student } = useStudentId();
  const { tasks, updateProgress } = useStudentTasks();

  // Find task linked to this unit
  const linkedTask = tasks.find(t => t.linkedUnitId === unitId);

  // Mark as in_progress when unit is opened
  useEffect(() => {
    if (linkedTask && linkedTask.progress?.status === 'pending') {
      updateProgress({ taskId: linkedTask.id, status: 'in_progress' });
    }
  }, [linkedTask, updateProgress]);

  // Handler for when student completes the unit
  function handleUnitComplete() {
    if (linkedTask) {
      updateProgress({ taskId: linkedTask.id, status: 'completed' });
    }
  }

  return (
    <div>
      {/* Unit content */}
      
      <Button onClick={handleUnitComplete}>
        Mark as Complete
      </Button>
    </div>
  );
}
```

## Cross-Module Data Flow

### Complete Flow Example

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE DATA FLOW                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  1. STUDENT REGISTRATION                                                   │
│     ┌─────────────────┐                                                    │
│     │ RegistrationWizard                                                   │
│     │ (student-id)    │                                                    │
│     └────────┬────────┘                                                    │
│              │ creates                                                     │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ student_        │                                                    │
│     │ registrations   │                                                    │
│     └────────┬────────┘                                                    │
│              │ provides unique_id                                          │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ StudentContext  │ ─── stores in localStorage for persistence         │
│     │ (student-id)    │                                                    │
│     └────────┬────────┘                                                    │
│              │ provides via useStudentId()                                 │
│              ▼                                                             │
│                                                                            │
│  2. TEACHER ASSIGNS TASK                                                   │
│     ┌─────────────────┐                                                    │
│     │ AssignTaskModal │                                                    │
│     │ (teacher-dash)  │                                                    │
│     └────────┬────────┘                                                    │
│              │ creates via useAssignTasks()                                │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ assigned_tasks  │ ─── linked_page = "/week/1/unit/unit1_1"           │
│     │                 │ ─── target_section = "A01"                         │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│                                                                            │
│  3. STUDENT VIEWS DASHBOARD                                                │
│     ┌─────────────────┐                                                    │
│     │ useStudentTasks │ ─── queries assigned_tasks WHERE                   │
│     │ (student-dash)  │     target_section = student.sectionNumber         │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ TaskCard        │ ─── displays task with instructions                │
│     │                 │ ─── [Go to Task] links to linked_page              │
│     └────────┬────────┘                                                    │
│              │ student clicks "Start Task"                                 │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ student_task_   │ ─── status = 'in_progress'                         │
│     │ progress        │ ─── started_at = now()                             │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│                                                                            │
│  4. STUDENT COMPLETES CONTENT                                              │
│     ┌─────────────────┐                                                    │
│     │ InteractiveUnit │ ─── content page at /week/1/unit/unit1_1           │
│     │ Viewer          │                                                    │
│     └────────┬────────┘                                                    │
│              │ student completes all slides/tasks                          │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ useStudentTasks.│ ─── updates progress                               │
│     │ updateProgress  │                                                    │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ student_task_   │ ─── status = 'completed'                           │
│     │ progress        │ ─── completed_at = now()                           │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│                                                                            │
│  5. TEACHER MONITORS PROGRESS                                              │
│     ┌─────────────────┐                                                    │
│     │ TeacherDashboard│                                                    │
│     │ Page            │                                                    │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ useStudentList  │ ─── queries student_registrations                  │
│     │                 │     + aggregates from student_task_progress        │
│     └────────┬────────┘                                                    │
│              │                                                             │
│              ▼                                                             │
│     ┌─────────────────┐                                                    │
│     │ StudentList     │ ─── shows all students with progress %             │
│     │ Table           │                                                    │
│     └─────────────────┘                                                    │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
```

## Barrel Export Pattern

Each module uses a barrel export (`index.ts`) to provide a clean public API:

```typescript
/**
 * src/features/student-id/index.ts
 * 
 * PUBLIC API for the student-id module.
 * Other modules import from here, not from internal files.
 */

// Context and hooks (most commonly used)
export { StudentProvider } from './context/StudentContext';
export { useStudentId } from './hooks/useStudentId';

// Components (for use in other parts of the app)
export { RegistrationWizard } from './components/RegistrationWizard';
export { StudentIdCard } from './components/StudentIdCard';
export { StudentStatusBar } from './components/StudentStatusBar';
export { LoginForm } from './components/LoginForm';

// Types (for type safety in consuming code)
export type { 
  StudentRegistration, 
  RegistrationFormData,
  StudentContextValue,
} from './types';

// Pages (for routing)
export { StudentIdPage } from './pages/StudentIdPage';
```

## Styling Integration

All components use Tailwind CSS with semantic tokens:

```tsx
// Use semantic color tokens, not hardcoded colors
<Badge className="bg-primary text-primary-foreground">
  Primary Badge
</Badge>

// Use design system spacing
<div className="p-4 space-y-2">
  Content with consistent spacing
</div>

// Use theme-aware shadows
<Card className="shadow-md dark:shadow-lg">
  Card with theme-aware shadow
</Card>
```

## Testing Strategy

Each module can be tested in isolation:

```typescript
// Unit test for generateUniqueId
describe('generateUniqueId', () => {
  it('creates ID in correct format', async () => {
    const mockSupabase = { from: () => ({ select: () => ({ single: () => ({ data: null }) }) }) };
    
    const id = await generateUniqueId(
      { lastFourDigits: '1234', firstInitial: 'J', lastInitial: 'D' },
      mockSupabase
    );
    
    expect(id).toMatch(/^1234-JD-[A-Z0-9]{2}$/);
  });
});

// Integration test for registration flow
describe('RegistrationWizard', () => {
  it('completes registration flow', async () => {
    render(<StudentProvider><RegistrationWizard /></StudentProvider>);
    
    // Step 1: Enter digits
    await userEvent.type(screen.getByLabelText(/last 4 digits/i), '1234');
    await userEvent.click(screen.getByText('Next'));
    
    // Step 2: Enter initials
    await userEvent.type(screen.getByLabelText(/first initial/i), 'J');
    await userEvent.type(screen.getByLabelText(/last initial/i), 'D');
    await userEvent.click(screen.getByText('Next'));
    
    // Step 3: Skip optional info
    await userEvent.click(screen.getByText('Complete'));
    
    // Verify success
    expect(await screen.findByText(/your unique id/i)).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **"useStudentId must be used within StudentProvider"**
   - Ensure `<StudentProvider>` wraps your app in `App.tsx`

2. **Tasks not showing for students**
   - Check RLS policies on `assigned_tasks` table
   - Verify student's section matches task's `target_section`

3. **Progress not updating**
   - Check RLS policies on `student_task_progress` table
   - Ensure unique constraint exists on `(student_unique_id, assigned_task_id)`

4. **Teacher can't see students**
   - Verify teacher has correct role in `profiles` table
   - Check `has_role` function is working correctly
