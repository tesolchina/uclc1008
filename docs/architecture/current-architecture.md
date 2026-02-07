# UCLC1008 当前技术架构文档

> 最后更新：2026-02-07

## 1. 项目概述

UCLC 1008 University English I — AI 辅助学习平台。为香港浸会大学（HKBU）学术英语课程提供 13 周结构化课程，涵盖学术阅读、摘要写作、释义、引用规范和论证。核心功能包括 AI 聊天辅导、手写 OCR 提取、学术写作引导（AWQ）、师生 Dashboard、实时课堂互动。

## 2. 系统架构总览

```
┌─────────────────────────┐
│     用户浏览器            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐        ┌─────────────────────────┐
│     Replit               │        │     Supabase             │
│                         │        │                         │
│  React SPA (前端)        │───────▶│  PostgreSQL 数据库        │
│  Vite 打包构建            │  REST  │  41 张数据表 + RLS 策略    │
│  port 8080              │  API   │  15 张 Realtime 表        │
│                         │        │                         │
│                         │───────▶│  15 个 Edge Functions     │
│                         │ invoke │  (Deno Runtime)          │
└─────────────────────────┘        │                         │
                                   │  OAuth 认证 (HKBU SSO)   │
                                   └───────────┬─────────────┘
                                               │
                                   ┌───────────┼───────────┐
                                   ▼           ▼           ▼
                            ┌──────────┐ ┌──────────┐ ┌──────────┐
                            │HKBU GenAI│ │OpenRouter│ │ Poe API  │
                            │gpt-4.1   │ │Gemini    │ │Claude 4.5│
                            └──────────┘ └──────────┘ └──────────┘
```

## 3. 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | UI 框架 |
| TypeScript | 5.8.3 | 类型安全 |
| Vite | 5.4.19 | 构建工具 |
| React Router | 6.30.1 | 路由 |
| TanStack Query | 5.83.0 | 服务端状态管理 |
| shadcn/ui + Radix UI | — | UI 组件库 |
| Tailwind CSS | 3.4.17 | 样式 |
| React Hook Form + Zod | — | 表单验证 |

### 后端（Supabase）

| 技术 | 用途 |
|------|------|
| PostgreSQL | 数据库 |
| Supabase Edge Functions (Deno) | 后端逻辑 |
| Supabase Auth | 用户会话管理 |
| Supabase Realtime | 实时订阅 |
| Row Level Security (RLS) | 数据访问控制 |

### 外部服务

| 服务 | 用途 |
|------|------|
| HKBU GenAI Platform | 主要 AI Provider（Azure OpenAI 兼容） |
| OpenRouter | 备选 AI Provider（OpenAI 兼容） |
| Poe API | Staff 工具的 Claude 访问 |
| HKBU OAuth (auth.hkbu.tech) | 教师/管理员认证 |

## 4. 项目目录结构

```
uclc1008/
├── src/
│   ├── App.tsx                    # 主路由配置
│   ├── pages/                     # 页面组件 (45 个文件)
│   │   ├── Index.tsx              # 首页
│   │   ├── weeks/                 # 每周页面 (Week1Page ~ Week13Page)
│   │   ├── SettingsPage.tsx       # API Key 设置
│   │   ├── Staff.tsx              # Staff 面板
│   │   └── ...
│   ├── features/                  # 功能模块 (106 个文件)
│   │   ├── auth/                  # 认证模块
│   │   ├── ai-live-class/         # AI 实时课堂
│   │   ├── classroom-discussion/  # 课堂讨论
│   │   ├── lecture-mode/          # 讲座模式
│   │   ├── live-session/          # 实时会话
│   │   └── ocr-module/            # OCR 模块
│   ├── components/                # 可复用组件 (123 个文件)
│   │   ├── admin/                 # 管理员组件
│   │   ├── api/                   # API 相关组件
│   │   ├── assignments/           # 作业组件
│   │   ├── awq-game/              # AWQ 游戏化写作
│   │   ├── awq-guide/             # AWQ 引导
│   │   ├── hours/                 # 课时任务
│   │   ├── layout/                # 布局组件
│   │   ├── lessons/               # 课程组件
│   │   ├── ocr-review/            # OCR 评审
│   │   ├── tasks/                 # 各类任务组件
│   │   └── ui/                    # shadcn/ui 基础组件
│   ├── contexts/                  # React Context
│   │   ├── AuthContext.tsx         # 认证状态
│   │   └── ApiKeyContext.tsx       # API Key 状态
│   ├── data/                      # 静态课程数据 (47 个文件)
│   │   ├── weeks/                 # 每周数据定义
│   │   ├── lessons/               # 课程内容
│   │   ├── hours/                 # 课时内容
│   │   ├── assignments/           # 作业定义
│   │   └── units/                 # 单元定义
│   ├── hooks/                     # 自定义 Hooks (6 个)
│   ├── integrations/supabase/     # Supabase 客户端
│   │   ├── client.ts              # Supabase JS Client 配置
│   │   └── types.ts               # 数据库类型定义
│   └── lib/                       # 工具函数
│       ├── utils.ts
│       ├── errors.ts
│       └── logger.ts
│
├── supabase/
│   ├── config.toml                # Supabase 项目配置
│   ├── migrations/                # 数据库迁移 (34 个 SQL 文件)
│   └── functions/                 # Edge Functions (15 个)
│       ├── chat/                  # 通用 AI 聊天
│       ├── smart-tutor/           # 智能辅导
│       ├── precourse-assistant/   # 课前写作助手
│       ├── ocr-extract/           # OCR 文字提取
│       ├── ocr-writing-review/    # OCR + 写作评审
│       ├── awq-writing-guide/     # AWQ 写作引导
│       ├── awq-guide-feedback/    # AWQ 反馈
│       ├── staff-agent/           # Staff AI 助手
│       ├── poe-markdown/          # Markdown 转换
│       ├── oauth-init/            # OAuth 初始化
│       ├── oauth-callback/        # OAuth 回调
│       ├── get-session-access-token/ # 会话 Token
│       ├── save-api-key/          # 保存 API Key
│       ├── check-api-status/      # 检查 API 状态
│       └── revoke-api-key/        # 撤销 API Key
│
├── materials/                     # 课程材料 (91 个文件)
│   ├── MD/                        # Markdown 格式的教材
│   └── API/                       # PDF→MD 转换脚本
│
├── docs/                          # 项目文档
│   ├── architecture/              # 架构文档
│   ├── student-system/            # 学生系统文档
│   ├── supabaseCodes/             # Edge Functions 文档
│   └── testing/                   # 测试报告
│
├── public/                        # 静态资源
├── vite.config.ts                 # Vite 配置
├── tailwind.config.ts             # Tailwind 配置
├── tsconfig.json                  # TypeScript 配置
├── package.json                   # 依赖管理
└── .env                           # 环境变量（前端用）
```

## 5. 数据库

### 5.1 概览

- **41 张表**，按功能分组
- **1 个自定义 enum**：`app_role` ('teacher', 'student', 'admin')
- **5 个 database functions**
- **23 个 triggers**（主要是 `updated_at` 自动更新）
- **80+ 个 RLS 策略**
- **15 张表**启用 Realtime

### 5.2 表分组

**用户与角色：**
`profiles`, `user_roles`, `user_sessions`

**学生管理：**
`students`, `student_sessions`, `student_id_merges`, `student_api_usage`

**课程与进度：**
`lessons`, `lesson_progress`, `lecture_section_progress`, `hour_tasks`

**学生作业与笔记：**
`student_task_responses` (597行), `paragraph_notes` (101行), `writing_drafts` (192行), `assignment_chat_history`, `student_questions`, `student_ocr_records`

**实时课堂：**
`live_sessions`, `session_participants`, `session_responses`, `session_prompts`, `discussion_sessions`, `discussion_threads`

**AI 实时课堂：**
`ai_live_sessions`, `ai_session_participants`, `ai_conversation_messages`, `ai_message_queue`

**教师工具：**
`teacher_comments`, `teacher_student_notes`, `teacher_sections`, `task_feedback`, `pending_teacher_requests`

**Staff 协作：**
`staff_threads`, `staff_comments`, `staff_materials`, `staff_library_folders`, `staff_library_files`

**AI 报告：**
`ai_tutor_reports`

**系统：**
`api_keys`, `process_logs`, `system_settings`

## 6. AI 功能详细

### 6.1 Edge Functions 与 AI Provider 映射

| Edge Function | 功能 | AI Provider | 模型 | Streaming |
|--------------|------|------------|------|-----------|
| `chat` | 通用聊天辅导 | HKBU GenAI (优先) → OpenRouter (备选) | gpt-4.1 / gemini-2.5-flash | Yes |
| `smart-tutor` | 自适应智能辅导 | OpenRouter | gemini-3-flash-preview | Yes |
| `precourse-assistant` | 课前写作助手 | OpenRouter | gemini-3-flash-preview | No |
| `ocr-extract` | 手写 OCR 提取 | OpenRouter | gemini-2.5-flash → 2.5-pro | No |
| `ocr-writing-review` | OCR + 写作反馈 | OpenRouter | gemini-2.5-flash + 3-flash | No |
| `awq-writing-guide` | AWQ 步骤引导 | OpenRouter | gemini-3-flash-preview | No |
| `awq-guide-feedback` | AWQ 反馈 | OpenRouter | gemini-3-flash-preview | No |
| `staff-agent` | Staff AI 文件管理 | Poe API | Claude-Sonnet-4.5 | No |
| `poe-markdown` | Markdown 转换 | Poe API | Claude-Sonnet-4.5 | No |
| `save-api-key` | HKBU Key 验证 | HKBU GenAI (测试调用) | gpt-4.1 | No |

### 6.2 chat 的 API Key 解析流程

```
请求到达 →  [1] 有 accessToken？ → 从 HKBU 平台获取 key → 用 HKBU GenAI
                    │ 无
                    ▼
            [2] studentId 有保存的 hkbu_api_key？ → 用 HKBU GenAI
                    │ 无
                    ▼
            [3] api_keys 表有系统级 HKBU key？ → 用 HKBU GenAI
                    │ 无
                    ▼
            [4] 检查每日额度 → 通过 → 用 OpenRouter (OPENROUTER_API_KEY)
                              └ 超限 → 返回 429 错误
```

### 6.3 调用 AI 的前端组件（20+ 个）

**chat 相关（15 个）：**
- `src/features/ai-live-class/hooks/useAIConversation.ts`
- `src/features/classroom-discussion/hooks/useStudentDiscussion.ts`
- `src/features/classroom-discussion/hooks/useDiscussionSession.ts`
- `src/components/tasks/open-ended/ConceptSelectTask.tsx`
- `src/components/tasks/open-ended/StrategyPracticeTask.tsx`
- `src/components/tasks/open-ended/ParaphraseCoach.tsx`
- `src/components/tasks/open-ended/IntegratedParaphraseTask.tsx`
- `src/components/tasks/open-ended/WritingTask.tsx`
- `src/components/tasks/WritingPracticeWithHistory.tsx`
- `src/components/tasks/objective/QuickCheckMC.tsx`
- `src/components/hours/WritingTaskWithFeedback.tsx`
- `src/components/lessons/LessonContent.tsx`
- `src/components/lessons/LessonContentEnhanced.tsx`
- `src/components/lessons/AiTutorRating.tsx`
- `src/components/LessonAiTutor.tsx`

**其他 AI 功能（9 个）：**
- `src/components/lessons/SmartAiTutor.tsx` → smart-tutor
- `src/components/assignments/PreCourseAssistant.tsx` → precourse-assistant
- `src/components/awq-game/AWQWritingGame.tsx` → awq-writing-guide
- `src/components/awq-guide/AWQGuideGame.tsx` → awq-guide-feedback
- `src/components/awq-guide/AWQWritingGame.tsx` → awq-guide-feedback
- `src/components/awq-guide/HTMLGameWithAI.tsx` → awq-guide-feedback
- `src/features/ocr-module/hooks/useOCRExtraction.ts` → ocr-extract
- `src/components/ocr-review/OCRWritingReview.tsx` → ocr-writing-review
- `src/pages/Staff.tsx` → poe-markdown

## 7. 认证系统

### 7.1 学生认证

- **无密码**：学生通过 Student ID（格式 `XXXX-XX-XX`，学号+姓名缩写）登录
- 不使用 Supabase Auth
- 无 OAuth，无邮箱/密码
- Session 通过 `student_sessions` 表 + `browser_session_id` 管理

### 7.2 教师/管理员认证

- HKBU OAuth SSO 流程
- Edge Functions 处理：`oauth-init` → `oauth-callback` → `get-session-access-token`
- 认证成功后创建 `profiles` + `user_roles` 记录
- 角色：teacher, student, admin

## 8. 环境变量

### 前端 (.env)

| 变量 | 用途 |
|------|------|
| `VITE_SUPABASE_PROJECT_ID` | Supabase 项目 ID |
| `VITE_SUPABASE_URL` | Supabase 项目 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key (公开) |

### Edge Function Secrets（Supabase Dashboard 设置）

| 变量 | 用途 |
|------|------|
| `SUPABASE_URL` | Supabase 内部 URL（自动注入） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin 操作（自动注入） |
| `OPENROUTER_API_KEY` | AI 备选 Provider |
| `POE_API_KEY` | Staff 工具 Claude 访问 |
| `HKBU_CLIENT_ID` | HKBU OAuth |
| `HKBU_CLIENT_SECRET` | HKBU OAuth |
| `FRONTEND_URL` | OAuth 回调地址 |

## 9. 实时功能 (Realtime)

以下 15 张表启用了 Supabase Realtime，用于实时课堂互动：

`process_logs`, `live_sessions`, `session_participants`, `session_responses`, `session_prompts`, `student_questions`, `lecture_section_progress`, `writing_drafts`, `student_task_responses`, `discussion_sessions`, `discussion_threads`, `ai_live_sessions`, `ai_session_participants`, `ai_conversation_messages`, `ai_message_queue`

## 10. 课程内容结构

- **13 周**课程，每周最多 3 个 hour/lesson
- 课程数据以 TypeScript 文件存储在 `src/data/`
- 课程材料 Markdown 文件在 `materials/MD/`
- 主要作业：Pre-course Writing, AWQ, ACE Draft/Final, CRAA, Reflective Portfolio
