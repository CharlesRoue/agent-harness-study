import { useApp } from '../context/AppContext'
import { chapters } from '../data/chapters'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const { progress } = useApp()
  const navigate = useNavigate()

  const phase1 = chapters.filter(ch => ch.phase === 1)
  const phase2 = chapters.filter(ch => ch.phase === 2)

  const nextChapter = chapters.find(ch => {
    const cp = progress.progress.chapters[ch.id]
    return !cp || cp.exercises !== 'all_correct'
  }) ?? chapters[0]

  function chapterStatus(chId: string): 'complete' | 'current' | 'locked' {
    const cp = progress.progress.chapters[chId]
    if (cp?.exercises === 'all_correct') return 'complete'
    if (chId === nextChapter.id) return 'current'
    return 'locked'
  }

  const completedCount = progress.completedCount

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-title">Potty Training Cyber Babies</h1>
        <p className="home-subtitle">
          从零掌握 Agent 工程
        </p>
        <p className="home-desc">
          20 个渐进章节，从 Agent Loop 到 Comprehensive Agent，<br />
          覆盖工具调用、权限管理、上下文压缩、多 Agent 协作等核心机制。
        </p>
        <button
          className="home-cta"
          onClick={() => navigate(`/chapter/${nextChapter.id}`)}
        >
          {completedCount === 0 ? '开始学习' : '继续学习'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        {completedCount > 0 && (
          <div className="home-progress-bar-wrap">
            <div className="home-progress-bar">
              <div
                className="home-progress-bar-fill"
                style={{ width: `${(completedCount / 20) * 100}%` }}
              />
            </div>
            <span className="home-progress-text">{completedCount} / 20 已完成</span>
          </div>
        )}
      </section>

      {/* Phase 1 */}
      <section className="home-phase">
        <div className="home-phase-header">
          <span className="home-phase-badge p1">Phase 1</span>
          <h2 className="home-phase-title">基础机制</h2>
          <span className="home-phase-count">
            {phase1.filter(ch => chapterStatus(ch.id) === 'complete').length}/{phase1.length}
          </span>
        </div>
        <p className="home-phase-desc">
          从最简单的循环开始，逐步加入工具、权限、钩子、记忆等基础能力
        </p>
        <div className="home-grid">
          {phase1.map(ch => (
            <ChapterCard
              key={ch.id}
              ch={ch}
              status={chapterStatus(ch.id)}
              onClick={() => navigate(`/chapter/${ch.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Phase 2 */}
      <section className="home-phase">
        <div className="home-phase-header">
          <span className="home-phase-badge p2">Phase 2</span>
          <h2 className="home-phase-title">高阶系统</h2>
          <span className="home-phase-count">
            {phase2.filter(ch => chapterStatus(ch.id) === 'complete').length}/{phase2.length}
          </span>
        </div>
        <p className="home-phase-desc">
          任务系统、多 Agent 协作、自主调度、插件扩展等高级主题
        </p>
        <div className="home-grid">
          {phase2.map(ch => (
            <ChapterCard
              key={ch.id}
              ch={ch}
              status={chapterStatus(ch.id)}
              onClick={() => navigate(`/chapter/${ch.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function ChapterCard({
  ch,
  status,
  onClick,
}: {
  ch: typeof chapters[number]
  status: 'complete' | 'current' | 'locked'
  onClick: () => void
}) {
  return (
    <button className={`home-card ${status}`} onClick={onClick}>
      <div className="home-card-header">
        <span className="home-card-id">{ch.id}</span>
        {status === 'complete' && (
          <svg className="home-card-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#238636" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {status === 'current' && (
          <span className="home-card-current-dot" />
        )}
      </div>
      <h3 className="home-card-title">{ch.title}</h3>
      <p className="home-card-sub">{ch.subtitle}</p>
    </button>
  )
}
