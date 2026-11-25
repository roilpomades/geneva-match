import { PLAYERS, type PlayerId } from './data'

export interface DecimalOdds {
  /** Decimal odds, e.g. 2.40 */
  decimal: number
  /** Implied probability 0–1 before margin */
  implied: number
}

export interface GameMarketOdds {
  gameNumber: number
  white: PlayerId
  black: PlayerId
  whiteWin: DecimalOdds
  draw: DecimalOdds
  blackWin: DecimalOdds
  source: string
  asOfLabel: string
}

export interface MatchWinnerOdds {
  gukesh: DecimalOdds
  sindarov: DecimalOdds
  source: string
  asOfLabel: string
}

/** Published match-winner snapshot (bet365 + Kalshi), updated when we refresh the app. */
export const MATCH_WINNER_ODDS: MatchWinnerOdds = {
  // bet365: Sindarov 1/3 → 1.33, Gukesh 9/4 → 3.25; Kalshi ~72% / 28%
  gukesh: { decimal: 3.25, implied: 0.28 },
  sindarov: { decimal: 1.33, implied: 0.72 },
  source: 'bet365 / Kalshi',
  asOfLabel: 'снимок рынка · ноя 2026',
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

function toOdds(p: number, margin = 1.06): DecimalOdds {
  const fair = clamp(p, 0.03, 0.92)
  const implied = fair
  const decimal = Math.round((margin / fair) * 100) / 100
  return { decimal, implied }
}

/**
 * Classic chess 1X2 model from Elo + white bonus.
 * Used for the upcoming game when dedicated bookmaker game markets are unavailable in-browser.
 */
export function gameOddsFromElo(gameNumber: number, white: PlayerId): GameMarketOdds {
  const black: PlayerId = white === 'gukesh' ? 'sindarov' : 'gukesh'
  const whiteElo = PLAYERS[white].rating + 32 // white first-move bonus ≈ +32 Elo
  const blackElo = PLAYERS[black].rating
  const diff = blackElo - whiteElo
  const expectedWhiteScore = 1 / (1 + 10 ** (diff / 400))

  // Classical WCC draw rate is high; shrink slightly with rating gap.
  const draw = clamp(0.58 - Math.abs(diff) * 0.00055, 0.42, 0.62)
  const decisive = 1 - draw
  // Split decisive results by expected score relative to 0.5.
  const whiteShare = clamp(0.5 + (expectedWhiteScore - 0.5) * 1.35, 0.28, 0.72)
  const pWhite = decisive * whiteShare
  const pBlack = decisive * (1 - whiteShare)

  return {
    gameNumber,
    white,
    black,
    whiteWin: toOdds(pWhite),
    draw: toOdds(draw),
    blackWin: toOdds(pBlack),
    source: 'модель Elo (классика)',
    asOfLabel: `партия ${gameNumber} · с маржой ~6%`,
  }
}

export function formatDecimal(n: number): string {
  return n.toFixed(2)
}

export function formatImpliedPct(p: number): string {
  return `${Math.round(p * 100)}%`
}
