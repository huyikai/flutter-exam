import bankJson from '@/assets/question_bank.json'
import type { OptionKey, Question, QuestionBank } from '@/lib/types'

function isOptionKey(x: unknown): x is OptionKey {
  return x === 'A' || x === 'B' || x === 'C' || x === 'D'
}

export function loadQuestionBank(): QuestionBank {
  const bank = bankJson as unknown as QuestionBank
  if (!bank || typeof bank !== 'object') throw new Error('题库 JSON 不合法')
  if (!Array.isArray(bank.questions)) throw new Error('题库 questions 不存在或格式错误')

  const questions: Question[] = bank.questions.map((q) => {
    if (typeof q.id !== 'number') throw new Error('题目 id 不合法')
    if (q.type !== 'single' && q.type !== 'multi') throw new Error(`题目 ${q.id} type 不合法`)
    if (typeof q.stem !== 'string') throw new Error(`题目 ${q.id} stem 不合法`)
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`题目 ${q.id} options 不合法`)
    }
    if (!Array.isArray(q.answerKeys) || q.answerKeys.length < 1) {
      throw new Error(`题目 ${q.id} answerKeys 不合法`)
    }

    for (const opt of q.options) {
      if (!isOptionKey(opt.key)) throw new Error(`题目 ${q.id} option.key 不合法`)
      if (typeof opt.text !== 'string') throw new Error(`题目 ${q.id} option.text 不合法`)
    }
    for (const k of q.answerKeys) {
      if (!isOptionKey(k)) throw new Error(`题目 ${q.id} answerKeys 含非法值`)
    }

    return q
  })

  // sort + uniqueness
  questions.sort((a, b) => a.id - b.id)
  const ids = new Set<number>()
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error(`题号重复：${q.id}`)
    ids.add(q.id)
  }

  return { version: bank.version ?? 1, questions }
}

