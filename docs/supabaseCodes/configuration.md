# Configuration Reference

Environment variables, AI models, and configuration settings for edge functions.

---

## Environment Variables

### Required for All Functions

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for privileged operations |

### Authentication

| Variable | Used By | Description |
|----------|---------|-------------|
| `HKBU_CLIENT_ID` | oauth-init, oauth-callback | HKBU OAuth client ID |
| `HKBU_CLIENT_SECRET` | oauth-callback | HKBU OAuth client secret |
| `FRONTEND_URL` | oauth-callback | Fallback redirect URL |

### AI Services

| Variable | Used By | Description |
|----------|---------|-------------|
| `LOVABLE_API_KEY` | chat, smart-tutor, precourse-assistant, awq-*, ocr-* | Lovable AI API access |
| `POE_API_KEY` | poe-markdown, staff-agent | Poe API for Claude access |

### Client Keys

| Variable | Used By | Description |
|----------|---------|-------------|
| `SUPABASE_ANON_KEY` | staff-agent | Anonymous client operations |

---

## AI Models Reference

### Lovable AI Models

| Model | Provider | Speed | Best For |
|-------|----------|-------|----------|
| `google/gemini-2.5-flash` | Lovable AI | Fast | Chat, OCR (primary) |
| `google/gemini-2.5-pro` | Lovable AI | Slow | OCR (accuracy fallback) |
| `google/gemini-3-flash-preview` | Lovable AI | Medium | Tutoring, Writing feedback |

### External Models

| Model | Provider | Used By |
|-------|----------|---------|
| `gpt-4.1` | HKBU GenAI | Student chat (with own key) |
| `Claude-Sonnet-4.5` | Poe API | Staff tools, Markdown conversion |

### Model Selection Guidelines

```
Fast & Cost-Effective:
├── gemini-2.5-flash → General chat, quick OCR

High Accuracy:
├── gemini-2.5-pro → Complex OCR, important extractions

Advanced Reasoning:
├── gemini-3-flash-preview → Tutoring, detailed feedback
├── Claude-Sonnet-4.5 → Complex planning, file operations
```

---

## Function Configuration

All functions configured in `supabase/config.toml`:

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

[functions.smart-tutor]
verify_jwt = false

[functions.precourse-assistant]
verify_jwt = false

[functions.awq-guide-feedback]
verify_jwt = false

[functions.awq-writing-guide]
verify_jwt = false

[functions.ocr-writing-review]
verify_jwt = false
```

### Why `verify_jwt = false`?

All functions disable automatic JWT verification because:
1. Some functions need public access (OAuth callbacks)
2. Functions that require auth validate JWTs in code
3. Allows custom authentication flows (HKBU OAuth)

---

## Database Tables Used

### Authentication & Users

| Table | Functions |
|-------|-----------|
| `profiles` | oauth-callback |
| `user_roles` | oauth-callback, staff-agent |
| `user_sessions` | oauth-callback, get-session-access-token |

### API Management

| Table | Functions |
|-------|-----------|
| `students` | check-api-status, save-api-key, revoke-api-key, chat |
| `api_keys` | check-api-status, revoke-api-key, chat |
| `student_api_usage` | chat |
| `system_settings` | chat, ocr-writing-review |

### AI & Tutoring

| Table | Functions |
|-------|-----------|
| `ai_tutor_reports` | smart-tutor |

### Staff Tools

| Table | Functions |
|-------|-----------|
| `staff_library_folders` | staff-agent |
| `staff_library_files` | staff-agent |

### Logging

| Table | Functions |
|-------|-----------|
| `process_logs` | save-api-key |

---

## System Settings Keys

Custom configurations stored in `system_settings` table:

| Key | Type | Used By | Description |
|-----|------|---------|-------------|
| `shared_api_daily_limit` | number | chat | Daily request limit for shared API |
| `ocr_writing_review_prompt` | string | ocr-writing-review | Custom teacher prompt |
