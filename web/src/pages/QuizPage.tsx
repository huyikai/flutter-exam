import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnswerSheet } from '@/components/AnswerSheet'
import { QuestionCard } from '@/components/QuestionCard'
import { Timer } from '@/components/Timer'
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* 顶部状态栏 - 卡片式设计 */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-6">
          {/* 倒计时 */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">剩余时间</div>
              <Timer
                startedAt={state.startedAt}
                submittedAt={state.submittedAt}
                onTimeout={() => {
                  dispatch({ type: 'SUBMIT', at: Date.now() })
                  navigate('/result')
                }}
              />
            </div>
          </div>

          {/* 进度 */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">答题进度</div>
              <div className="text-sm font-semibold">
                <span className="text-emerald-600">{progress.answered}</span>
                <span className="text-gray-400">/{progress.total}</span>
              </div>
            </div>
          </div>

          {/* 标记数量 */}
          {progress.marked > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 15h13.865a1 1 0 0 1 .768 1.64L16 21l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/><path d="M4 4h13.865a1 1 0 0 1 .768 1.64L16 10l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/></svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">已标记</div>
                <div className="text-sm font-semibold text-amber-600">{progress.marked}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  答题卡
                </Button>
              }
            />
            <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle>答题卡</SheetTitle>
              </SheetHeader>
              <AnswerSheet
                questionIds={state.questionIds}
                currentIndex={state.currentIndex}
                answers={state.answers}
                onJump={(idx) => {
                  dispatch({ type: 'JUMP', index: idx })
                  setSheetOpen(false)
                }}
              />
            </SheetContent>
          </Sheet>

          <Button
            onClick={() => setConfirmOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            交卷
          </Button>
        </div>
      </div>

      <QuestionCard
        question={question}
        selectedKeys={currentAnswer}
        onSelectSingle={onSelectSingle}
        onToggleMulti={onToggleMulti}
      />

      {/* 底部导航区 - 更清晰的层次 */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <Button
          variant="outline"
          size="lg"
          disabled={state.currentIndex === 0}
          onClick={() => dispatch({ type: 'JUMP', index: state.currentIndex - 1 })}
          className="gap-2 px-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          上一题
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant={isMarked ? 'default' : 'outline'}
            size="lg"
            onClick={() => dispatch({ type: 'TOGGLE_MARK', questionId: question.id })}
            className={`gap-2 px-4 ${
              isMarked
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'border-amber-300 text-amber-600 hover:bg-amber-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isMarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15h13.865a1 1 0 0 1 .768 1.64L16 21l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/><path d="M4 4h13.865a1 1 0 0 1 .768 1.64L16 10l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/></svg>
            {isMarked ? '已标记' : '标记'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={state.currentIndex === state.questionIds.length - 1}
            onClick={() => dispatch({ type: 'JUMP', index: state.currentIndex + 1 })}
            className="gap-2 px-6"
          >
            下一题
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Button>
        </div>
      </div>

      {/* 交卷确认弹窗 - 更精致的设计 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center text-xl">确认提交试卷？</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-500">
            <p className="mb-4">提交后将无法修改答案，请确认是否完成所有题目。</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-emerald-600">{progress.answered}</span>
                <span className="text-gray-400">已作答</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-gray-400">{progress.total - progress.answered}</span>
                <span className="text-gray-400">未作答</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-amber-500">{progress.marked}</span>
                <span className="text-gray-400">已标记</span>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-3 sm:gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              继续作答
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={submit}
            >
              确认交卷
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

