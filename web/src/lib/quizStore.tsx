import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { OptionKey, Question } from '@/lib/types'

export type QuizMode = 'full' | 'wrongOnly'

export const QUIZ_DURATION_SECONDS = 90 * 60
const PERSIST_KEY = 'flutter-exam.quiz.v1'

export type QuizState = {
  questions: Question[]
  questionIds: number[]
  currentIndex: number
  answers: Record<number, { selectedKeys: OptionKey[]; markedForReview: boolean; answeredAt: number | null }>
  startedAt: number | null
  submittedAt: number | null
  mode: QuizMode
}

type Action =
  | { type: 'INIT'; questions: Question[] }
  | { type: 'START'; at: number; mode: QuizMode; questionIds?: number[] }
  | { type: 'JUMP'; index: number }
  | { type: 'ANSWER_SINGLE'; questionId: number; key: OptionKey; at: number }
  | { type: 'ANSWER_TOGGLE_MULTI'; questionId: number; key: OptionKey; at: number }
  | { type: 'TOGGLE_MARK'; questionId: number }
  | { type: 'SUBMIT'; at: number }
  | { type: 'RESET' }

type Persisted = {
  version: 1
  startedAt: number | null
  submittedAt: number | null
  mode: QuizMode
  questionIds: number[]
  currentIndex: number
  answers: Record<
    number,
    { selectedKeys: OptionKey[]; markedForReview: boolean; answeredAt: number | null }
  >
}

function createInitialState(questions: Question[]): QuizState {
  const sorted = [...questions].sort((a, b) => a.id - b.id)
  return {
    questions: sorted,
    questionIds: sorted.map((q) => q.id),
    currentIndex: 0,
    answers: {},
    startedAt: null,
    submittedAt: null,
    mode: 'full',
  }
}

function loadPersisted(questions: Question[]): Persisted | null {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Persisted
    if (!parsed || parsed.version !== 1) return null

    const ids = new Set(questions.map((q) => q.id))
    const filteredQuestionIds = (parsed.questionIds ?? []).filter((id) => ids.has(id))
    if (filteredQuestionIds.length === 0) return null

    const currentIndex = Math.max(0, Math.min(parsed.currentIndex ?? 0, filteredQuestionIds.length - 1))
    const answers: Persisted['answers'] = {}
    for (const [k, v] of Object.entries(parsed.answers ?? {})) {
      const id = Number(k)
      if (!ids.has(id)) continue
      answers[id] = {
        selectedKeys: (v?.selectedKeys ?? []).filter((x): x is OptionKey => x === 'A' || x === 'B' || x === 'C' || x === 'D'),
        markedForReview: Boolean(v?.markedForReview),
        answeredAt: typeof v?.answeredAt === 'number' ? v.answeredAt : null,
      }
    }

    return {
      version: 1,
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : null,
      submittedAt: typeof parsed.submittedAt === 'number' ? parsed.submittedAt : null,
      mode: parsed.mode === 'wrongOnly' ? 'wrongOnly' : 'full',
      questionIds: filteredQuestionIds,
      currentIndex,
      answers,
    }
  } catch {
    return null
  }
}

function createInitialStateWithPersistence(questions: Question[]): QuizState {
  const base = createInitialState(questions)
  if (typeof window === 'undefined') return base
  const persisted = loadPersisted(base.questions)
  if (!persisted) return base

  // if expired and not submitted, auto-submit by setting submittedAt
  const now = Date.now()
  const expired =
    persisted.startedAt != null &&
    persisted.submittedAt == null &&
    now >= persisted.startedAt + QUIZ_DURATION_SECONDS * 1000

  return {
    ...base,
    questionIds: persisted.questionIds,
    currentIndex: persisted.currentIndex,
    answers: persisted.answers,
    startedAt: persisted.startedAt,
    submittedAt: expired ? persisted.startedAt! + QUIZ_DURATION_SECONDS * 1000 : persisted.submittedAt,
    mode: persisted.mode,
  }
}

function ensureAnswer(state: QuizState, questionId: number) {
  return (
    state.answers[questionId] ?? {
      selectedKeys: [],
      markedForReview: false,
      answeredAt: null,
    }
  )
}

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'INIT':
      return createInitialState(action.questions)
    case 'START': {
      const questionIds = action.questionIds ?? state.questions.map((q) => q.id)
      return {
        ...state,
        questionIds,
        currentIndex: 0,
        answers: {},
        startedAt: action.at,
        submittedAt: null,
        mode: action.mode,
      }
    }
    case 'JUMP': {
      const idx = Math.max(0, Math.min(action.index, state.questionIds.length - 1))
      return { ...state, currentIndex: idx }
    }
    case 'ANSWER_SINGLE': {
      const prev = ensureAnswer(state, action.questionId)
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: {
            ...prev,
            selectedKeys: [action.key],
            answeredAt: action.at,
          },
        },
      }
    }
    case 'ANSWER_TOGGLE_MULTI': {
      const prev = ensureAnswer(state, action.questionId)
      const set = new Set(prev.selectedKeys)
      if (set.has(action.key)) set.delete(action.key)
      else set.add(action.key)
      const selected = [...set].sort()
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: {
            ...prev,
            selectedKeys: selected,
            answeredAt: selected.length ? action.at : prev.answeredAt,
          },
        },
      }
    }
    case 'TOGGLE_MARK': {
      const prev = ensureAnswer(state, action.questionId)
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: { ...prev, markedForReview: !prev.markedForReview },
        },
      }
    }
    case 'SUBMIT':
      return { ...state, submittedAt: action.at }
    case 'RESET':
      return createInitialState(state.questions)
    default:
      return state
  }
}

type QuizContextValue = {
  state: QuizState
  dispatch: React.Dispatch<Action>
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ questions, children }: { questions: Question[]; children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, questions, createInitialStateWithPersistence)
  const value = useMemo(() => ({ state, dispatch }), [state])

  useEffect(() => {
    const persisted: Persisted = {
      version: 1,
      startedAt: state.startedAt,
      submittedAt: state.submittedAt,
      mode: state.mode,
      questionIds: state.questionIds,
      currentIndex: state.currentIndex,
      answers: state.answers,
    }
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(persisted))
    } catch {
      // ignore
    }
  }, [state.startedAt, state.submittedAt, state.mode, state.questionIds, state.currentIndex, state.answers])

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz 必须在 QuizProvider 内使用')
  return ctx
}

export function useCurrentQuestion(): Question | null {
  const { state } = useQuiz()
  const id = state.questionIds[state.currentIndex]
  return state.questions.find((q) => q.id === id) ?? null
}

export function computeScore(questions: Question[], answers: QuizState['answers']) {
  let correct = 0
  for (const q of questions) {
    const selected = new Set(answers[q.id]?.selectedKeys ?? [])
    const answer = new Set(q.answerKeys)
    const isCorrect = selected.size === answer.size && [...answer].every((k) => selected.has(k))
    if (isCorrect) correct++
  }
  return { correct, total: questions.length, score: correct }
}

export function selectQuestionIdsWrongOnly(questions: Question[], answers: QuizState['answers']) {
  const wrongIds: number[] = []
  for (const q of questions) {
    const selected = new Set(answers[q.id]?.selectedKeys ?? [])
    const answer = new Set(q.answerKeys)
    const isCorrect = selected.size === answer.size && [...answer].every((k) => selected.has(k))
    if (!isCorrect) wrongIds.push(q.id)
  }
  return wrongIds
}

