# Agent Harness 学习网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive learning website that guides the user through 20 progressive chapters of Agent Harness engineering, with reading content, terminology tooltips, and three types of exercises.

**Architecture:** Vite + React SPA with sidebar navigation. Markdown content fetched at runtime from `public/` directory. Exercises defined as static JSON. Progress tracked via localStorage.

**Tech Stack:** Vite 6, React 19, React Router 7, Tailwind CSS 4, react-markdown, rehype-highlight, Vitest

**Design Spec:** `docs/2026-06-15-agent-harness-learn-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Vite entry point |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript configuration |
| `src/main.tsx` | React entry, render App |
| `src/App.tsx` | Router + layout shell |
| `src/styles/global.css` | Tailwind import + custom styles |
| `src/context/AppContext.tsx` | Global state: progress, theme |
| `src/hooks/useProgress.ts` | Read/write progress to localStorage |
| `src/hooks/useTheme.ts` | Toggle light/dark theme |
| `src/data/chapters.ts` | 20-chapter metadata array |
| `src/data/glossary.ts` | Terminology card data (~40 terms) |
| `src/data/exercises/*.ts` | One file per chapter with exercises |
| `src/components/Sidebar.tsx` | Left sidebar with chapter list + progress bar |
| `src/components/TopBar.tsx` | Top bar with title, theme toggle, progress badge |
| `src/components/MarkdownRenderer.tsx` | Render chapter README with react-markdown + Shiki |
| `src/components/TermTooltip.tsx` | Terminology card tooltip overlay |
| `src/components/ExercisePanel.tsx` | Container that renders exercises for a chapter |
| `src/components/QuizExercise.tsx` | Multiple-choice exercise component |
| `src/components/CodeFillExercise.tsx` | Code fill-in-the-blank exercise |
| `src/components/ScenarioExercise.tsx` | Scenario judgment exercise |
| `src/components/ChapterNav.tsx` | Previous/next chapter navigation buttons |
| `src/components/ChapterPage.tsx` | Page component combining all chapter elements |
| `src/components/HomePage.tsx` | Landing page / redirect to first incomplete chapter |
| `scripts/sync-content.ts` | Copy README.md + SVGs from source repo |
| `public/content/` | Synced markdown files (fetched at runtime) |
| `public/course-assets/` | Synced SVG images |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/styles/global.css`

- [ ] **Step 1: Initialize Vite project**

```bash
cd H:\vibe_project\agent-harness-study
npm create vite@latest . -- --template react-ts --yes
```

If the directory is not empty (has `docs/`), use `--force` or create in a temp dir then move files.

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom@7 react-markdown remark-gfm rehype-raw rehype-highlight shiki
npm install -D tailwindcss@4 @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure vite.config.ts**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 4: Create test setup file**

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Configure global.css with Tailwind + custom theme**

Replace `src/styles/global.css` (create `src/styles/` dir):

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: #0969da;
  --color-primary-light: #ddf4ff;
  --color-success: #1a7f37;
  --color-success-light: #dafbe1;
  --color-warning: #9a6700;
  --color-warning-light: #fff8c5;
  --color-purple: #8250df;
  --color-purple-light: #fbefff;
  --color-text: #1f2328;
  --color-text-secondary: #656d76;
  --color-border: #d0d7de;
  --color-bg-secondary: #f6f8fa;
}

/* Light theme (default) */
:root {
  --bg: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-code: #f6f8fa;
  --text: #1f2328;
  --text-secondary: #656d76;
  --border: #d0d7de;
}

/* Dark theme */
[data-theme="dark"] {
  --bg: #0d1117;
  --bg-secondary: #161b22;
  --bg-code: #161b22;
  --text: #e6edf3;
  --text-secondary: #8b949e;
  --border: #30363d;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  margin: 0;
  transition: background-color 0.2s, color 0.2s;
}

/* Markdown content styles */
.markdown-body h1 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 1rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--border); }
.markdown-body h2 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem; padding-bottom: 0.2rem; border-bottom: 1px solid var(--border); }
.markdown-body h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; }
.markdown-body p { margin: 0.75rem 0; line-height: 1.7; }
.markdown-body ul, .markdown-body ol { margin: 0.5rem 0; padding-left: 1.5rem; }
.markdown-body li { margin: 0.25rem 0; line-height: 1.6; }
.markdown-body blockquote { border-left: 3px solid var(--color-primary); padding: 0.5rem 1rem; margin: 1rem 0; background: var(--bg-secondary); border-radius: 0 6px 6px 0; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.markdown-body th, .markdown-body td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; }
.markdown-body th { background: var(--bg-secondary); font-weight: 600; }
.markdown-body code:not(pre code) { background: var(--bg-secondary); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.875em; }
.markdown-body pre { background: var(--bg-code); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
.markdown-body pre code { background: none; padding: 0; font-size: 0.85rem; line-height: 1.6; }
.markdown-body img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
.markdown-body a { color: var(--color-primary); text-decoration: none; }
.markdown-body a:hover { text-decoration: underline; }
.markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.markdown-body details { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; margin: 1rem 0; }
.markdown-body details summary { cursor: pointer; font-weight: 600; }
.markdown-body details[open] summary { margin-bottom: 0.75rem; }

/* Term highlight */
.term-highlight {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 1px 4px;
  border-radius: 3px;
  border-bottom: 1px dashed var(--color-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.term-highlight:hover {
  background: var(--color-primary);
  color: white;
}

[data-theme="dark"] .term-highlight {
  background: rgba(9, 105, 218, 0.15);
}
```

- [ ] **Step 6: Set up index.html**

```html
<!-- index.html -->
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agent Harness 学习</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create minimal main.tsx**

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Create minimal App.tsx placeholder**

```tsx
// src/App.tsx
export default function App() {
  return <div style={{ padding: '2rem' }}>
    <h1>Agent Harness 学习</h1>
    <p>项目脚手架已就绪，开始构建...</p>
  </div>
}
```

- [ ] **Step 9: Verify the project starts**

```bash
npm run dev
```

Expected: Browser opens, shows "Agent Harness 学习" heading with light background.

- [ ] **Step 10: Initialize git and commit**

```bash
git init
echo -e "node_modules\ndist\n.DS_Store\npublic/content\npublic/course-assets" > .gitignore
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind project"
```

---

### Task 2: Content Sync Script

**Files:**
- Create: `scripts/sync-content.ts`
- Creates at runtime: `public/content/`, `public/course-assets/`

- [ ] **Step 1: Write the sync script**

```typescript
// scripts/sync-content.ts
import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'fs'
import { join, resolve } from 'path'

const SOURCE_REPO = process.argv[2] || join(process.env.HOME || process.env.USERPROFILE || '', 'learn-claude-code')
const PROJECT_ROOT = resolve(import.meta.dirname, '..')
const PUBLIC_DIR = join(PROJECT_ROOT, 'public')
const CONTENT_DIR = join(PUBLIC_DIR, 'content')
const ASSETS_DIR = join(PUBLIC_DIR, 'course-assets')

// Chapter directories in order
const CHAPTERS = Array.from({ length: 20 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  const dirs = readdirSync(SOURCE_REPO).filter(d => d.startsWith(`s${num}_`))
  return dirs[0]
}).filter(Boolean)

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function copyRecursive(src: string, dest: string) {
  ensureDir(dest)
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

console.log(`Syncing from: ${SOURCE_REPO}`)

// 1. Copy README.md (Chinese) for each chapter → public/content/
ensureDir(CONTENT_DIR)
for (const chapter of CHAPTERS) {
  const srcReadme = join(SOURCE_REPO, chapter, 'README.md')
  const destDir = join(CONTENT_DIR, chapter)
  ensureDir(destDir)
  if (existsSync(srcReadme)) {
    copyFileSync(srcReadme, join(destDir, 'README.md'))
    console.log(`  ✓ ${chapter}/README.md`)
  }
}

// 2. Copy SVG images → public/course-assets/
ensureDir(ASSETS_DIR)
for (const chapter of CHAPTERS) {
  const imgDir = join(SOURCE_REPO, chapter, 'images')
  if (existsSync(imgDir)) {
    const destDir = join(ASSETS_DIR, chapter)
    ensureDir(destDir)
    for (const file of readdirSync(imgDir)) {
      if (file.endsWith('.svg') && !file.includes('.en.') && !file.includes('.ja.')) {
        copyFileSync(join(imgDir, file), join(destDir, file))
      }
    }
    console.log(`  ✓ ${chapter}/images/`)
  }
}

console.log(`\nDone! Synced ${CHAPTERS.length} chapters.`)
```

- [ ] **Step 2: Add sync script to package.json**

Add to `package.json` scripts section:

```json
{
  "scripts": {
    "sync": "npx tsx scripts/sync-content.ts",
    "sync:from": "npx tsx scripts/sync-content.ts"
  }
}
```

- [ ] **Step 3: Clone source repo and run sync**

```bash
cd ~
git clone --depth 1 https://github.com/shareAI-lab/learn-claude-code.git
cd H:\vibe_project\agent-harness-study
npm run sync ~/learn-claude-code
```

Expected output: "Done! Synced 20 chapters."

- [ ] **Step 4: Verify synced files**

```bash
ls public/content/s01_agent_loop/
ls public/course-assets/s01_agent_loop/
```

Expected: `README.md` in content, `.svg` files in course-assets.

- [ ] **Step 5: Commit**

```bash
git add scripts/ .gitignore package.json
git commit -m "feat: add content sync script"
```

---

### Task 3: Data Layer (Chapters + Glossary)

**Files:**
- Create: `src/data/chapters.ts`
- Create: `src/data/glossary.ts`

- [ ] **Step 1: Create chapters metadata**

```typescript
// src/data/chapters.ts
export interface Chapter {
  id: string          // "s01"
  dir: string         // "s01_agent_loop"
  title: string       // "Agent Loop"
  subtitle: string    // "一个循环就够了"
  phase: 1 | 2
}

export const chapters: Chapter[] = [
  { id: 's01', dir: 's01_agent_loop',       title: 'Agent Loop',        subtitle: '一个循环就够了',         phase: 1 },
  { id: 's02', dir: 's02_tool_use',          title: 'Tool Use',          subtitle: '多加一个工具，只加一行',   phase: 1 },
  { id: 's03', dir: 's03_permission',        title: 'Permission',        subtitle: '执行前做权限判断',        phase: 1 },
  { id: 's04', dir: 's04_hooks',             title: 'Hooks',             subtitle: '挂在循环上，不写进循环里',  phase: 1 },
  { id: 's05', dir: 's05_todo_write',        title: 'TodoWrite',         subtitle: '没有计划的 Agent，做着做着就偏了', phase: 1 },
  { id: 's06', dir: 's06_subagent',          title: 'Subagent',          subtitle: '大任务拆小，每个拿到的都是干净上下文', phase: 1 },
  { id: 's07', dir: 's07_skill_loading',     title: 'Skill Loading',     subtitle: '用到的时候才加载',        phase: 1 },
  { id: 's08', dir: 's08_context_compact',   title: 'Context Compact',   subtitle: '上下文总会满，要有办法腾地方', phase: 1 },
  { id: 's09', dir: 's09_memory',            title: 'Memory',            subtitle: '压缩会丢细节，要有一层不丢的', phase: 1 },
  { id: 's10', dir: 's10_system_prompt',     title: 'System Prompt',     subtitle: '运行时组装，不硬编码',     phase: 1 },
  { id: 's11', dir: 's11_error_recovery',    title: 'Error Recovery',    subtitle: '错误不是结束，是重试的开始', phase: 1 },
  { id: 's12', dir: 's12_task_system',       title: 'Task System',       subtitle: '目标太大，拆成小任务',     phase: 2 },
  { id: 's13', dir: 's13_background_tasks',  title: 'Background Tasks',  subtitle: '慢操作放后台',           phase: 2 },
  { id: 's14', dir: 's14_cron_scheduler',    title: 'Cron Scheduler',    subtitle: '按时间表生产工作',        phase: 2 },
  { id: 's15', dir: 's15_agent_teams',       title: 'Agent Teams',       subtitle: '一个搞不定，组队来',      phase: 2 },
  { id: 's16', dir: 's16_team_protocols',    title: 'Team Protocols',    subtitle: '队友之间要有约定',       phase: 2 },
  { id: 's17', dir: 's17_autonomous_agents', title: 'Autonomous Agents', subtitle: '自己看板，自己认领',      phase: 2 },
  { id: 's18', dir: 's18_worktree_isolation',title: 'Worktree Isolation',subtitle: '各干各的，互不干扰',      phase: 2 },
  { id: 's19', dir: 's19_mcp_plugin',        title: 'MCP Tools',         subtitle: '外接工具，标准协议',      phase: 2 },
  { id: 's20', dir: 's20_comprehensive',     title: 'Comprehensive Agent',subtitle: '全部机制，归到一个循环', phase: 2 },
]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find(c => c.id === id)
}

export function getChapterIndex(id: string): number {
  return chapters.findIndex(c => c.id === id)
}

export function getAdjacentChapters(id: string): { prev: Chapter | null; next: Chapter | null } {
  const idx = getChapterIndex(id)
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  }
}
```

- [ ] **Step 2: Write a unit test for chapters utility functions**

```typescript
// src/data/chapters.test.ts
import { describe, it, expect } from 'vitest'
import { getChapter, getChapterIndex, getAdjacentChapters, chapters } from './chapters'

describe('chapters', () => {
  it('has 20 chapters', () => {
    expect(chapters).toHaveLength(20)
  })

  it('getChapter returns correct chapter', () => {
    const ch = getChapter('s01')
    expect(ch?.title).toBe('Agent Loop')
    expect(ch?.phase).toBe(1)
  })

  it('getChapterIndex returns correct index', () => {
    expect(getChapterIndex('s01')).toBe(0)
    expect(getChapterIndex('s20')).toBe(19)
  })

  it('getAdjacentChapters returns prev/next correctly', () => {
    const { prev, next } = getAdjacentChapters('s02')
    expect(prev?.id).toBe('s01')
    expect(next?.id).toBe('s03')
  })

  it('getAdjacentChapters handles boundaries', () => {
    expect(getAdjacentChapters('s01').prev).toBeNull()
    expect(getAdjacentChapters('s20').next).toBeNull()
  })

  it('phase 1 has s01-s11, phase 2 has s12-s20', () => {
    const phase1 = chapters.filter(c => c.phase === 1)
    const phase2 = chapters.filter(c => c.phase === 2)
    expect(phase1).toHaveLength(11)
    expect(phase2).toHaveLength(9)
  })
})
```

- [ ] **Step 3: Run test to verify**

```bash
npx vitest run src/data/chapters.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 4: Create glossary data**

```typescript
// src/data/glossary.ts
export interface GlossaryTerm {
  term: string
  category: string
  definition: string
  analogy: string
  firstSeen: string
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'LLM API',
    category: '基础概念',
    definition: '大语言模型 API。通过 HTTP 请求与语言模型交互的方式。你发送文本（prompt），模型返回文本（completion）。在 Agent 场景中，API 还支持工具调用。',
    analogy: '就像调用一个远程函数，输入是文字，输出也是文字。',
    firstSeen: 's01',
  },
  {
    term: 'Agent Loop',
    category: '核心机制',
    definition: 'Agent 的核心循环：发送消息给 LLM → 检查是否调用工具 → 执行工具 → 将结果返回给 LLM → 重复，直到模型不再调用工具。',
    analogy: '像一个不断检查"还需要做什么？"的循环，直到回答"不用了"。',
    firstSeen: 's01',
  },
  {
    term: 'stop_reason',
    category: 'API 细节',
    definition: 'LLM API 响应中的字段，表示模型停止生成的原因。"tool_use" 表示模型要调用工具，其他值表示模型认为任务完成。',
    analogy: '像一个开关，告诉循环"继续转"还是"停下来"。',
    firstSeen: 's01',
  },
  {
    term: 'Tool Calling',
    category: '核心机制',
    definition: '模型通过 API 请求外部工具执行的能力。模型不直接执行代码，而是发出"我要调用 bash 工具，参数是 ls"的请求，由 harness 执行后将结果返回。',
    analogy: '模型说"帮我查一下文件列表"，harness 去查，然后把结果告诉模型。',
    firstSeen: 's02',
  },
  {
    term: 'Harness',
    category: '核心概念',
    definition: 'Agent 在特定领域工作所需的全部基础设施：工具、知识、观察接口、行动接口和权限。模型提供智能，Harness 提供行动空间。',
    analogy: '模型是驾驶者，Harness 是载具。没有载具，驾驶者哪也去不了。',
    firstSeen: 's01',
  },
  {
    term: 'Context Window',
    category: '基础概念',
    definition: 'LLM 一次能处理的最大 token 数量。所有对话历史、系统提示、工具结果都共享这个窗口。超出后早期内容会被丢弃。',
    analogy: '像一张桌子的大小——桌面有限，东西太多就得清理掉旧的。',
    firstSeen: 's01',
  },
  {
    term: 'token',
    category: '基础概念',
    definition: 'LLM 处理文本的基本单位。大约 1 个英文单词 ≈ 1-1.5 token，1 个中文字 ≈ 1-2 token。',
    analogy: '就像文字的"像素"，模型看到的不是一整句话，而是一个个 token。',
    firstSeen: 's01',
  },
  {
    term: 'Subagent',
    category: 'Harness 机制',
    definition: '从主 Agent 派生出的独立 Agent 实例，拥有自己的上下文窗口。用于将大任务拆分成互不干扰的子任务。',
    analogy: '像经理把项目拆成小任务分给不同的组员，每个人有自己的工位和笔记。',
    firstSeen: 's06',
  },
  {
    term: 'Context Compact',
    category: 'Harness 机制',
    definition: '当对话历史接近上下文窗口上限时，自动压缩历史消息以释放空间。常用策略：保留系统提示和最近几轮对话，总结早期内容。',
    analogy: '桌子快满了，把旧笔记整理成摘要，腾出空间继续工作。',
    firstSeen: 's08',
  },
  {
    term: 'Memory System',
    category: 'Harness 机制',
    definition: '持久化存储系统，保存跨会话的重要信息（用户偏好、项目约定、历史决策）。与上下文窗口不同，Memory 不受窗口大小限制。',
    analogy: '上下文窗口是工作台，Memory 是文件柜——工作台上放不下的东西存进柜子，需要时再取。',
    firstSeen: 's09',
  },
  {
    term: 'System Prompt',
    category: '核心概念',
    definition: '发送给 LLM 的初始指令，定义 Agent 的身份、行为规则、可用工具等。在 Harness 架构中，System Prompt 在运行时动态组装，而非硬编码。',
    analogy: '像新员工第一天收到的工作手册——告诉你"你是谁、该怎么做、有什么权限"。',
    firstSeen: 's10',
  },
  {
    term: 'MCP',
    category: '扩展机制',
    definition: 'Model Context Protocol。一种标准化协议，让 Agent 可以通过统一接口连接外部工具和数据源（如 Slack、GitHub、数据库），无需为每个工具写定制代码。',
    analogy: '像 USB 接口——不管是键盘、鼠标还是硬盘，只要符合 USB 标准就能即插即用。',
    firstSeen: 's19',
  },
  {
    term: 'Hook',
    category: 'Harness 机制',
    definition: '挂载在 Agent Loop 特定阶段（如工具调用前、响应生成后）的回调函数。用于实现日志、监控、权限检查等横切关注点，不侵入核心循环。',
    analogy: '像流水线上的质检工位——产品（工具调用）经过时自动检查，不需要改生产线本身。',
    firstSeen: 's04',
  },
  {
    term: 'Permission System',
    category: 'Harness 机制',
    definition: '在工具执行前进行安全检查的机制。通常包含拒绝列表（永远禁止的操作）、规则匹配（需根据上下文判断）和用户审批（暂停等待确认）三层。',
    analogy: '像公司的报销审批——小额自动通过，大额需要经理签字，违规直接拒绝。',
    firstSeen: 's03',
  },
  {
    term: 'Skill',
    category: 'Harness 机制',
    definition: '按需加载的知识模块。Agent 不预先加载所有技能文档，而是在需要时动态拉取相关 Skill，避免占满上下文窗口。',
    analogy: '像工具箱里的专用工具——平时放在箱子里不占桌面，需要拧螺丝时才拿出螺丝刀。',
    firstSeen: 's07',
  },
  {
    term: 'Worktree',
    category: '扩展机制',
    definition: 'Git worktree，允许在同一仓库中创建多个独立工作目录。Agent 使用 worktree 隔离实现多个子任务并行执行，互不干扰文件系统。',
    analogy: '像给每个工人分配独立的工作间——各自在自己的房间里干活，不会碰到别人的东西。',
    firstSeen: 's18',
  },
  {
    term: 'Cron Scheduler',
    category: 'Harness 机制',
    definition: '定时任务调度器，让 Agent 可以按照 cron 表达式定期执行任务（如每天早上 9 点检查服务器状态）。',
    analogy: '像闹钟——设定好时间，到点了自动提醒（触发 Agent 执行任务）。',
    firstSeen: 's14',
  },
  {
    term: 'Task DAG',
    category: 'Harness 机制',
    definition: '有向无环图（Directed Acyclic Graph）形式的任务依赖关系。任务之间可以有先后依赖，但不能有循环依赖。',
    analogy: '像做菜步骤——先洗菜才能切菜，先切菜才能炒菜，但不能"先炒菜再切菜"。',
    firstSeen: 's12',
  },
]

// Build a lookup map for fast access
export const glossaryMap = new Map(glossary.map(t => [t.term.toLowerCase(), t]))

// Get all terms that first appear in a specific chapter
export function getTermsForChapter(chapterId: string): GlossaryTerm[] {
  return glossary.filter(t => t.firstSeen === chapterId)
}

// Find glossary terms in text, return their positions
export function findTermsInText(text: string): Array<{ term: GlossaryTerm; index: number }> {
  const results: Array<{ term: GlossaryTerm; index: number }> = []
  const lowerText = text.toLowerCase()

  for (const t of glossary) {
    const lowerTerm = t.term.toLowerCase()
    let idx = lowerText.indexOf(lowerTerm)
    while (idx !== -1) {
      results.push({ term: t, index: idx })
      idx = lowerText.indexOf(lowerTerm, idx + 1)
    }
  }

  return results.sort((a, b) => a.index - b.index)
}
```

- [ ] **Step 5: Write glossary tests**

```typescript
// src/data/glossary.test.ts
import { describe, it, expect } from 'vitest'
import { glossary, glossaryMap, getTermsForChapter, findTermsInText } from './glossary'

describe('glossary', () => {
  it('has at least 15 terms', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(15)
  })

  it('every term has required fields', () => {
    for (const t of glossary) {
      expect(t.term).toBeTruthy()
      expect(t.category).toBeTruthy()
      expect(t.definition).toBeTruthy()
      expect(t.analogy).toBeTruthy()
      expect(t.firstSeen).toMatch(/^s\d{2}$/)
    }
  })

  it('glossaryMap allows fast lookup', () => {
    const term = glossaryMap.get('llm api')
    expect(term?.category).toBe('基础概念')
  })

  it('getTermsForChapter filters correctly', () => {
    const s01terms = getTermsForChapter('s01')
    expect(s01terms.length).toBeGreaterThan(0)
    expect(s01terms.every(t => t.firstSeen === 's01')).toBe(true)
  })

  it('findTermsInText locates terms in text', () => {
    const text = '通过 LLM API 发送消息给模型，模型返回 stop_reason'
    const found = findTermsInText(text)
    const foundTerms = found.map(f => f.term.term)
    expect(foundTerms).toContain('LLM API')
    expect(foundTerms).toContain('stop_reason')
  })
})
```

- [ ] **Step 6: Run tests**

```bash
npx vitest run src/data/glossary.test.ts
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add chapters metadata and glossary data"
```

---

### Task 4: Theme System

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: Write useTheme hook**

```typescript
// src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'agent-harness-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved === 'dark' ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return { theme, toggleTheme }
}
```

- [ ] **Step 2: Test useTheme**

```typescript
// src/hooks/useTheme.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to light theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('dark')
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('light')
  })

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggleTheme() })
    expect(localStorage.getItem('agent-harness-theme')).toBe('dark')
  })

  it('sets data-theme attribute on document', () => {
    const { result } = renderHook(() => useTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    act(() => { result.current.toggleTheme() })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/hooks/useTheme.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts
git commit -m "feat: add theme toggle hook with localStorage persistence"
```

---

### Task 5: Progress Tracking

**Files:**
- Create: `src/hooks/useProgress.ts`

- [ ] **Step 1: Write useProgress hook**

```typescript
// src/hooks/useProgress.ts
import { useState, useCallback } from 'react'

export interface ChapterProgress {
  read: boolean
  exerciseAnswers: Record<string, { correct: boolean; userAnswer: string }>
  score: string       // e.g. "3/3"
  exercises: 'not_started' | 'in_progress' | 'all_correct' | 'partial'
  completedAt?: string
}

export interface Progress {
  currentChapter: string
  chapters: Record<string, ChapterProgress>
}

const STORAGE_KEY = 'agent-harness-learn-progress'

const defaultProgress: Progress = {
  currentChapter: 's01',
  chapters: {},
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore corrupt data */ }
  return { ...defaultProgress }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  const update = useCallback((updater: (prev: Progress) => Progress) => {
    setProgress(prev => {
      const next = updater(prev)
      saveProgress(next)
      return next
    })
  }, [])

  const markRead = useCallback((chapterId: string) => {
    update(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterId]: {
          ...prev.chapters[chapterId],
          read: true,
          exerciseAnswers: prev.chapters[chapterId]?.exerciseAnswers ?? {},
          score: prev.chapters[chapterId]?.score ?? '0/0',
          exercises: prev.chapters[chapterId]?.exercises ?? 'not_started',
        },
      },
    }))
  }, [update])

  const setCurrentChapter = useCallback((chapterId: string) => {
    update(prev => ({ ...prev, currentChapter: chapterId }))
  }, [update])

  const recordAnswer = useCallback((
    chapterId: string,
    exerciseId: string,
    correct: boolean,
    userAnswer: string,
    totalExercises: number,
  ) => {
    update(prev => {
      const chapter = prev.chapters[chapterId] ?? {
        read: false,
        exerciseAnswers: {},
        score: '0/0',
        exercises: 'not_started' as const,
      }

      const answers = { ...chapter.exerciseAnswers, [exerciseId]: { correct, userAnswer } }
      const correctCount = Object.values(answers).filter(a => a.correct).length
      const answeredCount = Object.keys(answers).length
      const allAnswered = answeredCount >= totalExercises
      const allCorrect = allAnswered && correctCount === totalExercises

      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...chapter,
            exerciseAnswers: answers,
            score: `${correctCount}/${totalExercises}`,
            exercises: allAnswered ? (allCorrect ? 'all_correct' : 'partial') : 'in_progress',
            completedAt: allAnswered ? new Date().toISOString().slice(0, 10) : chapter.completedAt,
          },
        },
      }
    })
  }, [update])

  const completedCount = Object.values(progress.chapters).filter(
    c => c.exercises === 'all_correct' || (c.read && c.exercises === 'not_started')
  ).length

  const exportProgress = useCallback(() => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-harness-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [progress])

  const importProgress = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setProgress(imported)
        saveProgress(imported)
      } catch { alert('Invalid progress file') }
    }
    reader.readAsText(file)
  }, [])

  return {
    progress,
    markRead,
    setCurrentChapter,
    recordAnswer,
    completedCount,
    exportProgress,
    importProgress,
  }
}
```

- [ ] **Step 2: Write tests for useProgress**

```typescript
// src/hooks/useProgress.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with default progress', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.progress.currentChapter).toBe('s01')
    expect(result.current.completedCount).toBe(0)
  })

  it('marks chapter as read', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.markRead('s01') })
    expect(result.current.progress.chapters['s01']?.read).toBe(true)
  })

  it('sets current chapter', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.setCurrentChapter('s05') })
    expect(result.current.progress.currentChapter).toBe('s05')
  })

  it('records exercise answers and computes score', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.recordAnswer('s01', 's01-q1', true, 'B', 3) })
    expect(result.current.progress.chapters['s01']?.exercises).toBe('in_progress')
    expect(result.current.progress.chapters['s01']?.score).toBe('1/3')

    act(() => { result.current.recordAnswer('s01', 's01-q2', true, 'stop_reason', 3) })
    act(() => { result.current.recordAnswer('s01', 's01-q3', false, 's08', 3) })
    expect(result.current.progress.chapters['s01']?.exercises).toBe('partial')
    expect(result.current.progress.chapters['s01']?.score).toBe('2/3')
  })

  it('marks all_correct when all answers are correct', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.recordAnswer('s01', 's01-q1', true, 'B', 2) })
    act(() => { result.current.recordAnswer('s01', 's01-q2', true, 'x', 2) })
    expect(result.current.progress.chapters['s01']?.exercises).toBe('all_correct')
    expect(result.current.progress.chapters['s01']?.completedAt).toBeTruthy()
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.markRead('s01') })
    const stored = JSON.parse(localStorage.getItem('agent-harness-learn-progress')!)
    expect(stored.chapters['s01']?.read).toBe(true)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/hooks/useProgress.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useProgress.ts src/hooks/useProgress.test.ts
git commit -m "feat: add progress tracking hook with localStorage persistence"
```

---

### Task 6: App Context + Routing Shell

**Files:**
- Create: `src/context/AppContext.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/HomePage.tsx`
- Create: `src/components/ChapterPage.tsx` (skeleton)

- [ ] **Step 1: Create AppContext**

```tsx
// src/context/AppContext.tsx
import { createContext, useContext, type ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'

type ThemeReturn = ReturnType<typeof useTheme>
type ProgressReturn = ReturnType<typeof useProgress>

interface AppContextType {
  theme: ThemeReturn
  progress: ProgressReturn
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const progress = useProgress()

  return (
    <AppContext.Provider value={{ theme, progress }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
```

- [ ] **Step 2: Set up routing in App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { HomePage } from './components/HomePage'
import { ChapterPage } from './components/ChapterPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter/:chapterId" element={<ChapterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
```

- [ ] **Step 3: Create HomePage skeleton**

```tsx
// src/components/HomePage.tsx
import { useApp } from '../context/AppContext'
import { chapters } from '../data/chapters'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const { progress } = useApp()
  const navigate = useNavigate()

  // Find the first incomplete chapter to auto-navigate
  const nextChapter = chapters.find(ch => {
    const cp = progress.progress.chapters[ch.id]
    return !cp || (cp.exercises !== 'all_correct')
  }) ?? chapters[0]

  return (
    <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Agent Harness 学习</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        从零掌握 Agent Harness 工程 · 20 个渐进章节
      </p>
      <button
        onClick={() => navigate(`/chapter/${nextChapter.id}`)}
        style={{
          background: '#0969da', color: 'white', border: 'none',
          padding: '12px 32px', borderRadius: 8, fontSize: 16, cursor: 'pointer',
        }}
      >
        {progress.completedCount === 0 ? '开始学习' : '继续学习'} → {nextChapter.id} {nextChapter.title}
      </button>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: 14 }}>
        进度: {progress.completedCount} / 20 章节已完成
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Create ChapterPage skeleton**

```tsx
// src/components/ChapterPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const chapter = getChapter(chapterId ?? '')

  useEffect(() => {
    if (chapterId) progress.setCurrentChapter(chapterId)
  }, [chapterId])

  if (!chapter) {
    return <div style={{ padding: '2rem' }}>章节不存在</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{chapter.id}: {chapter.title}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>{chapter.subtitle}</p>
      <p>内容渲染和练习组件将在此处加载...</p>
    </div>
  )
}
```

- [ ] **Step 5: Verify routing works**

```bash
npm run dev
```

Open browser:
- `/` → shows HomePage with "开始学习" button
- Click button → navigates to `/chapter/s01`
- `/chapter/s99` → redirects to `/`

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add app context, routing shell, and page skeletons"
```

---

### Task 7: Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`

- [ ] **Step 1: Implement Sidebar**

```tsx
// src/components/Sidebar.tsx
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { chapters, type Chapter } from '../data/chapters'
import { useRef } from 'react'

function ChapterItem({ chapter, isActive }: { chapter: Chapter; isActive: boolean }) {
  const { progress } = useApp()
  const navigate = useNavigate()
  const cp = progress.progress.chapters[chapter.id]
  const isComplete = cp?.exercises === 'all_correct'

  return (
    <button
      onClick={() => navigate(`/chapter/${chapter.id}`)}
      className={`
        w-full text-left px-2 py-1.5 rounded-md flex items-center gap-2 text-sm
        transition-colors cursor-pointer border-none
        ${isActive
          ? 'bg-[#0969da]/10 border-l-[3px] border-l-[#0969da] font-medium'
          : 'border-l-[3px] border-l-transparent hover:bg-[var(--bg-secondary)]'
        }
      `}
      style={{ color: isActive ? 'var(--text)' : 'var(--text-secondary)' }}
    >
      <span className="text-sm flex-shrink-0 w-4 text-center">
        {isComplete ? '✓' : isActive ? '▶' : '○'}
      </span>
      <span className="truncate">
        {chapter.id} {chapter.title}
      </span>
    </button>
  )
}

export function Sidebar() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const importRef = useRef<HTMLInputElement>(null)

  const phase1 = chapters.filter(c => c.phase === 1)
  const phase2 = chapters.filter(c => c.phase === 2)
  const completed = progress.completedCount
  const pct = Math.round((completed / 20) * 100)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) progress.importProgress(file)
  }

  return (
    <aside
      className="w-[260px] flex-shrink-0 border-r overflow-y-auto flex flex-col"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg)',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Chapter list */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          Phase 1 · 核心能力
        </div>
        <div className="flex flex-col gap-0.5 mb-4">
          {phase1.map(ch => (
            <ChapterItem key={ch.id} chapter={ch} isActive={ch.id === chapterId} />
          ))}
        </div>

        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          Phase 2 · 进阶能力
        </div>
        <div className="flex flex-col gap-0.5">
          {phase2.map(ch => (
            <ChapterItem key={ch.id} chapter={ch} isActive={ch.id === chapterId} />
          ))}
        </div>
      </div>

      {/* Progress + import/export */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          <span>学习进度</span>
          <span style={{ color: '#1a7f37' }}>{pct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #238636, #3fb950)' }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={progress.exportProgress}
            className="flex-1 text-xs py-1.5 rounded border cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}
          >
            导出进度
          </button>
          <button
            onClick={() => importRef.current?.click()}
            className="flex-1 text-xs py-1.5 rounded border cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}
          >
            导入进度
          </button>
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Integrate Sidebar into ChapterPage**

Update `src/components/ChapterPage.tsx`:

```tsx
// src/components/ChapterPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const chapter = getChapter(chapterId ?? '')

  useEffect(() => {
    if (chapterId) progress.setCurrentChapter(chapterId)
  }, [chapterId])

  if (!chapter) {
    return <div style={{ padding: '2rem' }}>章节不存在</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1>{chapter.id}: {chapter.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{chapter.subtitle}</p>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify sidebar renders correctly**

```bash
npm run dev
```

Navigate to `/chapter/s01` — sidebar should show all 20 chapters grouped by phase, with progress bar at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: add sidebar with chapter navigation and progress bar"
```

---

### Task 8: TopBar Component

**Files:**
- Create: `src/components/TopBar.tsx`

- [ ] **Step 1: Implement TopBar**

```tsx
// src/components/TopBar.tsx
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function TopBar() {
  const { theme, progress } = useApp()
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 border-b flex-shrink-0"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="font-bold text-base cursor-pointer border-none bg-transparent"
          style={{ color: '#0969da' }}
        >
          Agent Harness 学习
        </button>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          learn-claude-code
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={theme.toggleTheme}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
          }}
        >
          {theme.theme === 'light' ? '🌙 暗色' : '☀️ 亮色'}
        </button>
        <span
          className="text-xs px-3 py-1 rounded-full text-white"
          style={{ background: '#238636' }}
        >
          {progress.completedCount}/20
        </span>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify TopBar in browser**

```bash
npm run dev
```

TopBar should show title, theme toggle (switches between light/dark), and progress badge.

- [ ] **Step 3: Commit**

```bash
git add src/components/TopBar.tsx src/components/ChapterPage.tsx
git commit -m "feat: add top bar with theme toggle and progress badge"
```

---

### Task 9: MarkdownRenderer + TermTooltip

**Files:**
- Create: `src/components/MarkdownRenderer.tsx`
- Create: `src/components/TermTooltip.tsx`

- [ ] **Step 1: Implement TermTooltip**

```tsx
// src/components/TermTooltip.tsx
import { useState, useRef, useEffect, type ReactNode } from 'react'
import type { GlossaryTerm } from '../data/glossary'

interface TermTooltipProps {
  term: GlossaryTerm
  children: ReactNode
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!show) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [show])

  return (
    <span ref={ref} className="relative inline">
      <span
        className="term-highlight"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
      >
        {children}
      </span>
      {show && (
        <div
          className="absolute z-50 w-80 p-4 rounded-xl border shadow-lg"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 4,
            background: 'var(--bg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--color-primary-light)', color: '#0969da' }}
            >
              {term.category}
            </span>
            <button
              onClick={() => setShow(false)}
              className="text-lg leading-none cursor-pointer border-none bg-transparent"
              style={{ color: 'var(--text-secondary)' }}
            >
              ×
            </button>
          </div>
          <div className="font-bold text-base mb-2">{term.term}</div>
          <div className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text)' }}>
            {term.definition}
          </div>
          <div
            className="text-xs p-2 rounded-md"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            💡 {term.analogy}
          </div>
          <div className="text-xs mt-2" style={{ color: '#0969da' }}>
            首次出现于 {term.firstSeen}
          </div>
        </div>
      )}
    </span>
  )
}
```

- [ ] **Step 2: Implement MarkdownRenderer**

```tsx
// src/components/MarkdownRenderer.tsx
import { useState, useEffect, useRef, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { glossary } from '../data/glossary'
import { TermTooltip } from './TermTooltip'

interface MarkdownRendererProps {
  chapterDir: string
  onReachBottom?: () => void
}

export function MarkdownRenderer({ chapterDir, onReachBottom }: MarkdownRendererProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/content/${chapterDir}/README.md`)
      .then(r => r.ok ? r.text() : Promise.reject('Not found'))
      .then(text => {
        // Fix image paths: images/foo.svg → /course-assets/{chapterDir}/foo.svg
        const fixed = text.replace(
          /!\[([^\]]*)\]\(images\/([^)]+)\)/g,
          `![$1](/course-assets/${chapterDir}/$2)`
        )
        setContent(fixed)
        setLoading(false)
      })
      .catch(() => {
        setContent('# 内容未找到\n\n请运行 `npm run sync` 同步课程内容。')
        setLoading(false)
      })
  }, [chapterDir])

  // Scroll-to-bottom detection
  useEffect(() => {
    const el = containerRef.current
    if (!el || !onReachBottom) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onReachBottom() },
      { threshold: 0.1 }
    )
    const sentinel = el.querySelector('.scroll-sentinel')
    if (sentinel) observer.observe(sentinel)
    return () => observer.disconnect()
  }, [content, onReachBottom])

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>加载中...</div>
  }

  return (
    <div ref={containerRef} className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Wrap text nodes that contain glossary terms
          p: ({ children, ...props }) => {
            return <p {...props}>{wrapTerms(children)}</p>
          },
          li: ({ children, ...props }) => {
            return <li {...props}>{wrapTerms(children)}</li>
          },
          // Remove the navigation line at top of each README (links to other chapters)
          a: ({ href, children, ...props }) => {
            // Hide internal README navigation links
            if (href?.startsWith('README.') || href?.startsWith('../s')) {
              return null
            }
            return <a href={href} {...props}>{children}</a>
          },
        }}
      >
        {content}
      </ReactMarkdown>
      <div className="scroll-sentinel h-1" />
    </div>
  )
}

// Wrap text children with TermTooltip where glossary terms are found
function wrapTerms(children: ReactNode): ReactNode {
  if (typeof children !== 'string') {
    // Recursively process arrays of children
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === 'string') return wrapTermsInString(child, i)
        return child
      })
    }
    return children
  }
  return wrapTermsInString(children, 0)
}

function wrapTermsInString(text: string, keyPrefix: number): ReactNode {
  // Sort terms by length (longest first) to avoid partial matches
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length)
  const pattern = sorted.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  if (!pattern) return text

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)

  if (parts.length === 1) return text

  return parts.map((part, i) => {
    const matchedTerm = glossary.find(t => t.term.toLowerCase() === part.toLowerCase())
    if (matchedTerm) {
      return (
        <TermTooltip key={`${keyPrefix}-${i}`} term={matchedTerm}>
          {part}
        </TermTooltip>
      )
    }
    return part
  })
}
```

- [ ] **Step 3: Integrate MarkdownRenderer into ChapterPage**

Update `src/components/ChapterPage.tsx` to use MarkdownRenderer:

```tsx
// src/components/ChapterPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MarkdownRenderer } from './MarkdownRenderer'

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const chapter = getChapter(chapterId ?? '')

  useEffect(() => {
    if (chapterId) progress.setCurrentChapter(chapterId)
  }, [chapterId])

  const handleReachBottom = useCallback(() => {
    if (chapterId) progress.markRead(chapterId)
  }, [chapterId])

  if (!chapter) {
    return <div style={{ padding: '2rem' }}>章节不存在</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-4xl">
          {/* Chapter header */}
          <div className="mb-5">
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              {chapter.id} / 20
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {chapter.title} — {chapter.subtitle}
            </h1>
            <div className="flex gap-2">
              <span
                className="text-xs px-2.5 py-0.5 rounded-full"
                style={{
                  background: chapter.phase === 1 ? '#0969da22' : '#8250df22',
                  color: chapter.phase === 1 ? '#0969da' : '#8250df',
                }}
              >
                Phase {chapter.phase}
              </span>
            </div>
          </div>

          {/* Markdown content */}
          <div
            className="rounded-lg border p-5 mb-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <MarkdownRenderer
              chapterDir={chapter.dir}
              onReachBottom={handleReachBottom}
            />
          </div>

          {/* Exercise panel placeholder */}
          <div
            className="rounded-lg border p-5 mb-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <p style={{ color: 'var(--text-secondary)' }}>练习区（下一步实现）</p>
          </div>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify markdown renders correctly in browser**

```bash
npm run dev
```

Navigate to `/chapter/s01` — should see:
- README.md rendered with headings, code blocks, tables, SVG images
- Glossary terms highlighted in blue dashed underline
- Hovering a term shows the tooltip card
- Dark mode toggle works and styles update

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: add markdown renderer with term tooltips and scroll detection"
```

---

### Task 10: Exercise Components

**Files:**
- Create: `src/components/QuizExercise.tsx`
- Create: `src/components/CodeFillExercise.tsx`
- Create: `src/components/ScenarioExercise.tsx`
- Create: `src/components/ExercisePanel.tsx`

- [ ] **Step 1: Define shared exercise types**

Add to `src/data/chapters.ts` (append) or create `src/types/exercise.ts`:

```typescript
// src/types/exercise.ts
export interface QuizItem {
  id: string
  type: 'quiz'
  difficulty: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface CodeFillItem {
  id: string
  type: 'code_fill'
  difficulty: string
  question: string
  codeBefore: string
  codeAfter: string
  answer: string
  explanation: string
}

export interface ScenarioItem {
  id: string
  type: 'scenario'
  difficulty: string
  scenario: string
  options: Array<{ label: string; description: string }>
  correctIndex: number
  explanation: string
}

export type Exercise = QuizItem | CodeFillItem | ScenarioItem

export interface ChapterExercises {
  chapterId: string
  exercises: Exercise[]
}
```

- [ ] **Step 2: Implement QuizExercise**

```tsx
// src/components/QuizExercise.tsx
import { useState } from 'react'
import type { QuizItem } from '../types/exercise'

interface Props {
  exercise: QuizItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

export function QuizExercise({ exercise, previousAnswer, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(
    previousAnswer ? parseInt(previousAnswer.userAnswer) : null
  )
  const [submitted, setSubmitted] = useState(!!previousAnswer)
  const isCorrect = previousAnswer?.correct ?? (selected === exercise.correctIndex)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    onAnswer(selected === exercise.correctIndex, String(selected))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
          style={{ background: '#ddf4ff', color: '#0969da' }}
        >
          选择题
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {exercise.difficulty}
        </span>
      </div>

      <div className="font-medium mb-4">{exercise.question}</div>

      <div className="flex flex-col gap-2 mb-4">
        {exercise.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i)
          let borderStyle = '1px solid var(--border)'
          let bg = 'transparent'
          if (submitted) {
            if (i === exercise.correctIndex) {
              borderStyle = '2px solid #1a7f37'
              bg = '#dafbe1'
            } else if (i === selected && i !== exercise.correctIndex) {
              borderStyle = '2px solid #cf222e'
              bg = '#ffebe9'
            }
          } else if (i === selected) {
            borderStyle = '2px solid #0969da'
            bg = '#ddf4ff'
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className="flex items-center gap-3 p-3 rounded-lg text-left cursor-pointer"
              style={{ border: borderStyle, background: bg }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  border: `2px solid ${submitted && i === exercise.correctIndex ? '#1a7f37' : submitted && i === selected ? '#cf222e' : i === selected ? '#0969da' : 'var(--border)'}`,
                  background: submitted && i === exercise.correctIndex ? '#1a7f37' : 'transparent',
                  color: submitted && i === exercise.correctIndex ? 'white' : 'var(--text-secondary)',
                }}
              >
                {letter}
              </span>
              <span className="text-sm">{opt}</span>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-4 py-2 rounded-md text-sm text-white cursor-pointer border-none"
          style={{ background: selected !== null ? '#0969da' : '#d0d7de' }}
        >
          提交答案
        </button>
      ) : (
        <div
          className="p-3 rounded-lg text-sm leading-relaxed"
          style={{
            background: isCorrect ? '#dafbe1' : '#ffebe9',
            border: `1px solid ${isCorrect ? '#1a7f37' : '#cf222e'}`,
          }}
        >
          <div className="font-semibold mb-1" style={{ color: isCorrect ? '#1a7f37' : '#cf222e' }}>
            {isCorrect ? '✓ 正确！' : '✗ 不正确'}
          </div>
          <div>{exercise.explanation}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Implement CodeFillExercise**

```tsx
// src/components/CodeFillExercise.tsx
import { useState } from 'react'
import type { CodeFillItem } from '../types/exercise'

interface Props {
  exercise: CodeFillItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

export function CodeFillExercise({ exercise, previousAnswer, onAnswer }: Props) {
  const [input, setInput] = useState(previousAnswer?.userAnswer ?? '')
  const [submitted, setSubmitted] = useState(!!previousAnswer)
  const isCorrect = previousAnswer?.correct ?? false

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '')

  const handleSubmit = () => {
    const correct = normalize(input) === normalize(exercise.answer)
    setSubmitted(true)
    onAnswer(correct, input)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
          style={{ background: '#fff8c5', color: '#9a6700' }}
        >
          代码填空
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {exercise.difficulty}
        </span>
      </div>

      <div className="font-medium mb-3">{exercise.question}</div>

      <div
        className="rounded-lg border overflow-hidden mb-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-code)' }}
      >
        <div
          className="px-3 py-1.5 text-xs"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          python
        </div>
        <pre className="p-4 text-sm leading-relaxed m-0 overflow-x-auto">
          <code>{exercise.codeBefore}</code>
          <span
            className="inline-block px-1 mx-0.5 rounded"
            style={{
              background: submitted ? (isCorrect ? '#dafbe1' : '#ffebe9') : '#fff8c5',
              border: `2px dashed ${submitted ? (isCorrect ? '#1a7f37' : '#cf222e') : '#9a6700'}`,
            }}
          >
            {submitted ? (
              <span style={{ color: isCorrect ? '#1a7f37' : '#cf222e', fontFamily: 'monospace' }}>
                {isCorrect ? exercise.answer : input}
              </span>
            ) : (
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="???"
                className="bg-transparent border-none outline-none text-center font-mono"
                style={{ width: `${Math.max(exercise.answer.length * 10, 60)}px`, color: 'var(--text)' }}
                disabled={submitted}
              />
            )}
          </span>
          <code>{exercise.codeAfter}</code>
        </pre>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="px-4 py-2 rounded-md text-sm text-white cursor-pointer border-none"
          style={{ background: input.trim() ? '#0969da' : '#d0d7de' }}
        >
          提交答案
        </button>
      ) : (
        <div
          className="p-3 rounded-lg text-sm leading-relaxed"
          style={{
            background: isCorrect ? '#dafbe1' : '#ffebe9',
            border: `1px solid ${isCorrect ? '#1a7f37' : '#cf222e'}`,
          }}
        >
          <div className="font-semibold mb-1" style={{ color: isCorrect ? '#1a7f37' : '#cf222e' }}>
            {isCorrect ? '✓ 正确！' : `✗ 正确答案是: ${exercise.answer}`}
          </div>
          <div>{exercise.explanation}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement ScenarioExercise**

```tsx
// src/components/ScenarioExercise.tsx
import { useState } from 'react'
import type { ScenarioItem } from '../types/exercise'

interface Props {
  exercise: ScenarioItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

export function ScenarioExercise({ exercise, previousAnswer, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(
    previousAnswer ? parseInt(previousAnswer.userAnswer) : null
  )
  const [submitted, setSubmitted] = useState(!!previousAnswer)
  const isCorrect = previousAnswer?.correct ?? (selected === exercise.correctIndex)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    onAnswer(selected === exercise.correctIndex, String(selected))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
          style={{ background: '#fbefff', color: '#8250df' }}
        >
          场景判断
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {exercise.difficulty}
        </span>
      </div>

      <div
        className="rounded-lg border p-4 mb-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>🎬 场景描述</div>
        <div className="text-sm leading-relaxed">{exercise.scenario}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {exercise.options.map((opt, i) => {
          let borderStyle = '1px solid var(--border)'
          let bg = 'transparent'
          if (submitted) {
            if (i === exercise.correctIndex) {
              borderStyle = '2px solid #8250df'
              bg = '#fbefff'
            } else if (i === selected && i !== exercise.correctIndex) {
              borderStyle = '2px solid #cf222e'
              bg = '#ffebe9'
            }
          } else if (i === selected) {
            borderStyle = '2px solid #8250df'
            bg = '#fbefff'
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className="p-3 rounded-lg text-left cursor-pointer"
              style={{ border: borderStyle, background: bg }}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {opt.description}
              </div>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-4 py-2 rounded-md text-sm text-white cursor-pointer border-none"
          style={{ background: selected !== null ? '#8250df' : '#d0d7de' }}
        >
          提交答案
        </button>
      ) : (
        <div
          className="p-3 rounded-lg text-sm leading-relaxed"
          style={{
            background: isCorrect ? '#fbefff' : '#ffebe9',
            border: `1px solid ${isCorrect ? '#8250df' : '#cf222e'}`,
          }}
        >
          <div className="font-semibold mb-1" style={{ color: isCorrect ? '#8250df' : '#cf222e' }}>
            {isCorrect ? '✓ 正确！' : '✗ 不正确'}
          </div>
          <div>{exercise.explanation}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Implement ExercisePanel**

```tsx
// src/components/ExercisePanel.tsx
import { useApp } from '../context/AppContext'
import type { ChapterExercises } from '../types/exercise'
import { QuizExercise } from './QuizExercise'
import { CodeFillExercise } from './CodeFillExercise'
import { ScenarioExercise } from './ScenarioExercise'

interface Props {
  chapterExercises: ChapterExercises
}

export function ExercisePanel({ chapterExercises }: Props) {
  const { progress } = useApp()
  const chapterId = chapterExercises.chapterId
  const chapterProgress = progress.progress.chapters[chapterId]
  const total = chapterExercises.exercises.length

  const handleAnswer = (exerciseId: string, correct: boolean, userAnswer: string) => {
    progress.recordAnswer(chapterId, exerciseId, correct, userAnswer, total)
  }

  return (
    <div
      className="rounded-lg border p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold" style={{ color: '#cf6b00' }}>✏️ 章节练习</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          ({total} 题)
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {chapterExercises.exercises.map((ex, i) => {
          const ans = chapterProgress?.exerciseAnswers[ex.id]
          return (
            <span
              key={ex.id}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{
                background: ans
                  ? ans.correct ? '#1a7f37' : '#cf222e'
                  : 'var(--bg-secondary)',
                color: ans ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${ans ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {i + 1}
            </span>
          )
        })}
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-6">
        {chapterExercises.exercises.map(ex => {
          const prev = chapterProgress?.exerciseAnswers[ex.id]
          switch (ex.type) {
            case 'quiz':
              return (
                <QuizExercise
                  key={ex.id}
                  exercise={ex}
                  previousAnswer={prev}
                  onAnswer={(correct, answer) => handleAnswer(ex.id, correct, answer)}
                />
              )
            case 'code_fill':
              return (
                <CodeFillExercise
                  key={ex.id}
                  exercise={ex}
                  previousAnswer={prev}
                  onAnswer={(correct, answer) => handleAnswer(ex.id, correct, answer)}
                />
              )
            case 'scenario':
              return (
                <ScenarioExercise
                  key={ex.id}
                  exercise={ex}
                  previousAnswer={prev}
                  onAnswer={(correct, answer) => handleAnswer(ex.id, correct, answer)}
                />
              )
          }
        })}
      </div>

      {/* Score summary */}
      {chapterProgress?.exercises === 'all_correct' && (
        <div
          className="mt-6 p-4 rounded-lg text-center"
          style={{ background: '#dafbe1', border: '1px solid #1a7f37' }}
        >
          <div className="font-bold text-lg" style={{ color: '#1a7f37' }}>
            🎉 本章完成！
          </div>
          <div className="text-sm mt-1" style={{ color: '#1a7f37' }}>
            得分: {chapterProgress.score}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Verify exercise components render in browser**

Add a temporary test exercise to ChapterPage (will be replaced in next task):

```tsx
// Add to ChapterPage.tsx temporarily (import ExercisePanel and a dummy chapterExercises)
// This verifies all three exercise types render correctly
```

```bash
npm run dev
```

- [ ] **Step 7: Commit**

```bash
git add src/
git commit -m "feat: add quiz, code-fill, and scenario exercise components"
```

---

### Task 11: ChapterNav + Exercise Data (s01-s05)

**Files:**
- Create: `src/components/ChapterNav.tsx`
- Create: `src/data/exercises/s01.ts` through `src/data/exercises/s05.ts`
- Modify: `src/components/ChapterPage.tsx`

- [ ] **Step 1: Implement ChapterNav**

```tsx
// src/components/ChapterNav.tsx
import { useNavigate } from 'react-router-dom'
import { getAdjacentChapters } from '../data/chapters'

interface Props {
  chapterId: string
}

export function ChapterNav({ chapterId }: Props) {
  const navigate = useNavigate()
  const { prev, next } = getAdjacentChapters(chapterId)

  return (
    <div className="flex justify-between items-center pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
      {prev ? (
        <button
          onClick={() => navigate(`/chapter/${prev.id}`)}
          className="px-4 py-2 rounded-md text-sm cursor-pointer border"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          ← {prev.id} {prev.title}
        </button>
      ) : <div />}
      {next ? (
        <button
          onClick={() => navigate(`/chapter/${next.id}`)}
          className="px-4 py-2 rounded-md text-sm text-white cursor-pointer border-none"
          style={{ background: '#238636' }}
        >
          {next.id} {next.title} →
        </button>
      ) : <div />}
    </div>
  )
}
```

- [ ] **Step 2: Create exercise data for s01 (Agent Loop)**

```typescript
// src/data/exercises/s01.ts
import type { ChapterExercises } from '../../types/exercise'

export const s01: ChapterExercises = {
  chapterId: 's01',
  exercises: [
    {
      id: 's01-q1',
      type: 'quiz',
      difficulty: '基础',
      question: 'Agent Loop 中，模型停止调用工具时，循环通过什么机制退出？',
      options: [
        '设置 max_iterations 计数器',
        '检查 stop_reason 是否不等于 "tool_use"',
        '捕获 TimeoutError 异常',
        '等待用户手动停止',
      ],
      correctIndex: 1,
      explanation: 'Agent Loop 的核心退出条件非常简单：当 response.stop_reason 不是 "tool_use" 时，说明模型认为任务完成了，循环通过 break 退出。整个 Agent 就靠这一个判断来知道"该停了"。',
    },
    {
      id: 's01-q2',
      type: 'code_fill',
      difficulty: '基础',
      question: '补全 Agent Loop 的核心退出条件：',
      codeBefore: 'while True:\n    response = client.messages.create(...)\n    messages.append({"role": "assistant", ...})\n    if response.',
      codeAfter: ' != "tool_use":\n        break\n    # execute tools...',
      answer: 'stop_reason',
      explanation: 'stop_reason 是 LLM API 响应中的关键字段。当值为 "tool_use" 时模型要求调用工具，循环继续；其他值（如 "end_turn"）表示模型认为回答完毕，循环退出。',
    },
    {
      id: 's01-q3',
      type: 'scenario',
      difficulty: '进阶',
      scenario: '你正在构建一个 Agent，它在执行完工具后直接结束循环，不会把工具结果返回给模型。用户发现 Agent 只能执行一步操作就停了。问题出在哪里？',
      options: [
        { label: 's01 Agent Loop', description: '循环没有把 tool_result 追加到 messages 并继续迭代' },
        { label: 's02 Tool Use', description: '工具定义有误，模型无法正确解析' },
        { label: 's03 Permission', description: '权限系统阻止了后续工具调用' },
        { label: 's08 Context Compact', description: '上下文溢出导致模型无法继续' },
      ],
      correctIndex: 0,
      explanation: 'Agent Loop 的关键不仅是"循环"，还有"反馈"——执行工具后必须将结果作为 tool_result 追加到 messages 中，模型才能看到结果并决定下一步。缺少这一步，Agent 就成了"一次性工具"。',
    },
  ],
}
```

- [ ] **Step 3: Create exercise data for s02 (Tool Use)**

```typescript
// src/data/exercises/s02.ts
import type { ChapterExercises } from '../../types/exercise'

export const s02: ChapterExercises = {
  chapterId: 's02',
  exercises: [
    {
      id: 's02-q1',
      type: 'quiz',
      difficulty: '基础',
      question: '在 Claude API 中，模型请求调用工具时，response.content 中包含什么类型的 block？',
      options: [
        'text block，包含工具调用指令',
        'tool_use block，包含工具名和输入参数',
        'function block，包含函数签名',
        'action block，包含动作描述',
      ],
      correctIndex: 1,
      explanation: '当模型需要调用工具时，response.content 中包含 type="tool_use" 的 block，其中 block.name 是工具名，block.input 是参数，block.id 是唯一标识。Harness 需要根据这些信息执行对应工具。',
    },
    {
      id: 's02-q2',
      type: 'code_fill',
      difficulty: '基础',
      question: '补全工具分发逻辑——根据 block 的类型调用对应处理函数：',
      codeBefore: 'for block in response.content:\n    if block.type == "',
      codeAfter: '":\n        output = TOOL_HANDLERS[block.name](**block.input)\n        results.append({"type": "tool_result", ...})',
      answer: 'tool_use',
      explanation: '工具调用的关键判断是 block.type == "tool_use"。只有这种类型的 block 才表示模型要调用工具。text 类型的 block 是模型的普通文本回复，不需要执行。',
    },
    {
      id: 's02-q3',
      type: 'scenario',
      difficulty: '进阶',
      scenario: '你的 Agent 有 bash 和 read_file 两个工具。用户请求"读取 config.yaml 的内容"，但模型调用了 bash 工具并执行了 cat config.yaml，而不是使用专门的 read_file 工具。最可能的原因是？',
      options: [
        { label: 's02 Tool Use', description: '工具描述（description）不够清晰，模型无法区分使用场景' },
        { label: 's10 System Prompt', description: '系统提示没有正确引导模型的工具选择' },
        { label: 's01 Agent Loop', description: '循环逻辑有 bug，跳过了 read_file' },
        { label: 's03 Permission', description: 'read_file 被权限系统阻止了' },
      ],
      correctIndex: 0,
      explanation: '模型选择哪个工具完全取决于工具定义中的 name 和 description。如果 read_file 的描述不够清晰（比如只写了"读文件"而没说"读取指定路径的文件内容"），模型可能倾向于用更通用的 bash 来完成。好的工具描述是 Tool Use 的关键。',
    },
  ],
}
```

- [ ] **Step 4: Create exercise data for s03 (Permission)**

```typescript
// src/data/exercises/s03.ts
import type { ChapterExercises } from '../../types/exercise'

export const s03: ChapterExercises = {
  chapterId: 's03',
  exercises: [
    {
      id: 's03-q1',
      type: 'quiz',
      difficulty: '基础',
      question: 'Permission 系统的三道闸门按什么顺序执行？',
      options: [
        '用户审批 → 规则匹配 → 拒绝列表',
        '拒绝列表 → 规则匹配 → 用户审批',
        '规则匹配 → 拒绝列表 → 用户审批',
        '随机顺序，三道闸门独立判断',
      ],
      correctIndex: 1,
      explanation: '三道闸门顺序固定且不可调换：先查拒绝列表（永远禁止的操作直接拦截），再做规则匹配（判断是否需要询问用户），最后用户审批（暂停等待确认）。拒绝列表优先是因为某些操作无论如何都不应执行。',
    },
    {
      id: 's03-q2',
      type: 'code_fill',
      difficulty: '基础',
      question: '补全权限检查函数——三道闸门都没命中时，应该怎么做？',
      codeBefore: 'def check_permission(block) -> bool:\n    # 闸门 1: 硬拒绝\n    if check_deny_list(block): return False\n    # 闸门 2 + 3: 规则 + 审批\n    if check_rules(block): return ask_user(block)\n    # 三道都没命中 →',
      codeAfter: '',
      answer: 'return True',
      explanation: '三道闸门都没命中意味着这个操作是安全的——不在拒绝列表、不触发规则。大部分日常操作（读文件、运行安全命令）都走这条路。默认放行是合理的设计，不能因为加了权限系统就让 Agent 什么都做不了。',
    },
    {
      id: 's03-q3',
      type: 'scenario',
      difficulty: '进阶',
      scenario: 'Agent 在执行一个 git commit 操作时，用户每次都要手动点"允许"。用户反馈这太烦了。你应该怎么优化权限系统？',
      options: [
        { label: 's03 Permission', description: '将 git commit 从"需要审批"规则中移除，只对破坏性操作要求审批' },
        { label: 's04 Hooks', description: '添加一个 Hook 自动批准所有 git 操作' },
        { label: 's01 Agent Loop', description: '在循环中添加自动批准逻辑' },
        { label: 's10 System Prompt', description: '在系统提示中告诉模型不需要请求权限' },
      ],
      correctIndex: 0,
      explanation: '权限系统的规则应该精确到操作类型——git commit 是安全的常规操作，不应要求每次审批。正确的做法是优化 PERMISSION_RULES，只对真正危险的操作（rm、sudo 等）触发审批。权限粒度是 Permission 设计的核心。',
    },
  ],
}
```

- [ ] **Step 5: Create exercise data for s04 and s05**

Create `src/data/exercises/s04.ts` and `src/data/exercises/s05.ts` following the same pattern — 3 exercises each (1 quiz + 1 code_fill + 1 scenario). Use the chapter README content to derive meaningful questions.

- [ ] **Step 6: Create exercise index file**

```typescript
// src/data/exercises/index.ts
import { s01 } from './s01'
import { s02 } from './s02'
import { s03 } from './s03'
import { s04 } from './s04'
import { s05 } from './s05'
import type { ChapterExercises } from '../../types/exercise'

const exercisesMap: Record<string, ChapterExercises> = {
  s01, s02, s03, s04, s05,
}

export function getExercises(chapterId: string): ChapterExercises | null {
  return exercisesMap[chapterId] ?? null
}

export { exercisesMap }
```

- [ ] **Step 7: Integrate ExercisePanel + ChapterNav into ChapterPage**

Update `ChapterPage.tsx` to conditionally render exercises:

```tsx
// Add imports to ChapterPage.tsx
import { ExercisePanel } from './ExercisePanel'
import { ChapterNav } from './ChapterNav'
import { getExercises } from '../data/exercises'

// In the render, replace exercise placeholder with:
const exercises = getExercises(chapter.id)

// ... after MarkdownRenderer section:
{exercises && <ExercisePanel chapterExercises={exercises} />}
{!exercises && (
  <div className="rounded-lg border p-5 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
    本章练习尚未编写
  </div>
)}

<ChapterNav chapterId={chapter.id} />
```

- [ ] **Step 8: Verify in browser**

Navigate to `/chapter/s01` — should see markdown content, 3 exercises below it, and prev/next navigation at bottom. Answer all exercises and verify progress updates.

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: add chapter navigation and exercise data for s01-s05"
```

---

### Task 12: Exercise Data for Remaining Chapters (s06-s20)

**Files:**
- Create: `src/data/exercises/s06.ts` through `src/data/exercises/s20.ts`
- Modify: `src/data/exercises/index.ts`

- [ ] **Step 1: Create exercises for s06-s10**

Follow the same pattern as Task 11 Step 2-5. For each chapter, read the README.md and create 3 exercises (quiz + code_fill + scenario). Key topics per chapter:

- **s06 Subagent**: Context isolation, spawn mechanism, result collection
- **s07 Skill Loading**: Lazy loading, SKILL.md format, on-demand injection
- **s08 Context Compact**: Auto-compact trigger, summarization strategy, budget management
- **s09 Memory**: MEMORY.md structure, daily files, search mechanism
- **s10 System Prompt**: Runtime assembly, component sources, dynamic vs static parts

- [ ] **Step 2: Create exercises for s11-s15**

- **s11 Error Recovery**: Retry strategies, error classification, circuit breaker pattern
- **s12 Task System**: DAG dependencies, task states, priority management
- **s13 Background Tasks**: Async execution, completion notification, result retrieval
- **s14 Cron Scheduler**: Cron expressions, scheduling, missed run policy
- **s15 Agent Teams**: Team topologies, communication patterns, task assignment

- [ ] **Step 3: Create exercises for s16-s20**

- **s16 Team Protocols**: Message formats, handoff patterns, conflict resolution
- **s17 Autonomous Agents**: Self-assignment, kanban board, autonomous decision-making
- **s18 Worktree Isolation**: Git worktree, parallel execution, merge strategy
- **s19 MCP Tools**: Protocol structure, tool discovery, server lifecycle
- **s20 Comprehensive**: Integration of all mechanisms, architecture overview

- [ ] **Step 4: Update exercises index to include all chapters**

```typescript
// src/data/exercises/index.ts
import { s01 } from './s01'
// ... import s02 through s20
import { s20 } from './s20'

const exercisesMap: Record<string, ChapterExercises> = {
  s01, s02, s03, s04, s05,
  s06, s07, s08, s09, s10,
  s11, s12, s13, s14, s15,
  s16, s17, s18, s19, s20,
}
```

- [ ] **Step 5: Verify all chapters have exercises**

```bash
npm run dev
```

Navigate through all 20 chapters — each should show exercises and navigation.

- [ ] **Step 6: Commit**

```bash
git add src/data/exercises/
git commit -m "feat: add exercise data for all 20 chapters"
```

---

### Task 13: Integration + Polish

**Files:**
- Modify: `src/components/ChapterPage.tsx` (scroll to top on chapter change)
- Modify: `src/styles/global.css` (dark theme refinements)

- [ ] **Step 1: Add scroll-to-top on chapter navigation**

Add to `ChapterPage.tsx`:

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Inside ChapterPage component:
const location = useLocation()
useEffect(() => {
  // Scroll main content to top when chapter changes
  const main = document.querySelector('main')
  if (main) main.scrollTop = 0
}, [location.pathname])
```

- [ ] **Step 2: Add loading state and error boundaries**

Wrap routes with a simple error boundary component to handle rendering errors gracefully.

- [ ] **Step 3: Test full learning flow end-to-end**

```bash
npm run dev
```

Walk through:
1. Landing page → click "开始学习"
2. Read s01 content, scroll to bottom (triggers markRead)
3. Answer all 3 exercises in s01
4. Click "s02 Tool Use →" to navigate to next chapter
5. Toggle dark mode — verify all components look correct
6. Export progress, clear localStorage, import progress
7. Refresh page — verify progress is preserved

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass (chapters, glossary, useTheme, useProgress).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Agent Harness learning website"
```
