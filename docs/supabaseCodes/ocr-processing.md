# OCR & Document Processing

Edge functions for extracting text from handwritten documents.

---

## ocr-extract

**Path:** `supabase/functions/ocr-extract/index.ts`  
**JWT Verification:** `false`

High-accuracy OCR extraction optimized for handwritten English text.

### Functionality

- Optimized for handwritten English text extraction (~100% accuracy goal)
- Multi-model fallback strategy for resilience
- Preserves document structure: paragraphs, lists, headings
- Special notation for handwriting artifacts

### AI Models (Fallback Strategy)

| Priority | Model | Use Case |
|----------|-------|----------|
| 1 (Primary) | `google/gemini-2.5-flash` | Fast extraction |
| 2 (Fallback) | `google/gemini-2.5-pro` | High accuracy when primary fails |

### Special Notations

| Notation | Meaning |
|----------|---------|
| `~~strikethrough~~` | Crossed-out text |
| `^caret^` | Insertions above the line |
| `[unclear: guess]` | Text that's hard to read |

### Request Body

```json
{
  "imageBase64": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

### Supported MIME Types

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/heic`

### Response

```json
{
  "text": "# Extracted Content\n\nThe handwritten text extracted...",
  "model": "google/gemini-2.5-flash"
}
```

### Extraction Guidelines

The OCR system follows these rules:
1. Preserve original paragraph structure
2. Maintain list formatting (numbered and bulleted)
3. Keep heading hierarchy intact
4. Mark unclear text rather than guessing
5. Note crossed-out text for context

### Error Handling

| Error | Response |
|-------|----------|
| Invalid image | `400: Invalid image format` |
| OCR failed | `500: Failed to extract text` |
| Rate limited | `429: Too many requests` |

### Usage Example

```typescript
const response = await supabase.functions.invoke('ocr-extract', {
  body: {
    imageBase64: base64Image,
    mimeType: 'image/jpeg'
  }
});

if (response.data?.text) {
  console.log('Extracted:', response.data.text);
  console.log('Model used:', response.data.model);
}
```

### Performance Notes

- Primary model (gemini-2.5-flash): ~3-5 seconds per image
- Fallback model (gemini-2.5-pro): ~8-12 seconds per image
- Maximum image size: 20MB
- Recommended resolution: 300 DPI for best results
