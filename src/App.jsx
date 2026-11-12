import { useState } from 'react'
import GanttChart from './components/GanttChart.jsx'
import ProcessEditor from './components/ProcessEditor.jsx'
import SimulationResults from './components/SimulationResults.jsx'
import { SAMPLE, schedule } from './lib/scheduling.js'

function App() {
  const [processes, setProcesses] = useState(SAMPLE)

  const simulation = processes.length ? schedule(processes) : null

  const updateProcess = (index, field, value) => {
    const number = Math.floor(Number(value))
    const minimum = field === 'bt' ? 1 : 0
    const nextValue = Number.isFinite(number) ? Math.max(minimum, number) : minimum
    setProcesses((current) =>
      current.map((process, processIndex) =>
        processIndex === index ? { ...process, [field]: nextValue } : process,
      ),
    )
  }

  const renumberProcesses = (items) => items.map((process, index) => ({ ...process, id: `P${index + 1}` }))

  const addProcess = () => {
    if (processes.length >= 12) return
    setProcesses((current) => renumberProcesses([...current, { id: '', at: 0, bt: 3 }]))
  }

  const removeProcess = (index) => {
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
    }))
    setProcesses(renumberProcesses(randomized))
  }

  const resetSample = () => {
    setProcesses(SAMPLE)
  }

  return (
    <main className="mx-auto w-full max-w-245 px-4.5 pb-14 pt-7 max-sm:px-3.5 max-sm:pb-10 max-sm:pt-5.5">
      <header className="mb-6.5">
        <h1 className="mb-1 text-[28px] font-extrabold tracking-tight">Process scheduling simulator</h1>
        <p className="max-w-[60ch] text-muted">
          First Come First Served (FCFS) scheduling. Enter processes and explore the timeline and
          timing metrics.
        </p>
      </header>

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
          />
          <SimulationResults simulation={simulation} />
        </>
      )}
    </main>
  )
}

export default App
