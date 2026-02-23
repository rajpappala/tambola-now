import { useGameStore } from '@/store/gameStore'

const COLS = 10

export default function NumberBoard() {
  const { calledNumbers, currentNumber, settings } = useGameStore()
  const total = settings.numberRange

  return (
    <div
      className="grid gap-1 w-full"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const isCurrent = n === currentNumber
        const isCalled = calledNumbers.includes(n)

        return (
          <div
            key={n}
            className={[
              'aspect-square rounded flex items-center justify-center font-bold select-none text-[clamp(10px,2vw,14px)]',
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
