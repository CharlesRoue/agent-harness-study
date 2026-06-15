import { s01 } from './s01'
import { s02 } from './s02'
import { s03 } from './s03'
import { s04 } from './s04'
import { s05 } from './s05'
import type { ChapterExercises } from '../../types/exercise'

const exercisesMap: Record<string, ChapterExercises> = {
  s01, s02, s03, s04, s05,
}

export function getExercises(chapterId: string): ChapterExercises | null {
  return exercisesMap[chapterId] ?? null
}

export { exercisesMap }
