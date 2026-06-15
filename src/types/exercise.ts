export interface QuizItem {
  id: string
  type: 'quiz'
  difficulty: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface CodeFillItem {
  id: string
  type: 'code_fill'
  difficulty: string
  question: string
  codeBefore: string
  codeAfter: string
  answer: string
  explanation: string
}

export interface ScenarioItem {
  id: string
  type: 'scenario'
  difficulty: string
  scenario: string
  options: Array<{ label: string; description: string }>
  correctIndex: number
  explanation: string
}

export type Exercise = QuizItem | CodeFillItem | ScenarioItem

export interface ChapterExercises {
  chapterId: string
  exercises: Exercise[]
}
