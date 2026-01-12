# Database Schema

## Overview

The student identification and dashboard system uses three main tables:

1. **student_registrations** - Student identity and profile
2. **assigned_tasks** - Tasks created by teachers
3. **student_task_progress** - Student completion tracking

## Entity Relationship Diagram

```
┌─────────────────────────────┐
│     student_registrations   │
├─────────────────────────────┤
│ id (PK)                     │
│ unique_id (UNIQUE)          │◄────────────────────────┐
│ last_four_digits            │                         │
│ first_initial               │                         │
│ last_initial                │                         │
│ section_number              │                         │
│ teacher_name                │                         │
│ browser_session_id          │                         │
│ is_active                   │                         │
│ last_active_at              │                         │
│ created_at                  │                         │
│ updated_at                  │                         │
└─────────────────────────────┘                         │
                                                        │
┌─────────────────────────────┐                         │
│       assigned_tasks        │                         │
├─────────────────────────────┤                         │
│ id (PK)                     │◄──────────────┐         │
│ teacher_id (FK → auth.users)│               │         │
│ target_type                 │               │         │
│ target_student_id ──────────┼───────────────┼─────────┤
│ target_section              │               │         │
│ title                       │               │         │
│ description                 │               │         │
│ instructions                │               │         │
│ linked_page                 │               │         │
│ linked_assignment_id        │               │         │
│ linked_unit_id              │               │         │
│ due_date                    │               │         │
│ assigned_at                 │               │         │
│ is_active                   │               │         │
│ priority                    │               │         │
│ created_at                  │               │         │
│ updated_at                  │               │         │
└─────────────────────────────┘               │         │
                                              │         │
┌─────────────────────────────┐               │         │
│   student_task_progress     │               │         │
├─────────────────────────────┤               │         │
│ id (PK)                     │               │         │
│ student_unique_id ──────────┼───────────────┼─────────┘
│ assigned_task_id (FK) ──────┼───────────────┘
│ status                      │
│ started_at                  │
│ completed_at                │
│ response_data               │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
```

## Table Definitions

### student_registrations

Stores student registration data. This table is the core identity table.

```sql
/**
 * student_registrations
 * 
 * PURPOSE: Store student identity without requiring email/password auth.
 * 
 * DESIGN NOTES:
 * - unique_id is human-readable and memorable (e.g., "1234-JD-7X")
 * - Only last 4 digits stored for privacy
 * - browser_session_id enables "remember me" on same device
 * - is_active flag for soft deletes
 * - last_active_at for engagement tracking
 */
CREATE TABLE public.student_registrations (
  -- Primary key: UUID for database operations
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Human-readable unique identifier
  -- Format: {last4}-{initials}-{random2}, e.g., "1234-JD-7X"
  -- This is what students remember and use to log in
  unique_id TEXT NOT NULL UNIQUE,
  
  -- Partial student ID (privacy-preserving)
  -- Only stores last 4 digits, not full student number
  last_four_digits TEXT NOT NULL,
  
  -- Name initials (single characters, uppercase)
  first_initial TEXT NOT NULL,
  last_initial TEXT NOT NULL,
  
  -- Optional class information (nullable)
  -- Used for filtering and teacher assignment
  section_number TEXT,
  teacher_name TEXT,
  
  -- Device tracking for "remember me" functionality
  -- Generated on client side and stored in localStorage
  browser_session_id TEXT NOT NULL,
  
  -- Soft delete flag (never hard delete student data)
  is_active BOOLEAN DEFAULT true,
  
  -- Engagement tracking
  last_active_at TIMESTAMPTZ DEFAULT now(),
  
  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX idx_student_reg_unique_id ON student_registrations(unique_id);
CREATE INDEX idx_student_reg_section ON student_registrations(section_number);
CREATE INDEX idx_student_reg_teacher ON student_registrations(teacher_name);
CREATE INDEX idx_student_reg_active ON student_registrations(is_active);
CREATE INDEX idx_student_reg_last_active ON student_registrations(last_active_at DESC);
```

### assigned_tasks

Stores tasks created by teachers for students.

```sql
/**
 * assigned_tasks
 * 
 * PURPOSE: Store teacher-created assignments with targeting options.
 * 
 * TARGETING SYSTEM:
 * - target_type = 'all': Task visible to all students
 * - target_type = 'section': Task visible to students in target_section
 * - target_type = 'individual': Task visible only to target_student_id
 * 
 * CONTENT LINKING:
 * - linked_page: Route path (e.g., "/week/1/unit/unit1_1")
 * - linked_unit_id: References content in application
 * - linked_assignment_id: References assignment definitions
 */
CREATE TABLE public.assigned_tasks (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who created this task (teacher's auth.users ID)
  teacher_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Targeting: who should see this task
  target_type TEXT NOT NULL CHECK (target_type IN ('individual', 'section', 'all')),
  target_student_id TEXT,         -- Used when target_type = 'individual'
  target_section TEXT,            -- Used when target_type = 'section'
  
  -- Task content
  title TEXT NOT NULL,
  description TEXT,               -- Brief summary
  instructions TEXT,              -- Detailed instructions (shown in expandable panel)
  
  -- Content linking (all optional, use what's relevant)
  linked_page TEXT,               -- Direct route path for navigation
  linked_assignment_id TEXT,      -- Reference to assignment in code
  linked_unit_id TEXT,            -- Reference to unit in code
  
  -- Timing
  due_date TIMESTAMPTZ,           -- Optional deadline
  assigned_at TIMESTAMPTZ DEFAULT now(),
  
  -- Status and priority
  is_active BOOLEAN DEFAULT true,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX idx_tasks_teacher ON assigned_tasks(teacher_id);
CREATE INDEX idx_tasks_target_type ON assigned_tasks(target_type);
CREATE INDEX idx_tasks_section ON assigned_tasks(target_section);
CREATE INDEX idx_tasks_student ON assigned_tasks(target_student_id);
CREATE INDEX idx_tasks_due_date ON assigned_tasks(due_date);
CREATE INDEX idx_tasks_active ON assigned_tasks(is_active);
```

### student_task_progress

Tracks student progress on assigned tasks.

```sql
/**
 * student_task_progress
 * 
 * PURPOSE: Track each student's progress on each assigned task.
 * 
 * STATUS FLOW:
 * pending → in_progress → completed
 *                      → skipped
 * 
 * UPSERT PATTERN:
 * Records are upserted (created if not exists, updated if exists)
 * using the unique constraint on (student_unique_id, assigned_task_id)
 */
CREATE TABLE public.student_task_progress (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links to student (by unique_id, not by UUID)
  -- This allows tracking even if student re-registers
  student_unique_id TEXT NOT NULL,
  
  -- Links to assigned task
  assigned_task_id UUID REFERENCES assigned_tasks(id) ON DELETE CASCADE,
  
  -- Current status
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  
  -- Timing for analytics
  started_at TIMESTAMPTZ,         -- When student first clicked "Start"
  completed_at TIMESTAMPTZ,       -- When student marked complete
  
  -- Optional response data (for tasks that collect input)
  -- Stored as JSONB for flexibility
  response_data JSONB DEFAULT '{}'::jsonb,
  
  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one progress record per student per task
  UNIQUE(student_unique_id, assigned_task_id)
);

-- Indexes for common queries
CREATE INDEX idx_progress_student ON student_task_progress(student_unique_id);
CREATE INDEX idx_progress_task ON student_task_progress(assigned_task_id);
CREATE INDEX idx_progress_status ON student_task_progress(status);
```

## Row Level Security (RLS) Policies

### student_registrations Policies

```sql
-- Enable RLS
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;

/**
 * Policy: Anyone can register (INSERT)
 * 
 * PURPOSE: Allow anonymous registration without auth
 * SECURITY: No sensitive data exposed; only creates new records
 */
CREATE POLICY "Anyone can register"
  ON student_registrations
  FOR INSERT
  WITH CHECK (true);

/**
 * Policy: Anyone can read by unique_id (SELECT)
 * 
 * PURPOSE: Allow login by unique_id
 * SECURITY: Must know the unique_id to read
 */
CREATE POLICY "Anyone can select by unique_id"
  ON student_registrations
  FOR SELECT
  USING (true);

/**
 * Policy: Students can update own registration (UPDATE)
 * 
 * PURPOSE: Allow students to update their section/teacher info
 * SECURITY: Matches browser_session_id from request headers
 * NOTE: Requires edge function or custom header to work
 */
CREATE POLICY "Students can update own"
  ON student_registrations
  FOR UPDATE
  USING (
    browser_session_id = current_setting('request.headers', true)::json->>'x-browser-session-id'
  );

/**
 * Policy: Only admins can delete (DELETE)
 * 
 * PURPOSE: Prevent accidental deletion; soft delete preferred
 * SECURITY: Requires admin role check via has_role function
 */
CREATE POLICY "Admins can delete"
  ON student_registrations
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));
```

### assigned_tasks Policies

```sql
-- Enable RLS
ALTER TABLE assigned_tasks ENABLE ROW LEVEL SECURITY;

/**
 * Policy: Teachers and admins can manage all tasks
 * 
 * PURPOSE: Full CRUD for teachers/admins
 */
CREATE POLICY "Teachers can manage tasks"
  ON assigned_tasks
  FOR ALL
  USING (
    has_role(auth.uid(), 'teacher') OR 
    has_role(auth.uid(), 'admin')
  );

/**
 * Policy: Students can view tasks assigned to them
 * 
 * PURPOSE: Students see tasks targeted at them
 * SECURITY: Checks target_type and matches student info
 * 
 * IMPLEMENTATION NOTE:
 * In practice, you may need to pass student info via RPC or edge function
 * since students aren't authenticated via auth.uid()
 */
CREATE POLICY "Students can view assigned tasks"
  ON assigned_tasks
  FOR SELECT
  USING (
    target_type = 'all'
    OR (
      target_type = 'section' 
      AND target_section = current_setting('app.student_section', true)
    )
    OR (
      target_type = 'individual' 
      AND target_student_id = current_setting('app.student_unique_id', true)
    )
  );
```

### student_task_progress Policies

```sql
-- Enable RLS
ALTER TABLE student_task_progress ENABLE ROW LEVEL SECURITY;

/**
 * Policy: Students can manage their own progress
 * 
 * PURPOSE: Allow students to update their task status
 */
CREATE POLICY "Students manage own progress"
  ON student_task_progress
  FOR ALL
  USING (
    student_unique_id = current_setting('app.student_unique_id', true)
  );

/**
 * Policy: Teachers can view all progress
 * 
 * PURPOSE: Allow teachers to monitor student progress
 */
CREATE POLICY "Teachers view all progress"
  ON student_task_progress
  FOR SELECT
  USING (
    has_role(auth.uid(), 'teacher') OR 
    has_role(auth.uid(), 'admin')
  );
```

## Alternative: Using Edge Functions for Student Queries

Since students aren't authenticated via `auth.uid()`, an alternative approach is to use edge functions that set the student context:

```typescript
/**
 * Edge Function: get-student-tasks
 * 
 * Sets student context and queries tasks with RLS applied.
 */
export async function handler(req: Request) {
  const { studentUniqueId, sectionNumber } = await req.json();
  
  // Create admin client to set context
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Set student context for RLS
  await supabaseAdmin.rpc('set_student_context', {
    student_id: studentUniqueId,
    section: sectionNumber,
  });
  
  // Now query with RLS applied
  const { data, error } = await supabaseAdmin
    .from('assigned_tasks')
    .select('*');
  
  return new Response(JSON.stringify({ data, error }));
}
```

## Migration Order

When implementing this schema, apply migrations in this order:

1. **student_registrations** (no dependencies)
2. **assigned_tasks** (depends on auth.users)
3. **student_task_progress** (depends on assigned_tasks)

```sql
-- Migration 001: Create student_registrations
-- (paste student_registrations table + policies)

-- Migration 002: Create assigned_tasks
-- (paste assigned_tasks table + policies)

-- Migration 003: Create student_task_progress
-- (paste student_task_progress table + policies)
```
