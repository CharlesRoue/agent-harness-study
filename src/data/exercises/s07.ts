import type { ChapterExercises } from '../../types/exercise'

export const s07: ChapterExercises = {
  chapterId: 's07',
  exercises: [
    {
      id: 's07-q1', type: 'quiz', difficulty: '基础',
      question: '技能加载采用两级设计：启动时注入目录，运行时按需加载内容。为什么不直接把所有技能内容塞进 system prompt？',
      options: [
        '技能内容太大会导致 LLM 推理速度下降',
        '99% 的技能和当前任务无关，全塞进去白白消耗 token，且 Agent 每轮都带着无用信息',
        'LLM 无法解析超过 1000 行的 system prompt',
        '技能内容有版权限制，不能全部暴露给模型',
      ],
      correctIndex: 1,
      explanation: '技能加载的核心思想是"用到时才加载"。启动时只注入每个技能的名称和描述（约 100 tokens/skill），Agent 知道"我有什么技能可用"。只有当 Agent 判断需要某个技能时，才调用 load_skill 加载完整内容（约 2000 tokens），避免浪费 token。',
    },
    {
      id: 's07-q2', type: 'code_fill', difficulty: '基础',
      question: '补全技能加载函数的核心逻辑——按需返回完整技能内容：',
      codeBefore: 'def load_skill(skill_name: str) -> str:\n    skill = SKILL_REGISTRY.get(skill_name)\n    if not skill:\n        return f"Unknown skill: {skill_name}"\n    return skill[',
      codeAfter: ']  # 返回完整的 SKILL.md 内容',
      answer: '"content"',
      explanation: 'SKILL_REGISTRY 在启动时扫描 skills/ 目录，存储每个技能的 name、description 和完整 content。load_skill 被调用时，直接从注册表中取出 content 字段返回，通过 tool_result 注入到对话上下文中。这就是"按需加载"的关键一行。',
    },
    {
      id: 's07-q3', type: 'scenario', difficulty: '进阶',
      scenario: '你的项目有 React 组件规范、SQL 风格指南、API 设计文档共 6500 行。Agent 每次请求都带着全部文档，即使只是在改 CSS 颜色。用户反映 token 消耗太高。应该用哪种机制优化？',
      options: [
        { label: 's08 Context Compact', description: '自动压缩上下文，减少每轮携带的信息量' },
        { label: 's07 Skill Loading', description: '把规范文档转为技能，启动时只注入目录，用到时才加载完整内容' },
        { label: 's10 System Prompt', description: '把规范从 system prompt 中移除，减少固定开销' },
        { label: 's09 Memory', description: '把规范存入记忆系统，跨会话保留' },
      ],
      correctIndex: 1,
      explanation: '这正是 Skill Loading 解决的问题。把 6500 行规范拆成独立技能（react-style、sql-style、api-design），启动时只在 system prompt 放一行目录。Agent 改 CSS 时不加载任何规范，写 SQL 时才 load_skill("sql-style")，token 消耗从每轮 6500 行降到按需 2000 行。',
    },
  ],
}
