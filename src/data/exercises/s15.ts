import type { ChapterExercises } from '../../types/exercise'

export const s15: ChapterExercises = {
  chapterId: 's15',
  exercises: [
    {
      id: 's15-q1', type: 'quiz', difficulty: '基础',
      question: 's15 的队友和 s06 的子 Agent 最核心的区别是什么？',
      options: [
        '队友使用的 LLM 模型更强大',
        '队友有多轮生命周期和异步收件箱，能通信和协作；子 Agent 是一次性的，只回传结论',
        '队友有独立的 system prompt，子 Agent 共享主 Agent 的 prompt',
        '队友可以递归 spawn 新的队友',
      ],
      correctIndex: 1,
      explanation: '子 Agent 是"临时工"：一次性任务，完全上下文隔离，完成后只回传结论文本。队友是"团队成员"：多轮生命周期，有异步收件箱（MessageBus），能随时和其他 Agent 通信。子 Agent 解决上下文隔离问题，队友解决多模块协作问题。',
    },
    {
      id: 's15-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 MessageBus 的发送逻辑——发消息就是往对方的收件箱文件追加一行：',
      codeBefore: 'class MessageBus:\n    def send(self, from_agent: str, to_agent: str,\n             content: str, msg_type: str = "message"):\n        msg = {"from": from_agent, "to": to_agent,\n               "content": content, "type": msg_type,\n               "ts": time.time()}\n        inbox = MAILBOX_DIR / f"{to_agent}.',
      codeAfter: '"\n        with open(inbox, "a") as f:\n            f.write(json.dumps(msg) + "\\n")',
      answer: 'jsonl',
      explanation: 'MessageBus 使用 .jsonl 文件作为收件箱——每行一条 JSON 消息。发消息就是往对方的文件追加一行（append），读消息就是读文件后删除（消费式）。选文件而不是内存队列的原因是：直观、跨线程可观察、和真实 CC 的实现方式一致。',
    },
    {
      id: 's15-q3', type: 'scenario', difficulty: '进阶',
      scenario: '"重构整个后端"涉及认证模块、数据库层、API 路由、测试。一个 Agent 在修 API 路由时，认证模块的细节已经不在上下文里了。上下文窗口就那么大，单个 Agent 的注意力覆盖不了所有模块。应该用哪种机制？',
      options: [
        { label: 's06 Subagent', description: '把每个模块交给子 Agent，但子 Agent 之间无法通信' },
        { label: 's08 Context Compact', description: '压缩上下文以容纳更多模块信息' },
        { label: 's15 Agent Teams', description: '组建团队，每个队友负责一个模块，通过消息总线异步通信和协作' },
        { label: 's12 Task System', description: '把每个模块拆成独立任务，按依赖顺序执行' },
      ],
      correctIndex: 2,
      explanation: '当单个 Agent 的上下文覆盖不了所有模块时，需要组队。每个队友有自己的独立的上下文，专注一个模块；通过 MessageBus 异步通信，互相交换进展和接口约定。子 Agent 虽然也有独立上下文，但它们之间无法通信——"重构后端"需要的是能协作的队友，不是用完就走的临时工。',
    },
  ],
}
