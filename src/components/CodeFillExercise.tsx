import { useState } from 'react'
import type { CodeFillItem } from '../types/exercise'

interface CodeFillExerciseProps {
  exercise: CodeFillItem
  previousAnswer?: { correct: boolean; userAnswer: string }
  onAnswer: (correct: boolean, answer: string) => void
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '')
}

export function CodeFillExercise({ exercise, previousAnswer, onAnswer }: CodeFillExerciseProps) {
  const [input, setInput] = useState(previousAnswer?.userAnswer ?? '')
  const [submitted, setSubmitted] = useState(!!previousAnswer)
  const [isCorrect, setIsCorrect] = useState(previousAnswer?.correct ?? false)

  const handleSubmit = () => {
    const correct = normalize(input) === normalize(exercise.answer)
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct, input)
  }

  return (
    <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}
        >
          {exercise.difficulty}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>代码填空</span>
      </div>

      <div className="font-semibold mb-4">{exercise.question}</div>

      <div
        className="rounded-lg p-4 font-mono text-sm leading-relaxed mb-4"
        style={{ background: 'var(--bg-code)', border: '1px solid var(--border)' }}
      >
        <pre className="whitespace-pre-wrap m-0">
          <code>{exercise.codeBefore}</code>
        </pre>
        <div className="my-2">
          <input
            type="text"
            value={input}
            onChange={(e) => !submitted && setInput(e.target.value)}
            disabled={submitted}
            placeholder="???"
            className="font-mono text-sm px-3 py-1.5 rounded-md outline-none w-full"
            style={{
              border: submitted
                ? `2px solid ${isCorrect ? 'var(--color-success)' : '#cf222e'}`
                : '2px dashed var(--color-warning)',
              background: submitted
                ? (isCorrect ? 'var(--color-success-light)' : '#ffebe9')
                : 'var(--bg)',
            }}
          />
        </div>
        <pre className="whitespace-pre-wrap m-0">
          <code>{exercise.codeAfter}</code>
        </pre>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
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
          <strong style={{ color: isCorrect ? 'var(--color-success)' : '#cf222e' }}>
            {isCorrect ? '✓ 回答正确！' : `✗ 正确答案: ${exercise.answer}`}
          </strong>
          <div className="mt-2">{exercise.explanation}</div>
        </div>
      )}
    </div>
  )
}
