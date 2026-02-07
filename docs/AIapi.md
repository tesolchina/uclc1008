# AI API Provider Configuration

## Provider Hierarchy

The UCLC 1008 platform uses a two-tier AI provider strategy to ensure reliable service for all users.

### Tier 1 (Primary): HKBU GenAI Platform

- **Endpoint**: `https://genai.hkbu.edu.hk/api/v0/rest/deployments/{model}/chat/completions`
- **Authentication**: Per-user API key sent via `api-key` header
- **Model**: `gpt-4.1` (Azure OpenAI compatible)
- **Currently implemented in**: `chat` edge function only

**Key Resolution Order** (checked in sequence in the `chat` function):

1. **HKBU Platform key via OAuth** — Retrieved using the user's access token from `https://auth.hkbu.tech/api/user/api-keys`. Available when the user has authenticated through HKBU SSO.
2. **Per-student saved key** — Stored in the `students.hkbu_api_key` column in Supabase. Students can save their own HKBU API key through the Settings page.
3. **System-level shared key** — Stored in the `api_keys` table (provider = `"hkbu"`). Configured by teachers/admins as a shared fallback.

**Note**: The `check-api-status` function uses a slightly different display priority (student key > HKBU platform > local) for the status indicator, but the `chat` function's resolution order above is what determines which key is actually used for AI requests.

### Tier 2 (Current Fallback): OpenRouter

- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Authentication**: `OPENROUTER_API_KEY` environment variable (stored in Supabase Edge Function secrets)
- **When Used**: When no HKBU GenAI key is available (in the `chat` function), or directly by all other edge functions
- **Daily Limit**: Configurable per student (default: 50 requests/day), tracked in `student_api_usage` table — **only enforced in the `chat` function**

### Future Tier 2: Replit AI (Planned)

The target state is to replace OpenRouter with Replit AI Integrations (OpenAI-compatible API). This does not require a separate API key — charges would be billed to Replit account credits. See "Migration Plan" below.

---

## Edge Functions and Their Current AI Providers

| Edge Function | HKBU GenAI (if key available) | Fallback Provider | Models Used |
|---|---|---|---|
| `chat` | Yes (full hierarchy) | OpenRouter | `gpt-4.1` (HKBU) / `google/gemini-2.5-flash` (OpenRouter) |
| `smart-tutor` | No | OpenRouter (direct) | `google/gemini-3-flash-preview` |
| `precourse-assistant` | No | OpenRouter (direct) | `google/gemini-2.5-flash` |
| `ocr-extract` | No | OpenRouter (direct) | `google/gemini-2.5-flash`, `google/gemini-2.5-pro` (fallback chain) |
| `ocr-writing-review` | No | OpenRouter (direct) | `google/gemini-3-flash-preview` |
| `awq-guide-feedback` | No | OpenRouter (direct) | `google/gemini-2.5-flash` |
| `awq-writing-guide` | No | OpenRouter (direct) | `google/gemini-2.5-flash` |

**Target state**: All edge functions should try HKBU GenAI first (when the user provides a key), then fall back to Replit AI. Currently only the `chat` function implements the HKBU-first hierarchy. All other functions go directly to OpenRouter.

---

## How It Works

### `chat` Edge Function (full hierarchy implemented)

```
User sends message
  -> Check HKBU OAuth access token -> found? Use HKBU GenAI (gpt-4.1)
  -> Check student's saved HKBU key -> found? Use HKBU GenAI (gpt-4.1)
  -> Check system-level HKBU key   -> found? Use HKBU GenAI (gpt-4.1)
  -> None found?
      -> Check daily usage limit for student
      -> Under limit? Use OpenRouter (count toward daily quota)
      -> Over limit? Return 429 error with message to add HKBU key
```

### Other Edge Functions (OpenRouter only, currently)

```
User sends request
  -> Read OPENROUTER_API_KEY from environment
  -> Use OpenRouter directly (no HKBU check, no usage tracking)
  -> If OPENROUTER_API_KEY missing -> return 503 error
```

---

## Environment Variables

### Supabase Edge Function Secrets

| Variable | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | OpenRouter API access for AI model calls (current fallback) |
| `SUPABASE_URL` | Supabase project URL (auto-configured) |
| `SUPABASE_SERVICE_ROLE_KEY` | Database admin access (auto-configured) |

### Replit / Frontend Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL for frontend client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key for frontend client |

---

## Usage Tracking

Usage is tracked in the `student_api_usage` table, **currently only enforced in the `chat` function**:

| Column | Purpose |
|---|---|
| `student_id` | Identifies the student |
| `usage_date` | Date of usage (one row per student per day) |
| `request_count` | Number of API requests made |
| `prompt_tokens` | Input tokens consumed |
| `completion_tokens` | Output tokens generated |
| `total_tokens` | Total tokens (prompt + completion) |

Daily limits are configured in the `system_settings` table:
- `shared_api_enabled` — Whether shared/fallback AI is available (boolean)
- `shared_api_daily_limit` — Maximum requests per student per day (default: 50)

Other edge functions (smart-tutor, ocr-extract, etc.) do **not** currently enforce usage limits or track token consumption.

---

## Migration Plan: OpenRouter to Replit AI

The current fallback uses OpenRouter (`OPENROUTER_API_KEY`). The planned target state is:

1. Install Replit AI (OpenAI) integration on the Replit project
2. Update edge functions to use the Replit AI endpoint and key instead of OpenRouter
3. Update model references from `google/gemini-*` to supported models (e.g., `gpt-4o`)
4. Remove the `OPENROUTER_API_KEY` dependency from Supabase secrets
5. Extend the HKBU-first key resolution hierarchy to all edge functions (not just `chat`)
6. Extend usage tracking and daily limits to all edge functions

---

## API Key Management Pages

- **Student Settings** (`/settings`): Students can save/revoke their personal HKBU API key
- **Admin Dashboard** (`/admin`): View per-student API usage statistics
- **API Status Indicator**: Shows which AI provider is active and remaining daily quota
