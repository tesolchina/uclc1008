# Staff Tools

Edge functions for teacher and administrator workflows.

---

## staff-agent

**Path:** `supabase/functions/staff-agent/index.ts`  
**JWT Verification:** `false` (validates teacher/admin role internally)

AI agent for managing staff file library with natural language commands.

### Functionality

- Natural language file/folder management
- **Automatic execution** of operations (not suggest-then-confirm)
- Validates JWT and checks for teacher/admin role before processing

### Supported Operations

| Operation | Description |
|-----------|-------------|
| `create_folder` | Create folder at specified path |
| `create_file` | Create file with content |
| `move_file` | Move file between paths |
| `rename_file` | Rename file |
| `archive_file` | Mark file as archived |
| `link_file_to_thread` | Link/unlink file to discussion thread |
| `convert_file_to_markdown` | Convert original content to Markdown |

### AI Model

**Planning:** Claude-Sonnet-4.5 via Poe API

### Environment Variables

| Variable | Description |
|----------|-------------|
| `POE_API_KEY` | Poe API access key |
| `SUPABASE_ANON_KEY` | For client operations |
| `SUPABASE_SERVICE_ROLE_KEY` | For privileged operations |

### Request Body

```json
{
  "instruction": "Create a folder called 'Week 2 Materials' and move the reading guide into it",
  "context": {
    "currentFolder": "folder-id",
    "selectedFiles": ["file-id-1", "file-id-2"]
  }
}
```

### Response

```json
{
  "success": true,
  "operations": [
    {
      "type": "create_folder",
      "path": "Week 2 Materials",
      "status": "completed"
    },
    {
      "type": "move_file",
      "file": "reading-guide.md",
      "to": "Week 2 Materials/",
      "status": "completed"
    }
  ],
  "message": "Created folder and moved 1 file successfully"
}
```

### Database Tables

| Table | Purpose |
|-------|---------|
| `staff_library_folders` | Folder structure |
| `staff_library_files` | File metadata and content |

### Security

1. Extracts JWT from Authorization header
2. Validates token with Supabase Auth
3. Checks `user_roles` table for teacher/admin role
4. Rejects unauthorized requests with 403

---

## poe-markdown

**Path:** `supabase/functions/poe-markdown/index.ts`  
**JWT Verification:** `false`

Converts teaching materials to clean Markdown format.

### Functionality

- Uses Poe API with Claude-Sonnet-4.5
- Preserves headings, lists, tables, and examples
- No commentary added, outputs pure Markdown
- Cleans up formatting inconsistencies

### Environment Variables

| Variable | Description |
|----------|-------------|
| `POE_API_KEY` | Poe API access key |

### Request Body

```json
{
  "text": "Raw teaching material content with messy formatting..."
}
```

### Response

```json
{
  "markdown": "# Clean Heading\n\n## Section 1\n\nFormatted content..."
}
```

### Use Cases

1. Converting pasted Word document content
2. Cleaning up OCR-extracted text
3. Standardizing material formatting
4. Preparing content for the learning platform

### Conversion Rules

The AI follows these formatting rules:
- Convert headings to proper Markdown hierarchy
- Format lists consistently (use `-` for bullets)
- Create proper Markdown tables
- Preserve code blocks and examples
- Remove redundant whitespace
- Fix broken formatting

### Example

**Input:**
```
WEEK 1 - Academic Reading
Introduction to Academic Texts

• What is academic reading?
• Why is it important?
    - Critical thinking
    - Research skills
```

**Output:**
```markdown
# Week 1 - Academic Reading

## Introduction to Academic Texts

- What is academic reading?
- Why is it important?
  - Critical thinking
  - Research skills
```
