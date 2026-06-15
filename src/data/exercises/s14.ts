import type { ChapterExercises } from '../../types/exercise'

export const s14: ChapterExercises = {
  chapterId: 's14',
  exercises: [
    {
      id: 's14-q1', type: 'quiz', difficulty: '基础',
      question: 'Cron 调度的四层模型中，"Queue Processor" 的职责是什么？',
      options: [
        '每秒检查当前时间是否匹配 cron 表达式',
        '把已触发的任务写入 cron_queue',
        '发现队列非空且 Agent 空闲时，自动启动一轮 agent_loop 交付任务',
        '从队列中消费任务并注入到 messages 列表',
      ],
      correctIndex: 2,
      explanation: '四层模型各司其职：Scheduler（daemon 线程每秒轮询判断时间）→ Queue（存储已触发任务）→ Queue Processor（发现队列非空且 Agent 空闲时启动 agent_loop）→ Consumer（agent_loop 消费任务注入 messages）。Queue Processor 是调度与执行的桥梁，确保定时任务在 Agent 空闲时自动交付。',
    },
    {
      id: 's14-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 cron 表达式匹配逻辑——五段式标准语义：',
      codeBefore: 'def cron_matches(expr: str, now: datetime) -> bool:\n    """五段式 cron: 分钟 小时 日 月 星期"""\n    fields = expr.split()\n    minute, hour, dom, month, dow = fields\n    # 分钟、小时、月必须全部匹配\n    if not (match_field(minute, now.minute) and\n            match_field(hour, now.hour) and\n            match_field(month, now.month)):\n        return False\n    # 日和星期：',
      codeAfter: '\n    return match_field(dom, now.day) or match_field(dow, now.weekday())',
      answer: '任一匹配即可（OR）',
      explanation: '标准 cron 语义中，分钟、小时、月必须全部匹配（AND），但日（DOM）和星期（DOW）是 OR 关系——任一匹配即可。这是 Unix cron 用了 50 年的设计：比如 "0 9 * * 1-5" 表示"工作日早上 9 点"，日期和星期只要满足一个就触发。',
    },
    {
      id: 's14-q3', type: 'scenario', difficulty: '进阶',
      scenario: '用户希望 Agent "每天早上 9 点自动跑测试，如果失败就发通知"。但目前所有操作都是用户手动触发的——用户说一句，Agent 动一下。应该引入哪种机制？',
      options: [
        { label: 's13 Background Tasks', description: '把测试放到后台执行，不阻塞 Agent' },
        { label: 's14 Cron Scheduler', description: '用 cron 表达式定时触发任务，调度与执行解耦，无需人工触发' },
        { label: 's17 Autonomous Agents', description: '让 Agent 自己决定什么时候跑测试' },
        { label: 's12 Task System', description: '创建一个跑测试的任务，设置优先级' },
      ],
      correctIndex: 1,
      explanation: 'Cron Scheduler 解决的是"按时间表自动生产工作"的问题。用 cron 表达式 "0 9 * * *" 创建定时任务，调度线程每天 9:00 自动把"跑测试"注入队列，Agent 空闲时自动交付。调度与执行解耦——闹钟不需要你盯着它才会响，到点自动触发。',
    },
  ],
}
