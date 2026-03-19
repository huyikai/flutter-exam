import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnswerSheet } from '@/components/AnswerSheet'
import { QuestionCard } from '@/components/QuestionCard'
import { Timer } from '@/components/Timer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCurrentQuestion, useQuiz } from '@/lib/quizStore'
import type { OptionKey } from '@/lib/types'

export function QuizPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()
  const question = useCurrentQuestion()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const currentId = state.questionIds[state.currentIndex]
  const currentAnswer = state.answers[currentId]?.selectedKeys ?? []
  const isMarked = state.answers[currentId]?.markedForReview ?? false

  const progress = useMemo(() => {
    const answered = state.questionIds.filter((id) => (state.answers[id]?.selectedKeys?.length ?? 0) > 0).length
    const marked = state.questionIds.filter((id) => state.answers[id]?.markedForReview).length
    return { answered, marked, total: state.questionIds.length }
  }, [state.answers, state.questionIds])

  if (!state.startedAt) return <Navigate to="/" replace />
  if (!question) return null

  const onSelectSingle = (key: OptionKey) => {
    dispatch({ type: 'ANSWER_SINGLE', questionId: question.id, key, at: Date.now() })
  }

  const onToggleMulti = (key: OptionKey) => {
    dispatch({ type: 'ANSWER_TOGGLE_MULTI', questionId: question.id, key, at: Date.now() })
  }

  const submit = () => {
    dispatch({ type: 'SUBMIT', at: Date.now() })
    navigate('/result')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            倒计时{' '}
            <Timer
              startedAt={state.startedAt}
              submittedAt={state.submittedAt}
              onTimeout={() => {
                dispatch({ type: 'SUBMIT', at: Date.now() })
                navigate('/result')
              }}
            />
          </Badge>
          <Badge variant="secondary">
            进度 {progress.answered}/{progress.total}
          </Badge>
          {progress.marked > 0 ? <Badge variant="outline">标记 {progress.marked}</Badge> : null}
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button variant="outline" />}>答题卡</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>答题卡</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <AnswerSheet
                  questionIds={state.questionIds}
                  currentIndex={state.currentIndex}
                  answers={state.answers}
                  onJump={(idx) => {
                    dispatch({ type: 'JUMP', index: idx })
                    setSheetOpen(false)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={() => setConfirmOpen(true)}>交卷</Button>
        </div>
      </div>

      <QuestionCard
        question={question}
        selectedKeys={currentAnswer}
        onSelectSingle={onSelectSingle}
        onToggleMulti={onToggleMulti}
      />

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={state.currentIndex === 0}
          onClick={() => dispatch({ type: 'JUMP', index: state.currentIndex - 1 })}
        >
          上一题
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={isMarked ? 'secondary' : 'outline'}
            onClick={() => dispatch({ type: 'TOGGLE_MARK', questionId: question.id })}
          >
            {isMarked ? '已标记' : '标记'}
          </Button>
          <Button
            variant="outline"
            disabled={state.currentIndex === state.questionIds.length - 1}
            onClick={() => dispatch({ type: 'JUMP', index: state.currentIndex + 1 })}
          >
            下一题
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认交卷？</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            你已作答 {progress.answered}/{progress.total} 题，未作答 {progress.total - progress.answered} 题。
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              继续作答
            </Button>
            <Button onClick={submit}>确认交卷</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

