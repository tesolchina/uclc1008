# Supabase Edge Functions Documentation

This folder contains documentation for all edge functions deployed in the Lovable Cloud backend for the UCLC1008 University English I platform.

## Table of Contents

| File | Description |
|------|-------------|
| [authentication.md](./authentication.md) | OAuth and session management functions |
| [api-key-management.md](./api-key-management.md) | API key validation, storage, and revocation |
| [ai-chat-tutoring.md](./ai-chat-tutoring.md) | AI chat and smart tutoring functions |
| [writing-assistance.md](./writing-assistance.md) | AWQ writing guides and feedback |
| [ocr-processing.md](./ocr-processing.md) | OCR and document processing |
| [staff-tools.md](./staff-tools.md) | Staff collaboration and file management |
| [configuration.md](./configuration.md) | Environment variables and AI models reference |

## Quick Reference

### Function Overview

| Function | Category | JWT | Primary Use |
|----------|----------|-----|-------------|
| `oauth-init` | Auth | No | Initiate HKBU OAuth flow |
| `oauth-callback` | Auth | No | Handle OAuth callback |
| `get-session-access-token` | Auth | No | Retrieve session tokens |
| `check-api-status` | API Keys | No | Check available API keys |
| `save-api-key` | API Keys | No | Validate and save keys |
| `revoke-api-key` | API Keys | No | Remove API keys |
| `chat` | AI | No | General AI chat |
| `smart-tutor` | AI | No | Progressive testing |
| `precourse-assistant` | AI | No | Pre-course guidance |
| `awq-guide-feedback` | Writing | No | Step-by-step AWQ feedback |
| `awq-writing-guide` | Writing | No | Guided AWQ exercises |
| `ocr-writing-review` | Writing | No | Handwriting review |
| `ocr-extract` | OCR | No | Text extraction from images |
| `staff-agent` | Staff | No* | AI file management |
| `poe-markdown` | Staff | No | Markdown conversion |

*Staff-agent validates teacher/admin role internally

## Architecture

```
supabase/functions/
├── oauth-init/
├── oauth-callback/
├── get-session-access-token/
├── check-api-status/
├── save-api-key/
├── revoke-api-key/
├── chat/
├── smart-tutor/
├── precourse-assistant/
├── awq-guide-feedback/
├── awq-writing-guide/
├── ocr-writing-review/
├── ocr-extract/
├── staff-agent/
└── poe-markdown/
```
