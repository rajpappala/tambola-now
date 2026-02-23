import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useIsLandscape } from '@/hooks/useOrientation'
import RecentNumbers from './RecentNumbers'
import NumberBoard from './NumberBoard'
import CallerControls from './CallerControls'
import TicketCard from './TicketCard'

type Tab = 'board' | 'ticket'

export default function GameScreen() {
  const { goToScreen, tickets, generateTickets } = useGameStore()
  const isLandscape = useIsLandscape()
  const [tab, setTab] = useState<Tab>('board')

  if (tickets.length === 0) generateTickets(1)

  // ─── LANDSCAPE: sidebar + full-height board ────────────────────────────────
  if (isLandscape) {
    return (
      <div className="h-screen overflow-hidden flex flex-row bg-slate-950">
        {/* Left sidebar */}
        <aside className="w-44 flex-none flex flex-col border-r border-slate-800">
          {/* Title + nav */}
          <header className="flex-none flex items-center justify-between px-3 py-2 border-b border-slate-800">
            <button
              onClick={() => goToScreen('home')}
              className="text-slate-400 hover:text-white text-xs no-tap-highlight"
            >
              ← Back
            </button>
            <span className="font-bold text-brand-500 text-xs tracking-tight">Tambola Now</span>
          </header>

          {/* Current number + recent strip */}
          <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
            <RecentNumbers layout="sidebar" />
          </div>

          {/* Compact controls */}
          <div className="flex-none border-t border-slate-800 px-2 pt-2">
            <CallerControls compact />
          </div>
        </aside>

        {/* Board — fills all remaining space */}
        <div className="flex-1 min-h-0 p-2 h-full">
          <NumberBoard />
        </div>
      </div>
    )
  }

  // ─── PORTRAIT: stacked layout ──────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950 max-w-lg mx-auto">
      {/* Header */}
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
                tab === t ? 'bg-brand-500 text-white' : 'text-slate-500 hover:text-slate-300',
              ].join(' ')}
            >
              {t === 'board' ? '🎯 Board' : '🎟 Ticket'}
            </button>
          ))}
        </div>
      </header>

      {/* Recent numbers strip */}
      <div className="flex-none border-b border-slate-800">
        <RecentNumbers layout="horizontal" />
      </div>

      {/* Main content — fills remaining space */}
      <div className="flex-1 min-h-0">
        {tab === 'board' ? (
          <div className="h-full p-2">
            <NumberBoard />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-none px-3 pt-2 border-t border-slate-800">
        <CallerControls />
      </div>
    </div>
  )
}
