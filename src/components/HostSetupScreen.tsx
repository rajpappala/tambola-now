import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRoomStore } from '@/store/roomStore'
import { initAudio } from '@/utils/speechEngine'
import type { GameSettings } from '@/types/game'

const DEFAULTS: GameSettings = {
  callInterval: 3,
  mode: 'auto',
  voiceEnabled: true,
  speechRate: 0.85,
  nicknamesEnabled: true,
  chimeEnabled: true,
  recentCount: 5,
  numberRange: 90,
  ticketCount: 1,
}

export default function HostSetupScreen() {
  const goToScreen = useGameStore(s => s.goToScreen)
  const createRoom = useRoomStore(s => s.createRoom)
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS)

  function update(partial: Partial<GameSettings>) {
    setSettings(s => ({ ...s, ...partial }))
  }

  function handleCreateRoom() {
    initAudio()
    createRoom(settings)
    goToScreen('lobby')
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8 gap-6">
      <header className="w-full max-w-sm flex items-center gap-3">
        <button
          onClick={() => goToScreen('home')}
          className="text-slate-400 hover:text-white text-sm no-tap-highlight"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-brand-500">Host a Game</h1>
      </header>

      <div className="w-full max-w-sm space-y-5 bg-slate-900 rounded-2xl p-5">
        {/* Ticket count */}
        <Row label="Tickets per player">
          <Segmented
            options={[1, 2, 3]}
            value={settings.ticketCount}
            onChange={v => update({ ticketCount: v })}
          />
        </Row>

        {/* Number range */}
        <Row label="Number range">
          <Segmented
            options={[90, 100]}
            value={settings.numberRange}
            onChange={v => update({ numberRange: v })}
          />
        </Row>

        {/* Call interval */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Call speed</span>
            <span>{settings.callInterval}s</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={settings.callInterval}
            onChange={e => update({ callInterval: Number(e.target.value) })}
            className="w-full accent-brand-500"
          />
        </div>

        {/* Toggles */}
        <ToggleRow label="Voice announcements" value={settings.voiceEnabled} onChange={v => update({ voiceEnabled: v })} />
        <ToggleRow label="Number nicknames" value={settings.nicknamesEnabled} onChange={v => update({ nicknamesEnabled: v })} />
        <ToggleRow label="Attention chime" value={settings.chimeEnabled} onChange={v => update({ chimeEnabled: v })} />
      </div>

      <button
        onClick={handleCreateRoom}
        className="w-full max-w-sm py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-lg transition-colors no-tap-highlight"
      >
        🏠 Generate Room
      </button>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      {children}
    </div>
  )
}

function Segmented<T extends number>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-700">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={[
            'w-12 py-1.5 text-sm font-bold transition-colors no-tap-highlight',
            value === o ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
          ].join(' ')}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors relative no-tap-highlight ${value ? 'bg-brand-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
