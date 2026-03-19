import type { OptionKey } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
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
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">未答</Badge>
        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">已答</Badge>
        <Badge className="bg-amber-500 text-white hover:bg-amber-500">标记</Badge>
        <Badge className="bg-blue-600 text-white hover:bg-blue-600">当前</Badge>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {questionIds.map((id, idx) => {
          const a = answers[id]
          const isCurrent = idx === currentIndex
          const isAnswered = (a?.selectedKeys?.length ?? 0) > 0
          const isMarked = a?.markedForReview ?? false

          let cls = 'bg-muted text-foreground hover:bg-muted/80'
          if (isAnswered) cls = 'bg-emerald-600 text-white hover:bg-emerald-600/90'
          if (isMarked) cls = 'bg-amber-500 text-white hover:bg-amber-500/90'
          if (isCurrent) cls = 'bg-blue-600 text-white hover:bg-blue-600/90'

          return (
            <Button
              key={id}
              variant="ghost"
              className={cn('h-10 rounded-md border', cls)}
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

