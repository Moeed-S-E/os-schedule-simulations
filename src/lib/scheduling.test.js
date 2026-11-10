import { describe, expect, it } from 'vitest'
import { formatNumber, SAMPLE, schedule } from './scheduling.js'

describe('schedule', () => {
  it('schedules FCFS by arrival time and preserves input order for ties', () => {
    const processes = [
      { id: 'P1', at: 0, bt: 4, pr: 1 },
      { id: 'P2', at: 1, bt: 2, pr: 1 },
      { id: 'P3', at: 1, bt: 1, pr: 1 },
    ]

    const result = schedule(processes, 'FCFS')

    expect(result.segs).toEqual([
      { pid: 'P1', start: 0, end: 4, idle: false },
      { pid: 'P2', start: 4, end: 6, idle: false },
      { pid: 'P3', start: 6, end: 7, idle: false },
    ])
    expect(result.rows).toEqual([
      { ...processes[0], ct: 4, tat: 4, wt: 0 },
      { ...processes[1], ct: 6, tat: 5, wt: 3 },
      { ...processes[2], ct: 7, tat: 6, wt: 5 },
    ])
    expect(result.avgWT).toBeCloseTo(8 / 3)
    expect(result.avgTAT).toBe(5)
    expect(result.total).toBe(7)
  })

  it('schedules SJF non-preemptively among the processes that have arrived', () => {
    const processes = [
      { id: 'P1', at: 0, bt: 2, pr: 3 },
      { id: 'P2', at: 1, bt: 7, pr: 1 },
      { id: 'P3', at: 2, bt: 1, pr: 2 },
      { id: 'P4', at: 2, bt: 1, pr: 4 },
    ]

    const result = schedule(processes, 'SJF')

    expect(result.segs.map(({ pid, start, end }) => [pid, start, end])).toEqual([
      ['P1', 0, 2],
      ['P3', 2, 3],
      ['P4', 3, 4],
      ['P2', 4, 11],
    ])
  })

  it('schedules the lowest numeric priority first and breaks ties by arrival then order', () => {
    const processes = [
      { id: 'P1', at: 0, bt: 3, pr: 3 },
      { id: 'P2', at: 1, bt: 2, pr: 1 },
      { id: 'P3', at: 1, bt: 1, pr: 1 },
      { id: 'P4', at: 1, bt: 1, pr: 2 },
    ]

    const result = schedule(processes, 'Priority')

    expect(result.segs.map((segment) => segment.pid)).toEqual(['P1', 'P2', 'P3', 'P4'])
    expect(result.rows.map(({ id, ct, tat, wt }) => ({ id, ct, tat, wt }))).toEqual([
      { id: 'P1', ct: 3, tat: 3, wt: 0 },
      { id: 'P2', ct: 5, tat: 4, wt: 2 },
      { id: 'P3', ct: 6, tat: 5, wt: 4 },
      { id: 'P4', ct: 7, tat: 6, wt: 5 },
    ])
  })

  it('records initial idle time and gaps between process arrivals', () => {
    const result = schedule(
      [
        { id: 'P1', at: 3, bt: 2, pr: 1 },
        { id: 'P2', at: 8, bt: 1, pr: 1 },
      ],
      'FCFS',
    )

    expect(result.segs).toEqual([
      { pid: 'Idle', start: 0, end: 3, idle: true },
      { pid: 'P1', start: 3, end: 5, idle: false },
      { pid: 'Idle', start: 5, end: 8, idle: true },
      { pid: 'P2', start: 8, end: 9, idle: false },
    ])
    expect(result.rows.map(({ ct, tat, wt }) => ({ ct, tat, wt }))).toEqual([
      { ct: 5, tat: 2, wt: 0 },
      { ct: 9, tat: 1, wt: 0 },
    ])
  })

  it('returns zero metrics for an empty process list', () => {
    expect(schedule([], 'FCFS')).toEqual({
      rows: [],
      segs: [],
      avgWT: 0,
      avgTAT: 0,
      total: 0,
    })
  })

  it('does not mutate the provided process list', () => {
    const processes = structuredClone(SAMPLE)

    schedule(processes, 'SJF')

    expect(processes).toEqual(SAMPLE)
  })
})

describe('formatNumber', () => {
  it('formats integers without decimal places', () => {
    expect(formatNumber(4)).toBe('4')
  })

  it('formats non-integers to two decimal places', () => {
    expect(formatNumber(8 / 3)).toBe('2.67')
  })
})
