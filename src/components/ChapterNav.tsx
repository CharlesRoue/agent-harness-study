import { useNavigate } from 'react-router-dom'
import { getAdjacentChapters } from '../data/chapters'

interface Props {
  chapterId: string
}

export function ChapterNav({ chapterId }: Props) {
  const navigate = useNavigate()
  const { prev, next } = getAdjacentChapters(chapterId)

  return (
    <div className="flex justify-between items-center pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
      {prev ? (
        <button
          onClick={() => navigate(`/chapter/${prev.id}`)}
          className="px-4 py-2 rounded-md text-sm cursor-pointer border"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          &larr; {prev.id} {prev.title}
        </button>
      ) : <div />}
      {next ? (
        <button
          onClick={() => navigate(`/chapter/${next.id}`)}
          className="px-4 py-2 rounded-md text-sm text-white cursor-pointer border-none"
          style={{ background: '#238636' }}
        >
          {next.id} {next.title} &rarr;
        </button>
      ) : <div />}
    </div>
  )
}
