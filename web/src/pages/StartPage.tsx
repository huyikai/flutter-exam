import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuiz } from '@/lib/quizStore'

const TOTAL_SECONDS = 90 * 60

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function StartPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()

  const stats = useMemo(() => {
    const multi = state.questions.filter((q) => q.type === 'multi').length
    return { total: state.questions.length, multi, single: state.questions.length - multi }
  }, [state.questions])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Flutter 题库测验</h1>
        <p className="text-sm text-muted-foreground">
          混合模式：做题中不提示对错；交卷后查看得分、错题与解析（Markdown）。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">考试信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">题目数量</span>
            <span className="font-medium">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">单选 / 多选</span>
            <span className="font-medium">
              {stats.single} / {stats.multi}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">答题时长</span>
            <span className="font-medium">{formatDuration(TOTAL_SECONDS)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            dispatch({ type: 'START', at: Date.now(), mode: 'full' })
            navigate('/quiz')
          }}
        >
          开始答题
        </Button>
      </div>
    </div>
  )
}

