import type { OptionKey } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AnswerSheet({
  questionIds,
  currentIndex,
  answers,
  onJump,
}: {
  questionIds: number[]
  currentIndex: number
  answers: Record<number, { selectedKeys: OptionKey[]; markedForReview: boolean }>
  onJump: (index: number) => void
}) {
  const stats = {
    answered: questionIds.filter((id) => (answers[id]?.selectedKeys?.length ?? 0) > 0).length,
    marked: questionIds.filter((id) => answers[id]?.markedForReview).length,
    unanswered: questionIds.filter((id) => (answers[id]?.selectedKeys?.length ?? 0) === 0).length,
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-xl bg-gray-50 p-3">
          <span className="text-xl font-bold text-gray-400">{stats.unanswered}</span>
          <span className="text-xs text-gray-500">未作答</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-emerald-50 p-3">
          <span className="text-xl font-bold text-emerald-600">{stats.answered}</span>
          <span className="text-xs text-emerald-600">已作答</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-amber-50 p-3">
          <span className="text-xl font-bold text-amber-500">{stats.marked}</span>
          <span className="text-xs text-amber-600">已标记</span>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <span className="text-sm text-gray-600">未答</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-600">已答</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-sm text-gray-600">标记</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-blue-200" />
          <span className="text-sm text-gray-600">当前</span>
        </div>
      </div>

      {/* 题目网格 */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {questionIds.map((id, idx) => {
          const a = answers[id]
          const isCurrent = idx === currentIndex
          const isAnswered = (a?.selectedKeys?.length ?? 0) > 0
          const isMarked = a?.markedForReview ?? false

          let baseClasses = 'h-11 w-full rounded-lg text-sm font-medium transition-all duration-200'
          let colorClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200'

          if (isAnswered) {
            colorClasses = 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
          }
          if (isMarked) {
            colorClasses = 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
          }
          if (isCurrent) {
            colorClasses = 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            baseClasses += ' ring-2 ring-blue-300 ring-offset-2'
          }

          return (
            <Button
              key={id}
              variant="ghost"
              className={cn(baseClasses, colorClasses)}
              onClick={() => onJump(idx)}
            >
              {id}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

