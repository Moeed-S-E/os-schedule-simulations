import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { SAMPLE } from './lib/scheduling.js'

const panel = (name) =>
  within(screen.getByRole('heading', { name }).closest('section'))

describe('process scheduling simulator', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders the FCFS sample processes, schedule, results, and metrics', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Process scheduling simulator' })).toBeInTheDocument()
    expect(screen.getByText(/First Come First Served \(FCFS\)/)).toBeInTheDocument()
    const processesPanel = panel('Processes')
    expect(processesPanel.getByLabelText('P1 Arrival')).toHaveValue(0)
    expect(processesPanel.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Process',
      'Arrival',
      'Burst',
      'Actions',
    ])
    expect(panel('Results').getByRole('row', { name: /P1 0 7 7 7 0/ })).toBeInTheDocument()
    expect(panel('Results').getByText('3.80')).toBeInTheDocument()
    expect(panel('Results').getByText('7.60')).toBeInTheDocument()
    expect(panel('Gantt chart').getByText(/Total time: 23/)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Processes',
      'Gantt chart',
      'Results',
    ])
  })

  it('adds processes with the next id and disables adding at the 12-process limit', async () => {
    const user = userEvent.setup()
    render(<App />)

    const processesPanel = panel('Processes')
    for (let count = 0; count < 7; count += 1) {
      await user.click(processesPanel.getByRole('button', { name: 'Add process' }))
    }

    expect(processesPanel.getByLabelText('P12 Arrival')).toHaveValue(0)
    expect(processesPanel.getByRole('button', { name: 'Add process' })).toBeDisabled()
    expect(processesPanel.getAllByRole('row')).toHaveLength(13)
  })

  it('removes processes and renumbers the remaining rows', async () => {
    const user = userEvent.setup()
    render(<App />)

    const processesPanel = panel('Processes')
    await user.click(processesPanel.getByRole('button', { name: 'Remove P2' }))

    expect(processesPanel.queryByLabelText('P5 Arrival')).not.toBeInTheDocument()
    expect(processesPanel.getByLabelText('P2 Arrival')).toHaveValue(4)
    expect(processesPanel.getAllByRole('row')).toHaveLength(5)
  })

  it('clamps burst to one and floors fractional input', () => {
    render(<App />)

    const processesPanel = panel('Processes')
    const burst = processesPanel.getByLabelText('P1 Burst')
    const arrival = processesPanel.getByLabelText('P1 Arrival')

    fireEvent.change(burst, { target: { value: '0' } })
    fireEvent.change(arrival, { target: { value: '-3' } })

    expect(burst).toHaveValue(1)
    expect(arrival).toHaveValue(0)
  })

  it('randomizes a bounded set of valid processes', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    render(<App />)

    const processesPanel = panel('Processes')
    await user.click(processesPanel.getByRole('button', { name: 'Random set' }))

    expect(processesPanel.getAllByRole('row')).toHaveLength(7)
    for (let index = 1; index <= 6; index += 1) {
      expect(processesPanel.getByLabelText(`P${index} Arrival`)).toHaveValue(5)
      expect(processesPanel.getByLabelText(`P${index} Burst`)).toHaveValue(5)
    }
  })

  it('resets process inputs to the sample set', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    render(<App />)

    const processesPanel = panel('Processes')
    await user.click(processesPanel.getByRole('button', { name: 'Random set' }))
    await user.click(processesPanel.getByRole('button', { name: 'Reset sample' }))

    expect(processesPanel.getAllByRole('row')).toHaveLength(SAMPLE.length + 1)
    expect(processesPanel.getByLabelText('P1 Burst')).toHaveValue(SAMPLE[0].bt)
    expect(processesPanel.getByLabelText('P5 Arrival')).toHaveValue(SAMPLE[4].at)
  })

  it('shows the empty-state message and hides simulation results when all processes are removed', async () => {
    const user = userEvent.setup()
    render(<App />)

    for (let index = 0; index < SAMPLE.length; index += 1) {
      await user.click(panel('Processes').getByRole('button', { name: 'Remove P1' }))
    }

    expect(screen.getByText('Add at least one process to run the simulation.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Gantt chart' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Results' })).not.toBeInTheDocument()
  })

  it('shows the complete Gantt chart without replay controls', () => {
    render(<App />)

    const chart = panel('Gantt chart')
    expect(chart.getAllByTestId('gantt-segment')).toHaveLength(6)
    expect(chart.queryByLabelText('Replay')).not.toBeInTheDocument()
    expect(chart.queryByRole('button', { name: 'Show all' })).not.toBeInTheDocument()
  })

  it('renders left and right scroll buttons only for the Gantt chart', () => {
    render(<App />)

    expect(screen.getAllByRole('button', { name: 'Scroll left' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Scroll right' })).toHaveLength(1)
    expect(panel('Gantt chart').getByRole('button', { name: 'Scroll left' })).toBeInTheDocument()
    expect(panel('Processes').queryByRole('button', { name: 'Scroll left' })).not.toBeInTheDocument()
    expect(panel('Results').queryByRole('button', { name: 'Scroll right' })).not.toBeInTheDocument()
  })

  it('scroll buttons move the Gantt timeline in the selected direction', async () => {
    const user = userEvent.setup()
    render(<App />)

    const chart = panel('Gantt chart')
    const leftButton = chart.getByRole('button', { name: 'Scroll left' })
    const rightButton = chart.getByRole('button', { name: 'Scroll right' })
    const scrollRegion = document.getElementById(rightButton.getAttribute('aria-controls'))
    const scrollBy = vi.fn()
    Object.defineProperty(scrollRegion, 'clientWidth', { configurable: true, value: 400 })
    scrollRegion.scrollBy = scrollBy

    await user.click(rightButton)
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'smooth' })

    await user.click(leftButton)
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300, behavior: 'smooth' })
  })
})
