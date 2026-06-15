import { useState, useEffect, useCallback } from 'react'

export interface ChapterProgress {
  read: boolean
  exerciseAnswers: Record<string, { correct: boolean; userAnswer: string }>
  score: string
  exercises: 'not_started' | 'in_progress' | 'all_correct' | 'partial'
  completedAt?: string
}

export interface Progress {
  currentChapter: string
  chapters: Record<string, ChapterProgress>
}

const STORAGE_KEY = 'agent-harness-learn-progress'

const defaultProgress: Progress = {
  currentChapter: 's01',
  chapters: {},
}

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load progress:', e)
  }
  return defaultProgress
}

function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const markRead = useCallback((chapterId: string) => {
    setProgress(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterId]: {
          ...prev.chapters[chapterId],
          read: true,
          exerciseAnswers: prev.chapters[chapterId]?.exerciseAnswers || {},
          score: prev.chapters[chapterId]?.score || '0/0',
          exercises: prev.chapters[chapterId]?.exercises || 'not_started',
        },
      },
    }))
  }, [])

  const setCurrentChapter = useCallback((chapterId: string) => {
    setProgress(prev => ({
      ...prev,
      currentChapter: chapterId,
    }))
  }, [])

  const recordAnswer = useCallback(
    (
      chapterId: string,
      exerciseId: string,
      correct: boolean,
      userAnswer: string,
      totalExercises: number
    ) => {
      setProgress(prev => {
        const chapter = prev.chapters[chapterId] || {
          read: false,
          exerciseAnswers: {},
          score: '0/0',
          exercises: 'not_started' as const,
        }

        const newAnswers = {
          ...chapter.exerciseAnswers,
          [exerciseId]: { correct, userAnswer },
        }

        const correctCount = Object.values(newAnswers).filter(a => a.correct).length
        const answeredCount = Object.keys(newAnswers).length

        let exerciseStatus: ChapterProgress['exercises']
        if (answeredCount === 0) {
          exerciseStatus = 'not_started'
        } else if (answeredCount < totalExercises) {
          exerciseStatus = 'in_progress'
        } else if (correctCount === totalExercises) {
          exerciseStatus = 'all_correct'
        } else {
          exerciseStatus = 'partial'
        }

        const updatedChapter: ChapterProgress = {
          ...chapter,
          exerciseAnswers: newAnswers,
          score: `${correctCount}/${totalExercises}`,
          exercises: exerciseStatus,
          completedAt:
            exerciseStatus === 'all_correct' ? new Date().toISOString() : chapter.completedAt,
        }

        return {
          ...prev,
          chapters: {
            ...prev.chapters,
            [chapterId]: updatedChapter,
          },
        }
      })
    },
    []
  )

  const completedCount = Object.values(progress.chapters).filter(
    c => c.exercises === 'all_correct'
  ).length

  const exportProgress = useCallback(() => {
    const data = JSON.stringify(progress, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-harness-progress-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [progress])

  const importProgress = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setProgress(imported)
      } catch (err) {
        console.error('Failed to import progress:', err)
      }
    }
    reader.readAsText(file)
  }, [])

  return {
    progress,
    markRead,
    setCurrentChapter,
    recordAnswer,
    completedCount,
    exportProgress,
    importProgress,
  }
}
