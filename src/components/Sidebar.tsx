import { useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import { useApp } from '../context/AppContext'
import { chapters } from '../data/chapters'

export function Sidebar() {
  const { progress } = useApp()
  const navigate = useNavigate()
  const { chapterId: currentId } = useParams<{ chapterId: string }>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const phase1 = chapters.filter(ch => ch.phase === 1)
  const phase2 = chapters.filter(ch => ch.phase === 2)

  const pct = Math.round((progress.completedCount / 20) * 100)

  function getStatus(chId: string) {
    const cp = progress.progress.chapters[chId]
    if (cp?.exercises === 'all_correct') return 'complete'
    if (chId === currentId) return 'current'
    return 'not_started'
  }

  function statusIcon(status: string) {
    if (status === 'complete') return <span style={{ color: '#238636' }}>&#10003;</span>
    if (status === 'current') return <span style={{ color: '#0969da' }}>&#9654;</span>
    return <span style={{ color: 'var(--text-secondary)' }}>&#9675;</span>
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      progress.importProgress(file)
    }
    e.target.value = ''
  }

  function renderChapterItem(ch: typeof chapters[number]) {
    const status = getStatus(ch.id)
    const isCurrent = ch.id === currentId
    return (
      <button
        key={ch.id}
        onClick={() => navigate(`/chapter/${ch.id}`)}
        className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 rounded-none border-none cursor-pointer transition-colors"
        style={{
          background: isCurrent ? 'var(--bg-tertiary)' : 'transparent',
          borderLeft: isCurrent ? '3px solid #0969da' : '3px solid transparent',
          color: isCurrent ? '#0969da' : 'var(--text-primary)',
          fontWeight: isCurrent ? 600 : 400,
        }}
      >
        {statusIcon(status)}
        <span className="truncate">
          <span className="opacity-60 mr-1">{ch.id}</span>
          {ch.title}
        </span>
      </button>
    )
  }

  return (
    <aside
      className="w-[260px] flex-shrink-0 flex flex-col border-r overflow-hidden"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Phase 1 - 基础机制
          </span>
        </div>
        {phase1.map(renderChapterItem)}

        <div className="px-3 py-1.5 mt-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Phase 2 - 高阶系统
          </span>
        </div>
        {phase2.map(renderChapterItem)}
      </nav>

      <div
        className="flex-shrink-0 border-t px-3 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            进度
          </span>
          <span className="text-xs font-semibold">{pct}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden mb-3"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: '#238636' }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={progress.exportProgress}
            className="flex-1 text-xs py-1 rounded border cursor-pointer"
            style={{
              borderColor: 'var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            导出
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 text-xs py-1 rounded border cursor-pointer"
            style={{
              borderColor: 'var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            导入
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    </aside>
  )
}
