import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRoomStore } from '@/store/roomStore'
import { initAudio } from '@/utils/speechEngine'

export default function JoinScreen() {
  const goToScreen = useGameStore(s => s.goToScreen)
  const { joinRoom, joinError, clearJoinError } = useRoomStore()

  const prefillCode = new URLSearchParams(location.search).get('join')?.toUpperCase() ?? ''
  const [code, setCode] = useState(prefillCode)
  const [name, setName] = useState('')

  function handleJoin() {
    if (!code.trim() || !name.trim()) return
    initAudio()
    const ok = joinRoom(code, name)
    if (ok) goToScreen('lobby')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-full max-w-xs flex items-center gap-3 self-start">
        <button onClick={() => goToScreen('home')} className="text-slate-400 hover:text-white text-sm no-tap-highlight">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-brand-500">Join a Game</h1>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-1">
          <label className="text-slate-400 text-xs uppercase tracking-wider">Room Code</label>
          <input
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 6)); clearJoinError() }}
            placeholder="ABC123"
            autoFocus
            className="w-full text-center text-2xl font-extrabold tracking-[0.3em] py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 text-xs uppercase tracking-wider">Your Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value.slice(0, 20))}
            placeholder="e.g. Priya"
            className="w-full text-center text-lg py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500"
          />
        </div>

        {joinError && <p className="text-red-400 text-sm text-center">{joinError}</p>}

        <button
          onClick={handleJoin}
          disabled={!code.trim() || !name.trim()}
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xl transition-colors no-tap-highlight"
        >
          Join Game
        </button>
      </div>
    </div>
  )
}
