import type { ChapterExercises } from '../../types/exercise'

const exercisesMap: Record<string, ChapterExercises> = {}

export function getExercises(chapterId: string): ChapterExercises | null {
  return exercisesMap[chapterId] ?? null
}
