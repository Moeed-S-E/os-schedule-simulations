export const COLORS = ['#0b4f6c', '#01baef', '#b80c09']

export const SAMPLE = [
  { id: 'P1', at: 0, bt: 7 },
  { id: 'P2', at: 2, bt: 4 },
  { id: 'P3', at: 4, bt: 1 },
  { id: 'P4', at: 5, bt: 4 },
  { id: 'P5', at: 20, bt: 3 },
]

export function schedule(list) {
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

    ready.sort((a, b) => a.at - b.at || a.idx - b.idx)
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
