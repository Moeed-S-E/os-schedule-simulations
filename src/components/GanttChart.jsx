import { COLORS } from '../lib/scheduling.js'
import HorizontalScroller from './HorizontalScroller.jsx'
import Panel from './Panel.jsx'

function GanttChart({ segments, total, upTo, onReplayChange, onShowAll }) {
  const width = Math.max(total * 34, 320)
  const shown = segments.filter((segment) => segment.start < upTo)
  const bounds = [...new Set([0, ...segments.map((segment) => segment.end)])].filter(
    (time) => time <= upTo,
  )

  return (
    <Panel title="Gantt chart">
      <HorizontalScroller contentClassName="px-2 pb-2 pt-3.5">
        <div style={{ width: width + 28 }}>
          <div
            className="relative mx-3.5 h-16 rounded-[14px] shadow-inset"
            style={{ width }}
          >
            {shown.map((segment, index) => {
              const end = Math.min(segment.end, upTo)
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
                    width: `${((end - segment.start) / total) * 100}%`,
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
      <div className="mt-3 flex flex-wrap items-center gap-3.5">
        <label className="text-[13px] text-muted" htmlFor="scrub">Replay</label>
        <input
          className="w-full max-w-80 accent-accent"
          id="scrub"
          type="range"
          min="0"
          max={total}
          step="1"
          value={Math.min(upTo, total)}
          onChange={(event) => onReplayChange(Number(event.target.value))}
        />
        <button
          type="button"
          className="rounded-[14px] bg-surface px-4.5 py-2.5 font-bold text-app shadow-raised transition-shadow hover:shadow-inset active:shadow-inset focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
          onClick={onShowAll}
        >
          Show all
        </button>
      </div>
      <p className="mt-1.5 text-[13px] text-muted">
        Dashed blocks are idle time, when no process has arrived yet. Total time: {total}.
      </p>
    </Panel>
  )
}

export default GanttChart
