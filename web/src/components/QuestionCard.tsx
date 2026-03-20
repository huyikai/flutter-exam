import type { OptionKey, Question } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function QuestionCard({
  question,
  selectedKeys,
  onSelectSingle,
  onToggleMulti,
}: {
  question: Question
  selectedKeys: OptionKey[]
  onSelectSingle: (key: OptionKey) => void
  onToggleMulti: (key: OptionKey) => void
}) {
  return (
    <Card className="border-0 shadow-md">
      {/* 题目头部 - 强化视觉层次 */}
      <CardHeader className="border-b bg-gray-50/50 pb-6 pt-6">
        <div className="flex items-start gap-4">
          {/* 题号 */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            {question.id}
          </div>
          <div className="flex-1 space-y-3">
            {/* 题型标签 */}
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                question.type === 'single'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {question.type === 'single' ? '单选题' : '多选题'}
              </span>
            </div>
            {/* 题目内容 */}
            <CardTitle className="text-lg font-semibold leading-relaxed text-gray-900">
              {question.stem}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {question.type === 'single' ? (
          <RadioGroup
            value={selectedKeys[0] ?? ''}
            onValueChange={(v) => onSelectSingle(v as OptionKey)}
            className="space-y-3"
          >
            {question.options.map((opt) => {
              const isSelected = selectedKeys[0] === opt.key
              return (
                <label
                  key={opt.key}
                  htmlFor={`q${question.id}-${opt.key}`}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:border-blue-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <RadioGroupItem
                    value={opt.key}
                    id={`q${question.id}-${opt.key}`}
                    className="sr-only"
                  />
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-base leading-relaxed text-gray-700">
                    <span className="mr-2 font-semibold text-blue-600">{opt.key}.</span>
                    {opt.text}
                  </span>
                </label>
              )
            })}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {question.options.map((opt) => {
              const checked = selectedKeys.includes(opt.key)
              return (
                <label
                  key={opt.key}
                  htmlFor={`q${question.id}-${opt.key}`}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:border-purple-300 ${
                    checked
                      ? 'border-purple-500 bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Checkbox
                    id={`q${question.id}-${opt.key}`}
                    checked={checked}
                    onCheckedChange={() => onToggleMulti(opt.key)}
                    className="sr-only"
                  />
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    checked
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {checked && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-base leading-relaxed text-gray-700">
                    <span className="mr-2 font-semibold text-purple-600">{opt.key}.</span>
                    {opt.text}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

