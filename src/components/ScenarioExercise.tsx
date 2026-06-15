import { useState } from 'react'
import type { ScenarioItem } from '../types/exercise'

interface ScenarioExerciseProps {
  exercise: ScenarioItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

export function ScenarioExercise({ exercise, previousAnswer, onAnswer }: ScenarioExerciseProps) {
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
          style={{ background: 'var(--color-purple-light)', color: 'var(--color-purple)' }}
        >
          {exercise.difficulty}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>场景分析</span>
      </div>

      <div
        className="p-4 rounded-lg mb-4 text-sm leading-relaxed"
        style={{ background: 'var(--color-purple-light)', color: 'var(--text)' }}
      >
        <div className="font-semibold mb-1">场景描述</div>
        {exercise.scenario}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
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
              borderColor: 'var(--color-purple)',
              background: 'var(--color-purple-light)',
            }
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className="text-left p-4 rounded-lg border-2 transition-colors cursor-pointer disabled:cursor-default"
              style={style}
            >
              <div className="font-bold mb-1">{opt.label}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {opt.description}
              </div>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-6 py-2 rounded-lg text-white font-semibold transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: 'var(--color-purple)' }}
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
