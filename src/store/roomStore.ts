import { create } from 'zustand'
import type { RoomStore, RoomPlayer, RoomSnapshot, GameSettings, Ticket } from '@/types/game'
import { generateTicket } from '@/utils/ticketGenerator'
import { openRoomChannel, type RoomMessage } from '@/lib/roomChannel'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I — avoids read-aloud ambiguity

function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function shuffle(arr: number[]): number[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function freshPool(range: number): number[] {
  return shuffle(Array.from({ length: range }, (_, i) => i + 1))
}

function emptyMarked(): boolean[][] {
  return Array.from({ length: 3 }, () => Array(9).fill(false))
}

function makeTickets(count: number): Ticket[] {
  const clamped = Math.min(3, Math.max(1, count))
  return Array.from({ length: clamped }, (_, i) => ({
    id: `ticket-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    grid: generateTicket(),
    markedCells: emptyMarked(),
  }))
}

let channel: ReturnType<typeof openRoomChannel> | null = null
let hostPool: number[] = []

export const useRoomStore = create<RoomStore>()((set, get) => {
  function broadcastState() {
    const s = get()
    if (!s.isHost || !channel || !s.code) return
    const snapshot: RoomSnapshot = {
      code: s.code,
      hostId: s.selfId,
      players: s.players,
      settings: s.settings,
      status: s.status,
      calledNumbers: s.calledNumbers,
      currentNumber: s.currentNumber,
    }
    channel.send({ type: 'state', snapshot })
  }

  function handleMessage(msg: RoomMessage) {
    const s = get()

    if (msg.type === 'join' && s.isHost) {
      if (s.players.some(p => p.id === msg.player.id)) return
      set({ players: [...s.players, msg.player] })
      broadcastState()
      return
    }

    if (msg.type === 'leave' && s.isHost) {
      set({ players: s.players.filter(p => p.id !== msg.playerId) })
      broadcastState()
      return
    }

    if (msg.type === 'state' && !s.isHost) {
      const wasReset = s.status !== 'lobby' && msg.snapshot.status === 'lobby'
      set({
        players: msg.snapshot.players,
        settings: msg.snapshot.settings,
        status: msg.snapshot.status,
        calledNumbers: msg.snapshot.calledNumbers,
        currentNumber: msg.snapshot.currentNumber,
        tickets: wasReset ? s.tickets.map(t => ({ ...t, markedCells: emptyMarked() })) : s.tickets,
      })
    }
  }

  return {
    code: null,
    isHost: false,
    selfId: '',
    selfName: '',
    players: [],
    settings: {
      callInterval: 3,
      mode: 'auto',
      voiceEnabled: true,
      speechRate: 0.85,
      nicknamesEnabled: true,
      chimeEnabled: true,
      recentCount: 5,
      numberRange: 90,
      ticketCount: 1,
    },
    status: 'lobby',
    calledNumbers: [],
    currentNumber: null,
    tickets: [],
    joinError: null,

    createRoom: (settings: GameSettings) => {
      channel?.close()
      const code = generateRoomCode()
      const selfId = generateId()
      const hostPlayer: RoomPlayer = { id: selfId, name: 'Host', isHost: true }

      channel = openRoomChannel(code, handleMessage)
      hostPool = freshPool(settings.numberRange)

      set({
        code,
        isHost: true,
        selfId,
        selfName: 'Host',
        players: [hostPlayer],
        settings,
        status: 'lobby',
        calledNumbers: [],
        currentNumber: null,
        tickets: makeTickets(settings.ticketCount),
        joinError: null,
      })
      broadcastState()
    },

    joinRoom: (codeInput: string, name: string) => {
      const code = codeInput.trim().toUpperCase()
      channel?.close()
      const tempChannel = openRoomChannel(code, handleMessage)
      const snapshot = tempChannel.readSnapshot()

      if (!snapshot) {
        tempChannel.close()
        set({ joinError: 'Room not found. Check the code and try again.' })
        return false
      }

      const selfId = generateId()
      const player: RoomPlayer = { id: selfId, name: name.trim() || 'Player', isHost: false }

      channel = tempChannel
      set({
        code,
        isHost: false,
        selfId,
        selfName: player.name,
        players: [...snapshot.players, player],
        settings: snapshot.settings,
        status: snapshot.status,
        calledNumbers: snapshot.calledNumbers,
        currentNumber: snapshot.currentNumber,
        tickets: makeTickets(snapshot.settings.ticketCount),
        joinError: null,
      })
      channel.send({ type: 'join', player })
      return true
    },

    leaveRoom: () => {
      const s = get()
      if (channel && !s.isHost && s.code) {
        channel.send({ type: 'leave', playerId: s.selfId })
      }
      channel?.close()
      channel = null
      hostPool = []
      set({
        code: null,
        isHost: false,
        selfId: '',
        selfName: '',
        players: [],
        status: 'lobby',
        calledNumbers: [],
        currentNumber: null,
        tickets: [],
        joinError: null,
      })
    },

    removePlayer: (playerId: string) => {
      const s = get()
      if (!s.isHost) return
      set({ players: s.players.filter(p => p.id !== playerId) })
      broadcastState()
    },

    startGame: () => {
      const s = get()
      if (!s.isHost) return
      if (hostPool.length === 0) hostPool = freshPool(s.settings.numberRange)
      set({ status: 'playing' })
      broadcastState()
    },

    pauseGame: () => {
      if (!get().isHost) return
      set({ status: 'paused' })
      broadcastState()
    },

    resumeGame: () => {
      if (!get().isHost) return
      set({ status: 'playing' })
      broadcastState()
    },

    resetGame: () => {
      const s = get()
      if (!s.isHost) return
      hostPool = freshPool(s.settings.numberRange)
      set({
        status: 'lobby',
        calledNumbers: [],
        currentNumber: null,
        tickets: s.tickets.map(t => ({ ...t, markedCells: emptyMarked() })),
      })
      broadcastState()
    },

    callNext: () => {
      const s = get()
      if (!s.isHost || s.status !== 'playing' || hostPool.length === 0) return
      const number = hostPool[hostPool.length - 1]
      hostPool = hostPool.slice(0, -1)
      const newCalled = [...s.calledNumbers, number]
      set({
        calledNumbers: newCalled,
        currentNumber: number,
        status: hostPool.length === 0 ? 'finished' : s.status,
      })
      broadcastState()
    },

    markCell: (ticketId: string, row: number, col: number) => {
      const { tickets, calledNumbers } = get()
      set({
        tickets: tickets.map(t => {
          if (t.id !== ticketId) return t
          const num = t.grid[row][col]
          if (num === 0 || !calledNumbers.includes(num)) return t
          return {
            ...t,
            markedCells: t.markedCells.map((r, ri) =>
              r.map((cell, ci) => (ri === row && ci === col ? !cell : cell))
            ),
          }
        }),
      })
    },

    clearJoinError: () => set({ joinError: null }),
  }
})
