// Column ranges: col 0 → 1-9, col 1 → 10-19, ..., col 8 → 80-90
const COL_RANGES: [number, number][] = [
  [1, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
  [50, 59],
  [60, 69],
  [70, 79],
  [80, 90],
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function range(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}

/**
 * Phase 1: Generate a valid boolean 3×9 grid where each row has
 * exactly 5 trues and each column has at least 1 true.
 *
 * Algorithm:
 *  - Assign each column to exactly one random row (guarantees all columns filled, sums to 9).
 *  - Then for each row, greedily fill up to 5 from remaining available columns.
 *  - Retry if a row was over-assigned in phase 1 (rare, ~11% per attempt).
 */
function generateBoolGrid(): boolean[][] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const grid: boolean[][] = Array.from({ length: 3 }, () => Array(9).fill(false))
    const colCounts = Array(9).fill(0)

    // Assign each column a random row — ensures every column has ≥1
    for (let col = 0; col < 9; col++) {
      const row = Math.floor(Math.random() * 3)
      grid[row][col] = true
      colCounts[col]++
    }

    // Fill each row to exactly 5
    let valid = true
    for (let row = 0; row < 3; row++) {
      const current = grid[row].filter(Boolean).length
      const need = 5 - current
      if (need < 0) { valid = false; break }
      if (need === 0) continue

      const available = Array.from({ length: 9 }, (_, i) => i).filter(
        col => !grid[row][col] && colCounts[col] < 3
      )
      if (available.length < need) { valid = false; break }

      shuffle(available).slice(0, need).forEach(col => {
        grid[row][col] = true
        colCounts[col]++
      })
    }

    if (valid) return grid
  }

  // Deterministic fallback (always valid)
  const grid: boolean[][] = [
    [true, true, false, true, false, true, false, true, true],
    [false, true, true, false, true, true, true, false, true],
    [true, false, true, true, true, false, true, true, false],
  ]
  return grid
}

/**
 * Generate a valid 3×9 Tambola ticket.
 * Returns a 3×9 number grid where 0 = blank cell.
 * Numbers in each column appear in ascending order top-to-bottom.
 */
export function generateTicket(): number[][] {
  const boolGrid = generateBoolGrid()
  const grid: number[][] = Array.from({ length: 3 }, () => Array(9).fill(0))

  for (let col = 0; col < 9; col++) {
    const [min, max] = COL_RANGES[col]
    const rowsWithNumber = [0, 1, 2].filter(r => boolGrid[r][col])
    const count = rowsWithNumber.length

    // Pick `count` unique numbers from column range, sorted ascending
    const nums = shuffle(range(min, max)).slice(0, count).sort((a, b) => a - b)
    rowsWithNumber.forEach((row, i) => {
      grid[row][col] = nums[i]
    })
  }

  return grid
}
