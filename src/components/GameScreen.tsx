import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import RecentNumbers from './RecentNumbers'
import NumberBoard from './NumberBoard'
import CallerControls from './CallerControls'
import TicketCard from './TicketCard'

type Tab = 'board' | 'ticket'

export default function GameScreen() {
  const { goToScreen, tickets, generateTickets } = useGameStore()
  const [tab, setTab] = useState<Tab>('board')

  // Ensure we always have a ticket
  if (tickets.length === 0) generateTickets(1)

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <button
          onClick={() => goToScreen('home')}
          className="text-slate-400 hover:text-white transition-colors text-sm no-tap-highlight"
        >
          ← Back
        </button>
        <span className="font-bold text-brand-500 tracking-tight">Tambola Now</span>
        <button
          onClick={() => generateTickets(1)}
          className="text-slate-500 hover:text-slate-300 transition-colors text-xs no-tap-highlight"
          title="New ticket"
        >
          New ticket
        </button>
      </header>

      {/* Current number + recent strip — always visible */}
      <div className="bg-slate-950 border-b border-slate-800">
        <RecentNumbers />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950">
        {(['board', 'ticket'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2.5 text-sm font-medium transition-colors capitalize no-tap-highlight',
              tab === t
                ? 'text-brand-500 border-b-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-300',
            ].join(' ')}
          >
            {t === 'board' ? '🎯 Board' : '🎟 Ticket'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'board' ? (
          <div className="p-3">
            <NumberBoard />
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {/* Controls — sticky bottom */}
      <div className="px-3 pt-3 bg-slate-950 border-t border-slate-800 sticky bottom-0">
        <CallerControls />
      </div>
    </div>
  )
}
