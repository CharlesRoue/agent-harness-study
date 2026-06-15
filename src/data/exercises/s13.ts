import type { ChapterExercises } from '../../types/exercise'

export const s13: ChapterExercises = {
  chapterId: 's13',
  exercises: [
    {
      id: 's13-q1', type: 'quiz', difficulty: '基础',
      question: '后台任务完成后，结果是如何传递给 Agent 的？',
      options: [
        '直接写入 Agent 的 messages 列表，立即中断当前操作',
        '在下一轮 LLM 调用前，以 task_notification 的形式注入到对话上下文中',
        '通过文件系统保存结果，Agent 需要主动读取',
        '通过 PostToolUse hook 自动触发结果处理',
      ],
      correctIndex: 1,
      explanation: '后台任务的结果不会立即中断 Agent 的当前操作。它在下一轮 LLM 调用前被注入到 messages 中，以 <task_notification> 的形式出现。就像洗衣机完成后"滴滴滴"提醒你——它不会在你做饭时把你拉到洗衣机前面，而是在你下一次有空时通知你。',
    },
    {
      id: 's13-q2', type: 'code_fill', difficulty: '基础',
      question: '补全后台任务的判断逻辑——模型显式请求优先，启发式兜底：',
      codeBefore: 'def should_run_background(tool_name: str, tool_input: dict) -> bool:\n    """模型显式请求优先；启发式兜底。"""\n    if tool_input.get("',
      codeAfter: '"):\n        return True\n    return is_slow_operation(tool_name, tool_input)  # 启发式兜底',
      answer: 'run_in_background',
      explanation: '后台执行有两层判断：主路径是模型通过 bash 工具的 run_in_background 参数显式请求，模型自己决定哪些命令丢后台；兜底是启发式关键词匹配（install、build、test 等慢操作关键词）。显式请求优先，因为模型比关键词匹配更了解当前上下文。',
    },
    {
      id: 's13-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Agent 执行 npm install 时等了 10 分钟，期间什么也没做。LLM 按 token 计费，空转就是浪费。用户希望 Agent 能在等待安装的同时处理其他任务。应该用哪种机制？',
      options: [
        { label: 's06 Subagent', description: '把 npm install 交给子 Agent，主 Agent 继续工作' },
        { label: 's13 Background Tasks', description: '把慢操作放到后台线程执行，Agent 继续主循环处理其他任务' },
        { label: 's14 Cron Scheduler', description: '定时触发 npm install，避开高峰期' },
        { label: 's15 Agent Teams', description: '让一个队友专门负责安装依赖' },
      ],
      correctIndex: 1,
      explanation: 'Background Tasks 就是为这种场景设计的。npm install 被识别为慢操作（匹配 "install" 关键词或模型显式请求），扔到 daemon 线程后台执行。Agent 拿到一个占位结果后立即继续主循环，处理其他任务。后台完成后，通知注入到下一轮对话中。就像洗衣机——按下启动后去干别的。',
    },
  ],
}
