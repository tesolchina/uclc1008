

# Standalone OCR with Markdown Download

## Overview

Build a minimal, standalone OCR tool that extracts text from handwritten images with high accuracy and allows download as a Markdown file. No database persistence, no login required.

---

## Architecture

```text
src/features/ocr-module/
├── components/
│   ├── OCRUploader.tsx          # Upload/camera interface
│   ├── TextEditor.tsx           # Edit extracted text
│   └── OCRModulePage.tsx        # Main page combining all
├── hooks/
│   └── useOCRExtraction.ts      # API call logic
├── utils/
│   └── downloadMarkdown.ts      # Generate & download .md file
└── index.ts                     # Public exports

supabase/functions/
└── ocr-extract/                  # New dedicated edge function
    └── index.ts
```

---

## Features

| Feature | Description |
|---------|-------------|
| Mobile Camera | HTML5 `capture="environment"` for direct phone camera |
| File Upload | Drag-and-drop or click to select on desktop |
| High-Accuracy OCR | Uses `google/gemini-2.5-pro` for best handwriting recognition |
| Text Editor | Side-by-side image preview and editable text |
| Markdown Download | One-click download as `.md` file with metadata |
| No Login Required | Completely standalone, no authentication needed |

---

## User Flow

```text
┌────────────────────────────────────────────────────────────┐
│                   OCR TEXT EXTRACTOR                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌──────────────┐        ┌──────────────┐                │
│   │   📷 UPLOAD   │   →    │   ✏️ EDIT    │   →  📥 Download │
│   └──────────────┘        └──────────────┘                │
│                                                            │
│   - Take photo            - Review OCR result              │
│   - Upload file           - Fix any errors                 │
│   - Preview image         - Download as .md                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Technical Details

### Edge Function: `ocr-extract`

A dedicated, single-purpose OCR function using the most capable model:

- **Model**: `google/gemini-2.5-pro` (top-tier for image+text)
- **Purpose**: OCR only (no feedback, no chat)
- **Enhanced Prompt**: Optimized for handwritten English with special handling for corrections, insertions, and unclear text

Key prompt features:
- Preserves paragraph structure and formatting
- Marks crossed-out text as strikethrough
- Marks insertions with carets
- Flags unclear words with best guesses
- Outputs clean markdown format

### Markdown Download Format

```markdown
# OCR Extracted Text

> Extracted on: 2026-02-06 14:30

---

[Extracted and edited content here]
```

### Image Handling

- Supports JPG, PNG, WebP, HEIC
- Maximum file size: 10MB
- Auto-compression for large images using canvas API
- Preview with zoom capability

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/ocr-extract/index.ts` | Edge function with high-accuracy OCR |
| `src/features/ocr-module/components/OCRUploader.tsx` | Upload/camera UI component |
| `src/features/ocr-module/components/TextEditor.tsx` | Edit extracted text with preview |
| `src/features/ocr-module/components/OCRModulePage.tsx` | Main page layout |
| `src/features/ocr-module/hooks/useOCRExtraction.ts` | API call hook |
| `src/features/ocr-module/utils/downloadMarkdown.ts` | Markdown generation utility |
| `src/features/ocr-module/index.ts` | Public exports |
| `src/pages/OCRToolPage.tsx` | Route page wrapper |

### Config Update

Update `supabase/config.toml` to include the new function:
```toml
[functions.ocr-extract]
verify_jwt = false
```

### Route Addition

Add route in `App.tsx`:
```tsx
<Route path="ocr" element={<OCRToolPage />} />
```

---

## Key Differences from Existing OCR

| Aspect | Existing (ocr-writing-review) | New (ocr-extract) |
|--------|------------------------------|-------------------|
| Model | gemini-2.5-flash | gemini-2.5-pro (higher accuracy) |
| Purpose | AWQ-specific feedback | General OCR extraction |
| Features | OCR + Feedback + Chat | OCR only |
| Auth | Required | Not required |
| Persistence | Saves to database | No persistence |
| Output | AI review | Markdown download |

