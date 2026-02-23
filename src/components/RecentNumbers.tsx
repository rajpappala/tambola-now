import { useGameStore } from '@/store/gameStore'

export default function RecentNumbers() {
  const { currentNumber, calledNumbers, settings, status } = useGameStore()
  const recent = calledNumbers.slice(-settings.recentCount - 1, -1).reverse()

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Current number */}
      <div className="flex items-center justify-center">
        {currentNumber !== null ? (
          <div
            key={currentNumber}
            className="w-28 h-28 rounded-full bg-brand-500 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pulse-once"
          >
            <span className="text-5xl font-extrabold text-white leading-none">
              {currentNumber}
            </span>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
            <span className="text-slate-600 text-sm text-center leading-tight">
              {status === 'idle' ? 'Press\nStart' : '—'}
            </span>
          </div>
        )}
      </div>

      {/* Recent strip */}
      {recent.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {recent.map((n, i) => (
            <div
              key={`${n}-${i}`}
              className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-sm font-bold text-white opacity-80"
              style={{ opacity: 1 - i * 0.15 }}
            >
              {n}
            </div>
          ))}
        </div>
      )}

      {/* Numbers remaining */}
      <p className="text-slate-500 text-xs">
        {calledNumbers.length} called · {90 - calledNumbers.length} remaining
      </p>
    </div>
  )
}
