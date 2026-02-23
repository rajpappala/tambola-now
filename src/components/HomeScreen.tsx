import { useGameStore } from '@/store/gameStore'
import { initAudio } from '@/utils/speechEngine'

export default function HomeScreen() {
  const { goToScreen, initGame, generateTickets } = useGameStore()

  function handlePlaySolo() {
    initAudio() // unlock audio on this gesture
    initGame()
    generateTickets(1)
    goToScreen('game')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-10">
      {/* Logo / Title */}
      <div className="text-center space-y-3">
        <div className="text-7xl">🎱</div>
        <h1 className="text-5xl font-extrabold text-brand-500 tracking-tight">
          Tambola Now
        </h1>
        <p className="text-slate-400 text-lg">Family Tambola, made simple.</p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handlePlaySolo}
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-xl transition-colors no-tap-highlight"
        >
          🎮 Play Solo
        </button>

        <button
          disabled
          className="w-full py-4 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xl cursor-not-allowed"
          title="Multiplayer coming soon"
        >
          🏠 Host a Game
          <span className="ml-2 text-xs font-normal text-slate-600">soon</span>
        </button>

        <button
          disabled
          className="w-full py-4 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xl cursor-not-allowed"
          title="Multiplayer coming soon"
        >
          🔗 Join a Game
          <span className="ml-2 text-xs font-normal text-slate-600">soon</span>
        </button>
      </div>

      <p className="text-slate-600 text-sm">No downloads · No sign-ups · Just play</p>
    </div>
  )
}
