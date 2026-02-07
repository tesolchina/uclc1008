# UCLC1008 架构方案 C — 技术框架文档

## 1. 整体架构

```
┌──────────────────────────────────────────────────────┐
│                    Replit                             │
│                                                      │
│  ┌──────────────┐    ┌─────────────────────────────┐ │
│  │  React 前端   │───▶│  Express API Server         │ │
│  │  (Vite 打包)  │    │  /api/chat                  │ │
│  │  port 5173    │    │  /api/smart-tutor            │ │
│  │              │    │  /api/precourse-assistant    │ │
│  │              │    │  /api/ocr-extract            │ │
│  │              │    │  /api/ocr-writing-review     │ │
│  │              │    │  /api/awq-writing-guide      │ │
│  │              │    │  /api/awq-guide-feedback     │ │
│  │              │    │  /api/poe-markdown           │ │
│  │              │    │  /api/staff-agent            │ │
│  └──────────────┘    └──────────┬──────────────────┘ │
│                                 │                    │
└─────────────────────────────────┼────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
            ┌────────────┐ ┌──────────┐ ┌────────────┐
            │ HKBU GenAI │ │ Replit AI│ │   Poe API  │
            │ (Primary)  │ │(Fallback)│ │  (Staff)   │
            └────────────┘ └──────────┘ └────────────┘

┌──────────────────────────────────────────────────────┐
│               Supabase (仅数据 + Auth)                │
│                                                      │
│  ┌──────────────┐    ┌─────────────────────────────┐ │
│  │  PostgreSQL   │    │  Edge Functions (仅保留5个)   │ │
│  │  41张数据表    │    │  oauth-init                 │ │
│  │  RLS 策略     │    │  oauth-callback             │ │
│  │  Realtime     │    │  get-session-access-token   │ │
│  │              │    │  save-api-key               │ │
│  │              │    │  check-api-status           │ │
│  └──────────────┘    │  revoke-api-key             │ │
│                      └─────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 2. 职责划分

| 系统 | 负责 | 不负责 |
|------|------|--------|
| **Replit** | 前端托管、AI API 路由、AI provider 切换逻辑 | 数据库、用户认证 |
| **Supabase** | PostgreSQL 数据库、OAuth 认证、API key 存取 | AI 调用 |

## 3. 项目目录结构（变更后）

```
uclc1008/
├── server/                          # ← 新增：Replit Express 后端
│   ├── index.ts                     # Express 入口，注册所有路由
│   ├── middleware/
│   │   ├── cors.ts                  # CORS 配置
│   │   └── errorHandler.ts          # 统一错误处理
│   ├── lib/
│   │   ├── supabase.ts              # Supabase admin client (server-side)
│   │   ├── ai-providers.ts          # AI provider 统一接口
│   │   └── usage-tracker.ts         # API 用量追踪逻辑
│   └── routes/
│       ├── chat.ts                  # /api/chat — 通用聊天
│       ├── smart-tutor.ts           # /api/smart-tutor — 智能辅导
│       ├── precourse-assistant.ts   # /api/precourse-assistant — 课前助手
│       ├── ocr-extract.ts           # /api/ocr-extract — OCR 提取
│       ├── ocr-writing-review.ts    # /api/ocr-writing-review — OCR+写作评审
│       ├── awq-writing-guide.ts     # /api/awq-writing-guide — AWQ 引导
│       ├── awq-guide-feedback.ts    # /api/awq-guide-feedback — AWQ 反馈
│       ├── poe-markdown.ts          # /api/poe-markdown — Markdown 转换
│       └── staff-agent.ts           # /api/staff-agent — Staff AI 助手
│
├── src/                             # 前端（基本不变）
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── hooks/
│   ├── contexts/
│   ├── data/
│   ├── integrations/supabase/       # Supabase client (仅数据操作)
│   └── lib/
│       └── api.ts                   # ← 新增：统一的 AI API 调用封装
│
├── supabase/
│   ├── migrations/                  # 数据库迁移（保留）
│   ├── config.toml                  # Supabase 配置（保留）
│   └── functions/                   # Edge Functions（精简到5个）
│       ├── oauth-init/              # 保留
│       ├── oauth-callback/          # 保留
│       ├── get-session-access-token/ # 保留
│       ├── save-api-key/            # 保留（含 HKBU key 验证）
│       ├── check-api-status/        # 保留
│       └── revoke-api-key/          # 保留
│       # 以下全部删除，逻辑迁移到 server/routes/
│       # ├── chat/                  ← 删除
│       # ├── smart-tutor/           ← 删除
│       # ├── precourse-assistant/   ← 删除
│       # ├── ocr-extract/           ← 删除
│       # ├── ocr-writing-review/    ← 删除
│       # ├── awq-writing-guide/     ← 删除
│       # ├── awq-guide-feedback/    ← 删除
│       # ├── poe-markdown/          ← 删除
│       # └── staff-agent/           ← 删除
│
├── vite.config.ts                   # Vite 配置（加 proxy 指向 Express）
├── package.json                     # 新增 express, tsx 等依赖
└── .replit                          # Replit 运行配置
```

## 4. AI Provider 层级（核心设计）

### 4.1 Provider 优先级

```
请求到达 /api/chat
    │
    ▼
[1] 用户有 HKBU API Key？
    │── 有 → 用 HKBU GenAI (genai.hkbu.edu.hk)  ← 免费，用户自己的额度
    │
    ▼
[2] 系统有共享 HKBU Key？
    │── 有 → 检查每日额度 → 通过 → 用 HKBU GenAI  ← 免费，系统额度
    │                       └── 超限 → 继续往下
    │
    ▼
[3] Replit AI 可用？
    │── 是 → 用 Replit AI Integrations  ← 费用从 Replit credits 扣
    │
    ▼
[4] 全部不可用 → 返回错误提示用户配置 API Key
```

### 4.2 各函数的 Provider 映射

| API 路由 | Primary (HKBU) | Fallback (Replit AI) | 模型 |
|---------|----------------|---------------------|------|
| `/api/chat` | ✅ gpt-4.1 | ✅ google/gemini-2.5-flash | 支持 streaming |
| `/api/smart-tutor` | ❌ (无 HKBU 逻辑) | ✅ google/gemini-3-flash-preview | 支持 streaming |
| `/api/precourse-assistant` | ❌ | ✅ google/gemini-3-flash-preview | 非 streaming |
| `/api/ocr-extract` | ❌ | ✅ google/gemini-2.5-flash → 2.5-pro | 需要 vision 能力 |
| `/api/ocr-writing-review` | ❌ | ✅ google/gemini-2.5-flash + 3-flash | 多步骤 |
| `/api/awq-writing-guide` | ❌ | ✅ google/gemini-3-flash-preview | 非 streaming |
| `/api/awq-guide-feedback` | ❌ | ✅ google/gemini-3-flash-preview | 非 streaming |
| `/api/poe-markdown` | ❌ | ✅ Claude-Sonnet-4.5 (Poe) | Staff 专用 |
| `/api/staff-agent` | ❌ | ✅ Claude-Sonnet-4.5 (Poe) | Staff 专用 |

> **注意**：目前只有 `/api/chat` 实现了完整的 HKBU → Fallback 层级。其他函数直接使用 Replit AI。未来可以逐步把 HKBU 支持扩展到其他函数。

### 4.3 统一的 AI Provider 接口

```typescript
// server/lib/ai-providers.ts

interface AIProviderConfig {
  name: string;
  endpoint: string;
  headers: Record<string, string>;
  model: string;
}

// 根据优先级选择 provider
async function resolveProvider(
  options: {
    accessToken?: string;   // HKBU OAuth token
    studentId?: string;     // 学生 ID
    preferredModel?: string; // 期望的模型
    requireVision?: boolean; // 是否需要图片理解
  }
): Promise<AIProviderConfig> {
  // 1. 尝试 HKBU GenAI
  // 2. 尝试 Replit AI
  // 3. 抛出错误
}
```

## 5. 安全设计

### 5.1 API Key 存储位置

| Key | 存储位置 | 谁能访问 |
|-----|---------|---------|
| 学生 HKBU API Key | Supabase `students.hkbu_api_key` | 仅 server-side |
| 系统 HKBU API Key | Supabase `api_keys` 表 | 仅 server-side |
| HKBU OAuth credentials | Supabase Edge Function Secrets | 仅 OAuth 函数 |
| POE_API_KEY | Replit Secrets | 仅 server-side |
| SUPABASE_SERVICE_ROLE_KEY | Replit Secrets | 仅 server-side |
| Replit AI credentials | Replit 自动管理 | 仅 server-side |

### 5.2 前端安全原则

- 前端**永远不接触**任何 AI API Key
- 前端只持有 Supabase anon key（公开的，受 RLS 保护）
- 所有 AI 请求通过 `/api/*` 走 Express 后端
- Express 后端用 `SUPABASE_SERVICE_ROLE_KEY` 查询学生 key

### 5.3 请求验证

```
前端 → /api/chat (带 studentId 和可选 accessToken)
         │
Express 后端验证：
  1. studentId 格式检查
  2. 如果有 accessToken → 通过 HKBU 平台验证
  3. 如果没有 → 从 Supabase 查学生记录确认存在
  4. 检查每日用量额度
  5. 调用 AI API
```

## 6. Express Server 配置

### 6.1 开发模式

```typescript
// server/index.ts
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();

// API 路由
app.use('/api', apiRouter);

// 开发模式：Vite dev server 作为中间件
const vite = await createViteServer({ server: { middlewareMode: true } });
app.use(vite.middlewares);

app.listen(5000); // Replit 默认端口
```

### 6.2 生产模式

```typescript
// 生产模式：直接服务 Vite 构建产物
app.use(express.static('dist'));
app.get('*', (req, res) => res.sendFile('dist/index.html'));
```

### 6.3 Vite 配置变更

```typescript
// vite.config.ts — 开发时代理 /api 到 Express
export default defineConfig({
  server: {
    host: "::",
    port: 5173,      // Vite 开发端口
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:5000'  // 代理到 Express
    }
  },
});
```

### 6.4 package.json scripts

```json
{
  "scripts": {
    "dev": "tsx server/index.ts",         // 启动 Express (含 Vite 中间件)
    "build": "vite build",                // 构建前端
    "start": "NODE_ENV=production tsx server/index.ts",  // 生产模式
    "dev:frontend": "vite",               // 仅前端开发
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^5.1.0",
    "@supabase/supabase-js": "^2.86.0",
    // ... 其他现有依赖
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/express": "^5.0.0",
    // ... 其他现有依赖
  }
}
```

## 7. 前端调用变更

### 7.1 当前（Edge Function 调用）

```typescript
// 方式 1：通过 supabase-js
const { data } = await supabase.functions.invoke('chat', { body: { messages } });

// 方式 2：直接 fetch
const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
  headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` },
  body: JSON.stringify({ messages })
});
```

### 7.2 变更后（本地 API 调用）

```typescript
// src/lib/api.ts — 统一封装
export async function callAI(endpoint: string, body: object) {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
}

// 使用
const res = await callAI('chat', { messages, studentId, accessToken });
```

### 7.3 需要修改的前端文件（20+ 个）

**chat 相关（15 个组件）：**
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

**其他 AI 功能：**
- `src/components/lessons/SmartAiTutor.tsx` (smart-tutor)
- `src/components/assignments/PreCourseAssistant.tsx` (precourse-assistant)
- `src/components/awq-game/AWQWritingGame.tsx` (awq-writing-guide)
- `src/components/awq-guide/AWQGuideGame.tsx` (awq-guide-feedback)
- `src/components/awq-guide/AWQWritingGame.tsx` (awq-guide-feedback)
- `src/components/awq-guide/HTMLGameWithAI.tsx` (awq-guide-feedback)
- `src/features/ocr-module/hooks/useOCRExtraction.ts` (ocr-extract)
- `src/components/ocr-review/OCRWritingReview.tsx` (ocr-writing-review)
- `src/pages/Staff.tsx` (poe-markdown)

## 8. 环境变量

### Replit Secrets

| 变量名 | 用途 |
|--------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin 操作 |
| `VITE_SUPABASE_URL` | 前端用的 Supabase URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 前端用的 anon key |
| `VITE_SUPABASE_PROJECT_ID` | 前端用的项目 ID |
| `POE_API_KEY` | Staff 工具的 Claude 访问 |
| `HKBU_SYSTEM_API_KEY` | 系统级 HKBU GenAI key (可选) |

> **注意**：`OPENROUTER_API_KEY` 将被移除，由 Replit AI 托管替代。

### Supabase Edge Function Secrets（精简后）

| 变量名 | 用途 |
|--------|------|
| `HKBU_CLIENT_ID` | OAuth 认证 |
| `HKBU_CLIENT_SECRET` | OAuth 认证 |
| `FRONTEND_URL` | OAuth 回调地址 |

## 9. 本地开发支持

### 9.1 本地运行（不依赖 Replit）

```bash
# 1. 复制环境变量
cp .env.example .env.local

# 2. 安装依赖
npm install

# 3. 启动开发服务器（Express + Vite）
npm run dev
```

### 9.2 .env.example

```env
# Supabase
SUPABASE_URL=https://dlqnolcnkzmyeortwjhf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://dlqnolcnkzmyeortwjhf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=dlqnolcnkzmyeortwjhf

# AI Providers (本地开发用 OpenRouter，Replit 上用 Replit AI)
OPENROUTER_API_KEY=sk-or-v1-xxx  # 仅本地开发需要

# Staff tools
POE_API_KEY=your-poe-key
```

### 9.3 本地 vs Replit 的 AI Provider 差异

```typescript
// server/lib/ai-providers.ts
function getFallbackProvider(): AIProviderConfig {
  // Replit 环境：使用 Replit AI 托管
  if (process.env.REPLIT) {
    return { name: 'replit-ai', ... };
  }
  
  // 本地开发：使用 OpenRouter
  const key = process.env.OPENROUTER_API_KEY;
  if (key) {
    return { name: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/...', ... };
  }
  
  throw new Error('No AI provider available');
}
```

## 10. 实施阶段

### Phase 1：搭建 Express 骨架 (1-2 小时)
- [ ] 安装依赖 (express, tsx, @types/express)
- [ ] 创建 `server/index.ts` 入口
- [ ] 配置 Vite middleware 模式
- [ ] 创建 `server/lib/supabase.ts`
- [ ] 创建 `server/lib/ai-providers.ts`
- [ ] 测试 Express + Vite 一起跑

### Phase 2：迁移 AI 路由 (3-4 小时)
- [ ] 迁移 `chat` (最复杂，含 HKBU key 层级 + streaming)
- [ ] 迁移 `smart-tutor`
- [ ] 迁移 `precourse-assistant`
- [ ] 迁移 `ocr-extract` + `ocr-writing-review`
- [ ] 迁移 `awq-writing-guide` + `awq-guide-feedback`
- [ ] 迁移 `poe-markdown` + `staff-agent`

### Phase 3：修改前端调用 (2-3 小时)
- [ ] 创建 `src/lib/api.ts` 统一封装
- [ ] 逐个修改 20+ 个前端组件
- [ ] 测试每个功能

### Phase 4：清理和部署 (1 小时)
- [ ] 删除不再需要的 Supabase Edge Functions
- [ ] 重新部署 Supabase (仅保留 auth + key 管理)
- [ ] 配置 Replit Secrets
- [ ] 端到端测试

**预估总工时：7-10 小时**

## 11. 风险和注意事项

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Replit AI 不支持某些模型 | OCR 需要 vision 能力 | 确认 Replit AI 的 Gemini 支持图片输入 |
| Streaming 响应兼容性 | chat 和 smart-tutor 用 SSE | Express 原生支持 SSE |
| Replit 冷启动延迟 | 免费计划可能休眠 | 升级付费计划或加 keep-alive |
| 本地开发体验 | 需要 OpenRouter key | 提供 .env.example 说明 |
| CORS 问题 | 前端和 API 同源 | 同一个 Express 服务，无 CORS 问题 |
