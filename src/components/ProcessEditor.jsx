import ActionButton from './ActionButton.jsx'
import Panel from './Panel.jsx'

const fields = [
  { key: 'at', label: 'Arrival', min: 0 },
  { key: 'bt', label: 'Burst', min: 1 },
  { key: 'pr', label: 'Priority', min: 1 },
]

function ProcessEditor({ processes, onUpdate, onAdd, onRemove, onRandomize, onReset }) {
  return (
    <Panel title="Processes">
      <div className="overflow-x-auto p-1.5">
        <table className="w-full min-w-140 border-separate border-spacing-y-2.5 text-left">
          <thead>
            <tr className="text-[13px] font-semibold text-muted">
              <th className="px-2.5" scope="col">Process</th>
              {fields.map((field) => (
                <th className="px-2.5" key={field.key} scope="col">{field.label}</th>
              ))}
              <th className="px-2.5" scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id}>
                <td className="px-2.5 py-1 font-extrabold">{process.id}</td>
                {fields.map((field) => (
                  <td className="px-2.5 py-1" key={field.key}>
                    <input
                      className="w-[84px] rounded-xl bg-surface px-2.5 py-2 shadow-inset focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
                      type="number"
                      min={field.min}
                      value={process[field.key]}
                      aria-label={`${process.id} ${field.label}`}
                      onChange={(event) => onUpdate(index, field.key, event.target.value)}
                    />
                  </td>
                ))}
                <td className="px-2.5 py-1">
                  <ActionButton
                    variant="danger"
                    aria-label={`Remove ${process.id}`}
                    onClick={() => onRemove(index)}
                  >
                    Remove
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-3.5">
        <ActionButton variant="primary" onClick={onAdd} disabled={processes.length >= 12}>
          Add process
        </ActionButton>
        <ActionButton onClick={onRandomize}>Random set</ActionButton>
        <ActionButton onClick={onReset}>Reset sample</ActionButton>
      </div>
      {processes.length === 0 && (
        <p className="mt-2 text-[13px] text-warning">Add at least one process to run the simulation.</p>
      )}
    </Panel>
  )
}

export default ProcessEditor
