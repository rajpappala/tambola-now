import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { generateTicket } from '@/utils/ticketGenerator'
import type { Ticket } from '@/types/game'
import TicketCard from './TicketCard'

function emptyMarked(): boolean[][] {
  return Array.from({ length: 3 }, () => Array(9).fill(false))
}

function makeTickets(count: number): Ticket[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ticket-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    grid: generateTicket(),
    markedCells: emptyMarked(),
  }))
}

export default function TicketsScreen() {
  const goToScreen = useGameStore(s => s.goToScreen)
  const [ticketCount, setTicketCount] = useState(1)
  const [tickets, setTickets] = useState<Ticket[]>([])

  function handleCreate() {
    setTickets(makeTickets(ticketCount))
  }

  function handleMarkCell(ticketId: string, row: number, col: number) {
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t
        if (t.grid[row][col] === 0) return t
        return {
          ...t,
          markedCells: t.markedCells.map((r, ri) =>
            r.map((cell, ci) => (ri === row && ci === col ? !cell : cell))
          ),
        }
      })
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8 gap-6">
      <header className="w-full max-w-sm flex items-center gap-3">
        <button onClick={() => goToScreen('home')} className="text-slate-400 hover:text-white text-sm no-tap-highlight">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-brand-500">Create Tickets</h1>
      </header>

      <div className="w-full max-w-sm flex items-center justify-between px-1">
        <span className="text-slate-400 text-sm">Tickets</span>
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          {[1, 2, 3].map(n => (
            <button
              key={n}
              onClick={() => setTicketCount(n)}
              className={[
                'w-10 py-1.5 text-sm font-bold transition-colors no-tap-highlight',
                ticketCount === n ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full max-w-sm py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-xl transition-colors no-tap-highlight"
      >
        🎟 Create Tickets
      </button>

      {tickets.length > 0 && (
        <div className="w-full max-w-sm space-y-3">
          {tickets.map((ticket, i) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              calledNumbers={[]}
              onMarkCell={(row, col) => handleMarkCell(ticket.id, row, col)}
              index={i}
              total={tickets.length}
              freeMark
            />
          ))}
        </div>
      )}
    </div>
  )
}
