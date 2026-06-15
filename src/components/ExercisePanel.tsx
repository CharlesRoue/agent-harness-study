import { useApp } from '../context/AppContext'
import type { ChapterExercises, Exercise } from '../types/exercise'
import { QuizExercise } from './QuizExercise'
import { CodeFillExercise } from './CodeFillExercise'
import { ScenarioExercise } from './ScenarioExercise'

interface ExercisePanelProps {
  chapterExercises: ChapterExercises
}

export function ExercisePanel({ chapterExercises }: ExercisePanelProps) {
  const { progress } = useApp()
  const chapterId = chapterExercises.chapterId
  const chapterProgress = progress.progress.chapters[chapterId]
  const answers = chapterProgress?.exerciseAnswers ?? {}

  const handleAnswer = (exerciseId: string, correct: boolean, userAnswer: string) => {
    progress.recordAnswer(chapterId, exerciseId, correct, userAnswer, chapterExercises.exercises.length)
  }

  const allCorrect = Object.values(answers).every(a => a.correct) && Object.keys(answers).length === chapterExercises.exercises.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">练习</h2>
        <div className="flex gap-2">
          {chapterExercises.exercises.map((ex, i) => {
            const answer = answers[ex.id]
            let color = 'var(--border)'
            if (answer) {
              color = answer.correct ? 'var(--color-success)' : '#cf222e'
            }
            return (
              <div
                key={ex.id}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: color, color: answer ? 'white' : 'var(--text-secondary)' }}
              >
                {i + 1}
              </div>
            )
          })}
        </div>
      </div>

      {chapterExercises.exercises.map((exercise: Exercise) => {
        const previousAnswer = answers[exercise.id]

        switch (exercise.type) {
          case 'quiz':
            return (
              <QuizExercise
                key={exercise.id}
                exercise={exercise}
                previousAnswer={previousAnswer}
                onAnswer={(correct, answer) => handleAnswer(exercise.id, correct, answer)}
              />
            )
          case 'code_fill':
            return (
              <CodeFillExercise
                key={exercise.id}
                exercise={exercise}
                previousAnswer={previousAnswer}
                onAnswer={(correct, answer) => handleAnswer(exercise.id, correct, answer)}
              />
            )
          case 'scenario':
            return (
              <ScenarioExercise
                key={exercise.id}
                exercise={exercise}
                previousAnswer={previousAnswer}
                onAnswer={(correct, answer) => handleAnswer(exercise.id, correct, answer)}
              />
            )
        }
      })}

      {allCorrect && (
        <div
          className="p-6 rounded-xl text-center"
          style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-lg">恭喜！你已完成本章所有练习</div>
        </div>
      )}
    </div>
  )
}
