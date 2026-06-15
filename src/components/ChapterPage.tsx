import { useParams } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MarkdownRenderer } from './MarkdownRenderer'

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { progress } = useApp()
  const chapter = getChapter(chapterId ?? '')

  useEffect(() => {
    if (chapterId) progress.setCurrentChapter(chapterId)
  }, [chapterId])

  const handleReachBottom = useCallback(() => {
    if (chapterId) progress.markRead(chapterId)
  }, [chapterId, progress])

  if (!chapter) {
    return <div style={{ padding: '2rem' }}>章节不存在</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Chapter header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: chapter.phase === 1 ? 'var(--color-success-light)' : 'var(--color-purple-light)',
                  color: chapter.phase === 1 ? 'var(--color-success)' : 'var(--color-purple)',
                }}
              >
                Phase {chapter.phase}
              </span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {chapter.id}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{chapter.title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{chapter.subtitle}</p>
          </div>

          {/* Markdown content */}
          <div
            className="rounded-xl border p-6 lg:p-8 mb-8"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <MarkdownRenderer chapterDir={chapter.dir} onReachBottom={handleReachBottom} />
          </div>

          {/* Exercise panel placeholder */}
          <div
            className="rounded-xl border p-6 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <p style={{ color: 'var(--text-secondary)' }}>本章练习尚未编写</p>
          </div>
        </main>
      </div>
    </div>
  )
}
