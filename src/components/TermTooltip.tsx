import { useState, useRef, useEffect, type ReactNode } from 'react'
import type { GlossaryTerm } from '../data/glossary'

interface TermTooltipProps {
  term: GlossaryTerm
  children: ReactNode
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!show) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [show])

  return (
    <span ref={ref} className="relative inline">
      <span
        className="term-highlight"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
      >
        {children}
      </span>
      {show && (
        <div
          className="absolute z-50 w-80 p-4 rounded-xl border shadow-lg"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 4,
            background: 'var(--bg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--color-primary-light)', color: '#0969da' }}
            >
              {term.category}
            </span>
            <button
              onClick={() => setShow(false)}
              className="text-lg leading-none cursor-pointer border-none bg-transparent"
              style={{ color: 'var(--text-secondary)' }}
            >
              ×
            </button>
          </div>
          <div className="font-bold text-base mb-2">{term.term}</div>
          <div className="text-sm leading-relaxed mb-2">{term.definition}</div>
          <div
            className="text-xs p-2 rounded-md"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            {term.analogy}
          </div>
          <div className="text-xs mt-2" style={{ color: '#0969da' }}>
            首次出现于 {term.firstSeen}
          </div>
        </div>
      )}
    </span>
  )
}
