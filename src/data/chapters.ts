export interface Chapter {
  id: string
  dir: string
  title: string
  subtitle: string
  phase: 1 | 2
}

export const chapters: Chapter[] = [
  { id: 's01', dir: 's01_agent_loop',       title: 'Agent Loop',        subtitle: '一个循环就够了',         phase: 1 },
  { id: 's02', dir: 's02_tool_use',          title: 'Tool Use',          subtitle: '多加一个工具，只加一行',   phase: 1 },
  { id: 's03', dir: 's03_permission',        title: 'Permission',        subtitle: '执行前做权限判断',        phase: 1 },
  { id: 's04', dir: 's04_hooks',             title: 'Hooks',             subtitle: '挂在循环上，不写进循环里',  phase: 1 },
  { id: 's05', dir: 's05_todo_write',        title: 'TodoWrite',         subtitle: '没有计划的 Agent，做着做着就偏了', phase: 1 },
  { id: 's06', dir: 's06_subagent',          title: 'Subagent',          subtitle: '大任务拆小，每个拿到的都是干净上下文', phase: 1 },
  { id: 's07', dir: 's07_skill_loading',     title: 'Skill Loading',     subtitle: '用到的时候才加载',        phase: 1 },
  { id: 's08', dir: 's08_context_compact',   title: 'Context Compact',   subtitle: '上下文总会满，要有办法腾地方', phase: 1 },
  { id: 's09', dir: 's09_memory',            title: 'Memory',            subtitle: '压缩会丢细节，要有一层不丢的', phase: 1 },
  { id: 's10', dir: 's10_system_prompt',     title: 'System Prompt',     subtitle: '运行时组装，不硬编码',     phase: 1 },
  { id: 's11', dir: 's11_error_recovery',    title: 'Error Recovery',    subtitle: '错误不是结束，是重试的开始', phase: 1 },
  { id: 's12', dir: 's12_task_system',       title: 'Task System',       subtitle: '目标太大，拆成小任务',     phase: 2 },
  { id: 's13', dir: 's13_background_tasks',  title: 'Background Tasks',  subtitle: '慢操作放后台',           phase: 2 },
  { id: 's14', dir: 's14_cron_scheduler',    title: 'Cron Scheduler',    subtitle: '按时间表生产工作',        phase: 2 },
  { id: 's15', dir: 's15_agent_teams',       title: 'Agent Teams',       subtitle: '一个搞不定，组队来',      phase: 2 },
  { id: 's16', dir: 's16_team_protocols',    title: 'Team Protocols',    subtitle: '队友之间要有约定',       phase: 2 },
  { id: 's17', dir: 's17_autonomous_agents', title: 'Autonomous Agents', subtitle: '自己看板，自己认领',      phase: 2 },
  { id: 's18', dir: 's18_worktree_isolation',title: 'Worktree Isolation',subtitle: '各干各的，互不干扰',      phase: 2 },
  { id: 's19', dir: 's19_mcp_plugin',        title: 'MCP Tools',         subtitle: '外接工具，标准协议',      phase: 2 },
  { id: 's20', dir: 's20_comprehensive',     title: 'Comprehensive Agent',subtitle: '全部机制，归到一个循环', phase: 2 },
]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find(c => c.id === id)
}

export function getChapterIndex(id: string): number {
  return chapters.findIndex(c => c.id === id)
}

export function getAdjacentChapters(id: string): { prev: Chapter | null; next: Chapter | null } {
  const idx = getChapterIndex(id)
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  }
}
