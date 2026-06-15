import type { ChapterExercises } from '../../types/exercise'

export const s10: ChapterExercises = {
  chapterId: 's10',
  exercises: [
    {
      id: 's10-q1', type: 'quiz', difficulty: '基础',
      question: 'System Prompt 从硬编码字符串改为运行时组装，最核心的好处是什么？',
      options: [
        '减少代码行数，让程序更短',
        '各 section 独立维护，修改一处不影响其他，且可根据真实状态按需拼接避免浪费 token',
        '让 system prompt 可以被 LLM 自动修改',
        '提高 LLM 的推理速度',
      ],
      correctIndex: 1,
      explanation: '运行时组装的三个核心好处：1) 独立维护——修改 tools section 不影响 identity section；2) 按需拼接——没有记忆文件时不注入 memory section，节省 token；3) 缓存友好——稳定 section（identity、tools）保持不变，可命中 prompt cache。判断依据是真实状态（文件是否存在、工具是否启用），不是消息关键词。',
    },
    {
      id: 's10-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 system prompt 的按需拼接逻辑——根据真实状态决定是否注入记忆：',
      codeBefore: 'PROMPT_SECTIONS = {\n    "identity": "You are a coding agent. Act, don\'t explain.",\n    "tools": "Available tools: bash, read_file, write_file.",\n    "workspace": f"Working directory: {WORKDIR}",\n    "memory": "Relevant memories are injected below.",\n}\n\ndef assemble_system_prompt() -> str:\n    parts = [PROMPT_SECTIONS["identity"], PROMPT_SECTIONS["tools"], PROMPT_SECTIONS["workspace"]]\n    if ',
      codeAfter: ':\n        parts.append(PROMPT_SECTIONS["memory"])\n    return "\\n\\n".join(parts)',
      answer: 'MEMORY_DIR.exists()',
      explanation: 'memory section 是否加载取决于 .memory/ 目录是否存在——这是真实状态判断，不是猜测。如果项目没有记忆文件，就不注入这段内容，省下 token。每个 section 的加载条件独立：identity 和 tools 始终加载，memory 按需加载。',
    },
    {
      id: 's10-q3', type: 'scenario', difficulty: '进阶',
      scenario: '你在维护一个 Agent 项目，每次新增一个工具都要修改 system prompt 的硬编码字符串。上周加了一个搜索工具，结果和前面的指令冲突了，Agent 行为变得不可预测。问题出在哪里？',
      options: [
        { label: 's10 System Prompt', description: '硬编码的 prompt 牵一发动全身，应改为分段独立维护、运行时组装' },
        { label: 's02 Tool Use', description: '工具定义有问题，导致模型理解错误' },
        { label: 's04 Hooks', description: '缺少 Hook 来验证 system prompt 的一致性' },
        { label: 's08 Context Compact', description: 'prompt 太长导致上下文溢出' },
      ],
      correctIndex: 0,
      explanation: '硬编码 system prompt 的核心问题是"修改一处可能影响全局"。s10 的解决方案是把 prompt 拆成独立 section（identity、tools、workspace、memory），每个 section 独立维护。新增工具只需修改 tools section，不会和 identity 指令冲突。运行时按需拼接，还能利用 prompt cache 减少成本。',
    },
  ],
}
