import { formatNumber } from '../lib/scheduling.js'
import Panel from './Panel.jsx'

function SimulationResults({ simulation }) {
  return (
    <Panel title="Results">
      <div className="overflow-x-auto p-1.5">
        <table className="w-full min-w-140 border-separate border-spacing-y-2.5 text-left tabular-nums">
          <thead>
            <tr className="text-[13px] font-semibold text-muted">
              {['Process', 'Arrival', 'Burst', 'Completion', 'Turnaround', 'Waiting'].map((label) => (
                <th className="px-2.5" key={label} scope="col">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {simulation.rows.map((row) => (
              <tr key={row.id}>
                <td className="px-2.5 py-1 font-extrabold">{row.id}</td>
                <td className="px-2.5 py-1">{row.at}</td>
                <td className="px-2.5 py-1">{row.bt}</td>
                <td className="px-2.5 py-1">{row.ct}</td>
                <td className="px-2.5 py-1">{row.tat}</td>
                <td className="px-2.5 py-1">{row.wt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-muted">
        Turnaround = Completion − Arrival. Waiting = Turnaround − Burst.
      </p>
      <div className="mt-4.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5.5">
        <MetricTile value={formatNumber(simulation.avgWT)} label="Average waiting time" />
        <MetricTile value={formatNumber(simulation.avgTAT)} label="Average turnaround time" />
      </div>
    </Panel>
  )
}

function MetricTile({ value, label }) {
  return (
    <div className="rounded-[18px] p-4.5 shadow-inset">
      <b className="block text-[30px] tabular-nums text-accent">{value}</b>
      <span className="text-[13px] text-muted">{label}</span>
    </div>
  )
}

export default SimulationResults
