import type { ChapterExercises } from '../../types/exercise'

export const s17: ChapterExercises = {
  chapterId: 's17',
  exercises: [
    {
      id: 's17-q1', type: 'quiz', difficulty: '基础',
      question: '自治 Agent 空闲时的 idle_poll 优先检查什么？',
      options: [
        '任务看板上的未认领任务',
        '收件箱（inbox）中的消息，特别是 shutdown_request 等协议消息',
        'cron 调度器的定时任务队列',
        '后台任务的完成通知',
      ],
      correctIndex: 1,
      explanation: 'idle_poll 的检查顺序是：① 收件箱优先（可能包含 shutdown_request 等协议消息，需要立即处理），② 任务看板其次（扫描可认领的未完成任务）。inbox 优先是因为协议消息（如关机请求）比新任务更紧急——收到 shutdown_request 应该立即回复并退出，不能先去认领新任务。',
    },
    {
      id: 's17-q2', type: 'code_fill', difficulty: '基础',
      question: '补全自治 Agent 的任务认领逻辑——从任务看板自动认领无人做的任务：',
      codeBefore: '# ② 扫描任务看板\nunclaimed = scan_unclaimed_tasks()\nif unclaimed:\n    task = unclaimed[0]\n    result = ',
      codeAfter: '(task["id"], agent_name)\n    if "Claimed" in result:\n        messages.append(...)\n        return "work"  # 认领成功，回到 WORK 阶段',
      answer: 'claim_task',
      explanation: 'scan_unclaimed_tasks 找到 pending 状态、无 owner、依赖已完成的任务。claim_task 把任务标记为该 Agent 所有。这是自治的核心——队友不需要 Lead 分配任务，自己看看板、发现没人做的任务就认领，做完再找下一个。Lead 不用操心任务分配。',
    },
    {
      id: 's17-q3', type: 'scenario', difficulty: '进阶',
      scenario: '任务看板上有 10 个未认领任务，但 Lead 必须手动 assign 每一个给队友。如果 Lead 忙于其他工作，任务就一直堆积。用户希望队友能自己发现并认领任务。应该用哪种机制？',
      options: [
        { label: 's12 Task System', description: '给任务设置优先级，让高优先级任务先被分配' },
        { label: 's15 Agent Teams', description: '增加更多队友来处理堆积的任务' },
        { label: 's17 Autonomous Agents', description: '让队友空闲时自动轮询任务看板，发现无人认领的任务就自己 claim' },
        { label: 's14 Cron Scheduler', description: '定时把任务推送给队友' },
      ],
      correctIndex: 2,
      explanation: 'Autonomous Agents 的三阶段生命周期解决了这个问题：WORK（执行任务）→ IDLE（每 5 秒轮询 inbox + 任务看板，发现未认领任务就自动 claim）→ SHUTDOWN。队友从"等分配"变成"自组织"，空闲时主动找活干，Lead 不需要逐个 assign，团队可以扩展到更多队友。',
    },
  ],
}
