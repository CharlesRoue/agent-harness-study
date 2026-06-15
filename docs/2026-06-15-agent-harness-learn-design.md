# Agent Harness 学习网站 — 设计文档

> 日期: 2026-06-15
> 状态: 已审批
> 基于: [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)

---

## 1. 项目概述

构建一个本地运行的交互式学习网站，基于 learn-claude-code 仓库的 20 个渐进章节，帮助用户从零掌握 Agent Harness 工程。用户具备深度学习/AI 基础，但缺乏 LLM 和 Agent 经验。

**核心理念：** 阅读 + 交互练习，术语卡片桥接知识落差，本地运行。

## 2. 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 构建工具 | Vite 6 + TypeScript | 轻量快速，HMR 即时反馈 |
| UI 框架 | React 19 | 组件化，生态成熟 |
| 路由 | React Router 7 | SPA 多章节导航 |
| 样式 | Tailwind CSS 4 | 实用优先，亮色主题为默认 |
| Markdown 渲染 | react-markdown + remark-gfm + rehype-raw | 渲染仓库 README.md，支持表格、内联 HTML |
| 代码高亮 | Shiki | 精准语法高亮，主题可控 |
| 状态管理 | React Context | 进度、主题等全局状态，轻量够用 |
| 数据持久化 | localStorage + JSON 导出备份 | 纯前端方案，支持手动导出进度为 JSON 文件备份 |

## 3. 页面布局

### 3.1 整体结构

```
┌─────────────────────────────────────────────┐
│  TopBar: 标题 | 主题切换 | 进度徽章           │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Main Content                    │
│ 260px    │                                  │
│          │  ┌────────────────────────────┐  │
│ Phase 1  │  │ 课程内容 (Markdown 渲染)    │  │
│  s01 ✓   │  │  - 正文 + 代码高亮          │  │
│  s02 ✓   │  │  - SVG 图表内联            │  │
│  s03 ▶   │  │  - 术语蓝色高亮            │  │
│  s04 ○   │  └────────────────────────────┘  │
│  ...     │                                  │
│          │  ┌────────────────────────────┐  │
│ Phase 2  │  │ 练习区                      │  │
│  s12 ○   │  │  - 选择题 / 代码填空 /      │  │
│  ...     │  │    场景判断                 │  │
│          │  └────────────────────────────┘  │
│ 进度条   │                                  │
│          │  ← 上一章 | 下一章 →              │
└──────────┴──────────────────────────────────┘
```

### 3.2 侧边栏

- 按 Phase 1（核心能力 s01-s11）和 Phase 2（进阶能力 s12-s20）分组
- 状态图标：✓ 已完成（绿色）、▶ 当前章节（蓝色高亮）、○ 未开始（灰色）
- 点击任意章节直接跳转
- 底部显示总进度条和百分比

### 3.3 顶栏

- 项目标题 "Agent Harness 学习"
- 亮色/暗色主题切换（默认亮色）
- 总进度徽章（如 3/20）

### 3.4 底部导航

- 上一章/下一章快捷按钮，显示章节名

## 4. 内容渲染系统

### 4.1 Markdown 渲染

- 使用 react-markdown 读取每章 README.md（中文版）
- remark-gfm 支持表格、任务列表
- rehype-raw 支持内联 HTML（仓库使用了 `<details>` 折叠块）
- SVG 图片从 `public/course-assets/` 加载，路径自动映射

### 4.2 代码块增强

- Shiki 语法高亮（Python 为主）
- 右上角复制按钮
- 可选行号显示

### 4.3 术语卡片浮层

**术语表（glossary.json）：** 维护约 30-50 个 LLM/Agent 核心术语，每个术语包含：

```json
{
  "term": "LLM API",
  "category": "基础概念",
  "definition": "大语言模型 API。通过 HTTP 请求与语言模型交互的方式...",
  "analogy": "就像调用一个远程函数，输入是文字，输出也是文字。",
  "firstSeen": "s01"
}
```

**渲染机制：**

- 构建时扫描正文，匹配术语关键词
- 匹配到的术语标记为蓝色虚线下划线
- hover 或点击弹出浮层卡片，显示术语名、解释、类比、首次出现章节
- 卡片可关闭，不影响阅读流
- 底部提供"查看完整术语表"链接

## 5. 交互练习系统

### 5.1 三种题型

**选择题（Quiz）：**
- 每题 3-4 个选项，单选
- 点选后即时反馈：正确（绿色）/错误（红色）+ 详细解析
- 解析引用对应章节概念，建立知识关联

**代码填空（Code Fill）：**
- 代码块中用 `???` 标记空缺位置
- 用户在输入框填写答案
- 支持模糊匹配（空格/大小写容错）
- 提交后即时判定 + 解析

**场景判断（Scenario）：**
- 给出 Agent 运行场景描述
- 选项为章节名（如 s08 Context Compact）
- 强化对 20 个 Harness 机制之间关系的理解

### 5.2 练习数据格式

每章一个 JSON 文件（`src/data/exercises/s01.json`）：

```json
{
  "chapterId": "s01",
  "exercises": [
    {
      "id": "s01-q1",
      "type": "quiz",
      "difficulty": "基础",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ..."],
      "correctIndex": 1,
      "explanation": "..."
    },
    {
      "id": "s01-q2",
      "type": "code_fill",
      "difficulty": "基础",
      "question": "补全 Agent Loop 的核心条件判断：",
      "codeBefore": "while True:\n    response = client.messages.create(...)\n    messages.append(...)\n    if response.",
      "codeAfter": " != \"tool_use\":\n        break",
      "answer": "stop_reason",
      "explanation": "..."
    },
    {
      "id": "s01-q3",
      "type": "scenario",
      "difficulty": "进阶",
      "scenario": "你的 Agent 需要同时处理多个独立子任务...",
      "options": [
        { "label": "s06 Subagent", "description": "拆分子任务到独立上下文" },
        { "label": "s08 Context Compact", "description": "压缩上下文释放空间" }
      ],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}
```

### 5.3 交互流程

1. 用户完成阅读（滚动到底部）→ 标记已读
2. 进入练习区 → 逐题作答
3. 每题即时反馈（对/错 + 解析）
4. 全部完成 → 显示本章得分（如 3/3）
5. 标记章节完成 → 更新侧边栏状态和进度条

## 6. 进度追踪

### 6.1 追踪维度

| 维度 | 触发条件 | 用途 |
|---|---|---|
| 章节已读 | 滚动到内容底部 | 侧边栏标记 |
| 练习完成 | 全部题目已提交 | 侧边栏标记 ✓ |
| 练习得分 | 每题对错记录 | 复习参考 |
| 当前位置 | 实时记录 | 下次打开回到上次章节 |

### 6.2 存储方案

使用 localStorage 存储进度（纯前端方案，无需后端）：

- **key**: `agent-harness-learn-progress`
- **value**: JSON 对象，结构如下：

```json
{
  "currentChapter": "s03",
  "chapters": {
    "s01": {
      "read": true,
      "exercises": "all_correct",
      "score": "3/3",
      "completedAt": "2026-06-15"
    },
    "s02": {
      "read": true,
      "exercises": "partial",
      "score": "2/3"
    },
    "s03": {
      "read": false,
      "exercises": "not_started"
    }
  }
}
```

**备份机制：** 侧边栏底部提供"导出进度"和"导入进度"按钮，将进度序列化为 JSON 文件下载/上传，防止清缓存导致数据丢失。

## 7. 项目目录结构

```
agent-harness-study/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
│
├── public/
│   └── course-assets/          ← 从仓库同步的 SVG 图片
│       ├── s01_agent_loop/
│       ├── s02_tool_use/
│       └── ...
│
├── content/                    ← 从仓库同步的 Markdown 原文
│   ├── s01_agent_loop/README.md
│   ├── s02_tool_use/README.md
│   └── ...
│
├── src/
│   ├── main.tsx                ← 入口
│   ├── App.tsx                 ← 路由 + 布局
│   │
│   ├── components/
│   │   ├── Sidebar.tsx         ← 侧边栏导航
│   │   ├── TopBar.tsx          ← 顶栏
│   │   ├── MarkdownRenderer.tsx← 内容渲染
│   │   ├── TermTooltip.tsx     ← 术语浮层
│   │   ├── QuizExercise.tsx    ← 选择题组件
│   │   ├── CodeFillExercise.tsx← 代码填空组件
│   │   ├── ScenarioExercise.tsx← 场景判断组件
│   │   ├── ExercisePanel.tsx   ← 练习区容器
│   │   └── ChapterNav.tsx      ← 上下章导航
│   │
│   ├── hooks/
│   │   ├── useProgress.ts      ← 进度读写
│   │   └── useTheme.ts         ← 主题切换
│   │
│   ├── context/
│   │   └── AppContext.tsx       ← 全局状态 Context
│   │
│   ├── data/
│   │   ├── chapters.ts         ← 20 章元信息（id、标题、phase）
│   │   ├── glossary.json       ← 术语表
│   │   └── exercises/          ← 每章练习题
│   │       ├── s01.json
│   │       ├── s02.json
│   │       └── ...
│   │
│   └── styles/
│       └── global.css          ← Tailwind 导入 + 自定义样式
│
├── scripts/
│   └── sync-content.ts         ← 从仓库同步 README + SVG
│
└── docs/
    └── 2026-06-15-agent-harness-learn-design.md  ← 本文档
```

## 8. 内容同步流程

1. `git clone https://github.com/shareAI-lab/learn-claude-code.git` 到任意位置
2. 配置 `scripts/sync-content.ts` 中的源路径
3. `npm run sync` 执行同步：
   - 复制 20 章 README.md（中文版）→ `content/`
   - 复制 SVG 图片 → `public/course-assets/`
4. `npm run dev` 启动开发服务器
5. 运行时 react-markdown 动态读取 `content/` 下的 Markdown

## 9. 主题设计

- **默认亮色主题**（GitHub Light 风格）
- 支持切换到暗色主题（GitHub Dark 风格）
- 颜色体系：
  - 主色：#0969da（链接、术语高亮、当前章节）
  - 成功：#1a7f37（已完成、正确反馈）
  - 警告：#9a6700（代码填空高亮）
  - 紫色：#8250df（场景判断标签、进阶标记）
  - 文本：#1f2328（正文）、#656d76（辅助文字）

## 10. 约束与边界

- **本地运行**：`npm run dev` 启动，不部署到公网
- **单语言**：仅使用中文版 README.md
- **不修改原文**：仓库内容是只读数据源，不 fork 不修改
- **无后端**：纯前端 SPA，进度存本地文件
- **无认证**：单用户，无需登录
