import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function TopBar() {
  const { theme, progress } = useApp()
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const chapter = chapterId ? getChapter(chapterId) : undefined

  const pct = Math.round((progress.completedCount / 20) * 100)

  return (
    <header className="topbar">
      {/* Left: branding + breadcrumb */}
      <div className="flex items-center gap-1 min-w-0">
        <button
          onClick={() => navigate('/')}
          className="topbar-brand"
        >
          <span className="topbar-brand-text">Level Up Agent</span>
        </button>

        {chapter && (
          <div className="flex items-center gap-1 min-w-0 ml-1">
            <span className="topbar-separator"><ChevronRight /></span>
            <span className="topbar-chapter-tag">
              {chapter.phase === 1 ? 'P1' : 'P2'}
            </span>
            <span className="topbar-chapter-num">{chapter.id}</span>
            <span className="topbar-separator"><ChevronRight /></span>
            <span className="topbar-chapter-title">{chapter.title}</span>
          </div>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Progress ring */}
        <div className="topbar-progress">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle
              cx="14" cy="14" r="11"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2.5"
            />
            <circle
              cx="14" cy="14" r="11"
              fill="none"
              stroke={pct === 100 ? '#238636' : '#0969da'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 69.12} 69.12`}
              transform="rotate(-90 14 14)"
              className="topbar-progress-ring"
            />
          </svg>
          <span className="topbar-progress-text">
            {progress.completedCount}<span className="topbar-progress-total">/20</span>
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={theme.toggleTheme}
          className="topbar-theme-btn"
          title={theme.theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
        >
          {theme.theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}
