import type { ChapterExercises } from '../../types/exercise'

export const s19: ChapterExercises = {
  chapterId: 's19',
  exercises: [
    {
      id: 's19-q1', type: 'quiz', difficulty: '基础',
      question: 'MCP（Model Context Protocol）的核心价值是什么？',
      options: [
        '让 Agent 运行速度更快',
        '定义标准化的工具发现和调用协议，外部服务只要实现它就能被 Agent 调用，不管服务用什么语言写的',
        '替代所有内置工具，统一用外部插件',
        '让多个 Agent 共享同一个工具集',
      ],
      correctIndex: 1,
      explanation: 'MCP 定义了 Agent 如何发现和调用外部工具。核心概念：MCPClient 连接 server 并发现工具（tools/list），调用工具（tools/call），assemble_tool_pool 把内置工具和 MCP 工具组装成一个工具池。外部服务只要实现 MCP 协议就能被 Agent 调用——Agent 不需要知道工具是谁写的、用什么语言写的。',
    },
    {
      id: 's19-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 MCP 工具命名规范——避免不同 server 的工具名冲突：',
      codeBefore: 'def assemble_tool_pool(builtin_tools, mcp_clients) -> list:\n    """把内置工具和 MCP 工具组装成一个工具池"""\n    pool = list(builtin_tools)\n    for server_name, client in mcp_clients.items():\n        for tool in client.tools:\n            # 用',
      codeAfter: '__{server_name}__{tool["name"]} 命名避免冲突\n            prefixed = f"mcp__{server_name}__{tool[\'name\']}"\n            pool.append({"name": prefixed, ...})\n    return pool',
      answer: 'mcp__',
      explanation: 'MCP 工具命名采用 mcp__{server_name}__{tool_name} 格式，例如 mcp__jira__create_ticket、mcp__notion__search。三段式命名确保不同 server 的同名工具不会冲突——Jira 的 "search" 和 Notion 的 "search" 变成 mcp__jira__search 和 mcp__notion__search，各自独立。',
    },
    {
      id: 's19-q3', type: 'scenario', difficulty: '进阶',
      scenario: '你有 3 个外部服务想接入 Agent：Jira API（查 issue）、部署系统（触发 deploy）、Notion 知识库（搜文档）。你不想为每个服务重写一套工具代码。应该用哪种机制？',
      options: [
        { label: 's02 Tool Use', description: '为每个服务手写工具定义和处理器' },
        { label: 's07 Skill Loading', description: '把每个服务的 API 文档写成技能，按需加载' },
        { label: 's19 MCP Plugin', description: '让每个服务实现 MCP 协议，通过 connect_mcp 接入，自动发现和调用工具' },
        { label: 's06 Subagent', description: '为每个服务创建专门的子 Agent' },
      ],
      correctIndex: 2,
      explanation: 'MCP 的核心价值就是"外接工具，标准协议"。每个服务只要实现 MCP 的 tools/list 和 tools/call 接口，Agent 通过 connect_mcp 连接后就能自动发现工具、加入工具池、直接调用。不需要为每个服务重写工具代码——Jira、部署系统、Notion 都是同样的接入方式。',
    },
  ],
}
