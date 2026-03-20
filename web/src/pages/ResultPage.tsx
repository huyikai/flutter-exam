import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computeScore, selectQuestionIdsWrongOnly, useQuiz } from '@/lib/quizStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function sameSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((x) => set.has(x))
}

export function ResultPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()

  const score = useMemo(() => computeScore(state.questions, state.answers), [state.questions, state.answers])

  const view = useMemo(() => {
    const wrongIds = selectQuestionIdsWrongOnly(state.questions, state.answers)
    const markedIds = state.questionIds.filter((id) => state.answers[id]?.markedForReview)
    return { wrongIds, markedIds }
  }, [state.questions, state.answers, state.questionIds])

  const renderList = (ids: number[]) => {
    if (ids.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          <p className="mt-4 text-gray-500">暂无题目</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {ids.map((id) => {
          const q = state.questions.find((x) => x.id === id)
          if (!q) return null
          const selected = state.answers[id]?.selectedKeys ?? []
          const isCorrect = sameSet(selected, q.answerKeys)
          return (
            <Card key={id} className="border-0 shadow-md overflow-hidden">
              <CardHeader className={`pb-4 pt-5 ${isCorrect ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
                <div className="flex items-start gap-4">
                  {/* 题号和状态 */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {id}
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* 状态标签 */}
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? '回答正确' : '回答错误'}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        你的答案：{selected.length ? selected.join('') : '未作答'}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        正确答案：{q.answerKeys.join('')}
                      </span>
                    </div>
                    {/* 题目 */}
                    <CardTitle className="text-base font-semibold leading-relaxed text-gray-900">
                      {q.stem}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {q.explanationMd ? (
                  <div className="prose prose-sm max-w-none rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      解析
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.explanationMd}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4 text-center text-gray-500">
                    暂无解析
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* 成绩展示区域 */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">考试完成</h1>
            <p className="mt-1 text-blue-100">恭喜你完成了本次测验</p>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold">{score.score}</span>
            <span className="text-xl text-blue-200">/ {score.total} 分</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="rounded-full bg-white/20 px-4 py-1.5 backdrop-blur">
              正确 {score.correct} 题
            </span>
            <span className="rounded-full bg-white/20 px-4 py-1.5 backdrop-blur">
              错误 {score.total - score.correct} 题
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => {
            dispatch({ type: 'RESET' })
            navigate('/')
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          返回首页
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => {
            dispatch({ type: 'START', at: Date.now(), mode: 'full' })
            navigate('/quiz')
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          重做全套
        </Button>
        <Button
          size="lg"
          className="gap-2 bg-amber-500 hover:bg-amber-600"
          onClick={() => {
            const wrongIds = selectQuestionIdsWrongOnly(state.questions, state.answers)
            dispatch({ type: 'START', at: Date.now(), mode: 'wrongOnly', questionIds: wrongIds })
            navigate('/quiz')
          }}
          disabled={view.wrongIds.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15h13.865a1 1 0 0 1 .768 1.64L16 21l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/><path d="M4 4h13.865a1 1 0 0 1 .768 1.64L16 10l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/></svg>
          错题再练（{view.wrongIds.length}）
        </Button>
      </div>

      {/* 题目解析标签页 */}
      <Tabs defaultValue="wrong" className="mt-2 w-full">
        <TabsList variant="line" className="w-full h-12 bg-transparent border-b rounded-none p-0">
          <TabsTrigger value="wrong" className="gap-2 text-base font-medium data-[active]:text-red-600 data-[active]:after:bg-red-600 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            错题
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">{view.wrongIds.length}</span>
          </TabsTrigger>
          <TabsTrigger value="marked" className="gap-2 text-base font-medium data-[active]:text-amber-600 data-[active]:after:bg-amber-600 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 15h13.865a1 1 0 0 1 .768 1.64L16 21l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/><path d="M4 4h13.865a1 1 0 0 1 .768 1.64L16 10l-2.633-4.36a1 1 0 0 1 .768-1.64H4z"/></svg>
            标记
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-600">{view.markedIds.length}</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2 text-base font-medium data-[active]:text-blue-600 data-[active]:after:bg-blue-600 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            全部
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{state.questions.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wrong" className="mt-6 w-full block">
          {renderList(view.wrongIds)}
        </TabsContent>
        <TabsContent value="marked" className="mt-6 w-full block">
          {renderList(view.markedIds)}
        </TabsContent>
        <TabsContent value="all" className="mt-6 w-full block">
          {renderList(state.questions.map((q) => q.id))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

