export type PlayerId = 'gukesh' | 'sindarov'

export type EventKind = 'game' | 'rest' | 'tiebreak'

export interface ScheduleEvent {
  id: string
  kind: EventKind
  /** 1–14 for classical games; undefined for rest/tiebreak */
  gameNumber?: number
  /** Local calendar date in Geneva (YYYY-MM-DD) */
  date: string
  /** ISO start time in Europe/Zurich when known */
  startsAtIso?: string
  labelRu: string
}

export interface GameResult {
  gameNumber: number
  startsAt: number
  finished: boolean
  white: PlayerId
  black: PlayerId
  /** Raw status from Lichess, e.g. 1-0, 0-1, ½-½, * */
  status: string
  moves?: number
  opening?: string
  roundId?: string
}

export interface MatchState {
  source: 'lichess' | 'fallback'
  fetchedAt: number
  gukesh: number
  sindarov: number
  games: GameResult[]
  nextHint?: string
  error?: string
}

export const PLAYERS = {
  gukesh: {
    id: 'gukesh' as const,
    name: 'Gukesh',
    fullName: 'Gukesh Dommaraju',
    fed: 'IND',
    rating: 2710,
  },
  sindarov: {
    id: 'sindarov' as const,
    name: 'Sindarov',
    fullName: 'Javokhir Sindarov',
    fed: 'UZB',
    rating: 2782,
  },
}

export const LICHESS_TOUR_ID = 'qfkdt8mn'
export const TARGET_POINTS = 7.5

/** Official FIDE schedule — games at 15:00 CET / CEST (Europe/Zurich). */
export const SCHEDULE: ScheduleEvent[] = [
  {
    id: 'g1',
    kind: 'game',
    gameNumber: 1,
    date: '2026-11-24',
    startsAtIso: '2026-11-24T15:00:00+01:00',
    labelRu: 'Партия 1',
  },
  {
    id: 'g2',
    kind: 'game',
    gameNumber: 2,
    date: '2026-11-25',
    startsAtIso: '2026-11-25T15:00:00+01:00',
    labelRu: 'Партия 2',
  },
  {
    id: 'g3',
    kind: 'game',
    gameNumber: 3,
    date: '2026-11-26',
    startsAtIso: '2026-11-26T15:00:00+01:00',
    labelRu: 'Партия 3',
  },
  {
    id: 'r1',
    kind: 'rest',
    date: '2026-11-27',
    labelRu: 'День отдыха',
  },
  {
    id: 'g4',
    kind: 'game',
    gameNumber: 4,
    date: '2026-11-28',
    startsAtIso: '2026-11-28T15:00:00+01:00',
    labelRu: 'Партия 4',
  },
  {
    id: 'g5',
    kind: 'game',
    gameNumber: 5,
    date: '2026-11-29',
    startsAtIso: '2026-11-29T15:00:00+01:00',
    labelRu: 'Партия 5',
  },
  {
    id: 'g6',
    kind: 'game',
    gameNumber: 6,
    date: '2026-11-30',
    startsAtIso: '2026-11-30T15:00:00+01:00',
    labelRu: 'Партия 6',
  },
  {
    id: 'r2',
    kind: 'rest',
    date: '2026-12-01',
    labelRu: 'День отдыха',
  },
  {
    id: 'g7',
    kind: 'game',
    gameNumber: 7,
    date: '2026-12-02',
    startsAtIso: '2026-12-02T15:00:00+01:00',
    labelRu: 'Партия 7',
  },
  {
    id: 'g8',
    kind: 'game',
    gameNumber: 8,
    date: '2026-12-03',
    startsAtIso: '2026-12-03T15:00:00+01:00',
    labelRu: 'Партия 8',
  },
  {
    id: 'g9',
    kind: 'game',
    gameNumber: 9,
    date: '2026-12-04',
    startsAtIso: '2026-12-04T15:00:00+01:00',
    labelRu: 'Партия 9',
  },
  {
    id: 'r3',
    kind: 'rest',
    date: '2026-12-05',
    labelRu: 'День отдыха',
  },
  {
    id: 'g10',
    kind: 'game',
    gameNumber: 10,
    date: '2026-12-06',
    startsAtIso: '2026-12-06T15:00:00+01:00',
    labelRu: 'Партия 10',
  },
  {
    id: 'g11',
    kind: 'game',
    gameNumber: 11,
    date: '2026-12-07',
    startsAtIso: '2026-12-07T15:00:00+01:00',
    labelRu: 'Партия 11',
  },
  {
    id: 'g12',
    kind: 'game',
    gameNumber: 12,
    date: '2026-12-08',
    startsAtIso: '2026-12-08T15:00:00+01:00',
    labelRu: 'Партия 12',
  },
  {
    id: 'r4',
    kind: 'rest',
    date: '2026-12-09',
    labelRu: 'День отдыха',
  },
  {
    id: 'g13',
    kind: 'game',
    gameNumber: 13,
    date: '2026-12-10',
    startsAtIso: '2026-12-10T15:00:00+01:00',
    labelRu: 'Партия 13',
  },
  {
    id: 'g14',
    kind: 'game',
    gameNumber: 14,
    date: '2026-12-11',
    startsAtIso: '2026-12-11T15:00:00+01:00',
    labelRu: 'Партия 14',
  },
  {
    id: 'tb',
    kind: 'tiebreak',
    date: '2026-12-12',
    labelRu: 'Тай-брейк (если нужно)',
  },
]

/** Game 1: Sindarov white. Odd numbers → Sindarov white. */
export function whiteForGame(gameNumber: number): PlayerId {
  return gameNumber % 2 === 1 ? 'sindarov' : 'gukesh'
}

export function blackForGame(gameNumber: number): PlayerId {
  return whiteForGame(gameNumber) === 'gukesh' ? 'sindarov' : 'gukesh'
}

export function parsePointsFromStatus(
  status: string,
  white: PlayerId,
): { gukesh: number; sindarov: number } | null {
  const normalized = status.replace('1/2', '½').trim()
  if (normalized === '*' || normalized === '' || !normalized) return null

  let whitePts = 0
  let blackPts = 0
  if (normalized === '1-0') {
    whitePts = 1
  } else if (normalized === '0-1') {
    blackPts = 1
  } else if (normalized === '½-½' || normalized === '1/2-1/2') {
    whitePts = 0.5
    blackPts = 0.5
  } else {
    return null
  }

  const black: PlayerId = white === 'gukesh' ? 'sindarov' : 'gukesh'
  const score = { gukesh: 0, sindarov: 0 }
  score[white] += whitePts
  score[black] += blackPts
  return score
}

export function movesFromFen(fen?: string): number | undefined {
  if (!fen) return undefined
  const parts = fen.trim().split(/\s+/)
  const fullmove = Number(parts[5])
  const side = parts[1]
  if (!Number.isFinite(fullmove) || fullmove < 1) return undefined
  // If white to move at fullmove N, last completed was N-1; if black, N already played by white.
  if (side === 'w') return Math.max(0, fullmove - 1)
  return fullmove
}

export function formatScore(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const whole = Math.floor(n)
  const frac = n - whole
  if (Math.abs(frac - 0.5) < 1e-9) {
    return whole === 0 ? '½' : `${whole}½`
  }
  return String(n)
}

export function matchStatusLabel(state: MatchState): string {
  if (state.gukesh >= TARGET_POINTS && state.sindarov < TARGET_POINTS) {
    return 'Чемпион: Gukesh'
  }
  if (state.sindarov >= TARGET_POINTS && state.gukesh < TARGET_POINTS) {
    return 'Чемпион: Sindarov'
  }
  const finished = state.games.filter((g) => g.finished).length
  if (finished >= 14 && state.gukesh === state.sindarov) {
    return 'Тай-брейк'
  }
  if (finished === 0) return 'Матч ещё не начался'
  return 'Матч идёт'
}

export function formatMsk(ts: number, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    ...opts,
  }).format(new Date(ts))
}

export function formatDateMsk(ts: number): string {
  return formatMsk(ts, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
}

export function formatDateTimeMsk(ts: number): string {
  return formatMsk(ts, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateOnlyFromIsoDate(date: string): string {
  // Noon UTC avoids DST edge for calendar-only labels.
  const ts = Date.parse(`${date}T12:00:00Z`)
  return formatMsk(ts, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
}

export function resultLabelRu(status: string, white: PlayerId): string {
  const normalized = status.replace('1/2', '½').trim()
  if (normalized === '½-½' || normalized === '1/2-1/2') return 'Ничья'
  if (normalized === '1-0') {
    return `Победа ${PLAYERS[white].name}`
  }
  if (normalized === '0-1') {
    const black = white === 'gukesh' ? 'sindarov' : 'gukesh'
    return `Победа ${PLAYERS[black].name}`
  }
  if (normalized === '*') return 'Идёт'
  return normalized || '—'
}

export function compactResult(status: string): string {
  return status.replace('1/2', '½').trim() || '—'
}

/** Fallback snapshot when Lichess is unreachable (Game 1 drawn). */
export function fallbackMatchState(error?: string): MatchState {
  const games: GameResult[] = SCHEDULE.filter((e) => e.kind === 'game').map((e) => {
    const n = e.gameNumber!
    const white = whiteForGame(n)
    const startsAt = e.startsAtIso ? Date.parse(e.startsAtIso) : Date.parse(`${e.date}T15:00:00+01:00`)
    if (n === 1) {
      return {
        gameNumber: 1,
        startsAt,
        finished: true,
        white,
        black: blackForGame(1),
        status: '½-½',
        moves: 38,
      }
    }
    return {
      gameNumber: n,
      startsAt,
      finished: false,
      white,
      black: blackForGame(n),
      status: '*',
    }
  })

  return {
    source: 'fallback',
    fetchedAt: Date.now(),
    gukesh: 0.5,
    sindarov: 0.5,
    games,
    error,
  }
}
