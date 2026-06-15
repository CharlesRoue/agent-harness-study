import { s01 } from './s01'
import { s02 } from './s02'
import { s03 } from './s03'
import { s04 } from './s04'
import { s05 } from './s05'
import { s06 } from './s06'
import { s07 } from './s07'
import { s08 } from './s08'
import { s09 } from './s09'
import { s10 } from './s10'
import { s11 } from './s11'
import { s12 } from './s12'
import { s13 } from './s13'
import { s14 } from './s14'
import { s15 } from './s15'
import { s16 } from './s16'
import { s17 } from './s17'
import { s18 } from './s18'
import { s19 } from './s19'
import { s20 } from './s20'
import type { ChapterExercises } from '../../types/exercise'

const exercisesMap: Record<string, ChapterExercises> = {
  s01, s02, s03, s04, s05,
  s06, s07, s08, s09, s10,
  s11, s12, s13, s14, s15,
  s16, s17, s18, s19, s20,
}

export function getExercises(chapterId: string): ChapterExercises | null {
  return exercisesMap[chapterId] ?? null
}

export { exercisesMap }
