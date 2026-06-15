export interface GlossaryTerm {
  term: string
  category: string
  definition: string
  analogy: string
  firstSeen: string
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'LLM API',
    category: '基础概念',
    definition: '大语言模型的应用程序接口，用于发送提示并获取模型响应',
    analogy: '像打电话给翻译官，你说中文，他翻译成英文',
    firstSeen: 's01'
  },
  {
    term: 'Agent Loop',
    category: '核心机制',
    definition: 'Agent 的核心循环：发送提示、获取响应、执行工具、更新状态',
    analogy: '像流水线：原料进来，加工，成品出去，废料留下',
    firstSeen: 's01'
  },
  {
    term: 'stop_reason',
    category: 'API 响应',
    definition: '模型停止生成的原因：end_turn（完成）、tool_use（需要工具）、max_tokens（超限）',
    analogy: '像红灯：绿灯继续走，黄灯准备停，红灯必须停',
    firstSeen: 's01'
  },
  {
    term: 'Tool Calling',
    category: '核心机制',
    definition: '模型请求调用外部工具的能力，Agent 执行后将结果返回给模型',
    analogy: '像厨师说"我需要刀"，你递给他刀，他继续切菜',
    firstSeen: 's02'
  },
  {
    term: 'Harness',
    category: '架构',
    definition: 'Agent 的框架代码，负责循环、状态管理、工具执行，不包含业务逻辑',
    analogy: '像汽车底盘：引擎、轮子、方向盘都有，但不知道去哪',
    firstSeen: 's01'
  },
  {
    term: 'Context Window',
    category: '模型限制',
    definition: '模型一次能处理的最大 token 数量，超出会截断或报错',
    analogy: '像桌子大小：桌子小，只能放几张纸；桌子大，能放一摞',
    firstSeen: 's08'
  },
  {
    term: 'token',
    category: '基础概念',
    definition: '模型处理文本的最小单位，大约是 3/4 个英文单词或 1-2 个汉字',
    analogy: '像乐高积木：一个词可能是一块积木，也可能是两块',
    firstSeen: 's01'
  },
  {
    term: 'Subagent',
    category: '多 Agent',
    definition: '被主 Agent 创建的子 Agent，拥有独立的上下文和任务',
    analogy: '像经理派实习生去查资料，实习生有自己的笔记本',
    firstSeen: 's06'
  },
  {
    term: 'Context Compact',
    category: '上下文管理',
    definition: '压缩历史对话以节省上下文空间的策略，如摘要、丢弃旧消息',
    analogy: '像整理衣柜：旧衣服打包压缩，腾出空间放新衣服',
    firstSeen: 's08'
  },
  {
    term: 'Memory System',
    category: '持久化',
    definition: '跨会话保留信息的机制，通常存储在文件或数据库中',
    analogy: '像日记本：今天的事写下来，明天忘了可以翻回去看',
    firstSeen: 's09'
  },
  {
    term: 'System Prompt',
    category: '配置',
    definition: '每次请求都携带的全局指令，定义 Agent 的角色、规则、工具',
    analogy: '像员工手册：告诉新员工你是谁、该做什么、不该做什么',
    firstSeen: 's10'
  },
  {
    term: 'MCP',
    category: '协议',
    definition: 'Model Context Protocol，标准化的工具协议，让不同工具可以统一接入',
    analogy: '像 USB 接口：不管是鼠标还是键盘，插上就能用',
    firstSeen: 's19'
  },
  {
    term: 'Hook',
    category: '扩展机制',
    definition: '在 Agent 循环特定节点执行的回调函数，用于日志、监控、拦截',
    analogy: '像门铃：有人来了（事件），门铃响（Hook 执行），你决定是否开门',
    firstSeen: 's04'
  },
  {
    term: 'Permission System',
    category: '安全',
    definition: '在执行工具前判断是否允许的机制，防止危险操作',
    analogy: '像门禁卡：不是所有人都能进服务器机房',
    firstSeen: 's03'
  },
  {
    term: 'Skill',
    category: '知识管理',
    definition: '可复用的程序性知识，按需加载到上下文中指导 Agent 行为',
    analogy: '像菜谱：平时不占脑子，要做菜时翻开看',
    firstSeen: 's07'
  },
  {
    term: 'Worktree',
    category: '隔离',
    definition: 'Git 的工作树隔离机制，让多个 Agent 在不同分支并行工作互不干扰',
    analogy: '像多张办公桌：每个人在自己的桌子上干活，不会弄乱别人的',
    firstSeen: 's18'
  },
  {
    term: 'Cron Scheduler',
    category: '自动化',
    definition: '按时间表自动触发任务的调度器，用于定期执行 Agent 任务',
    analogy: '像闹钟：设定好时间，到点就响，提醒你做事',
    firstSeen: 's14'
  },
  {
    term: 'Task DAG',
    category: '任务管理',
    definition: '有向无环图，用于表示任务之间的依赖关系和执行顺序',
    analogy: '像做菜顺序：先洗菜再切菜再炒菜，不能反过来',
    firstSeen: 's12'
  },
]

export const glossaryMap = new Map(
  glossary.map(t => [t.term.toLowerCase(), t])
)

export function getTermsForChapter(chapterId: string): GlossaryTerm[] {
  return glossary.filter(t => t.firstSeen === chapterId)
}

export function findTermsInText(text: string): { term: GlossaryTerm; index: number }[] {
  const lowerText = text.toLowerCase()
  const results: { term: GlossaryTerm; index: number }[] = []

  for (const t of glossary) {
    const idx = lowerText.indexOf(t.term.toLowerCase())
    if (idx !== -1) {
      results.push({ term: t, index: idx })
    }
  }

  return results.sort((a, b) => a.index - b.index)
}
