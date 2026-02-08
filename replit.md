# UCLC 1008 University English I – AI-Assisted Learning Hub

## Overview

This is an AI-assisted learning platform for UCLC 1008 University English I, a university-level academic English course at Hong Kong Baptist University (HKBU). The platform provides 13 weeks of structured lessons covering academic reading, summarizing, paraphrasing, citation practices, and argumentation. Key features include AI-powered tutoring chat, OCR text extraction from handwritten work, guided academic writing exercises (AWQ), student/teacher dashboards, and live classroom sessions.

The app is a React single-page application with an Express backend server. Supabase is used for the PostgreSQL database, authentication (OAuth), and RLS policies. AI functions have been migrated from Supabase Edge Functions to Express routes on the server.

## Recent Changes

- **2026-02-08**: Configured Replit AI Integrations (OpenAI-compatible) as the third-tier fallback AI provider. Priority: HKBU GenAI → OpenRouter → Replit AI. Model mapping: Gemini models map to gpt-4.1-mini. Environment vars: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-managed by Replit).
- **2026-02-07**: Migrated all 9 AI Edge Functions from Supabase to Express server routes (`/api/*`). Frontend updated to call Express routes instead of Supabase Edge Functions. Server uses Vite as middleware in development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework**: React 18 with TypeScript, built with Vite
- **Styling**: TailwindCSS with shadcn/ui component library (Radix UI primitives)
- **Routing**: React Router v6 with route-per-page pattern
- **State Management**: React Context (AuthContext, ApiKeyContext) + TanStack React Query for server state
- **Path aliases**: `@/` maps to `./src/`
- **Dev server**: Vite runs as Express middleware on port 5000

### Backend (Express Server)

- **Entry point**: `server/index.ts` — Express server on port 5000
- **Dev mode**: Uses Vite as middleware (SPA mode)
- **Production mode**: Serves static files from `dist/`
- **Startup**: `npx tsx server/index.ts`

### Directory Structure

```
server/
├── index.ts              # Express entry point (port 5000)
├── middleware/
│   └── cors.ts           # CORS configuration
├── lib/
│   ├── supabase.ts       # Supabase admin client
│   ├── ai-providers.ts   # AI provider resolution (HKBU → OpenRouter fallback)
│   └── usage-tracker.ts  # Daily usage limits and token tracking
├── routes/
│   ├── chat.ts           # /api/chat — General AI chat with streaming, HKBU key hierarchy
│   ├── smart-tutor.ts    # /api/smart-tutor — Progressive AI tutoring with 3-level tests
│   ├── precourse-assistant.ts  # /api/precourse-assistant — Pre-course writing guidance
│   ├── ocr-extract.ts    # /api/ocr-extract — Handwriting OCR (Gemini vision models)
│   ├── ocr-writing-review.ts   # /api/ocr-writing-review — Writing feedback from OCR
│   ├── awq-writing-guide.ts    # /api/awq-writing-guide — AWQ step-by-step writing
│   ├── awq-guide-feedback.ts   # /api/awq-guide-feedback — AWQ sentence-level feedback
│   ├── poe-markdown.ts   # /api/poe-markdown — Poe API for markdown conversion
│   └── staff-agent.ts    # /api/staff-agent — AI file management for teachers
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

### Database (Supabase)

- **Database**: PostgreSQL via Supabase with tables for `students`, `student_task_responses`, `writing_drafts`, `lesson_progress`, `live_sessions`, `assignment_chat_history`, `staff_materials`, `api_keys`, `student_api_usage`, `process_logs`, `ai_tutor_reports`, `system_settings`, `staff_library_folders`, `staff_library_files`
- **Authentication**: Custom OAuth flow with HKBU platform (not Supabase Auth). Students use a lightweight ID system (student number + initials) without email/password. OAuth handles teacher/admin authentication via HKBU SSO. OAuth endpoints still on Supabase Edge Functions (`oauth-init`, `oauth-callback`).
- **RLS**: 34 permissive Row Level Security policies (intentional for educational access)

### AI Provider Strategy (Three-Tier)

1. **Primary: HKBU GenAI Platform** – Azure OpenAI-compatible API at `genai.hkbu.edu.hk`. Uses per-user API keys resolved in order: OAuth access token → student's saved key → system shared key. Only the `chat` route implements this full hierarchy.
2. **Second Tier: OpenRouter** – Used when no HKBU key is available. Uses `OPENROUTER_API_KEY` env var. Daily usage limits per student (default 50/day) enforced in `chat` route.
3. **Third Tier: Replit AI** – OpenAI-compatible API via Replit AI Integrations. Uses auto-managed `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY`. Gemini model names mapped to GPT equivalents (`gemini-2.5-flash` → `gpt-4.1-mini`, `gemini-2.5-pro` → `gpt-4.1`). Billed to Replit credits.
4. **Models used**: `gpt-4.1` (HKBU), `google/gemini-2.5-flash` / `google/gemini-2.5-pro` (OCR via OpenRouter), `google/gemini-3-flash-preview` (writing feedback/smart-tutor via OpenRouter), `gpt-4.1-mini` (Replit AI fallback)

### API Routes

| Route | Purpose | Streaming |
|-------|---------|-----------|
| `POST /api/chat` | General AI chat with HKBU key hierarchy, usage limits | Yes |
| `POST /api/smart-tutor` | Progressive tutoring with 3-level task system | Yes |
| `POST /api/precourse-assistant` | Pre-course writing guidance | Yes |
| `POST /api/ocr-extract` | Handwriting OCR with Gemini vision models | No |
| `POST /api/ocr-writing-review` | OCR + writing feedback (3 actions: ocr, feedback, chat) | Mixed |
| `POST /api/awq-writing-guide` | AWQ step-by-step writing guide | Yes |
| `POST /api/awq-guide-feedback` | AWQ sentence-level feedback | Yes |
| `POST /api/poe-markdown` | Markdown conversion via Poe API | No |
| `POST /api/staff-agent` | AI file management for teachers (Poe API) | No |
| `GET /api/health` | Health check | No |

### Content Architecture

- **13 weeks** of course material, each with up to 3 hours/lessons
- **Assignments**: Pre-course Writing, Academic Writing Quiz (AWQ), Argument Construction & Evaluation (ACE Draft + Final), Critical Response to Academic Arguments (CRAA), Reflective Learning Portfolio
- **Course materials** stored as Markdown files in `materials/MD/` — these include instructions, rubrics, sample answers, and study guides
- **PDF-to-Markdown pipeline**: Python scripts in `materials/API/` convert PDFs to Markdown using HKBU GenAI API

## External Dependencies

### Core Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase** | Database, OAuth auth, RLS, file storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (client) |
| **HKBU GenAI Platform** | Primary AI provider (Azure OpenAI compatible) | `HKBU_CLIENT_ID`, `HKBU_CLIENT_SECRET`, per-user API keys |
| **HKBU OAuth (auth.hkbu.tech)** | Teacher/admin authentication | `HKBU_CLIENT_ID`, `HKBU_CLIENT_SECRET`, `FRONTEND_URL` |
| **OpenRouter** | Current fallback AI provider | `OPENROUTER_API_KEY` (env var on server) |
| **Poe API** | Claude access for staff-agent and markdown conversion | `POE_API_KEY` (env var on server) |

### Key NPM Packages

| Package | Purpose |
|---------|---------|
| `express` | Backend HTTP server |
| `cors` | CORS middleware |
| `tsx` | TypeScript execution for server |
| `@supabase/supabase-js` | Supabase client for database operations |
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

## Environment Variables

### Server-side (process.env)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (secret, needed for admin operations)
- `OPENROUTER_API_KEY` — OpenRouter API key for AI fallback
- `POE_API_KEY` — Poe API key for staff tools
- `NODE_ENV` — "development" or "production"

### Client-side (import.meta.env)
- `VITE_SUPABASE_URL` — Supabase project URL (public)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key (public)

### Still on Supabase Edge Functions
- OAuth flow (`oauth-init`, `oauth-callback`, `get-session-access-token`) — still deployed as Supabase Edge Functions
- `check-api-status`, `save-api-key`, `revoke-api-key` — not yet migrated to Express (frontend updated to call `/api/*` but routes not yet created)
