import type { ChapterExercises } from '../../types/exercise'

export const s16: ChapterExercises = {
  chapterId: 's16',
  exercises: [
    {
      id: 's16-q1', type: 'quiz', difficulty: '基础',
      question: 'Team Protocols 中 shutdown_request 和 plan_approval_request 两种协议，它们的底层机制有什么关系？',
      options: [
        '它们使用完全不同的通信方式，没有共性',
        '它们共享同一套 request-response 机制：一方发请求，另一方回复，通过 request_id 关联，状态机追踪 pending → approved/rejected',
        'shutdown 使用同步阻塞，plan_approval 使用异步回调',
        'shutdown 只能 Lead 发起，plan_approval 只能队友发起，方向不同但机制相同',
      ],
      correctIndex: 1,
      explanation: '两种协议的结构完全一样：一方发请求 → 创建 ProtocolState（status=pending）→ 另一方收到后 dispatch → 回复时通过 request_id 找到对应记录 → 更新状态为 approved/rejected。关机是 Lead→队友方向，计划审批是队友→Lead 方向，但底层都是同一套 request-response 状态机。',
    },
    {
      id: 's16-q2', type: 'code_fill', difficulty: '基础',
      question: '补全协议状态的关联逻辑——通过 request_id 找到对应请求并更新状态：',
      codeBefore: 'def handle_response(msg: dict):\n    """队友/Lead 收到协议回复时调用"""\n    req_id = msg["metadata"]["request_id"]\n    state = pending_requests.get(req_id)\n    if not state:\n        return  # 找不到对应请求，忽略\n    state.status = "',
      codeAfter: '" if msg["metadata"].get("approve") else "rejected"\n    # 状态从 pending 变为 approved/rejected',
      answer: 'approved',
      explanation: 'ProtocolState 的状态机很简单：pending → approved 或 rejected。回复消息中通过 request_id 找到原始请求，通过 approve 字段判断是批准还是拒绝。这个机制让关机和计划审批都有了结构化的握手——不是"杀进程"，而是"请求-确认-执行"。',
    },
    {
      id: 's16-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Lead 想让队友 Alice 关机。如果直接杀线程，Alice 写了一半的文件会留在磁盘上。Lead 需要等 Alice 确认收尾后再安全退出。应该用哪种机制？',
      options: [
        { label: 's15 Agent Teams', description: '通过 MessageBus 发一条关机消息给 Alice' },
        { label: 's16 Team Protocols', description: '使用 shutdown_request/response 协议握手：Lead 发请求，Alice 确认收尾后回复 approved' },
        { label: 's17 Autonomous Agents', description: '让 Alice 自己检测到关机信号后退出' },
        { label: 's12 Task System', description: '把 Alice 的任务标记为 completed，让她自然退出' },
      ],
      correctIndex: 1,
      explanation: '直接杀线程会导致数据丢失。Team Protocols 的 shutdown 协议提供了结构化的关机握手：Lead 发 shutdown_request（创建 ProtocolState），Alice 收到后完成收尾工作（保存文件、清理状态），然后回复 shutdown_response（approve=True），Lead 收到确认后才安全关闭 Alice 的线程。',
    },
  ],
}
