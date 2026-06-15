import type { ChapterExercises } from '../../types/exercise'

export const s12: ChapterExercises = {
  chapterId: 's12',
  exercises: [
    {
      id: 's12-q1', type: 'quiz', difficulty: '基础',
      question: 'Task System（s12）和 TodoWrite（s05）的关键区别是什么？',
      options: [
        'Task System 支持更多状态类型',
        'Task System 有文件持久化、任务依赖（blockedBy）和跨会话保留，TodoWrite 只是当前会话的执行清单',
        'Task System 可以自动执行任务，TodoWrite 只能列清单',
        'TodoWrite 比 Task System 更适合多 Agent 场景',
      ],
      correctIndex: 1,
      explanation: 'TodoWrite 是"当前任务的执行清单"，存在会话内存中，没有依赖关系，不负责任务认领。Task System 是"可恢复的任务系统"，每个任务是 .tasks/{id}.json 文件，有 blockedBy 依赖图，跨会话持久化，支持 owner/claim 机制——是多 Agent 协作的基础。',
    },
    {
      id: 's12-q2', type: 'code_fill', difficulty: '基础',
      question: '补全任务创建时的依赖声明——"写 API" 必须等 "建数据库" 完成后才能开始：',
      codeBefore: '# 先创建数据库任务\ndb_task = create_task("建数据库表", "创建 users, orders 表")\n\n# 创建 API 任务，声明依赖\napi_task = create_task(\n    "写 API 路由",\n    "实现 CRUD 接口",\n    blockedBy=[',
      codeAfter: ']  # 等数据库任务完成后才能开始\n)',
      answer: 'db_task.id',
      explanation: 'blockedBy 是任务依赖的核心机制。"写 API" 的 blockedBy 包含 "建数据库" 的 ID，意味着只有数据库任务完成后，API 任务才能被认领和执行。这确保了任务按正确的顺序执行——不能先盖屋顶再打地基。',
    },
    {
      id: 's12-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Agent 接到一个项目：搭数据库、写 API、加测试。它用 TodoWrite 列了清单，然后开始写 API，写到一半发现没有数据库表，回头补。加测试时 API 接口签名又变了。任务之间互相阻塞，效率很低。应该用哪种机制改进？',
      options: [
        { label: 's05 TodoWrite', description: '把 TodoWrite 的清单写得更详细，标注先后顺序' },
        { label: 's12 Task System', description: '用带 blockedBy 依赖的任务图，确保任务按 DAG 顺序执行' },
        { label: 's06 Subagent', description: '把每个任务交给不同的子 Agent 并行执行' },
        { label: 's15 Agent Teams', description: '组建团队，让不同队友负责不同任务' },
      ],
      correctIndex: 1,
      explanation: '问题的根源是任务之间没有明确的依赖关系。Task System 通过 blockedBy 建立 DAG（有向无环图）：测试 blockedBy API，API blockedBy 数据库。Agent 只能认领依赖已完成的任务，避免了"先盖屋顶再打地基"的混乱。TodoWrite 没有依赖机制，只适合单任务的步骤清单。',
    },
  ],
}
