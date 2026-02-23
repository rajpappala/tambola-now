import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { initAudio, playChime, announceNumber } from '@/utils/speechEngine'
import { getNickname } from '@/utils/nicknames'

interface Props {
  compact?: boolean // landscape sidebar mode
}

export default function CallerControls({ compact = false }: Props) {
  const {
    status, settings, currentNumber,
    startGame, pauseGame, resumeGame, resetGame, callNext,
    updateSettings,
  } = useGameStore()

  const [showReset, setShowReset] = useState(false)
  const prevNumberRef = useRef<number | null>(null)

  // Auto-call interval
  useEffect(() => {
    if (status !== 'playing' || settings.mode !== 'auto') return
    const id = setInterval(callNext, settings.callInterval * 1000)
    return () => clearInterval(id)
  }, [status, settings.mode, settings.callInterval, callNext])

  // Voice announcement on new number
  useEffect(() => {
    if (!currentNumber || currentNumber === prevNumberRef.current) return
    prevNumberRef.current = currentNumber
    if (!settings.voiceEnabled) return

    const nickname = settings.nicknamesEnabled ? getNickname(currentNumber) : null
    if (settings.chimeEnabled) {
      playChime().then(() => announceNumber(currentNumber, nickname, settings.speechRate))
    } else {
      announceNumber(currentNumber, nickname, settings.speechRate)
    }
  }, [currentNumber, settings])

  function handleStart() { initAudio(); startGame() }
  function handleReset() {
    if (!showReset) { setShowReset(true); return }
    resetGame(); setShowReset(false)
  }

  const isIdle = status === 'idle'
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isFinished = status === 'finished'

  const btnBase = compact
    ? 'flex-1 py-1.5 rounded-lg font-bold text-sm transition-all no-tap-highlight'
    : 'flex-1 py-3 rounded-xl font-bold text-lg transition-all no-tap-highlight'

  const resetBtn = compact
    ? 'py-1.5 px-3 rounded-lg font-bold text-sm transition-all no-tap-highlight'
    : 'py-3 px-4 rounded-xl font-bold text-lg transition-all no-tap-highlight'

  return (
    <div className={compact ? 'space-y-1.5 pb-1' : 'space-y-2 pb-2'}>
      {/* Main action buttons */}
      <div className="flex gap-1.5 justify-center">
        {isIdle && (
          <button onClick={handleStart} className={`${btnBase} bg-brand-500 hover:bg-brand-600 active:scale-95 text-white`}>
            ▶ Start
          </button>
        )}
        {isPlaying && (
          <button onClick={pauseGame} className={`${btnBase} bg-yellow-600 hover:bg-yellow-700 active:scale-95 text-white`}>
            ⏸ Pause
          </button>
        )}
        {isPaused && (
          <button onClick={resumeGame} className={`${btnBase} bg-brand-500 hover:bg-brand-600 active:scale-95 text-white`}>
            ▶ Resume
          </button>
        )}
        {isFinished && (
          <div className={`${btnBase} bg-green-700 text-white text-center`}>🎉 Done!</div>
        )}
        {(settings.mode === 'manual' || isPaused) && !isIdle && !isFinished && (
          <button onClick={callNext} className={`${btnBase} bg-slate-700 hover:bg-slate-600 active:scale-95 text-white`}>
            Next ▶
          </button>
        )}
        <button
          onClick={handleReset}
          onBlur={() => setShowReset(false)}
          className={`${resetBtn} ${showReset ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          {showReset ? (compact ? '✓' : 'Confirm?') : '↺'}
        </button>
      </div>

      {/* Settings panel */}
      <div className={`bg-slate-900 rounded-xl ${compact ? 'p-2 space-y-1.5' : 'p-2.5 space-y-2'}`}>
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Mode</span>
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(['auto', 'manual'] as const).map(m => (
              <button
                key={m}
                onClick={() => updateSettings({ mode: m })}
                className={[
                  'px-3 py-1 text-xs font-medium transition-colors capitalize no-tap-highlight',
                  settings.mode === m
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
                ].join(' ')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Speed slider */}
        {settings.mode === 'auto' && (
          <div className="space-y-0.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Speed</span>
              <span>{settings.callInterval}s</span>
            </div>
            <input
              type="range" min={1} max={30} value={settings.callInterval}
              onChange={e => updateSettings({ callInterval: Number(e.target.value) })}
              className="w-full accent-brand-500"
            />
          </div>
        )}

        {/* Voice + Nicknames toggles — hidden in compact if no space */}
        {!compact && (
          <>
            <ToggleRow
              label="Voice"
              value={settings.voiceEnabled}
              onChange={v => updateSettings({ voiceEnabled: v })}
            />
            <ToggleRow
              label="Nicknames"
              value={settings.nicknamesEnabled}
              onChange={v => updateSettings({ nicknamesEnabled: v })}
            />
          </>
        )}
        {compact && (
          <div className="flex gap-3">
            <button
              onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`flex-1 py-1 rounded text-xs font-medium no-tap-highlight ${settings.voiceEnabled ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'}`}
            >
              🔊 Voice
            </button>
            <button
              onClick={() => updateSettings({ nicknamesEnabled: !settings.nicknamesEnabled })}
              className={`flex-1 py-1 rounded text-xs font-medium no-tap-highlight ${settings.nicknamesEnabled ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'}`}
            >
              💬 Names
            </button>
          </div>
        )}
      </div>
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
