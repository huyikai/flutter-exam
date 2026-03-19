import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), '..')
const INPUT_TXT = path.join(ROOT, 'flutter_exam.txt')
const OUTPUT_JSON = path.join(process.cwd(), 'src', 'assets', 'question_bank.json')

function normalizeLine(line) {
  return line.replace(/\r$/, '').trimEnd()
}

function parseAnswersBlock(lines) {
  const answersById = new Map()

  const answerStart = lines.findIndex((l) => normalizeLine(l).trim() === '答案')
  if (answerStart < 0) throw new Error('未找到“答案”区块')

  for (let i = answerStart + 1; i < lines.length; i++) {
    const raw = normalizeLine(lines[i]).trim()
    if (!raw) continue

    // e.g. "01-05:  DCBCB" or "36-40:  B、AC、ACD、D、BD"
    const m = raw.match(/^(\d{1,3})-(\d{1,3}):\s*(.+)$/)
    if (!m) continue

    const start = Number(m[1])
    const end = Number(m[2])
    const payload = m[3].trim()
    const count = end - start + 1
    if (count <= 0) throw new Error(`答案区范围非法: ${raw}`)

    if (/^[A-D]+$/.test(payload.replace(/\s+/g, ''))) {
      // compact single-answer string
      const compact = payload.replace(/\s+/g, '')
      if (compact.length !== count) {
        throw new Error(`答案区长度与范围不一致: ${raw}`)
      }
      for (let k = 0; k < count; k++) {
        const id = start + k
        answersById.set(id, new Set([compact[k]]))
      }
    } else {
      // delimited per-question answers, separated by 、 or , or whitespace
      const parts = payload
        .split(/、|,|\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (parts.length !== count) {
        throw new Error(`答案区分段数量与范围不一致: ${raw}`)
      }
      for (let k = 0; k < count; k++) {
        const id = start + k
        const keys = parts[k].replace(/\s+/g, '').split('')
        answersById.set(id, new Set(keys))
      }
    }
  }

  return answersById
}

function parseQuestions(lines, answersById) {
  const questions = []

  let current = null
  let seenAnswers = false

  for (let i = 0; i < lines.length; i++) {
    const line = normalizeLine(lines[i])
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed === '答案') {
      seenAnswers = true
      break
    }

    const qMatch = trimmed.match(/^(\d{1,3})\.\s*(.+)$/)
    if (qMatch) {
      if (current) questions.push(current)

      const id = Number(qMatch[1])
      const stem = qMatch[2].trim()
      const isMulti = stem.includes('（多选题）') || stem.includes('(多选题)')
      current = {
        id,
        type: isMulti ? 'multi' : 'single',
        stem,
        options: [],
        answerKeys: [],
        explanationMd: '',
      }
      continue
    }

    const optMatch = trimmed.match(/^([A-D])\)\s*(.+)$/)
    if (optMatch && current) {
      current.options.push({ key: optMatch[1], text: optMatch[2].trim() })
      continue
    }
  }

  if (!seenAnswers) {
    // still push last question if file has no answer marker (should not happen here)
    if (current) questions.push(current)
  } else {
    if (current) questions.push(current)
  }

  // attach answers and validate
  for (const q of questions) {
    const ans = answersById.get(q.id)
    if (!ans) throw new Error(`题号 ${q.id} 未找到答案`)
    q.answerKeys = [...ans]
    if (q.options.length !== 4) {
      throw new Error(`题号 ${q.id} 选项数量异常: ${q.options.length}`)
    }
  }

  // determine multi by answers count if needed (keep explicit multi if marked)
  for (const q of questions) {
    if (q.type === 'single' && q.answerKeys.length > 1) q.type = 'multi'
  }

  return questions
}

async function main() {
  const txt = await fs.readFile(INPUT_TXT, 'utf8')
  const lines = txt.split('\n')

  const answersById = parseAnswersBlock(lines)
  const questions = parseQuestions(lines, answersById)

  if (questions.length !== 100) {
    throw new Error(`解析题数不为 100：当前=${questions.length}`)
  }

  const payload = {
    version: 1,
    questions,
  }

  await fs.mkdir(path.dirname(OUTPUT_JSON), { recursive: true })
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(payload, null, 2) + '\n', 'utf8')

  // quick summary
  const multiCount = questions.filter((q) => q.type === 'multi').length
  const singleCount = questions.length - multiCount
  console.log(`✅ 写入 ${OUTPUT_JSON}`)
  console.log(`题数=${questions.length}, 单选=${singleCount}, 多选=${multiCount}`)
}

main().catch((err) => {
  console.error('❌ 转换失败：', err?.message ?? err)
  process.exit(1)
})

