import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function TopBar() {
  const { theme, progress } = useApp()
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 border-b flex-shrink-0"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="font-bold text-base cursor-pointer border-none bg-transparent"
          style={{ color: '#0969da' }}
        >
          Agent Harness 学习
        </button>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          learn-claude-code
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={theme.toggleTheme}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
          }}
        >
          {theme.theme === 'light' ? '🌙 暗色' : '☀️ 亮色'}
        </button>
        <span
          className="text-xs px-3 py-1 rounded-full text-white"
          style={{ background: '#238636' }}
        >
          {progress.completedCount}/20
        </span>
      </div>
    </header>
  )
}
