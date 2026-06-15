import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const chapter = getChapter(chapterId ?? '')

  useEffect(() => {
    if (chapterId) progress.setCurrentChapter(chapterId)
  }, [chapterId])

  if (!chapter) {
    return <div style={{ padding: '2rem' }}>章节不存在</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-2">{chapter.id}: {chapter.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{chapter.subtitle}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            内容渲染和练习组件将在此处加载...
          </p>
        </main>
      </div>
    </div>
  )
}
