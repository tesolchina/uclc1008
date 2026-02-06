# Writing Assistance

Edge functions providing AI-powered feedback for academic writing tasks.

---

## awq-guide-feedback

**Path:** `supabase/functions/awq-guide-feedback/index.ts`  
**JWT Verification:** `false`

Step-by-step feedback for AWQ (Academic Writing Quiz) summary writing practice.

### Functionality

- Provides feedback for 12-step AWQ writing process
- Supports both step-based feedback and free-form chat modes
- Evaluates: content accuracy, paraphrasing, citations, academic tone, clarity
- Uses emoji indicators for quick visual feedback

### Feedback Indicators

| Emoji | Meaning |
|-------|---------|
| ✅ | Good / Correct |
| ⚠️ | Needs work / Attention required |
| 💡 | Suggestion / Tip |

### 12 Writing Steps

| Step | Focus |
|------|-------|
| 1 | Introduction: Background |
| 2 | Introduction: Topic Focus |
| 3 | Introduction: Thesis Statement |
| 4 | Body: Topic Sentence |
| 5-11 | Body: Article points with citations |
| 12 | Conclusion: Restate contrast |

### AI Model

`google/gemini-3-flash-preview` via Lovable API

### Request Body

```json
{
  "mode": "step",
  "stepNumber": 3,
  "studentText": "The thesis of this essay is...",
  "messages": [],
  "studentId": "student-id"
}
```

### Response (Streaming)

Feedback with structured evaluation and suggestions.

---

## awq-writing-guide

**Path:** `supabase/functions/awq-writing-guide/index.ts`  
**JWT Verification:** `false`

Guided AWQ writing exercise with article excerpts.

### Functionality

- 6-step writing process with guided instruction
- Provides article excerpts about FRT in schools
- Offers step-specific guidance and feedback
- Final review scores against 5 AWQ criteria

### 6-Step Process

| Step | Activity |
|------|----------|
| 1 | **Read** - Review article excerpts |
| 2 | **Plan** - Outline your approach |
| 3 | **Intro** - Write introduction |
| 4 | **Body** - Develop body paragraphs |
| 5 | **Conclusion** - Write conclusion |
| 6 | **Review** - Self-assessment |

### Articles Used

**Article A:** Hong et al. (2022)
- FRT Acceptance Study
- Focus: User acceptance factors

**Article B:** Andrejevic & Selwyn (2020)
- Critical Perspective on FRT in Schools
- Focus: Privacy and surveillance concerns

### AWQ Scoring Criteria

1. Content accuracy
2. Proper paraphrasing
3. Citation format (APA 7th)
4. Academic tone
5. Logical structure

### AI Model

`google/gemini-3-flash-preview` via Lovable API

---

## ocr-writing-review

**Path:** `supabase/functions/ocr-writing-review/index.ts`  
**JWT Verification:** `false`

OCR-based handwriting extraction with AI feedback for AWQ.

### Functionality

Three action modes:
1. **OCR Action:** Extracts text from handwritten images using vision model
2. **Feedback Action:** Reviews extracted text against AWQ criteria (streaming)
3. **Chat Action:** Continues conversation about writing improvements (streaming)

### AI Models

| Action | Model |
|--------|-------|
| OCR | `google/gemini-2.5-flash` |
| Feedback | `google/gemini-3-flash-preview` |
| Chat | `google/gemini-3-flash-preview` |

### Request Body

**OCR Action:**
```json
{
  "action": "ocr",
  "imageBase64": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

**Feedback Action:**
```json
{
  "action": "feedback",
  "extractedText": "The extracted handwritten text...",
  "studentId": "student-id"
}
```

**Chat Action:**
```json
{
  "action": "chat",
  "messages": [
    { "role": "user", "content": "How can I improve my thesis?" }
  ],
  "extractedText": "Original text for context..."
}
```

### Custom Prompts

Uses teacher's custom prompt from `system_settings` table:
- Key: `ocr_writing_review_prompt`
- Allows teachers to customize feedback style and focus

### Response

**OCR:**
```json
{
  "text": "Extracted text in markdown format",
  "confidence": "high"
}
```

**Feedback/Chat:** Streaming response with detailed feedback
