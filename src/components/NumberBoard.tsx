import { useGameStore } from '@/store/gameStore'

const COLS = 10

export default function NumberBoard() {
  const { calledNumbers, currentNumber, settings } = useGameStore()
  const total = settings.numberRange
  const rows = Math.ceil(total / COLS) // 9 for 90 numbers

  return (
    // h-full + grid with explicit rows = fills parent, no overflow
    <div
      className="h-full w-full grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const isCurrent = n === currentNumber
        const isCalled = calledNumbers.includes(n)

        return (
          <div
            key={n}
            className={[
              // No aspect-square — let the grid row height determine size
              'flex items-center justify-center rounded font-bold select-none',
              'text-[clamp(8px,1.8vw,15px)]',
              isCurrent
                ? 'bg-brand-500 text-white ring-2 ring-white animate-pulse-once'
                : isCalled
                ? 'bg-green-700 text-white'
                : 'bg-slate-800 text-slate-400',
            ].join(' ')}
          >
            {n}
          </div>
        )
      })}
    </div>
  )
}
