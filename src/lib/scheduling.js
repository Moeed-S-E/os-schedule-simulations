export const ALGOS = {
  FCFS: { label: 'FCFS', key: (process) => [process.at, process.idx] },
  SJF: { label: 'SJF', key: (process) => [process.bt, process.at, process.idx] },
  Priority: { label: 'Priority', key: (process) => [process.pr, process.at, process.idx] },
}

export const COLORS = [
  '#a9c48a',
  '#e3b868',
  '#dd9a84',
  '#c6ad8d',
  '#8fc09a',
  '#e6b3a3',
  '#cfcb7e',
  '#b9a28a',
]

export const SAMPLE = [
  { id: 'P1', at: 0, bt: 7, pr: 3 },
  { id: 'P2', at: 2, bt: 4, pr: 1 },
  { id: 'P3', at: 4, bt: 1, pr: 4 },
  { id: 'P4', at: 5, bt: 4, pr: 2 },
  { id: 'P5', at: 20, bt: 3, pr: 1 },
]

const compareKeys = (a, b) => {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

export function schedule(list, algo) {
  const processes = list.map((process, idx) => ({ ...process, idx, done: false }))
  const segments = []
  const result = {}
  let time = 0
  let finished = 0

  while (finished < processes.length) {
    const ready = processes.filter((process) => !process.done && process.at <= time)

    if (ready.length === 0) {
      const next = Math.min(...processes.filter((process) => !process.done).map((process) => process.at))
      segments.push({ pid: 'Idle', start: time, end: next, idle: true })
      time = next
      continue
    }

    ready.sort((a, b) => compareKeys(ALGOS[algo].key(a), ALGOS[algo].key(b)))
    const process = ready[0]
    const start = time
    const end = time + process.bt
    segments.push({ pid: process.id, start, end, idle: false })
    time = end
    process.done = true
    finished += 1

    const turnaround = end - process.at
    result[process.id] = { ct: end, tat: turnaround, wt: turnaround - process.bt }
  }

  const rows = list.map((process) => ({ ...process, ...result[process.id] }))
  const count = rows.length || 1
  const avgWT = rows.reduce((sum, row) => sum + row.wt, 0) / count
  const avgTAT = rows.reduce((sum, row) => sum + row.tat, 0) / count
  return { rows, segs: segments, avgWT, avgTAT, total: time }
}

export const formatNumber = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(2))
