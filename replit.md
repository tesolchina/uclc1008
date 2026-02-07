# UCLC 1008 University English I – AI-Assisted Learning Hub

## Overview

This is an AI-assisted learning platform for UCLC 1008 University English I, a university-level academic English course at Hong Kong Baptist University (HKBU). The platform provides 13 weeks of structured lessons covering academic reading, summarizing, paraphrasing, citation practices, and argumentation. Key features include AI-powered tutoring chat, OCR text extraction from handwritten work, guided academic writing exercises (AWQ), student/teacher dashboards, and live classroom sessions.

The app is a React single-page application built with Vite, using Supabase (via Lovable Cloud) for the backend including PostgreSQL database, Edge Functions (Deno), and OAuth authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework**: React 18 with TypeScript, built with Vite
- **Styling**: TailwindCSS with shadcn/ui component library (Radix UI primitives)
- **Routing**: React Router v6 with route-per-page pattern
- **State Management**: React Context (AuthContext, ApiKeyContext) + TanStack React Query for server state
- **Path aliases**: `@/` maps to `./src/`
- **Dev server**: Runs on port 8080 with `host: "::"` for external access

### Directory Structure

```
src/
├── pages/              # Route-level page components (Index, WeekPages, Lessons, Dashboards)
├── pages/weeks/        # Individual week pages (Week1Page through Week13Page)
├── features/           # Feature modules (auth, student-id, student-dashboard, teacher-dashboard, ocr-module)
├── components/         # Reusable UI components organized by domain (admin, api, assignments, layout, ui)
├── contexts/           # React context providers (Auth, ApiKey)
├── hooks/              # Custom React hooks
├── data/               # Static data files organized by week (week1.ts–week13.ts) and assignments
├── lib/                # Utility functions (errors.ts, logger.ts, utils.ts)
```

### Key Design Patterns

- **Feature-based modules**: Self-contained features in `src/features/` with their own components, hooks, types, and barrel exports (`index.ts`)
- **Week-based content**: Each of the 13 weeks has its own data file in `src/data/weeks/` and a corresponding page component. Lessons are organized by week and hour.
- **Static data + dynamic content**: Course structure and lesson content are stored as TypeScript data files; student responses, progress, and AI interactions are stored in Supabase.
- **No strict TypeScript**: `strict: false`, `noImplicitAny: false` — the codebase is lenient with types.

### Backend (Supabase / Lovable Cloud)

- **Database**: PostgreSQL via Supabase with tables for `students`, `student_task_responses`, `writing_drafts`, `lesson_progress`, `live_sessions`, `assignment_chat_history`, `staff_materials`, `api_keys`, `student_api_usage`, `process_logs`
- **Authentication**: Custom OAuth flow with HKBU platform (not Supabase Auth). Students use a lightweight ID system (student number + initials) without email/password. OAuth handles teacher/admin authentication via HKBU SSO.
- **Edge Functions** (Deno): Located in `supabase/functions/`. Key functions include:
  - `chat` – General AI chat with multi-provider key resolution
  - `smart-tutor` – Progressive AI tutoring
  - `precourse-assistant` – Pre-course writing guidance
  - `ocr-extract` – Handwriting OCR using Gemini models
  - `ocr-writing-review` – Handwriting feedback
  - `awq-guide-feedback` / `awq-writing-guide` – Academic Writing Quiz step-by-step guidance
  - `staff-agent` – AI-powered file management for teachers
  - `oauth-init` / `oauth-callback` / `get-session-access-token` – Authentication flow
  - `check-api-status` / `save-api-key` / `revoke-api-key` – API key management
- **RLS**: 34 permissive Row Level Security policies (intentional for educational access)
- **No JWT verification** on edge functions — they handle auth internally where needed

### AI Provider Strategy (Two-Tier)

1. **Primary: HKBU GenAI Platform** – Azure OpenAI-compatible API at `genai.hkbu.edu.hk`. Uses per-user API keys resolved in order: OAuth access token → student's saved key → system shared key. Currently only the `chat` edge function implements this full hierarchy.
2. **Current Fallback: OpenRouter** – Used when no HKBU key is available (in `chat`), or directly by all other edge functions. Uses `OPENROUTER_API_KEY` stored in Supabase Edge Function secrets. Daily usage limits per student (default 50/day) are enforced only in the `chat` function.
3. **Planned Fallback: Replit AI** – Target state is to replace OpenRouter with Replit AI Integrations (OpenAI-compatible, billed to Replit credits). See `docs/AIapi.md` for the full migration plan.
4. **Models used**: `gpt-4.1` (HKBU), `google/gemini-2.5-flash` and `google/gemini-2.5-pro` (OCR), `google/gemini-3-flash-preview` (writing feedback/smart-tutor)

### Content Architecture

- **13 weeks** of course material, each with up to 3 hours/lessons
- **Assignments**: Pre-course Writing, Academic Writing Quiz (AWQ), Argument Construction & Evaluation (ACE Draft + Final), Critical Response to Academic Arguments (CRAA), Reflective Learning Portfolio
- **Course materials** stored as Markdown files in `materials/MD/` — these include instructions, rubrics, sample answers, and study guides
- **PDF-to-Markdown pipeline**: Python scripts in `materials/API/` convert PDFs to Markdown using HKBU GenAI API

## External Dependencies

### Core Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase (Lovable Cloud)** | Database, Edge Functions, file storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` |
| **HKBU GenAI Platform** | Primary AI provider (Azure OpenAI compatible) | `HKBU_CLIENT_ID`, `HKBU_CLIENT_SECRET`, per-user API keys |
| **HKBU OAuth (auth.hkbu.tech)** | Teacher/admin authentication | `HKBU_CLIENT_ID`, `HKBU_CLIENT_SECRET`, `FRONTEND_URL` |
| **OpenRouter** | Current fallback AI provider | `OPENROUTER_API_KEY` in Supabase secrets (to be replaced with Replit AI) |
| **Poe API** | Claude access for staff-agent and markdown conversion | `POE_API_KEY` |

### Key NPM Packages

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Supabase client for database and edge function calls |
| `@tanstack/react-query` | Server state management and caching |
| `react-router-dom` | Client-side routing |
| `shadcn/ui` + Radix UI primitives | UI component library |
| `lucide-react` | Icon library |
| `mammoth` | DOCX file processing |
| `pdfjs-dist` | PDF rendering in browser |
| `next-themes` | Dark/light theme support |
| `zod` + `@hookform/resolvers` | Form validation |
| `date-fns` | Date formatting |
| `embla-carousel-react` | Carousel component |
| `cmdk` | Command palette |
| `tailwindcss-animate` | Animation utilities for Tailwind |