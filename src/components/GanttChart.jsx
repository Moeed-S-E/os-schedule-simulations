import { COLORS } from '../lib/scheduling.js'
import HorizontalScroller from './HorizontalScroller.jsx'
import Panel from './Panel.jsx'

function GanttChart({ segments, total }) {
  const width = Math.max(total * 34, 320)
  const bounds = [...new Set([0, ...segments.map((segment) => segment.end)])]

  return (
    <Panel title="Gantt chart">
      <HorizontalScroller contentClassName="px-2 pb-2 pt-3.5">
        <div style={{ width: width + 28 }}>
          <div
            className="relative mx-3.5 h-16 rounded-[14px] shadow-inset"
            style={{ width }}
          >
            {segments.map((segment, index) => {
              const processNumber = parseInt(String(segment.pid).replace(/\D/g, ''), 10) || 1
              return (
                <div
                  key={`${segment.pid}-${segment.start}-${index}`}
                  data-testid="gantt-segment"
                  className={`absolute bottom-2 top-2 flex items-center justify-center overflow-hidden rounded-[10px] text-[13px] font-extrabold ${
                    segment.idle
                      ? 'border border-dashed border-muted bg-transparent font-semibold text-muted shadow-none'
                      : processNumber % COLORS.length === 2
                        ? 'text-app'
                        : 'text-[#fbfbff]'
                  } ${
                    segment.idle ? '' : 'shadow-raised'
                  }`}
                  style={{
                    left: `${(segment.start / total) * 100}%`,
                    width: `${((segment.end - segment.start) / total) * 100}%`,
                    backgroundColor: segment.idle
                      ? 'transparent'
                      : COLORS[(processNumber - 1) % COLORS.length],
                  }}
                >
                  {segment.pid}
                </div>
              )
            })}
          </div>
          <div className="relative mx-3.5 mt-1.5 h-7">
            {bounds.map((time) => (
              <span
                key={time}
                className="absolute -translate-x-1/2 text-xs tabular-nums text-muted"
                style={{ left: `${(time / total) * 100}%` }}
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </HorizontalScroller>
      <p className="mt-1.5 text-[13px] text-muted">
        Dashed blocks are idle time, when no process has arrived yet. Total time: {total}.
      </p>
    </Panel>
  )
}

export default GanttChart
