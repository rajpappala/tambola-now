import type { RoomPlayer, RoomSnapshot } from '@/types/game'

export type RoomMessage =
  | { type: 'join'; player: RoomPlayer }
  | { type: 'leave'; playerId: string }
  | { type: 'state'; snapshot: RoomSnapshot }

const storageKey = (code: string) => `tambola-room-${code}`

/**
 * Same-browser room sync: BroadcastChannel for live updates between tabs,
 * with a localStorage snapshot so a tab opened after messages fired can
 * still hydrate. This is the seam to swap for Firebase Realtime Database
 * later without touching the store/UI layer.
 */
export function openRoomChannel(code: string, onMessage: (msg: RoomMessage) => void) {
  const bc = new BroadcastChannel(`tambola-room-${code}`)
  bc.onmessage = (e: MessageEvent<RoomMessage>) => onMessage(e.data)

  return {
    send(msg: RoomMessage) {
      bc.postMessage(msg)
      if (msg.type === 'state') {
        localStorage.setItem(storageKey(code), JSON.stringify(msg.snapshot))
      }
    },
    readSnapshot(): RoomSnapshot | null {
      const raw = localStorage.getItem(storageKey(code))
      if (!raw) return null
      try {
        return JSON.parse(raw) as RoomSnapshot
      } catch {
        return null
      }
    },
    clearSnapshot() {
      localStorage.removeItem(storageKey(code))
    },
    close() {
      bc.close()
    },
  }
}
