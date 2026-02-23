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

  if (tickets.length === 0) generateTickets(1)

  return (
    // h-screen + overflow-hidden = nothing scrolls, everything fits
    <div className="h-screen flex flex-col overflow-hidden max-w-lg mx-auto">

      {/* Header — compact */}
      <header className="flex-none flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => goToScreen('home')}
          className="text-slate-400 hover:text-white text-sm no-tap-highlight"
        >
          ← Back
        </button>
        <span className="font-bold text-brand-500 tracking-tight text-sm">Tambola Now</span>
        <div className="flex gap-2">
          {(['board', 'ticket'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors no-tap-highlight',
                tab === t
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-500 hover:text-slate-300',
              ].join(' ')}
            >
              {t === 'board' ? '🎯 Board' : '🎟 Ticket'}
            </button>
          ))}
        </div>
      </header>

      {/* Current number + recent strip — compact, fixed height */}
      <div className="flex-none bg-slate-950 border-b border-slate-800">
        <RecentNumbers />
      </div>

      {/* Main content — flex-1 min-h-0 so it fills EXACTLY remaining space */}
      <div className="flex-1 min-h-0">
        {tab === 'board' ? (
          // p-2 padding, h-full so NumberBoard can stretch to fill
          <div className="h-full p-2">
            <NumberBoard />
          </div>
        ) : (
          // Ticket tab can scroll (it's a different use case)
          <div className="h-full overflow-y-auto p-3 space-y-3">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {/* Controls — compact, fixed at bottom */}
      <div className="flex-none px-3 pt-2 bg-slate-950 border-t border-slate-800">
        <CallerControls />
      </div>
    </div>
  )
}
