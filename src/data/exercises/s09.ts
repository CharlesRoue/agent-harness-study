import type { ChapterExercises } from '../../types/exercise'

export const s09: ChapterExercises = {
  chapterId: 's09',
  exercises: [
    {
      id: 's09-q1', type: 'quiz', difficulty: '基础',
      question: 'Memory 系统选择了文件系统（.memory/ 目录下的 .md 文件）而不是数据库，最核心的原因是什么？',
      options: [
        '文件系统读写速度更快',
        '记忆文件不参与上下文压缩，且可跨会话保留，Agent 和人类都能直接查看和编辑',
        '数据库需要额外的连接池管理',
        'LLM 只能理解 Markdown 格式的数据',
      ],
      correctIndex: 1,
      explanation: 'Memory 的核心价值是"不参与压缩、跨会话保留"。选文件系统是因为：.md 文件直观可读，人类和 Agent 都能查看编辑；文件不参与上下文压缩管线，细节不会丢失；新开会话时通过 MEMORY.md 索引重新加载，实现跨会话持久化。',
    },
    {
      id: 's09-q2', type: 'code_fill', difficulty: '基础',
      question: '补全记忆系统的设计——索引常驻 system prompt，内容按需加载：',
      codeBefore: '# MEMORY.md 索引注入 system prompt\nSYSTEM = base_prompt + "\\n## Memories\\n" + read_memory_index()\n\n# 记忆内容加载：根据当前对话匹配相关记忆\ndef load_relevant_memories(query: str) -> str:\n    index = parse_memory_index()\n    relevant = [m for m in index if ',
      codeAfter: '(m, query)]\n    return "\\n".join(read_memory_file(m) for m in relevant)',
      answer: 'matches',
      explanation: '记忆系统的两条加载路径：索引（MEMORY.md）常驻 system prompt，每轮都带，约 100 tokens/条，可被 prompt cache 缓存；内容按需加载，通过文件名和描述匹配当前对话，注入到 user turn 中。这样既保证 Agent 始终知道"有哪些记忆"，又不浪费 token 加载无关内容。',
    },
    {
      id: 's09-q3', type: 'scenario', difficulty: '进阶',
      scenario: '用户告诉 Agent "用 tab 缩进不要用空格"。Agent 记住了，但经过 s08 的上下文压缩后，这个偏好被简化成"用户有代码风格偏好"，细节丢失了。下次写代码时 Agent 又用了空格。应该用哪种机制确保偏好不丢失？',
      options: [
        { label: 's08 Context Compact', description: '优化压缩算法，保留更多细节' },
        { label: 's09 Memory', description: '将偏好写入 .memory/ 目录的持久文件，不参与压缩，跨会话保留' },
        { label: 's10 System Prompt', description: '把用户偏好硬编码到 system prompt 中' },
        { label: 's07 Skill Loading', description: '把偏好写成技能文档，需要时加载' },
      ],
      correctIndex: 1,
      explanation: '上下文压缩是有损的，细节必然丢失。Memory 系统专门解决这个问题：把"用 tab 不用空格"写为 .memory/user-preference-tabs.md 文件，索引常驻 system prompt，内容按需注入。压缩、新会话都不影响——文件在磁盘上，细节完整保留。',
    },
  ],
}
