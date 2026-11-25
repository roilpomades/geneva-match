import {
  LICHESS_TOUR_ID,
  SCHEDULE,
  blackForGame,
  derivePhase,
  fallbackMatchState,
  movesFromFen,
  parsePointsFromStatus,
  whiteForGame,
  type GameResult,
  type MatchState,
  type PlayerId,
} from './data'

interface LichessRoundMeta {
  id: string
  name: string
  slug: string
  finished?: boolean
  ongoing?: boolean
  startsAt?: number
  finishedAt?: number
}

interface LichessTourResponse {
  tour: { id: string; name: string }
  rounds: LichessRoundMeta[]
}

interface LichessGame {
  id: string
  name: string
  fen?: string
  status?: string
  lastMove?: string
  players?: Array<{ name: string; fed?: string }>
}

interface LichessRoundResponse {
  round: LichessRoundMeta
  games: LichessGame[]
}

const UA = 'geneva-match-dashboard (cursor-cloud-agent; chess-wcc-2026)'
const STARTING_FEN_PREFIX = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': UA,
    },
  })
  if (!res.ok) {
    throw new Error(`Lichess ${res.status}: ${url}`)
  }
  return res.json() as Promise<T>
}

function gameNumberFromRound(round: LichessRoundMeta): number | null {
  const fromName = round.name.match(/(\d+)/)
  if (fromName) return Number(fromName[1])
  const fromSlug = round.slug.match(/(\d+)/)
  if (fromSlug) return Number(fromSlug[1])
  return null
}

function detectWhite(game: LichessGame, fallback: PlayerId): PlayerId {
  const whiteName = (game.players?.[0]?.name ?? game.name.split('-')[0] ?? '').toLowerCase()
  if (whiteName.includes('gukesh')) return 'gukesh'
  if (whiteName.includes('sindarov')) return 'sindarov'
  return fallback
}

function scheduleStart(gameNumber: number): number {
  const ev = SCHEDULE.find((e) => e.kind === 'game' && e.gameNumber === gameNumber)
  if (ev?.startsAtIso) return Date.parse(ev.startsAtIso)
  return Date.now()
}

function isLiveGame(
  meta: LichessRoundMeta | undefined,
  game: LichessGame | undefined,
  finished: boolean,
  startsAt: number,
  now: number,
): boolean {
  if (finished) return false
  if (meta?.ongoing) return true
  const status = game?.status ?? '*'
  if (status !== '*' && status !== '') return false
  const fen = game?.fen ?? ''
  const hasMoves = Boolean(game?.lastMove) || (fen && !fen.startsWith(STARTING_FEN_PREFIX))
  // Live if moves already played, or clock window after official start (with 2h grace before end-of-day).
  if (hasMoves) return true
  if (now >= startsAt && now < startsAt + 7 * 60 * 60 * 1000) return true
  return false
}

export async function loadMatchState(): Promise<MatchState> {
  try {
    const tour = await fetchJson<LichessTourResponse>(
      `https://lichess.org/api/broadcast/${LICHESS_TOUR_ID}`,
    )

    const roundByGame = new Map<number, LichessRoundMeta>()
    for (const round of tour.rounds ?? []) {
      const n = gameNumberFromRound(round)
      if (n != null) roundByGame.set(n, round)
    }

    const now = Date.now()
    const roundsToFetch = [...roundByGame.entries()].filter(([, r]) => {
      if (r.finished || r.ongoing) return true
      const start = r.startsAt ?? 0
      // Current / imminent / recently started unfinished rounds
      return start > 0 && start <= now + 6 * 60 * 60 * 1000
    })

    const roundDetails = await Promise.all(
      roundsToFetch.map(async ([, round]) => {
        const detail = await fetchJson<LichessRoundResponse>(
          `https://lichess.org/api/broadcast/-/-/${round.id}`,
        )
        return detail
      }),
    )

    const detailById = new Map(roundDetails.map((d) => [d.round.id, d]))

    let gukesh = 0
    let sindarov = 0
    const games: GameResult[] = []

    for (let n = 1; n <= 14; n++) {
      const meta = roundByGame.get(n)
      const detail = meta ? detailById.get(meta.id) : undefined
      const game = detail?.games?.[0]
      const white = game ? detectWhite(game, whiteForGame(n)) : whiteForGame(n)
      const startsAt = meta?.startsAt ?? scheduleStart(n)
      const finished = Boolean(meta?.finished)
      const status = finished ? (game?.status ?? '½-½') : (game?.status ?? '*')
      const fen = game?.fen
      const live = isLiveGame(meta, game, finished, startsAt, now)

      if (finished) {
        const pts = parsePointsFromStatus(status, white)
        if (pts) {
          gukesh += pts.gukesh
          sindarov += pts.sindarov
        }
      }

      games.push({
        gameNumber: n,
        startsAt,
        finished,
        white,
        black: blackForGame(n),
        status,
        moves: movesFromFen(fen),
        roundId: meta?.id,
        fen,
        live,
      })
    }

    return {
      source: 'lichess',
      fetchedAt: Date.now(),
      gukesh,
      sindarov,
      games,
      phase: derivePhase(games, now),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Сеть недоступна'
    return fallbackMatchState(message)
  }
}
