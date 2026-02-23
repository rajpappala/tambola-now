import { useGameStore } from '@/store/gameStore'

export default function RecentNumbers() {
  const { currentNumber, calledNumbers, settings, status } = useGameStore()
  const recent = calledNumbers.slice(-settings.recentCount - 1, -1).reverse()

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Current number — prominent circle */}
      {currentNumber !== null ? (
        <div
          key={currentNumber}
          className="flex-none w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] animate-pulse-once"
        >
          <span className="text-2xl font-extrabold text-white leading-none">
            {currentNumber}
          </span>
        </div>
      ) : (
        <div className="flex-none w-14 h-14 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
          <span className="text-slate-600 text-xs text-center leading-tight">
            {status === 'idle' ? 'Start' : '—'}
          </span>
        </div>
      )}

      {/* Recent strip */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {recent.map((n, i) => (
          <div
            key={`${n}-${i}`}
            className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-xs font-bold text-white"
            style={{ opacity: Math.max(0.3, 1 - i * 0.15) }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Counter — pushed to the right */}
      <div className="ml-auto text-right">
        <div className="text-slate-400 text-xs font-medium">{calledNumbers.length} / {settings.numberRange}</div>
        <div className="text-slate-600 text-xs">{settings.numberRange - calledNumbers.length} left</div>
      </div>
    </div>
  )
}
