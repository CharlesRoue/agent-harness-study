import { useState } from 'react'
import type { QuizItem } from '../types/exercise'

interface QuizExerciseProps {
  exercise: QuizItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

export function QuizExercise({ exercise, previousAnswer, onAnswer }: QuizExerciseProps) {
  const [selected, setSelected] = useState<number | null>(
    previousAnswer ? parseInt(previousAnswer.userAnswer, 10) : null
  )
  const [submitted, setSubmitted] = useState(!!previousAnswer)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    onAnswer(selected === exercise.correctIndex, String(selected))
  }

  return (
    <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: 'var(--color-primary-light)', color: '#0969da' }}
        >
          {exercise.difficulty}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>选择题</span>
      </div>

      <div className="font-semibold mb-4">{exercise.question}</div>

      <div className="space-y-2 mb-4">
        {exercise.options.map((opt, i) => {
          let style: React.CSSProperties = {
            borderColor: 'var(--border)',
            background: 'var(--bg)',
          }

          if (submitted) {
            if (i === exercise.correctIndex) {
              style = {
                borderColor: 'var(--color-success)',
                background: 'var(--color-success-light)',
              }
            } else if (i === selected && i !== exercise.correctIndex) {
              style = {
                borderColor: '#cf222e',
                background: '#ffebe9',
              }
            }
          } else if (i === selected) {
            style = {
              borderColor: '#0969da',
              background: 'var(--color-primary-light)',
            }
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className="w-full text-left p-3 rounded-lg border-2 transition-colors cursor-pointer disabled:cursor-default"
              style={style}
            >
              <span className="font-mono font-bold mr-2">{LABELS[i]}.</span>
              {opt}
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-6 py-2 rounded-lg text-white font-semibold transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: '#0969da' }}
        >
          提交答案
        </button>
      ) : (
        <div
          className="p-4 rounded-lg text-sm leading-relaxed"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          <strong style={{ color: selected === exercise.correctIndex ? 'var(--color-success)' : '#cf222e' }}>
            {selected === exercise.correctIndex ? '✓ 回答正确！' : '✗ 回答错误'}
          </strong>
          <div className="mt-2">{exercise.explanation}</div>
        </div>
      )}
    </div>
  )
}
