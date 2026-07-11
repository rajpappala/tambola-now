interface Props {
  layout?: 'horizontal' | 'sidebar'
  currentNumber: number | null
  calledNumbers: number[]
  recentCount: number
  totalRange: number
  isIdle: boolean
}

export default function RecentNumbers({
  layout = 'horizontal',
  currentNumber,
  calledNumbers,
  recentCount,
  totalRange,
  isIdle,
}: Props) {
  const recent = calledNumbers.slice(-recentCount - 1, -1).reverse()

  if (layout === 'sidebar') {
    return (
      <div className="flex flex-col items-center gap-3 py-4 px-2">
        {/* Big current number */}
        {currentNumber !== null ? (
          <div
            key={currentNumber}
            className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.5)] animate-pulse-once"
          >
            <span className="text-3xl font-extrabold text-white leading-none">
              {currentNumber}
            </span>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
            <span className="text-slate-600 text-xs text-center">
              {isIdle ? 'Start' : '—'}
            </span>
          </div>
        )}

        {/* Recent strip */}
        {recent.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {recent.map((n, i) => (
              <div
                key={`${n}-${i}`}
                className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-xs font-bold text-white"
                style={{ opacity: Math.max(0.3, 1 - i * 0.15) }}
              >
                {n}
              </div>
            ))}
          </div>
        )}

        <p className="text-slate-500 text-xs text-center">
          {calledNumbers.length} / {totalRange}
        </p>
      </div>
    )
  }

  // Horizontal layout (portrait)
  return (
    <div className="flex items-center gap-3 px-4 py-2">
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
            {isIdle ? 'Start' : '—'}
          </span>
        </div>
      )}

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

      <div className="ml-auto text-right">
        <div className="text-slate-400 text-xs font-medium">
          {calledNumbers.length} / {totalRange}
        </div>
        <div className="text-slate-600 text-xs">
          {totalRange - calledNumbers.length} left
        </div>
      </div>
    </div>
  )
}
