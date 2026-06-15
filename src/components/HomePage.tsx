import { useApp } from '../context/AppContext'
import { chapters } from '../data/chapters'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const { progress } = useApp()
  const navigate = useNavigate()

  const nextChapter = chapters.find(ch => {
    const cp = progress.progress.chapters[ch.id]
    return !cp || (cp.exercises !== 'all_correct')
  }) ?? chapters[0]

  return (
    <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Agent Harness 学习</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        从零掌握 Agent Harness 工程 · 20 个渐进章节
      </p>
      <button
        onClick={() => navigate(`/chapter/${nextChapter.id}`)}
        style={{
          background: '#0969da', color: 'white', border: 'none',
          padding: '12px 32px', borderRadius: 8, fontSize: 16, cursor: 'pointer',
        }}
      >
        {progress.completedCount === 0 ? '开始学习' : '继续学习'} → {nextChapter.id} {nextChapter.title}
      </button>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: 14 }}>
        进度: {progress.completedCount} / 20 章节已完成
      </p>
    </div>
  )
}
