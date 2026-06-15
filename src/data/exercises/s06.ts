import type { ChapterExercises } from '../../types/exercise'

export const s06: ChapterExercises = {
  chapterId: 's06',
  exercises: [
    {
      id: 's06-q1', type: 'quiz', difficulty: '基础',
      question: '子 Agent 为什么不能递归 spawn 新的子 Agent？',
      options: [
        '递归调用会导致 API 费用指数增长',
        '子 Agent 的工具集中不包含 task 工具，从设计上禁止递归',
        'LLM 不支持嵌套的 messages 列表',
        '递归会触发权限系统的拒绝列表',
      ],
      correctIndex: 1,
      explanation: '子 Agent 的工具集被显式限制：有 bash/read/write/edit/glob，但没有 task 工具。这是设计层面的隔离——防止无限递归导致上下文爆炸和资源耗尽。子 Agent 只负责完成一件具体任务并返回结论。',
    },
    {
      id: 's06-q2', type: 'code_fill', difficulty: '基础',
      question: '补全子 Agent 的核心隔离机制——给它一个全新的消息列表：',
      codeBefore: 'def spawn_subagent(description: str) -> str:\n    sub_tools = [bash, read_file, write_file, edit_file, glob]\n    # 关键：子 Agent 使用独立的消息列表\n    messages = [{"role": "',
      codeAfter: '", "content": description}]  # 全新 messages[]\n    for _ in range(30):\n        response = client.messages.create(messages=messages, tools=sub_tools)\n        ...',
      answer: 'user',
      explanation: '子 Agent 的上下文隔离核心在于：它拥有全新的 messages 列表，只有一条 user 消息（任务描述）。主 Agent 的 120 条历史消息不会传入，子 Agent 拿到的是干净的上下文，注意力不会被无关信息干扰。',
    },
    {
      id: 's06-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Agent 在修一个复杂 bug，需要追踪 30 个文件的调用链。追踪完成后，主 Agent 的上下文已经被中间过程塞满，变得"健忘"。应该用哪种机制解决？',
      options: [
        { label: 's06 Subagent', description: '把调用链追踪交给子 Agent，它用独立上下文完成后只返回结论' },
        { label: 's08 Context Compact', description: '压缩主 Agent 的历史消息来腾出空间' },
        { label: 's09 Memory', description: '把追踪结果存入持久记忆，压缩后仍可检索' },
        { label: 's07 Skill Loading', description: '把追踪方法写成技能文档，按需加载' },
      ],
      correctIndex: 0,
      explanation: '这正是子 Agent 的典型场景：大量中间过程（读 30 个文件、追踪调用链）和最终目标（修 bug）无关。把追踪交给子 Agent，它用独立的干净上下文完成工作，只把结论（"bug 在 auth.py 第 42 行"）返回给主 Agent，中间过程全部丢弃。',
    },
  ],
}
