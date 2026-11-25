export interface PositionEval {
  fen: string
  /** Centipawns from White's perspective; null if mate line */
  cp: number | null
  mate: number | null
  depth?: number
  knodes?: number
}

const UA = 'geneva-match-dashboard (cursor-cloud-agent; chess-wcc-2026)'

export async function fetchCloudEval(fen: string): Promise<PositionEval | null> {
  try {
    const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': UA },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      fen: string
      knodes?: number
      depth?: number
      pvs?: Array<{ cp?: number; mate?: number; moves?: string }>
    }
    const pv = data.pvs?.[0]
    if (!pv) return null
    return {
      fen: data.fen,
      cp: typeof pv.cp === 'number' ? pv.cp : null,
      mate: typeof pv.mate === 'number' ? pv.mate : null,
      depth: data.depth,
      knodes: data.knodes,
    }
  } catch {
    return null
  }
}

/** Human label from White's POV, then mapped to player names. */
export function formatEvalForPlayers(
  ev: PositionEval,
  whiteName: string,
  blackName: string,
): { bar: number; label: string; side: 'white' | 'black' | 'equal' } {
  if (ev.mate != null) {
    const side = ev.mate > 0 ? 'white' : 'black'
    const who = side === 'white' ? whiteName : blackName
    return {
      bar: side === 'white' ? 1 : 0,
      label: `Мат в ${Math.abs(ev.mate)} · лучше ${who}`,
      side,
    }
  }
  const cp = ev.cp ?? 0
  // Map ±300cp to full bar.
  const bar = Math.min(1, Math.max(0, 0.5 + cp / 600))
  if (Math.abs(cp) < 25) {
    return { bar, label: 'Равно (~0.00)', side: 'equal' }
  }
  const pawns = (Math.abs(cp) / 100).toFixed(2)
  const who = cp > 0 ? whiteName : blackName
  const sign = cp > 0 ? '+' : '−'
  return {
    bar,
    label: `${sign}${pawns} · лучше ${who}`,
    side: cp > 0 ? 'white' : 'black',
  }
}
