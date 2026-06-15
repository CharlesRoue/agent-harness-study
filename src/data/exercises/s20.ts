import type { ChapterExercises } from '../../types/exercise'

export const s20: ChapterExercises = {
  chapterId: 's20',
  exercises: [
    {
      id: 's20-q1', type: 'quiz', difficulty: '基础',
      question: 'S20 综合 Agent 的核心循环结构和 S01 的简单循环有什么关系？',
      options: [
        'S20 使用了完全不同的循环结构',
        'S20 的核心循环和 S01 相同（调用模型 → 检查 tool_use → 执行工具 → 追加结果），只是循环周围的 harness 变完整了',
        'S20 取消了 while 循环，改为事件驱动',
        'S20 的循环每次只执行一个工具，S01 可以批量执行',
      ],
      correctIndex: 1,
      explanation: '从 S01 到 S20，循环的核心结构始终不变：调用 LLM → 检查响应中是否有 tool_use block → 执行工具 → 把 tool_result 追加回 messages → 下一轮。变化的是循环周围的 harness：权限 hook、压缩管线、记忆注入、prompt 组装、错误恢复、后台调度、团队协议、worktree 隔离、MCP 插件——都挂在这同一个 while True 上。',
    },
    {
      id: 's20-q2', type: 'code_fill', difficulty: '基础',
      question: '补全综合 Agent 循环中 LLM 调用前的组装逻辑——让模型看到当前全部能力：',
      codeBefore: 'while True:\n    # ① LLM 调用前：压缩 + 组装 system prompt\n    messages = auto_compact(messages)\n    system = assemble_system_prompt(\n        identity=True,\n        tools=enabled_tools,\n        workspace=WORKDIR,\n        memory=',
      codeAfter: ',  # 按需注入记忆\n        skills=SKILL_REGISTRY,  # 按需注入技能目录\n        mcp_state=mcp_clients,  # 注入 MCP 工具状态\n    )\n    response = client.messages.create(system=system, messages=messages, tools=tool_pool)',
      answer: 'MEMORY_DIR.exists()',
      explanation: 'assemble_system_prompt 的 memory 参数取决于 .memory/ 目录是否存在——这是 S10 运行时组装思想的体现。综合 Agent 在每轮 LLM 调用前，把记忆、技能目录、MCP 工具状态都组装进 system prompt，让模型看到当前全部能力和长期上下文。',
    },
    {
      id: 's20-q3', type: 'scenario', difficulty: '进阶',
      scenario: '你在构建一个能长期工作的 coding agent，它需要同时具备：工具分发、权限边界、hooks 扩展、压缩恢复、记忆持久、技能加载、任务管理、后台调度、团队协作、worktree 隔离、MCP 插件。你觉得最困难的部分是什么？',
      options: [
        { label: 's20 Comprehensive', description: '难点不是堆功能，而是看清所有组件都挂在循环的哪个位置，确保它们协同工作而不互相干扰' },
        { label: 's01 Agent Loop', description: '循环本身太简单，无法承载这么多功能' },
        { label: 's11 Error Recovery', description: '错误恢复是最复杂的子系统，其他都是简单的增删' },
        { label: 's15 Agent Teams', description: '团队通信是最难调试的部分' },
      ],
      correctIndex: 0,
      explanation: 'S20 的核心洞察是"机制很多，循环一个"。所有组件都挂在同一个 while True 上的不同位置：用户输入前后是 UserPromptSubmit hooks，LLM 前是压缩 + prompt 组装 + cron/background 通知注入，工具执行前是 PreToolUse hooks + 权限，执行时可能走 background dispatch，执行后是 PostToolUse hooks。难点不是堆功能，而是理解每个组件在循环中的精确位置。',
    },
  ],
}
