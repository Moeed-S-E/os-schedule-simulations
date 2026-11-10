import { formatNumber } from '../lib/scheduling.js'
import Panel from './Panel.jsx'

function AlgorithmComparison({ comparisons }) {
  const best = comparisons.reduce((currentBest, comparison) =>
    comparison.avgWT < currentBest.avgWT ? comparison : currentBest,
  )

  return (
    <Panel title="Algorithm comparison">
      <div className="overflow-x-auto p-1.5">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2.5 text-left tabular-nums">
          <thead>
            <tr className="text-[13px] font-semibold text-muted">
              <th className="px-2.5" scope="col">Algorithm</th>
              <th className="px-2.5" scope="col">Avg waiting</th>
              <th className="px-2.5" scope="col">Avg turnaround</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison) => (
              <tr key={comparison.key}>
                <td className="px-2.5 py-1 font-extrabold">{comparison.key}</td>
                <td className={`px-2.5 py-1 ${comparison === best ? 'font-extrabold text-accent' : ''}`}>
                  {formatNumber(comparison.avgWT)}
                </td>
                <td className="px-2.5 py-1">{formatNumber(comparison.avgTAT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-muted">
        Lowest average waiting time for this process set:{' '}
        <span className="font-extrabold text-accent">{best.key}</span>.
      </p>
    </Panel>
  )
}

export default AlgorithmComparison
