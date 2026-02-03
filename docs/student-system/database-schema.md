# Database Schema

> **Last Updated:** 2025-02-03

## Overview

The UCLC 1008 Learning Hub uses Lovable Cloud (Supabase) for data persistence. This document describes the actual database schema in production.

## Table Size Summary (as of Feb 2025)

| Table | Size | Description |
|-------|------|-------------|
| `process_logs` | ~1.6 MB | Debug/operation logs (auto-cleanup to 500 rows) |
| `student_task_responses` | ~544 KB | Student answers to tasks |
| `writing_drafts` | ~256 KB | Student writing submissions |
| `staff_materials` | ~192 KB | Teacher-uploaded content |
| `assignment_chat_history` | ~152 KB | AI chat sessions per assignment |
| `students` | ~112 KB | Student profiles and API keys |

## Core Tables

### students
Primary student identity table (NOT using Supabase Auth).

```sql
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,      -- Human-readable ID (e.g., "1234-JD")
  student_number TEXT,                  -- Full HKBU student number (optional)
  display_name TEXT,                    -- Preferred name
  email TEXT,                           -- Optional email
  section_number TEXT,                  -- Class section (e.g., "A01")
  hkbu_api_key TEXT,                    -- Encrypted HKBU GenAI API key
  notes TEXT,                           -- Teacher notes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### profiles
Authenticated users (teachers/admins) via HKBU OAuth.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,                  -- Same as auth.users.id
  hkbu_user_id TEXT NOT NULL,           -- HKBU OAuth user ID
  email TEXT,
  display_name TEXT,
  role app_role DEFAULT 'student',      -- ENUM: 'teacher', 'student', 'admin'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### student_task_responses
Student answers to tasks (Hour tasks, discussion questions).

```sql
CREATE TABLE public.student_task_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,             -- References students.student_id
  task_id UUID REFERENCES hour_tasks(id),
  question_key TEXT,                    -- Alternative key for static questions
  response TEXT NOT NULL,
  is_correct BOOLEAN,
  score NUMERIC,
  ai_feedback TEXT,                     -- AI-generated feedback
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### hour_tasks
Database-driven task definitions for classroom hours.

```sql
CREATE TABLE public.hour_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL,
  hour_number INTEGER NOT NULL,
  task_order INTEGER DEFAULT 0,
  task_type TEXT NOT NULL,              -- 'mc', 'short-answer', 'paragraph', etc.
  question TEXT NOT NULL,
  context TEXT,                         -- Background reading material
  options JSONB,                        -- For MC questions
  correct_answer TEXT,
  hints JSONB,
  explanation TEXT,
  word_limit INTEGER,
  skill_focus TEXT[],                   -- Skills being assessed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### writing_drafts
Versioned student writing with AI feedback.

```sql
CREATE TABLE public.writing_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  task_key TEXT NOT NULL,               -- e.g., "week3_summary_draft"
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  ai_feedback TEXT,
  is_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Live Session Tables

### live_sessions
Teacher-initiated classroom sessions.

```sql
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  session_code VARCHAR(6) NOT NULL,     -- Auto-generated join code
  lesson_id TEXT NOT NULL,              -- e.g., "week3-hour2"
  title TEXT,
  status TEXT DEFAULT 'pending',        -- 'pending', 'active', 'ended'
  session_type TEXT,                    -- 'discussion', 'lecture', etc.
  current_section TEXT,
  current_question_index INTEGER,
  settings JSONB,
  allow_ahead BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### session_participants
Students joined to a live session.

```sql
CREATE TABLE public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_sessions(id) NOT NULL,
  student_identifier TEXT NOT NULL,     -- References students.student_id
  display_name TEXT,
  is_online BOOLEAN DEFAULT true,
  current_section TEXT,
  last_seen_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT now()
);
```

### session_responses
Real-time responses during live sessions.

```sql
CREATE TABLE public.session_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_sessions(id) NOT NULL,
  participant_id UUID REFERENCES session_participants(id) NOT NULL,
  question_index INTEGER NOT NULL,
  question_type TEXT NOT NULL,
  response JSONB NOT NULL,
  is_correct BOOLEAN,
  ai_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);
```

## AI & Chat Tables

### ai_tutor_reports
AI-generated progress reports per student per topic.

```sql
CREATE TABLE public.ai_tutor_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  hour_number INTEGER NOT NULL,
  topic_id TEXT NOT NULL,               -- e.g., "paraphrasing"
  star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
  qualitative_report TEXT NOT NULL,
  performance_data JSONB,
  tasks_completed INTEGER,
  tasks_total INTEGER,
  student_notes TEXT,                   -- Student's self-reflection
  teacher_comment TEXT,
  teacher_id UUID REFERENCES profiles(id),
  commented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### assignment_chat_history
Persistent AI chat per student per assignment context.

```sql
CREATE TABLE public.assignment_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  assignment_key TEXT NOT NULL,         -- e.g., "precourse", "ace-final"
  week_number INTEGER,
  hour_number INTEGER,
  lesson_id TEXT,
  context_type TEXT,                    -- 'assignment', 'lesson', 'general'
  messages JSONB DEFAULT '[]',          -- Array of {role, content, timestamp}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Staff Collaboration Tables

### staff_threads
Discussion threads for teacher collaboration.

### staff_comments
Comments on staff threads.

### staff_materials
Uploaded teaching materials with markdown conversion.

### staff_library_files / staff_library_folders
Organized file storage for shared materials.

## System Tables

### process_logs
Debug and operation logging (auto-cleanup keeps last 500).

### system_settings
Key-value store for app configuration.

### api_keys
Shared API keys for platform services.

## Enums

```sql
CREATE TYPE public.app_role AS ENUM ('teacher', 'student', 'admin');
```

## Key Relationships

```
students (student_id)
    ├── student_task_responses
    ├── writing_drafts
    ├── ai_tutor_reports
    ├── assignment_chat_history
    └── session_participants (as student_identifier)

profiles (id = auth.users.id)
    ├── live_sessions (teacher_id)
    ├── ai_tutor_reports (teacher_id for comments)
    ├── user_roles
    └── teacher_sections

live_sessions
    ├── session_participants
    ├── session_responses
    ├── session_prompts
    └── discussion_sessions
```

## Security Notes

### RLS Policy Pattern
Most tables use permissive `USING (true)` policies for educational accessibility. This is **intentional** for this learning platform where:
- Students aren't authenticated via Supabase Auth
- Data is class-related, not sensitive PII
- Teachers need visibility across all student work

### Sensitive Data Protection
- `students.hkbu_api_key` - Encrypted API keys, never exposed via SELECT
- `profiles.email` - Protected by RLS for teachers/admins only

### Known Security Warnings
The linter reports 34 "permissive RLS" warnings - these are accepted tradeoffs for educational functionality. Critical tables like `students` and `profiles` have proper restrictions.

## Maintenance

### Process Logs Cleanup
The `cleanupOldLogs()` function in edge functions keeps logs at ~500 rows. Manual cleanup:

```sql
DELETE FROM process_logs WHERE created_at < (
  SELECT created_at FROM process_logs 
  ORDER BY created_at DESC OFFSET 499 LIMIT 1
);
```

### Realtime Enabled Tables
```sql
-- These tables are in supabase_realtime publication
live_sessions
session_participants
session_responses
session_prompts
ai_conversation_messages
ai_message_queue
```
