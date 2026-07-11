import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRoomStore } from '@/store/roomStore'
import { initAudio, playChime, announceNumber } from '@/utils/speechEngine'
import { getNickname } from '@/utils/nicknames'
import RecentNumbers from './RecentNumbers'
import NumberBoard from './NumberBoard'
import TicketCard from './TicketCard'

type Tab = 'board' | 'ticket' | 'players'

export default function RoomGameScreen() {
  const goToScreen = useGameStore(s => s.goToScreen)
  const {
    code, isHost, players, selfId, settings, status,
    calledNumbers, currentNumber, tickets,
    startGame, pauseGame, resumeGame, resetGame, callNext, markCell, removePlayer, leaveRoom,
  } = useRoomStore()

  const [tab, setTab] = useState<Tab>('board')
  const prevNumberRef = useRef<number | null>(null)

  // Host-only auto-call interval
  useEffect(() => {
    if (!isHost || status !== 'playing' || settings.mode !== 'auto') return
    const id = setInterval(callNext, settings.callInterval * 1000)
    return () => clearInterval(id)
  }, [isHost, status, settings.mode, settings.callInterval, callNext])

  // Every device announces the current number locally, in sync via the broadcast
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

  function handleLeave() {
    leaveRoom()
    goToScreen('home')
  }

  function handleStart() {
    initAudio()
    startGame()
  }

  const isIdle = status === 'lobby'
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isFinished = status === 'finished'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <button onClick={handleLeave} className="text-slate-400 hover:text-white text-sm no-tap-highlight">
          ← Leave
        </button>
        <span className="text-slate-500 text-xs font-mono tracking-widest">{code}</span>
        <div className="flex gap-2">
          {(['board', 'ticket', 'players'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors no-tap-highlight',
                tab === t ? 'bg-brand-500 text-white' : 'text-slate-500 hover:text-slate-300',
              ].join(' ')}
            >
              {t === 'board' ? '🎯' : t === 'ticket' ? '🎟' : '👥'} {players.length && t === 'players' ? players.length : ''}
            </button>
          ))}
        </div>
      </header>

      {/* Recent numbers strip */}
      <div className="flex-none border-b border-slate-800">
        <RecentNumbers
          layout="horizontal"
          currentNumber={currentNumber}
          calledNumbers={calledNumbers}
          recentCount={settings.recentCount}
          totalRange={settings.numberRange}
          isIdle={isIdle}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0">
        {tab === 'board' && (
          <div className="h-full p-2">
            <NumberBoard calledNumbers={calledNumbers} currentNumber={currentNumber} numberRange={settings.numberRange} />
          </div>
        )}

        {tab === 'ticket' && (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            {tickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                calledNumbers={calledNumbers}
                onMarkCell={(row, col) => markCell(ticket.id, row, col)}
                index={i}
                total={tickets.length}
              />
            ))}
          </div>
        )}

        {tab === 'players' && (
          <div className="h-full overflow-y-auto p-3 space-y-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium">
                  {p.name} {p.id === selfId && <span className="text-slate-500">(you)</span>}
                  {p.isHost && <span className="ml-2 text-xs text-brand-500">HOST</span>}
                </span>
                {isHost && !p.isHost && (
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="text-slate-500 hover:text-red-400 text-xs no-tap-highlight"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-none px-3 py-2 border-t border-slate-800 space-y-2">
        {isHost ? (
          <div className="flex gap-1.5 justify-center">
            {isIdle && (
              <button onClick={handleStart} className="flex-1 py-3 rounded-xl font-bold text-lg bg-brand-500 hover:bg-brand-600 active:scale-95 text-white no-tap-highlight">
                ▶ Start
              </button>
            )}
            {isPlaying && (
              <button onClick={pauseGame} className="flex-1 py-3 rounded-xl font-bold text-lg bg-yellow-600 hover:bg-yellow-700 active:scale-95 text-white no-tap-highlight">
                ⏸ Pause
              </button>
            )}
            {isPaused && (
              <button onClick={resumeGame} className="flex-1 py-3 rounded-xl font-bold text-lg bg-brand-500 hover:bg-brand-600 active:scale-95 text-white no-tap-highlight">
                ▶ Resume
              </button>
            )}
            {isFinished && (
              <div className="flex-1 py-3 rounded-xl font-bold text-lg bg-green-700 text-white text-center">🎉 Done!</div>
            )}
            {(settings.mode === 'manual' || isPaused) && !isIdle && !isFinished && (
              <button onClick={callNext} className="flex-1 py-3 rounded-xl font-bold text-lg bg-slate-700 hover:bg-slate-600 active:scale-95 text-white no-tap-highlight">
                Next ▶
              </button>
            )}
            <button
              onClick={resetGame}
              className="py-3 px-4 rounded-xl font-bold text-lg bg-slate-800 text-slate-400 hover:bg-slate-700 no-tap-highlight"
            >
              ↺
            </button>
          </div>
        ) : (
          <p className="text-center text-slate-500 text-sm py-2">
            {isFinished ? '🎉 Game over!' : isPaused ? 'Host paused the game' : 'Host is calling numbers…'}
          </p>
        )}
      </div>
    </div>
  )
}
