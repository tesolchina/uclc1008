# AI Chat & Tutoring

Edge functions powering AI-driven chat and tutoring features.

---

## chat

**Path:** `supabase/functions/chat/index.ts`  
**JWT Verification:** `false`

General-purpose AI chat endpoint for student interactions.

### Functionality

Multi-source API key resolution:
1. HKBU platform (via access token)
2. Per-student saved key
3. System-level shared key
4. Lovable AI fallback with usage limits

### Features

- Enforces daily usage limits for shared API (default: 50 requests/day)
- Tracks token usage per student in `student_api_usage` table
- Supports streaming responses
- Context-aware with week/theme metadata

### AI Models

| Source | Model | Endpoint |
|--------|-------|----------|
| HKBU | `gpt-4.1` | Azure OpenAI compatible |
| Lovable AI | `google/gemini-2.5-flash` | Lovable API |

### Request Body

```json
{
  "messages": [
    { "role": "user", "content": "Hello, can you help me?" }
  ],
  "accessToken": "optional-hkbu-token",
  "studentId": "optional-student-id",
  "meta": {
    "weekTitle": "Week 1",
    "theme": "Academic Reading",
    "aiPromptHint": "Custom tutor instructions"
  }
}
```

### Response (Streaming)

```
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":"!"}}]}
data: [DONE]
```

### Database Tables

| Table | Purpose |
|-------|---------|
| `students` | Student API keys |
| `api_keys` | System shared keys |
| `system_settings` | Shared API configuration |
| `student_api_usage` | Usage tracking |

---

## smart-tutor

**Path:** `supabase/functions/smart-tutor/index.ts`  
**JWT Verification:** `false`

AI-powered tutoring system with structured testing and reporting.

### Functionality

1. Implements progressive testing agenda (3 levels of difficulty)
2. Evaluates student responses using custom tags
3. Generates qualitative reports with star ratings (0-5)
4. Saves reports to `ai_tutor_reports` table

### Evaluation Tags

| Tag | Purpose |
|-----|---------|
| `[SCORE:X]` | Score 0-3 for each task |
| `[NEXT_TASK]` | Advance to next task |
| `[SESSION_COMPLETE]` | End session and generate report |

### Topics (Week 1)

**Hour 1:**
- Skimming Techniques
- Scanning Techniques
- IMRaD Structure

**Hour 2:**
- Paraphrasing Strategies
- Avoiding Patchwriting

### AI Model

`google/gemini-3-flash-preview` via Lovable API

### Request Body

```json
{
  "messages": [],
  "topicId": "skimming",
  "studentId": "student-id",
  "weekNumber": 1,
  "hourNumber": 1,
  "action": "generate_report",
  "tutorState": {
    "currentTaskIndex": 0,
    "scores": [3, 2, 3]
  }
}
```

### Report Generation

When `action: "generate_report"`:
```json
{
  "report": {
    "qualitativeReport": "Excellent understanding of skimming...",
    "starRating": 4,
    "tasksCompleted": 3,
    "tasksTotal": 3,
    "performanceData": {...}
  }
}
```

---

## precourse-assistant

**Path:** `supabase/functions/precourse-assistant/index.ts`  
**JWT Verification:** `false`

AI assistant for pre-course writing assignment guidance.

### Functionality

- Provides assignment guidance without writing content for students
- Enforces academic integrity rules (refuses to write any part of assignment)
- Calculates and displays time remaining until deadline
- Explains APA 7th edition citation formats

### Assignment Details

| Field | Value |
|-------|-------|
| **Due Date** | 23 January 2026, 6:00 PM HKT |
| **Task 1** | Summary writing (max 300 words) |
| **Task 2** | Argumentative essay (max 300 words) |
| **Topic** | Facial recognition in schools |
| **Source** | Andrejevic & Selwyn (2020) |

### AI Model

`google/gemini-3-flash-preview` via Lovable API

### Academic Integrity Rules

The assistant will **NOT**:
- Write any part of the assignment
- Provide complete sentences to copy
- Give specific arguments to use

The assistant **WILL**:
- Explain assignment requirements
- Clarify citation formats
- Suggest approaches and strategies
- Answer questions about the topic
