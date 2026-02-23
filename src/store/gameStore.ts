import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameStore, GameSettings, Screen, Ticket } from '@/types/game'
import { generateTicket } from '@/utils/ticketGenerator'

const DEFAULT_SETTINGS: GameSettings = {
  callInterval: 3,
  mode: 'auto',
  voiceEnabled: true,
  speechRate: 0.85,
  nicknamesEnabled: true,
  chimeEnabled: true,
  recentCount: 5,
  numberRange: 90,
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

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'home',
      status: 'idle',
      calledNumbers: [],
      currentNumber: null,
      pool: [],
      settings: DEFAULT_SETTINGS,
      tickets: [],

      goToScreen: (screen: Screen) => set({ screen }),

      initGame: () => {
        const { settings } = get()
        set({
          status: 'idle',
          calledNumbers: [],
          currentNumber: null,
          pool: freshPool(settings.numberRange),
        })
      },

      startGame: () => {
        const { pool, settings } = get()
        if (pool.length === 0) {
          set({ pool: freshPool(settings.numberRange) })
        }
        set({ status: 'playing' })
      },

      pauseGame: () => set({ status: 'paused' }),

      resumeGame: () => set({ status: 'playing' }),

      resetGame: () => {
        const { settings, tickets } = get()
        set({
          status: 'idle',
          calledNumbers: [],
          currentNumber: null,
          pool: freshPool(settings.numberRange),
          tickets: tickets.map(t => ({ ...t, markedCells: emptyMarked() })),
        })
      },

      callNext: () => {
        const { pool, calledNumbers, status } = get()
        if (pool.length === 0 || status === 'finished') return

        const number = pool[pool.length - 1]
        const newPool = pool.slice(0, -1)
        const newCalled = [...calledNumbers, number]

        set({
          pool: newPool,
          calledNumbers: newCalled,
          currentNumber: number,
          status: newPool.length === 0 ? 'finished' : status,
        })
      },

      generateTickets: (count: number) => {
        const tickets: Ticket[] = Array.from({ length: count }, (_, i) => ({
          id: `ticket-${i}-${Date.now()}`,
          grid: generateTicket(),
          markedCells: emptyMarked(),
        }))
        set({ tickets })
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
                r.map((cell: boolean, ci: number) =>
                  ri === row && ci === col ? !cell : cell
                )
              ),
            }
          }),
        })
      },

      updateSettings: (partial: Partial<GameSettings>) => {
        set(state => ({ settings: { ...state.settings, ...partial } }))
      },
    }),
    {
      name: 'tambola-now-state',
      partialize: state => ({ settings: state.settings }),
    }
  )
)
