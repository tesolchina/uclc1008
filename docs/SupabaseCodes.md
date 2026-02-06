# Supabase Edge Functions Documentation

This document describes all edge functions deployed in the Lovable Cloud backend for the UCLC1008 University English I platform.

---

## Table of Contents

1. [Authentication & Session Management](#authentication--session-management)
   - [oauth-init](#oauth-init)
   - [oauth-callback](#oauth-callback)
   - [get-session-access-token](#get-session-access-token)
2. [API Key Management](#api-key-management)
   - [check-api-status](#check-api-status)
   - [save-api-key](#save-api-key)
   - [revoke-api-key](#revoke-api-key)
3. [AI Chat & Tutoring](#ai-chat--tutoring)
   - [chat](#chat)
   - [smart-tutor](#smart-tutor)
   - [precourse-assistant](#precourse-assistant)
4. [Writing Assistance](#writing-assistance)
   - [awq-guide-feedback](#awq-guide-feedback)
   - [awq-writing-guide](#awq-writing-guide)
   - [ocr-writing-review](#ocr-writing-review)
5. [OCR & Document Processing](#ocr--document-processing)
   - [ocr-extract](#ocr-extract)
6. [Staff Tools](#staff-tools)
   - [staff-agent](#staff-agent)
   - [poe-markdown](#poe-markdown)

---

## Authentication & Session Management

### oauth-init

**Path:** `supabase/functions/oauth-init/index.ts`  
**JWT Verification:** `false`

Initiates OAuth authentication flow with HKBU platform.

**Functionality:**
- Constructs OAuth authorization URL with client ID and redirect URI
- Generates a state parameter containing return URL and nonce for CSRF protection
- Redirects user to `https://auth.hkbu.tech/auth-provider/login`

**Environment Variables:**
- `HKBU_CLIENT_ID` - OAuth client ID
- `SUPABASE_URL` - Used to construct callback URL

**Request:** `GET` with optional `return_url` query parameter

---

### oauth-callback

**Path:** `supabase/functions/oauth-callback/index.ts`  
**JWT Verification:** `false`

Handles OAuth callback after HKBU authentication.

**Functionality:**
- Exchanges authorization code for access token via HKBU token endpoint
- Parses JWT to extract user information (userId, email, name, role)
- Upserts user profile and roles in database
- Creates user session with access token and expiry
- Redirects to frontend with session token

**Environment Variables:**
- `HKBU_CLIENT_ID`
- `HKBU_CLIENT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_URL` (fallback)

**Database Tables:**
- `profiles` - User profile storage
- `user_roles` - Role assignments
- `user_sessions` - Session management

---

### get-session-access-token

**Path:** `supabase/functions/get-session-access-token/index.ts`  
**JWT Verification:** `false`

Retrieves access token for an existing session.

**Functionality:**
- Validates session ID and profile ID
- Checks session expiry
- Returns access token if valid

**Request Body:**
```json
{
  "sessionId": "uuid",
  "profileId": "uuid"
}
```

---

## API Key Management

### check-api-status

**Path:** `supabase/functions/check-api-status/index.ts`  
**JWT Verification:** `false`

Checks availability of various AI API keys for the current user.

**Functionality:**
- Fetches API keys from HKBU platform (if authenticated)
- Checks per-student saved keys in `students` table
- Falls back to system-level keys in `api_keys` table
- Returns masked key previews (first 2 + last 4 characters)

**Supported Providers:**
- `hkbu` - HKBU GenAI
- `openrouter` - OpenRouter
- `bolatu` - Bolatu (BLT)
- `kimi` - Kimi

**Response:**
```json
{
  "statuses": [
    { "provider": "hkbu", "available": true, "source": "student", "maskedKey": "ab••••1234" }
  ],
  "authenticated": true
}
```

---

### save-api-key

**Path:** `supabase/functions/save-api-key/index.ts`  
**JWT Verification:** `false`

Validates and saves API keys for students.

**Functionality:**
- Validates HKBU API key by making test request to GenAI endpoint
- Supports `testOnly` mode for validation without saving
- Saves validated key to student's record in `students` table
- Logs operations to `process_logs` table

**HKBU Validation Endpoint:** `https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions`

**Request Body:**
```json
{
  "provider": "hkbu",
  "apiKey": "key-value",
  "studentId": "student-id",
  "testOnly": false
}
```

---

### revoke-api-key

**Path:** `supabase/functions/revoke-api-key/index.ts`  
**JWT Verification:** `false`

Revokes API keys from both HKBU platform and local database.

**Functionality:**
- Attempts to revoke from HKBU platform via DELETE or POST with empty key
- Removes from shared `api_keys` table (if no studentId)
- Clears `hkbu_api_key` from student record (if studentId provided)

---

## AI Chat & Tutoring

### chat

**Path:** `supabase/functions/chat/index.ts`  
**JWT Verification:** `false`

General-purpose AI chat endpoint for student interactions.

**Functionality:**
- Multi-source API key resolution:
  1. HKBU platform (via access token)
  2. Per-student saved key
  3. System-level shared key
  4. Lovable AI fallback with usage limits
- Enforces daily usage limits for shared API (default: 50 requests/day)
- Tracks token usage per student
- Supports streaming responses

**AI Models:**
- HKBU: `gpt-4.1` (Azure OpenAI compatible)
- Lovable AI: `google/gemini-2.5-flash`

**Request Body:**
```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "accessToken": "optional",
  "studentId": "optional",
  "meta": {
    "weekTitle": "Week 1",
    "theme": "Academic Reading",
    "aiPromptHint": "Custom tutor instructions"
  }
}
```

**Database Tables:**
- `students` - Student API keys
- `api_keys` - System keys
- `system_settings` - Shared API configuration
- `student_api_usage` - Usage tracking

---

### smart-tutor

**Path:** `supabase/functions/smart-tutor/index.ts`  
**JWT Verification:** `false`

AI-powered tutoring system with structured testing and reporting.

**Functionality:**
- Implements progressive testing agenda (3 levels of difficulty)
- Evaluates student responses using custom tags:
  - `[SCORE:X]` - Score 0-3 for each task
  - `[NEXT_TASK]` - Advance to next task
  - `[SESSION_COMPLETE]` - End session
- Generates qualitative reports with star ratings (0-5)
- Saves reports to `ai_tutor_reports` table

**Topics Covered (Week 1):**
- Skimming Techniques (Hour 1)
- Scanning Techniques (Hour 1)
- IMRaD Structure (Hour 1)
- Paraphrasing Strategies (Hour 2)
- Avoiding Patchwriting (Hour 2)

**AI Model:** `google/gemini-3-flash-preview`

**Request Body:**
```json
{
  "messages": [],
  "topicId": "skimming",
  "studentId": "student-id",
  "weekNumber": 1,
  "hourNumber": 1,
  "action": "generate_report",
  "tutorState": {}
}
```

---

### precourse-assistant

**Path:** `supabase/functions/precourse-assistant/index.ts`  
**JWT Verification:** `false`

AI assistant for pre-course writing assignment guidance.

**Functionality:**
- Provides assignment guidance without writing content for students
- Enforces academic integrity rules (refuses to write any part of assignment)
- Calculates and displays time remaining until deadline
- Explains APA 7th edition citation formats

**Assignment Details:**
- Due: 23 January 2026, 6:00 PM HKT
- Task 1: Summary writing (max 300 words)
- Task 2: Argumentative essay (max 300 words)
- Topic: Facial recognition in schools (Andrejevic & Selwyn, 2020)

**AI Model:** `google/gemini-3-flash-preview`

---

## Writing Assistance

### awq-guide-feedback

**Path:** `supabase/functions/awq-guide-feedback/index.ts`  
**JWT Verification:** `false`

Step-by-step feedback for AWQ summary writing practice.

**Functionality:**
- Provides feedback for 12-step AWQ writing process
- Supports both step-based feedback and free-form chat modes
- Evaluates: content accuracy, paraphrasing, citations, academic tone, clarity
- Uses emoji indicators: ✅ good, ⚠️ needs work, 💡 suggestion

**12 Writing Steps:**
1. Introduction: Background
2. Introduction: Topic Focus
3. Introduction: Thesis Statement
4. Body: Topic Sentence
5-11. Body: Article points with citations
12. Conclusion: Restate contrast

**AI Model:** `google/gemini-3-flash-preview`

---

### awq-writing-guide

**Path:** `supabase/functions/awq-writing-guide/index.ts`  
**JWT Verification:** `false`

Guided AWQ writing exercise with article excerpts.

**Functionality:**
- 6-step writing process: Read, Plan, Intro, Body, Conclusion, Review
- Provides article excerpts about FRT in schools
- Offers step-specific guidance and feedback
- Final review scores against 5 AWQ criteria

**Articles Used:**
- Article A: Hong et al. (2022) - FRT Acceptance Study
- Article B: Andrejevic & Selwyn (2020) - Critical Perspective

**AI Model:** `google/gemini-3-flash-preview`

---

### ocr-writing-review

**Path:** `supabase/functions/ocr-writing-review/index.ts`  
**JWT Verification:** `false`

OCR-based handwriting extraction with AI feedback for AWQ.

**Functionality:**
- **OCR Action:** Extracts text from handwritten images using vision model
- **Feedback Action:** Reviews extracted text against AWQ criteria (streaming)
- **Chat Action:** Continues conversation about writing improvements (streaming)
- Uses teacher's custom prompt from `system_settings` table

**AI Model:** `google/gemini-2.5-flash` (OCR), `google/gemini-3-flash-preview` (feedback/chat)

**Request Body:**
```json
{
  "action": "ocr" | "feedback" | "chat",
  "imageBase64": "base64-encoded-image",
  "extractedText": "text for review",
  "messages": []
}
```

---

## OCR & Document Processing

### ocr-extract

**Path:** `supabase/functions/ocr-extract/index.ts`  
**JWT Verification:** `false`

High-accuracy OCR extraction for handwritten text.

**Functionality:**
- Optimized for handwritten English text extraction (~100% accuracy goal)
- Multi-model fallback strategy for resilience:
  1. `google/gemini-2.5-flash` (fast, primary)
  2. `google/gemini-2.5-pro` (high accuracy fallback)
- Preserves document structure: paragraphs, lists, headings
- Special notation for:
  - Crossed-out text: `~~strikethrough~~`
  - Insertions: `^caret^` notation
  - Unclear text: `[unclear: guess]`

**Request Body:**
```json
{
  "imageBase64": "base64-encoded-image",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "text": "Extracted markdown text",
  "model": "google/gemini-2.5-flash"
}
```

---

## Staff Tools

### staff-agent

**Path:** `supabase/functions/staff-agent/index.ts`  
**JWT Verification:** `false` (but validates teacher/admin role internally)

AI agent for managing staff file library.

**Functionality:**
- Natural language file/folder management
- Automatic execution of operations (not suggest-then-confirm)
- Supported operations:
  - `create_folder` - Create folder at path
  - `create_file` - Create file with content
  - `move_file` - Move file between paths
  - `rename_file` - Rename file
  - `archive_file` - Mark file as archived
  - `link_file_to_thread` - Link/unlink file to discussion thread
  - `convert_file_to_markdown` - Convert original content to Markdown

**Security:** Validates JWT and checks for teacher/admin role before processing

**AI Model (Planning):** Claude-Sonnet-4.5 via Poe API

**Database Tables:**
- `staff_library_folders`
- `staff_library_files`

---

### poe-markdown

**Path:** `supabase/functions/poe-markdown/index.ts`  
**JWT Verification:** `false`

Converts teaching materials to clean Markdown format.

**Functionality:**
- Uses Poe API with Claude-Sonnet-4.5
- Preserves headings, lists, tables, and examples
- No commentary added, outputs pure Markdown

**Environment Variables:**
- `POE_API_KEY`

**Request Body:**
```json
{
  "text": "Raw teaching material content"
}
```

**Response:**
```json
{
  "markdown": "Cleaned Markdown content"
}
```

---

## Environment Variables Summary

| Variable | Used By |
|----------|---------|
| `SUPABASE_URL` | All functions |
| `SUPABASE_ANON_KEY` | staff-agent |
| `SUPABASE_SERVICE_ROLE_KEY` | Most functions |
| `LOVABLE_API_KEY` | AI functions (chat, smart-tutor, ocr-extract, etc.) |
| `POE_API_KEY` | poe-markdown, staff-agent |
| `HKBU_CLIENT_ID` | oauth-init, oauth-callback |
| `HKBU_CLIENT_SECRET` | oauth-callback |
| `FRONTEND_URL` | oauth-callback (fallback) |

---

## AI Models Used

| Model | Provider | Use Case |
|-------|----------|----------|
| `google/gemini-2.5-flash` | Lovable AI | Chat, OCR (primary) |
| `google/gemini-2.5-pro` | Lovable AI | OCR (fallback for accuracy) |
| `google/gemini-3-flash-preview` | Lovable AI | Tutoring, Writing assistance |
| `gpt-4.1` | HKBU GenAI | Student chat (with their own key) |
| `Claude-Sonnet-4.5` | Poe API | Staff tools, Markdown conversion |

---

## Configuration

All functions are configured in `supabase/config.toml` with `verify_jwt = false` (JWT validation handled in code where needed):

```toml
[functions.chat]
verify_jwt = false

[functions.poe-markdown]
verify_jwt = false

[functions.staff-agent]
verify_jwt = false

[functions.oauth-init]
verify_jwt = false

[functions.oauth-callback]
verify_jwt = false

[functions.check-api-status]
verify_jwt = false

[functions.save-api-key]
verify_jwt = false

[functions.revoke-api-key]
verify_jwt = false

[functions.get-session-access-token]
verify_jwt = false

[functions.ocr-extract]
verify_jwt = false
```
