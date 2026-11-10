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

  it('renders the sample processes, schedule, results, metrics, and comparison', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Process scheduling simulator' })).toBeInTheDocument()
    expect(panel('Algorithm').getByRole('button', { name: 'FCFS' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(panel('Processes').getByLabelText('P1 Arrival')).toHaveValue(0)
    expect(panel('Processes').getByLabelText('P5 Priority')).toHaveValue(1)
    expect(panel('Results').getByRole('row', { name: /P1 0 7 7 7 0/ })).toBeInTheDocument()
    expect(panel('Results').getByText('3.80')).toBeInTheDocument()
    expect(panel('Results').getByText('7.60')).toBeInTheDocument()
    expect(panel('Gantt chart').getByText(/Total time: 23/)).toBeInTheDocument()
    expect(panel('Algorithm comparison').getByText('FCFS')).toBeInTheDocument()
    expect(
      panel('Algorithm comparison')
        .getByRole('row', { name: /SJF 3\.20 7/ })
        .querySelector('td:nth-child(2)'),
    ).toHaveClass('text-accent')
  })

  it.each([
    ['FCFS', 'First Come First Served:', '3.80'],
    ['SJF', 'Shortest Job First:', '3.20'],
    ['Priority', 'Priority: among arrived processes', '4.40'],
  ])('selecting %s updates its description, active state, and computed metrics', async (algo, description, avg) => {
    const user = userEvent.setup()
    render(<App />)

    const algorithmPanel = panel('Algorithm')
    await user.click(algorithmPanel.getByRole('button', { name: algo }))

    expect(algorithmPanel.getByRole('button', { name: algo })).toHaveAttribute('aria-pressed', 'true')
    expect(algorithmPanel.getByText(new RegExp(description))).toBeInTheDocument()
    expect(panel('Results').getByText(avg)).toBeInTheDocument()
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

  it('clamps burst and priority to one and floors fractional input', () => {
    render(<App />)

    const processesPanel = panel('Processes')
    const burst = processesPanel.getByLabelText('P1 Burst')
    const arrival = processesPanel.getByLabelText('P1 Arrival')
    const priority = processesPanel.getByLabelText('P1 Priority')

    fireEvent.change(burst, { target: { value: '0' } })
    fireEvent.change(arrival, { target: { value: '-3' } })
    fireEvent.change(priority, { target: { value: '0' } })
    fireEvent.change(priority, { target: { value: '2.8' } })

    expect(burst).toHaveValue(1)
    expect(arrival).toHaveValue(0)
    expect(priority).toHaveValue(2)
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
      expect(processesPanel.getByLabelText(`P${index} Priority`)).toHaveValue(3)
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

  it('replays the Gantt chart and can show all segments again', async () => {
    const user = userEvent.setup()
    render(<App />)

    const chart = panel('Gantt chart')
    const segments = () => chart.queryAllByTestId('gantt-segment')
    expect(segments()).toHaveLength(6)

    fireEvent.change(chart.getByLabelText('Replay'), { target: { value: '2' } })
    expect(segments()).toHaveLength(1)

    await user.click(chart.getByRole('button', { name: 'Show all' }))
    expect(segments()).toHaveLength(6)
  })

  it('renders left and right scroll buttons only for the Gantt chart', () => {
    render(<App />)

    expect(screen.getAllByRole('button', { name: 'Scroll left' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Scroll right' })).toHaveLength(1)
    expect(panel('Gantt chart').getByRole('button', { name: 'Scroll left' })).toBeInTheDocument()
    expect(panel('Processes').queryByRole('button', { name: 'Scroll left' })).not.toBeInTheDocument()
    expect(panel('Results').queryByRole('button', { name: 'Scroll right' })).not.toBeInTheDocument()
    expect(
      panel('Algorithm comparison').queryByRole('button', { name: 'Scroll left' }),
    ).not.toBeInTheDocument()
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
