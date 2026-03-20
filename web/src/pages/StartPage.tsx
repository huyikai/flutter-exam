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
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-8 p-6 min-h-[80vh]">
      {/* 标题区域 */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Flutter 题库测验</h1>
        <p className="text-gray-500 max-w-md">
          检测你的 Flutter 知识掌握程度，题目涵盖基础概念到进阶应用
        </p>
      </div>

      {/* 考试信息卡片 */}
      <Card className="w-full border-0 shadow-xl">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            考试信息
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <span className="text-gray-600">题目数量</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{stats.total} 题</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <span className="text-gray-600">题型分布</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">单选 {stats.single}</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">多选 {stats.multi}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span className="text-gray-600">答题时长</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{formatDuration(TOTAL_SECONDS)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 开始按钮 */}
      <Button
        size="lg"
        className="w-full max-w-md h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
        onClick={() => {
          dispatch({ type: 'START', at: Date.now(), mode: 'full' })
          navigate('/quiz')
        }}
      >
        开始答题
      </Button>

      <p className="text-xs text-gray-400 text-center">
        混合模式：做题中不提示对错；交卷后查看得分、错题与解析
      </p>
    </div>
  )
}

