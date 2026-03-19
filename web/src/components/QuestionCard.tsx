import type { OptionKey, Question } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          {question.id}. {question.stem}
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {question.type === 'single' ? '单选题' : '多选题'}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.type === 'single' ? (
          <RadioGroup
            value={selectedKeys[0] ?? ''}
            onValueChange={(v) => onSelectSingle(v as OptionKey)}
            className="space-y-2"
          >
            {question.options.map((opt) => (
              <div key={opt.key} className="flex items-start gap-3 rounded-md border p-3">
                <RadioGroupItem value={opt.key} id={`q${question.id}-${opt.key}`} className="mt-0.5" />
                <Label htmlFor={`q${question.id}-${opt.key}`} className="cursor-pointer text-sm leading-6">
                  <span className="mr-2 font-medium">{opt.key}.</span>
                  {opt.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            {question.options.map((opt) => {
              const checked = selectedKeys.includes(opt.key)
              return (
                <div key={opt.key} className="flex items-start gap-3 rounded-md border p-3">
                  <Checkbox
                    id={`q${question.id}-${opt.key}`}
                    checked={checked}
                    onCheckedChange={() => onToggleMulti(opt.key)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`q${question.id}-${opt.key}`} className="cursor-pointer text-sm leading-6">
                    <span className="mr-2 font-medium">{opt.key}.</span>
                    {opt.text}
                  </Label>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

