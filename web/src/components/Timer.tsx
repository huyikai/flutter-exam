import { useEffect, useMemo, useState } from 'react'
import { QUIZ_DURATION_SECONDS } from '@/lib/quizStore'

function formatRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Timer({
  startedAt,
  submittedAt,
  onTimeout,
}: {
  startedAt: number | null
  submittedAt: number | null
  onTimeout: () => void
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!startedAt || submittedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [startedAt, submittedAt])

  const remainingSeconds = useMemo(() => {
    if (!startedAt) return QUIZ_DURATION_SECONDS
    const elapsed = Math.floor((now - startedAt) / 1000)
    return Math.max(0, QUIZ_DURATION_SECONDS - elapsed)
  }, [now, startedAt])

  useEffect(() => {
    if (!startedAt) return
    if (submittedAt) return
    if (remainingSeconds <= 0) onTimeout()
  }, [remainingSeconds, onTimeout, startedAt, submittedAt])

  return <span className="tabular-nums">{formatRemaining(remainingSeconds)}</span>
}

