interface Cell {
  file: string
  ownership: number
}

interface Props {
  cells: Cell[]
  /** Highlight threshold for “strong ownership” legend (default 70). */
  strongThreshold?: number
}

function ownershipFill(pct: number): string {
  const t = Math.max(0, Math.min(100, pct)) / 100
  // Accent purple intensity — never use verified green decoratively.
  const alpha = 0.12 + t * 0.78
  return `rgba(109, 74, 255, ${alpha.toFixed(3)})`
}

function ownershipText(pct: number): string {
  return pct >= 55 ? '#FFFFFF' : '#18181B'
}

/**
 * SVG-ish file × ownership grid for L2 project audit.
 */
export function AuthorshipHeatmap({ cells, strongThreshold = 70 }: Props) {
  if (cells.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-canvas px-4 py-8 text-center text-sm text-muted">
        No authorship cells for this repo.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {cells.map((cell) => (
          <div
            key={cell.file}
            className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 shadow-sm"
            style={{ backgroundColor: ownershipFill(cell.ownership) }}
            title={`${cell.file}: ${cell.ownership}% ownership`}
          >
            <span
              className="truncate font-mono text-[12px] font-medium"
              style={{ color: ownershipText(cell.ownership) }}
            >
              {cell.file}
            </span>
            <span
              className="shrink-0 text-[12px] font-semibold tabular-nums"
              style={{ color: ownershipText(cell.ownership) }}
            >
              {cell.ownership}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ backgroundColor: ownershipFill(20) }}
          />
          Low
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ backgroundColor: ownershipFill(55) }}
          />
          Mid
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ backgroundColor: ownershipFill(90) }}
          />
          Strong (≥{strongThreshold}%)
        </span>
      </div>
    </div>
  )
}
