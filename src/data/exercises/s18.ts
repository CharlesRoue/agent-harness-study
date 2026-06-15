import type { ChapterExercises } from '../../types/exercise'

export const s18: ChapterExercises = {
  chapterId: 's18',
  exercises: [
    {
      id: 's18-q1', type: 'quiz', difficulty: '基础',
      question: 'Git worktree 在多 Agent 并行执行中解决了什么核心问题？',
      options: [
        'Agent 之间的通信延迟',
        '多个 Agent 在同一目录下修改同一文件导致的互相覆盖和无法干净回滚',
        'Agent 的上下文窗口不够大',
        '任务依赖关系无法正确表达',
      ],
      correctIndex: 1,
      explanation: '当 Alice 和 Bob 都在同一目录工作时，Alice write_file("config.py") 和 Bob write_file("config.py") 会互相覆盖，而且无法分清谁的改动是什么。Git worktree 为每个任务创建独立的工作目录和分支（Alice 在 .worktrees/auth-refactor/，Bob 在 .worktrees/ui-login/），各干各的，互不干扰。',
    },
    {
      id: 's18-q2', type: 'code_fill', difficulty: '基础',
      question: '补全 worktree 创建逻辑——为任务创建独立目录和独立分支：',
      codeBefore: 'def create_worktree(name: str, task_id: str = "") -> str:\n    validate_worktree_name(name)  # 只允许 [A-Za-z0-9._-]{1,64}\n    path = WORKTREES_DIR / name\n    ok, result = run_git(["',
      codeAfter: '", str(path), "-b", f"wt/{name}", "HEAD"])\n    if not ok:\n        return f"Git error: {result}"\n    if task_id:\n        bind_task_to_worktree(task_id, name)\n    return f"Worktree \'{name}\' created at {path}"',
      answer: 'worktree add',
      explanation: 'git worktree add 是关键命令：它创建一个新的工作目录（path），关联一个新的分支（-b wt/{name}），基于当前 HEAD。这个目录和主工作目录共享同一个 .git 仓库，但文件树完全独立。Alice 在自己的 worktree 里改文件不会影响 Bob 的 worktree。',
    },
    {
      id: 's18-q3', type: 'scenario', difficulty: '进阶',
      scenario: 'Alice 的任务是"重构认证模块"，Bob 的任务是"重构 UI 登录页"。两人都在项目根目录工作。Alice 修改了 config.py，Bob 也修改了 config.py，互相覆盖。而且无法干净地回滚——分不清哪些改动是谁的。应该用哪种机制？',
      options: [
        { label: 's16 Team Protocols', description: '让 Alice 和 Bob 通过协议协商，避免同时修改同一文件' },
        { label: 's17 Autonomous Agents', description: '让队友自动检测文件冲突并解决' },
        { label: 's18 Worktree Isolation', description: '为每个任务创建独立的 git worktree，各自在独立目录下工作，互不干扰' },
        { label: 's12 Task System', description: '给任务加锁，同一时间只允许一个 Agent 修改文件' },
      ],
      correctIndex: 2,
      explanation: 's15-s17 解决了"谁干什么"和"怎么通信"，但没解决"在哪干"。Worktree Isolation 通过 git worktree 为每个任务创建独立的工作目录：Alice 在 .worktrees/auth-refactor/，Bob 在 .worktrees/ui-login/。各干各的目录，互不覆盖。完成后各自的改动在独立分支上，可以干净地 merge 或回滚。',
    },
  ],
}
