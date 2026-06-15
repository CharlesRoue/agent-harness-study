import type { ChapterExercises } from '../../types/exercise'

export const s11: ChapterExercises = {
  chapterId: 's11',
  exercises: [
    {
      id: 's11-q1', type: 'quiz', difficulty: '基础',
      question: '当 LLM 输出被截断（stop_reason 为 max_tokens）时，第一次恢复动作是什么？',
      options: [
        '立即注入续写提示让模型继续输出',
        '直接切换到备用模型',
        '把 max_tokens 从 8K 升级到 64K，不追加截断输出，用相同请求重试',
        '触发 reactive compact 压缩上下文后重试',
      ],
      correctIndex: 2,
      explanation: '输出截断的恢复策略是分级升级的：第一次直接把 max_tokens 从 8K 升级到 64K（8 倍空间），不追加截断输出到 messages，保持原始请求不变。如果 64K 还是不够，才保存截断输出并注入续写提示，最多续写 3 次。升级只有一次机会，续写最多 3 次，超过就退出。',
    },
    {
      id: 's11-q2', type: 'code_fill', difficulty: '基础',
      question: '补全错误恢复的上下文超限处理——触发 reactive compact 后重试：',
      codeBefore: 'except PromptTooLongError:\n    if not state.',
      codeAfter: ':\n        reactive_compact(messages)  # 比 auto compact 更激进\n        state.has_attempted_reactive_compact = True\n        continue  # 压缩后重试\n    return  # 压缩过还是超限，只能退出',
      answer: 'has_attempted_reactive_compact',
      explanation: 'reactive compact 是比 auto compact 更激进的压缩策略，只在 API 报错 prompt_too_long 时触发。关键设计是"只尝试一次"——如果压缩后还是超限，说明再压缩也不会变小，直接退出。这个状态标记防止无限重试。',
    },
    {
      id: 's11-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Agent 在运行中收到 529 overloaded 错误。它直接崩溃退出了，没有重试，没有退避，没有切换模型。用户抱怨 Agent 太脆弱。应该用哪种机制增强韧性？',
      options: [
        { label: 's08 Context Compact', description: '压缩上下文以减少 API 请求大小' },
        { label: 's11 Error Recovery', description: '对 429/529 错误实施指数退避重试，连续失败可切换备用模型' },
        { label: 's13 Background Tasks', description: '把 API 调用放到后台，失败不影响主循环' },
        { label: 's06 Subagent', description: '把任务交给子 Agent，让它独立处理错误' },
      ],
      correctIndex: 1,
      explanation: '529 overloaded 是临时故障，属于 s11 Error Recovery 的第三种恢复模式。正确的处理是：指数退避 + 抖动重试（避免所有客户端同时重试），连续多次 529 时可以切换到备用模型。这让 Agent 像一辆"不怕熄火的车"——遇到故障自动恢复，而不是一碰就停。',
    },
  ],
}
