import { useGameStore } from '@/store/gameStore'
import type { Ticket } from '@/types/game'

interface Props {
  ticket: Ticket
}

export default function TicketCard({ ticket }: Props) {
  const { markCell, calledNumbers } = useGameStore()

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          Tambola Ticket
        </span>
        <span className="text-xs text-slate-500">{ticket.id.slice(-4)}</span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-0.5 p-2"
        style={{ gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' }}
      >
        {ticket.grid.map((row, ri) =>
          row.map((num, ci) => {
            const isBlank = num === 0
            const isCalled = !isBlank && calledNumbers.includes(num)
            const isMarked = ticket.markedCells[ri][ci]

            return (
              <button
                key={`${ri}-${ci}`}
                onClick={() => markCell(ticket.id, ri, ci)}
                disabled={isBlank || !isCalled}
                className={[
                  'aspect-square rounded text-xs font-bold transition-all no-tap-highlight',
                  isBlank
                    ? 'bg-slate-800 cursor-default'
                    : isMarked
                    ? 'bg-brand-500 text-white scale-95'
                    : isCalled
                    ? 'bg-green-900 text-green-300 ring-1 ring-green-600 cursor-pointer hover:bg-green-800'
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed',
                ].join(' ')}
              >
                {isBlank ? '' : num}
              </button>
            )
          })
        )}
      </div>

      {/* Legend */}
      <div className="px-3 pb-2 flex gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-brand-500 inline-block" /> Marked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-900 ring-1 ring-green-600 inline-block" /> Called
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-700 inline-block" /> Waiting
        </span>
      </div>
    </div>
  )
}
