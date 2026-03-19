export type OptionKey = 'A' | 'B' | 'C' | 'D'

export type QuestionType = 'single' | 'multi'

export type QuestionOption = {
  key: OptionKey
  text: string
}

export type Question = {
  id: number
  type: QuestionType
  stem: string
  options: QuestionOption[]
  answerKeys: OptionKey[]
  explanationMd?: string
}

export type QuestionBank = {
  version: number
  questions: Question[]
}

export type QuizAnswer = {
  selectedKeys: OptionKey[]
  markedForReview: boolean
  answeredAt: number | null
}

