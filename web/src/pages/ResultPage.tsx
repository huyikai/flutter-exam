import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
    return (
      <div className="space-y-3">
        {ids.map((id) => {
          const q = state.questions.find((x) => x.id === id)
          if (!q) return null
          const selected = state.answers[id]?.selectedKeys ?? []
          const isCorrect = sameSet(selected, q.answerKeys)
          return (
            <Card key={id}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">
                  {id}. {q.stem}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge className={isCorrect ? 'bg-emerald-600 text-white hover:bg-emerald-600' : 'bg-red-600 text-white hover:bg-red-600'}>
                    {isCorrect ? '正确' : '错误'}
                  </Badge>
                  <Badge variant="secondary">你的选择：{selected.length ? selected.join('') : '未作答'}</Badge>
                  <Badge variant="outline">正确答案：{q.answerKeys.join('')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {q.explanationMd ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.explanationMd}</ReactMarkdown>
                  </div>
                ) : (
                  '暂无解析'
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
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">成绩</h1>
        <div className="text-sm text-muted-foreground">
          得分：<span className="font-medium text-foreground">{score.score}</span> / {score.total}（正确 {score.correct} 题）
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: 'RESET' })
            navigate('/')
          }}
        >
          返回首页
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: 'START', at: Date.now(), mode: 'full' })
            navigate('/quiz')
          }}
        >
          重做全套
        </Button>
        <Button
          onClick={() => {
            const wrongIds = selectQuestionIdsWrongOnly(state.questions, state.answers)
            dispatch({ type: 'START', at: Date.now(), mode: 'wrongOnly', questionIds: wrongIds })
            navigate('/quiz')
          }}
          disabled={view.wrongIds.length === 0}
        >
          错题再练（{view.wrongIds.length}）
        </Button>
      </div>

      <Tabs defaultValue="wrong">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wrong">错题（{view.wrongIds.length}）</TabsTrigger>
          <TabsTrigger value="marked">标记（{view.markedIds.length}）</TabsTrigger>
          <TabsTrigger value="all">全部（{state.questions.length}）</TabsTrigger>
        </TabsList>
        <TabsContent value="wrong" className="mt-4">
          {renderList(view.wrongIds)}
        </TabsContent>
        <TabsContent value="marked" className="mt-4">
          {renderList(view.markedIds)}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          {renderList(state.questions.map((q) => q.id))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

