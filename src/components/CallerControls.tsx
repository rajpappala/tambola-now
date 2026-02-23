import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { initAudio, playChime, announceNumber } from '@/utils/speechEngine'
import { getNickname } from '@/utils/nicknames'

export default function CallerControls() {
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

  function handleStart() {
    initAudio()
    startGame()
  }

  function handleReset() {
    if (!showReset) { setShowReset(true); return }
    resetGame()
    setShowReset(false)
  }

  const isIdle = status === 'idle'
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isFinished = status === 'finished'

  return (
    <div className="space-y-4 pb-4">
      {/* Main controls */}
      <div className="flex gap-2 justify-center">
        {/* Start / Pause / Resume */}
        {isIdle && (
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-lg transition-all no-tap-highlight"
          >
            ▶ Start
          </button>
        )}
        {isPlaying && (
          <button
            onClick={pauseGame}
            className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 active:scale-95 text-white font-bold text-lg transition-all no-tap-highlight"
          >
            ⏸ Pause
          </button>
        )}
        {isPaused && (
          <button
            onClick={resumeGame}
            className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-lg transition-all no-tap-highlight"
          >
            ▶ Resume
          </button>
        )}
        {isFinished && (
          <div className="flex-1 py-3 rounded-xl bg-green-700 text-white font-bold text-lg text-center">
            🎉 All numbers called!
          </div>
        )}

        {/* Next (manual mode or when paused) */}
        {(settings.mode === 'manual' || isPaused) && !isIdle && !isFinished && (
          <button
            onClick={callNext}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-bold text-lg transition-all no-tap-highlight"
          >
            Next ▶
          </button>
        )}

        {/* Reset */}
        <button
          onClick={handleReset}
          onBlur={() => setShowReset(false)}
          className={[
            'py-3 px-4 rounded-xl font-bold text-lg transition-all no-tap-highlight',
            showReset
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400',
          ].join(' ')}
        >
          {showReset ? 'Confirm?' : '↺'}
        </button>
      </div>

      {/* Speed + mode controls */}
      <div className="space-y-3 bg-slate-900 rounded-xl p-3">
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Mode</span>
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(['auto', 'manual'] as const).map(m => (
              <button
                key={m}
                onClick={() => updateSettings({ mode: m })}
                className={[
                  'px-4 py-1.5 text-sm font-medium transition-colors capitalize no-tap-highlight',
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

        {/* Speed slider — auto mode only */}
        {settings.mode === 'auto' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Speed</span>
              <span>{settings.callInterval}s / number</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={settings.callInterval}
              onChange={e => updateSettings({ callInterval: Number(e.target.value) })}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>Fast (1s)</span>
              <span>Slow (30s)</span>
            </div>
          </div>
        )}

        {/* Voice toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Voice</span>
          <button
            onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className={[
              'w-12 h-6 rounded-full transition-colors relative no-tap-highlight',
              settings.voiceEnabled ? 'bg-brand-500' : 'bg-slate-700',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5',
              ].join(' ')}
            />
          </button>
        </div>

        {/* Nicknames toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Nicknames</span>
          <button
            onClick={() => updateSettings({ nicknamesEnabled: !settings.nicknamesEnabled })}
            className={[
              'w-12 h-6 rounded-full transition-colors relative no-tap-highlight',
              settings.nicknamesEnabled ? 'bg-brand-500' : 'bg-slate-700',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                settings.nicknamesEnabled ? 'translate-x-6' : 'translate-x-0.5',
              ].join(' ')}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
