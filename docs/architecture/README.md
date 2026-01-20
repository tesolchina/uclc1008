# Architecture Overview

This document describes the high-level architecture of the UCLC 1008 AI-Assisted Learning Hub.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  React + Vite + TypeScript + TailwindCSS + shadcn/ui           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│   │   Pages     │  │  Features   │  │      Components         ││
│   │  (Routes)   │  │  (Modules)  │  │    (Reusable UI)        ││
│   └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘│
│          │                │                      │              │
│          └────────────────┼──────────────────────┘              │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────────┐│
│   │              Contexts & Hooks                              ││
│   │  AuthContext, ApiKeyContext, useLessonProgress, etc.      ││
│   └───────────────────────────────────────────────────────────┘│
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE / LOVABLE CLOUD                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │  Edge Functions │  │    Auth         │ │
│  │   Database      │  │  (Deno)         │  │    (OAuth)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  Tables: students, ai_tutor_reports, student_task_responses,   │
│          lesson_progress, live_sessions, etc.                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── api/            # API status indicators
│   ├── assignments/    # Assignment-related components
│   ├── auth/           # Authentication UI (deprecated, use features/auth)
│   ├── layout/         # Layout components (AppLayout, Sidebar)
│   ├── lessons/        # Lesson content and AI tutor components
│   ├── staff/          # Staff collaboration components
│   ├── student/        # Student-specific components
│   ├── tasks/          # Task types (MC, writing, paraphrase)
│   ├── teacher/        # Teacher dashboard components
│   ├── ui/             # shadcn/ui base components
│   └── units/          # Unit/slide viewer components
│
├── contexts/           # React Context providers
│   ├── AuthContext.tsx       # (deprecated) Use features/auth
│   └── ApiKeyContext.tsx     # Global HKBU API key state
│
├── data/               # Static data and type definitions
│   ├── assignments/    # Assignment configuration
│   ├── lessons/        # Lesson content data
│   ├── units/          # Unit slide content
│   ├── weeks/          # Week configuration
│   └── types.ts        # Shared TypeScript types
│
├── features/           # Feature-based modules (recommended pattern)
│   ├── auth/           # Authentication feature module
│   │   ├── components/ # Auth-specific components
│   │   ├── hooks/      # Auth-specific hooks
│   │   ├── utils/      # Auth utilities
│   │   └── index.ts    # Public exports
│   ├── lecture-mode/   # Lecture outline/progress feature
│   └── live-session/   # Real-time session feature
│
├── hooks/              # Shared custom React hooks
│   ├── useLessonProgress.ts
│   ├── useLiveSession.ts
│   └── use-toast.ts
│
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and types
│
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities (cn, etc.)
│   ├── errors.ts       # Error handling utilities
│   └── logger.ts       # Logging utility
│
└── pages/              # Route-level page components
    └── weeks/          # Week overview pages
```

## Key Modules

### 1. Authentication (`src/features/auth/`)
Handles user authentication including:
- Student ID-based login (simple mode)
- HKBU OAuth integration (full mode)
- Role management (student, teacher, admin)

### 2. AI Integration
- **Edge Functions**: `chat`, `smart-tutor`, `precourse-assistant`
- **API Key Management**: HKBU API keys stored per-student
- **Fallback**: Lovable AI (shared, rate-limited)

### 3. Curriculum Content (`src/data/`)
Static curriculum data organized by week/hour/lesson.

### 4. Live Sessions (`src/features/live-session/`)
Real-time classroom sessions with:
- Teacher control panel
- Student participation tracking
- Supabase Realtime for synchronization

## Data Flow

```
User Action → Component → Hook/Context → Supabase Client → Edge Function → Database
                ↑                                                            │
                └────────────────── Response ───────────────────────────────┘
```

## Edge Functions

| Function | Purpose |
|----------|---------|
| `chat` | Main AI chat endpoint, handles API key selection |
| `smart-tutor` | Structured tutoring with scoring |
| `precourse-assistant` | Pre-course writing assistance |
| `save-api-key` | Validate and store HKBU API keys |
| `revoke-api-key` | Remove stored API keys |
| `oauth-init` / `oauth-callback` | HKBU OAuth flow |

## Database Schema

See `docs/student-system/database-schema.md` for detailed schema documentation.

Key tables:
- `students` - Student profiles and API keys
- `ai_tutor_reports` - AI tutor session reports
- `student_task_responses` - Task submission tracking
- `lesson_progress` - Lesson completion tracking
- `live_sessions` - Active classroom sessions

## Adding New Features

1. Create a new folder in `src/features/[feature-name]/`
2. Include: `components/`, `hooks/`, `utils/`, `types.ts`, `index.ts`
3. Export public API through `index.ts`
4. Add route in `src/App.tsx` if needed
5. Update this documentation
