export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'
export type GameMode = 'auto' | 'manual'
export type Screen = 'home' | 'game' | 'host-setup' | 'lobby' | 'join' | 'room-game'

export interface GameSettings {
  callInterval: number // seconds 1–30
  mode: GameMode
  voiceEnabled: boolean
  speechRate: number // 0.5–1.5
  nicknamesEnabled: boolean
  chimeEnabled: boolean
  recentCount: number // how many past numbers to show beside current
  numberRange: number // 90 or 100
  ticketCount: number // 1–3 tickets per player
}

export interface Ticket {
  id: string
  grid: number[][] // 3×9 — 0 = blank
  markedCells: boolean[][] // 3×9
}

export type RoomStatus = 'lobby' | 'playing' | 'paused' | 'finished'

export interface RoomPlayer {
  id: string
  name: string
  isHost: boolean
}

/** Authoritative room snapshot — written by the host, broadcast to everyone. */
export interface RoomSnapshot {
  code: string
  hostId: string
  players: RoomPlayer[]
  settings: GameSettings
  status: RoomStatus
  calledNumbers: number[]
  currentNumber: number | null
}

export interface RoomStore {
  code: string | null
  isHost: boolean
  selfId: string
  selfName: string
  players: RoomPlayer[]
  settings: GameSettings
  status: RoomStatus
  calledNumbers: number[]
  currentNumber: number | null
  tickets: Ticket[]
  joinError: string | null

  createRoom: (settings: GameSettings) => void
  joinRoom: (code: string, name: string) => boolean
  leaveRoom: () => void
  removePlayer: (playerId: string) => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  callNext: () => void
  markCell: (ticketId: string, row: number, col: number) => void
  clearJoinError: () => void
}

export interface GameStore {
  screen: Screen
  status: GameStatus
  calledNumbers: number[]
  currentNumber: number | null
  pool: number[]
  settings: GameSettings
  tickets: Ticket[]

  goToScreen: (screen: Screen) => void
  initGame: () => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  callNext: () => void
  generateTickets: (count: number) => void
  markCell: (ticketId: string, row: number, col: number) => void
  updateSettings: (partial: Partial<GameSettings>) => void
}
