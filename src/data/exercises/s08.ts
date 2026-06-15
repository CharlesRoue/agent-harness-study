import type { ChapterExercises } from '../../types/exercise'

export const s08: ChapterExercises = {
  chapterId: 's08',
  exercises: [
    {
      id: 's08-q1', type: 'quiz', difficulty: '基础',
      question: 'Context Compact 采用四层压缩策略："便宜的先跑，贵的后跑"。以下哪个顺序是正确的？',
      options: [
        'LLM 摘要 → 裁旧对话 → 旧工具结果占位 → 应急裁剪',
        '裁旧对话 → 旧工具结果占位 → LLM 摘要 → 应急裁剪',
        '应急裁剪 → LLM 摘要 → 裁旧对话 → 旧工具结果占位',
        '旧工具结果占位 → 裁旧对话 → 应急裁剪 → LLM 摘要',
      ],
      correctIndex: 1,
      explanation: '四层按成本递增排列：L1 snip_compact（裁掉中间旧对话，0 API 调用）→ L2 micro_compact（旧工具结果替换为占位符，0 API）→ L3 llm_compact（调用 LLM 生成摘要，1 API）→ L4 emergency（API 报错时应急裁剪）。便宜的先跑，能不花 API 就不花。',
    },
    {
      id: 's08-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 micro_compact 的核心逻辑——只保留最近几条工具结果的完整内容：',
      codeBefore: 'KEEP_RECENT_TOOL_RESULTS = 3\n\ndef micro_compact(messages):\n    tool_results = collect_tool_result_blocks(messages)\n    if len(tool_results) <= KEEP_RECENT_TOOL_RESULTS:\n        return messages\n    for _, _, block in tool_results[:-KEEP_RECENT_TOOL_RESULTS]:\n        if len(block.get("content", "")) > 120:\n            block["content"] = "',
      codeAfter: '"\n    return messages',
      answer: '[Earlier tool result compacted. Re-run if needed.]',
      explanation: 'micro_compact 是第二层压缩（L2），不需要调用 API。它找到所有旧的工具结果，只保留最近 3 条的完整内容，更早的替换为一行占位符。这样 Agent 读过的 10 个文件中，只有最后 3 个保留原文，前 7 个变成占位符，大幅减少上下文占用。',
    },
    {
      id: 's08-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Agent 连续读了 30 个文件追踪调用链，messages 列表涨到 160 条。此时 Agent 开始"健忘"，忘记了最初的任务目标。API 还没有报错（上下文未超限）。最合适的处理方式是什么？',
      options: [
        { label: 's06 Subagent', description: '下次类似任务用子 Agent 隔离，避免主上下文膨胀' },
        { label: 's08 Context Compact', description: '自动压缩：裁旧对话 + 旧工具结果占位，减少上下文占用' },
        { label: 's09 Memory', description: '把当前任务目标存入持久记忆，压缩后仍可检索' },
        { label: 's11 Error Recovery', description: '等待 API 报错后再触发 reactive compact' },
      ],
      correctIndex: 1,
      explanation: '当 messages 数量膨胀但 API 尚未报错时，auto compact 会自动触发：先 snip_compact 裁掉中间的旧对话（保留头 3 条和尾 47 条），再 micro_compact 把旧工具结果替换为占位符。这两层都是零 API 调用，能显著减少上下文占用，让 Agent 重新聚焦当前任务。',
    },
  ],
}
