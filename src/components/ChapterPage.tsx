import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getChapter } from '../data/chapters'

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
    <div style={{ padding: '2rem' }}>
      <h1>{chapter.id}: {chapter.title}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>{chapter.subtitle}</p>
    </div>
  )
}
