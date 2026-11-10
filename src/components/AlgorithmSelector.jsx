import { ALGOS } from '../lib/scheduling.js'
import ActionButton from './ActionButton.jsx'
import Panel from './Panel.jsx'

const descriptions = {
  FCFS: 'First Come First Served: the process that arrived earliest runs next.',
  SJF: 'Shortest Job First: among arrived processes, the shortest burst runs next.',
  Priority:
    'Priority: among arrived processes, the lowest priority number (highest priority) runs next.',
}

function AlgorithmSelector({ selected, onSelect }) {
  return (
    <Panel title="Algorithm">
      <div className="flex flex-wrap items-center gap-3.5">
        {Object.keys(ALGOS).map((key) => (
          <ActionButton
            key={key}
            variant={selected === key ? 'active' : 'default'}
            aria-pressed={selected === key}
            onClick={() => onSelect(key)}
          >
            {ALGOS[key].label}
          </ActionButton>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-muted">{descriptions[selected]}</p>
    </Panel>
  )
}

export default AlgorithmSelector
