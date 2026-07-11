import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useGameStore } from '@/store/gameStore'
import { useRoomStore } from '@/store/roomStore'
import TicketCard from './TicketCard'

export default function LobbyScreen() {
  const goToScreen = useGameStore(s => s.goToScreen)
  const {
    code, isHost, players, selfId, status, tickets,
    startGame, removePlayer, leaveRoom, markCell,
  } = useRoomStore()

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showTicket, setShowTicket] = useState(false)

  const joinUrl = code ? `${location.origin}${location.pathname}?join=${code}` : ''

  useEffect(() => {
    if (!joinUrl) return
    QRCode.toDataURL(joinUrl, { width: 220, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [joinUrl])

  // Everyone follows the host into the game once it starts
  useEffect(() => {
    if (status !== 'lobby') goToScreen('room-game')
  }, [status, goToScreen])

  function handleCopy() {
    navigator.clipboard.writeText(code ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleLeave() {
    leaveRoom()
    goToScreen('home')
  }

  const whatsappText = encodeURIComponent(
    `Join my Tambola game! Code: ${code}\n${joinUrl}`
  )

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8 gap-6">
      <header className="w-full max-w-sm flex items-center gap-3">
        <button onClick={handleLeave} className="text-slate-400 hover:text-white text-sm no-tap-highlight">
          ← Leave
        </button>
        <h1 className="text-xl font-bold text-brand-500">Game Lobby</h1>
      </header>

      {/* Room code */}
      <button
        onClick={handleCopy}
        className="w-full max-w-sm bg-slate-900 rounded-2xl py-5 flex flex-col items-center gap-1 no-tap-highlight"
      >
        <span className="text-slate-500 text-xs uppercase tracking-wider">Room Code · tap to copy</span>
        <span className="text-4xl font-extrabold tracking-[0.3em] text-white">{code}</span>
        {copied && <span className="text-brand-500 text-xs font-medium">Copied!</span>}
      </button>

      {/* QR + share */}
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-5 flex flex-col items-center gap-4">
        {qrDataUrl && <img src={qrDataUrl} alt="Room QR code" className="rounded-lg bg-white p-2" />}
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-center transition-colors no-tap-highlight"
        >
          💬 Share via WhatsApp
        </a>
        <p className="text-slate-600 text-xs text-center">
          Works across browser tabs on this device for now — connect a backend to play across devices.
        </p>
      </div>

      {/* Player list */}
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-4 space-y-2">
        <span className="text-slate-500 text-xs uppercase tracking-wider">Players ({players.length})</span>
        {players.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
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

      {/* Ticket preview */}
      {tickets.length > 0 && (
        <div className="w-full max-w-sm">
          <button
            onClick={() => setShowTicket(v => !v)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors no-tap-highlight"
          >
            {showTicket ? 'Hide' : 'Preview'} My Ticket{tickets.length > 1 ? 's' : ''}
          </button>
          {showTicket && (
            <div className="mt-3 space-y-3">
              {tickets.map((t, i) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  calledNumbers={[]}
                  onMarkCell={(row, col) => markCell(t.id, row, col)}
                  index={i}
                  total={tickets.length}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Start button (host only) */}
      {isHost ? (
        <button
          onClick={startGame}
          disabled={players.length < 2}
          className="w-full max-w-sm py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-lg transition-colors no-tap-highlight"
        >
          {players.length < 2 ? 'Waiting for players…' : '▶ Start Game'}
        </button>
      ) : (
        <p className="text-slate-400 text-sm">Waiting for the host to start the game…</p>
      )}
    </div>
  )
}
