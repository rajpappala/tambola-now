export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'
export type GameMode = 'auto' | 'manual'
export type Screen = 'home' | 'game'

export interface GameSettings {
  callInterval: number // seconds 1–30
  mode: GameMode
  voiceEnabled: boolean
  speechRate: number // 0.5–1.5
  nicknamesEnabled: boolean
  chimeEnabled: boolean
  recentCount: number // how many past numbers to show beside current
  numberRange: number // 90 or 100
}

export interface Ticket {
  id: string
  grid: number[][] // 3×9 — 0 = blank
  markedCells: boolean[][] // 3×9
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
