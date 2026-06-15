import { useState, useEffect, useRef, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { glossary } from '../data/glossary'
import { TermTooltip } from './TermTooltip'

interface MarkdownRendererProps {
  chapterDir: string
  onReachBottom?: () => void
}

export function MarkdownRenderer({ chapterDir, onReachBottom }: MarkdownRendererProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/content/${chapterDir}/README.md`)
      .then(r => r.ok ? r.text() : Promise.reject('Not found'))
      .then(text => {
        const fixed = text.replace(
          /!\[([^\]]*)\]\(images\/([^)]+)\)/g,
          `![$1](/course-assets/${chapterDir}/$2)`
        )
        setContent(fixed)
        setLoading(false)
      })
      .catch(() => {
        setContent('# 内容未找到\n\n请运行 `npm run sync` 同步课程内容。')
        setLoading(false)
      })
  }, [chapterDir])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !onReachBottom) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onReachBottom() },
      { threshold: 0.1 }
    )
    const sentinel = el.querySelector('.scroll-sentinel')
    if (sentinel) observer.observe(sentinel)
    return () => observer.disconnect()
  }, [content, onReachBottom])

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>加载中...</div>
  }

  return (
    <div ref={containerRef} className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children, ...props }) => <p {...props}>{wrapTerms(children)}</p>,
          li: ({ children, ...props }) => <li {...props}>{wrapTerms(children)}</li>,
          a: ({ href, children, ...props }) => {
            if (href?.startsWith('README.') || href?.startsWith('../s')) return null
            return <a href={href} {...props}>{children}</a>
          },
        }}
      >
        {content}
      </ReactMarkdown>
      <div className="scroll-sentinel h-1" />
    </div>
  )
}

function wrapTerms(children: ReactNode): ReactNode {
  if (typeof children !== 'string') {
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === 'string') return wrapTermsInString(child, i)
        return child
      })
    }
    return children
  }
  return wrapTermsInString(children, 0)
}

function wrapTermsInString(text: string, keyPrefix: number): ReactNode {
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length)
  const pattern = sorted.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  if (!pattern) return text
  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const matchedTerm = glossary.find(t => t.term.toLowerCase() === part.toLowerCase())
    if (matchedTerm) {
      return <TermTooltip key={`${keyPrefix}-${i}`} term={matchedTerm}>{part}</TermTooltip>
    }
    return part
  })
}
