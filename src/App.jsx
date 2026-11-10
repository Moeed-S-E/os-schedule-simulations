import { useMemo, useState } from 'react'
import AlgorithmComparison from './components/AlgorithmComparison.jsx'
import AlgorithmSelector from './components/AlgorithmSelector.jsx'
import GanttChart from './components/GanttChart.jsx'
import ProcessEditor from './components/ProcessEditor.jsx'
import SimulationResults from './components/SimulationResults.jsx'
import { ALGOS, SAMPLE, schedule } from './lib/scheduling.js'

function App() {
  const [processes, setProcesses] = useState(SAMPLE)
  const [algo, setAlgo] = useState('FCFS')
  const [upTo, setUpTo] = useState(Number.POSITIVE_INFINITY)

  const simulation = useMemo(
    () => (processes.length ? schedule(processes, algo) : null),
    [processes, algo],
  )
  const comparisons = useMemo(
    () =>
      processes.length
        ? Object.keys(ALGOS).map((key) => ({ key, ...schedule(processes, key) }))
        : [],
    [processes],
  )

  const resetReplay = () => setUpTo(Number.POSITIVE_INFINITY)

  const updateProcess = (index, field, value) => {
    const number = Math.floor(Number(value))
    const minimum = field === 'bt' || field === 'pr' ? 1 : 0
    const nextValue = Number.isFinite(number) ? Math.max(minimum, number) : minimum
    resetReplay()
    setProcesses((current) =>
      current.map((process, processIndex) =>
        processIndex === index ? { ...process, [field]: nextValue } : process,
      ),
    )
  }

  const renumberProcesses = (items) => items.map((process, index) => ({ ...process, id: `P${index + 1}` }))

  const addProcess = () => {
    if (processes.length >= 12) return
    resetReplay()
    setProcesses((current) => renumberProcesses([...current, { id: '', at: 0, bt: 3, pr: 1 }]))
  }

  const removeProcess = (index) => {
    resetReplay()
    setProcesses((current) =>
      renumberProcesses(current.filter((_, processIndex) => processIndex !== index)),
    )
  }

  const randomizeProcesses = () => {
    const randomInteger = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
    const randomized = Array.from({ length: randomInteger(4, 7) }, () => ({
      id: '',
      at: randomInteger(0, 10),
      bt: randomInteger(1, 8),
      pr: randomInteger(1, 5),
    }))
    resetReplay()
    setProcesses(renumberProcesses(randomized))
  }

  const resetSample = () => {
    resetReplay()
    setProcesses(SAMPLE)
  }

  const changeAlgorithm = (nextAlgo) => {
    resetReplay()
    setAlgo(nextAlgo)
  }

  return (
    <main className="mx-auto w-full max-w-245 px-4.5 pb-14 pt-7 max-sm:px-3.5 max-sm:pb-10 max-sm:pt-5.5">
      <header className="mb-6.5">
        <h1 className="mb-1 text-[28px] font-extrabold tracking-tight">Process scheduling simulator</h1>
        <p className="max-w-[60ch] text-muted">
          Non-preemptive CPU scheduling. Enter processes, pick an algorithm, and read the timeline and
          metrics.
        </p>
      </header>

      <AlgorithmSelector selected={algo} onSelect={changeAlgorithm} />
      <ProcessEditor
        processes={processes}
        onUpdate={updateProcess}
        onAdd={addProcess}
        onRemove={removeProcess}
        onRandomize={randomizeProcesses}
        onReset={resetSample}
      />

      {simulation && (
        <>
          <GanttChart
            segments={simulation.segs}
            total={simulation.total}
            upTo={upTo}
            onReplayChange={setUpTo}
            onShowAll={resetReplay}
          />
          <SimulationResults simulation={simulation} />
          <AlgorithmComparison comparisons={comparisons} />
        </>
      )}
    </main>
  )
}

export default App
