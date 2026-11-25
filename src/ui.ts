import {
  PLAYERS,
  SCHEDULE,
  compactResult,
  formatCountdown,
  formatDateMsk,
  formatDateOnlyFromIsoDate,
  formatDateTimeMsk,
  formatScore,
  matchStatusLabel,
  resultLabelRu,
  type MatchState,
  type PlayerId,
  type ScheduleEvent,
} from './data'
import { formatEvalForPlayers, type PositionEval } from './eval'
import {
  MATCH_WINNER_ODDS,
  formatDecimal,
  formatImpliedPct,
  gameOddsFromElo,
  type GameMarketOdds,
} from './odds'

export interface UiExtras {
  positionEval?: PositionEval | null
  evalLoading?: boolean
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function finishedGameNumbers(state: MatchState): Set<number> {
  return new Set(state.games.filter((g) => g.finished).map((g) => g.gameNumber))
}

function upcomingEvents(state: MatchState): ScheduleEvent[] {
  const done = finishedGameNumbers(state)
  const now = Date.now()
  return SCHEDULE.filter((ev) => {
    if (ev.kind === 'game' && ev.gameNumber != null) {
      return !done.has(ev.gameNumber)
    }
    const dayEnd = Date.parse(`${ev.date}T23:59:59+03:00`)
    return dayEnd >= now - 12 * 60 * 60 * 1000
  })
}

function pastDateEvents(state: MatchState): ScheduleEvent[] {
  const done = finishedGameNumbers(state)
  return SCHEDULE.filter((ev) => {
    if (ev.kind === 'game' && ev.gameNumber != null) {
      return done.has(ev.gameNumber)
    }
    if (ev.kind === 'rest') {
      const dayEnd = Date.parse(`${ev.date}T23:59:59+03:00`)
      return dayEnd < Date.now()
    }
    return false
  })
}

function flagName(id: PlayerId): string {
  const p = PLAYERS[id]
  return `<span class="flag" title="${p.fed}" aria-label="${p.fed}">${p.flag}</span> ${escapeHtml(p.name)}`
}

function renderPhasePanel(state: MatchState, extras: UiExtras): string {
  const phase = state.phase

  if (phase.kind === 'live' && phase.gameNumber != null) {
    const white = phase.white ?? 'gukesh'
    const black = phase.black ?? 'sindarov'
    const moves = phase.moves != null ? `${phase.moves} ходов` : 'партия началась'
    let evalBlock = ''
    if (extras.evalLoading) {
      evalBlock = `<p class="eval-meta">Считаем оценку Lichess…</p>`
    } else if (extras.positionEval) {
      const formatted = formatEvalForPlayers(
        extras.positionEval,
        PLAYERS[white].name,
        PLAYERS[black].name,
      )
      const depth = extras.positionEval.depth
        ? ` · глубина ${extras.positionEval.depth}`
        : ''
      evalBlock = `
        <div class="eval-block">
          <div class="eval-bar" aria-hidden="true">
            <div class="eval-fill" style="width:${(formatted.bar * 100).toFixed(1)}%"></div>
          </div>
          <p class="eval-label">${escapeHtml(formatted.label)}</p>
          <p class="eval-meta">Cloud eval Lichess${escapeHtml(depth)}</p>
        </div>`
    } else {
      evalBlock = `<p class="eval-meta">Оценка позиции пока недоступна</p>`
    }

    return `
      <section class="pulse live" aria-live="polite">
        <div class="pulse-head">
          <span class="live-dot" aria-hidden="true"></span>
          <h2>Партия ${phase.gameNumber} идёт</h2>
        </div>
        <p class="pulse-sub">
          Белые: ${flagName(white)} · чёрные: ${flagName(black)} · ${escapeHtml(moves)}
        </p>
        ${evalBlock}
      </section>`
  }

  if (phase.kind === 'countdown' || phase.kind === 'rest') {
    const startsAt = phase.startsAt ?? Date.now()
    const title =
      phase.kind === 'rest'
        ? 'День отдыха'
        : `До партии ${phase.gameNumber ?? ''}`
    const white = phase.white
    const colorLine =
      white != null
        ? `<p class="pulse-sub">Белые: ${flagName(white)} · старт ${escapeHtml(formatDateTimeMsk(startsAt))} MSK</p>`
        : `<p class="pulse-sub">Старт ${escapeHtml(formatDateTimeMsk(startsAt))} MSK</p>`

    return `
      <section class="pulse countdown" aria-live="polite">
        <div class="pulse-head">
          <h2>${escapeHtml(title.trim())}</h2>
        </div>
        ${colorLine}
        <p class="countdown-clock" id="countdown-clock" data-starts-at="${startsAt}">
          ${escapeHtml(formatCountdown(startsAt - Date.now()))}
        </p>
        <p class="eval-meta">Обратный отсчёт по Москве</p>
      </section>`
  }

  return `
    <section class="pulse">
      <div class="pulse-head"><h2>Матч завершён</h2></div>
    </section>`
}

function renderOdds(state: MatchState): string {
  const next = state.games.find((g) => !g.finished)
  let gameOdds: GameMarketOdds | null = null
  if (next) {
    gameOdds = gameOddsFromElo(next.gameNumber, next.white)
  }

  const match = MATCH_WINNER_ODDS
  const gameBlock = gameOdds
    ? `
      <div class="odds-card">
        <h3>На партию ${gameOdds.gameNumber}</h3>
        <p class="odds-note">${escapeHtml(gameOdds.source)} · ${escapeHtml(gameOdds.asOfLabel)}</p>
        <ul class="odds-rows">
          <li>
            <span>${flagName(gameOdds.white)} победа</span>
            <strong>${formatDecimal(gameOdds.whiteWin.decimal)}</strong>
            <em>${formatImpliedPct(gameOdds.whiteWin.implied)}</em>
          </li>
          <li>
            <span>Ничья</span>
            <strong>${formatDecimal(gameOdds.draw.decimal)}</strong>
            <em>${formatImpliedPct(gameOdds.draw.implied)}</em>
          </li>
          <li>
            <span>${flagName(gameOdds.black)} победа</span>
            <strong>${formatDecimal(gameOdds.blackWin.decimal)}</strong>
            <em>${formatImpliedPct(gameOdds.blackWin.implied)}</em>
          </li>
        </ul>
      </div>`
    : ''

  return `
    <section class="section odds-section" aria-labelledby="odds-heading">
      <h2 id="odds-heading">Коэффициенты</h2>
      ${gameBlock}
      <div class="odds-card">
        <h3>Победитель матча</h3>
        <p class="odds-note">${escapeHtml(match.source)} · ${escapeHtml(match.asOfLabel)}</p>
        <ul class="odds-rows">
          <li>
            <span>${flagName('gukesh')}</span>
            <strong>${formatDecimal(match.gukesh.decimal)}</strong>
            <em>${formatImpliedPct(match.gukesh.implied)}</em>
          </li>
          <li>
            <span>${flagName('sindarov')}</span>
            <strong>${formatDecimal(match.sindarov.decimal)}</strong>
            <em>${formatImpliedPct(match.sindarov.implied)}</em>
          </li>
        </ul>
      </div>
    </section>`
}

function renderResults(state: MatchState): string {
  const played = state.games.filter((g) => g.finished || g.live)
  if (played.length === 0) {
    return `<p class="empty">Сыгранных партий пока нет.</p>`
  }

  return `
    <ul class="list results">
      ${played
        .map((g, i) => {
          const moves = g.moves != null ? `${g.moves} ходов` : ''
          const title = g.live ? 'Идёт сейчас' : resultLabelRu(g.status, g.white)
          const pill = g.live ? 'LIVE' : compactResult(g.status)
          return `
            <li class="row ${g.live ? 'is-live' : ''}" style="--i:${i}">
              <span class="badge">№${g.gameNumber}</span>
              <div class="row-main">
                <div class="row-title">${escapeHtml(title)}</div>
                <div class="row-meta">
                  ${escapeHtml(formatDateMsk(g.startsAt))} · белые: ${flagName(g.white)}
                  ${moves ? ` · ${escapeHtml(moves)}` : ''}
                </div>
              </div>
              <span class="score-pill">${escapeHtml(pill)}</span>
            </li>`
        })
        .join('')}
    </ul>`
}

function renderUpcoming(state: MatchState): string {
  const events = upcomingEvents(state).filter((ev) => {
    if (ev.kind === 'game' && ev.gameNumber != null) {
      const g = state.games.find((x) => x.gameNumber === ev.gameNumber)
      return !g?.live
    }
    return true
  })
  if (events.length === 0) {
    return `<p class="empty">Ближайших событий нет.</p>`
  }

  return `
    <ul class="list upcoming">
      ${events
        .map((ev, i) => {
          const when =
            ev.kind === 'game' && ev.startsAtIso
              ? `${formatDateTimeMsk(Date.parse(ev.startsAtIso))} MSK`
              : formatDateOnlyFromIsoDate(ev.date)
          const tag =
            ev.kind === 'rest' ? 'отдых' : ev.kind === 'tiebreak' ? 'тай-брейк' : 'партия'
          const whiteId = ev.gameNumber != null ? (ev.gameNumber % 2 === 1 ? 'sindarov' : 'gukesh') : null
          const whiteHint =
            whiteId != null ? ` · белые: ${PLAYERS[whiteId].flag} ${PLAYERS[whiteId].name}` : ''
          return `
            <li class="row" style="--i:${i}">
              <span class="badge badge-${ev.kind}">${escapeHtml(tag)}</span>
              <div class="row-main">
                <div class="row-title">${escapeHtml(ev.labelRu)}</div>
                <div class="row-meta">${escapeHtml(when)}${whiteHint}</div>
              </div>
            </li>`
        })
        .join('')}
    </ul>`
}

function renderPastDates(state: MatchState): string {
  const events = pastDateEvents(state)
  if (events.length === 0) {
    return `<p class="empty">Пока нет.</p>`
  }
  return `
    <ul class="list past-dates">
      ${events
        .map((ev) => {
          const when =
            ev.kind === 'game' && ev.startsAtIso
              ? formatDateTimeMsk(Date.parse(ev.startsAtIso))
              : formatDateOnlyFromIsoDate(ev.date)
          return `
            <li class="row compact">
              <div class="row-main">
                <div class="row-title">${escapeHtml(ev.labelRu)}</div>
                <div class="row-meta">${escapeHtml(when)} MSK</div>
              </div>
            </li>`
        })
        .join('')}
    </ul>`
}

export function renderApp(root: HTMLElement, state: MatchState, extras: UiExtras = {}): void {
  const status = matchStatusLabel(state)
  const sourceNote =
    state.source === 'lichess'
      ? 'Данные Lichess · обновите страницу для свежих результатов'
      : `Офлайн-срез${state.error ? `: ${state.error}` : ''}`

  root.innerHTML = `
    <div class="page">
      <div class="atmosphere" aria-hidden="true"></div>
      <header class="hero">
        <p class="brand">Матч за звание чемпиона мира по шахматам</p>
        <h1 class="matchup">
          <span class="name">${PLAYERS.gukesh.flag} ${PLAYERS.gukesh.name}</span>
          <span class="vs">—</span>
          <span class="name">${PLAYERS.sindarov.flag} ${PLAYERS.sindarov.name}</span>
        </h1>
        <p class="sub">Женева 2026 · классика до 7½ очков</p>
      </header>

      ${renderPhasePanel(state, extras)}

      <section class="scoreboard" aria-label="Счёт матча">
        <div class="score-grid">
          <div class="player left">
            <span class="fed">${PLAYERS.gukesh.flag} ${PLAYERS.gukesh.fed}</span>
            <span class="pname">${PLAYERS.gukesh.name}</span>
          </div>
          <div class="score-pair">
            <span class="pts">${formatScore(state.gukesh)}</span>
            <span class="dash">—</span>
            <span class="pts">${formatScore(state.sindarov)}</span>
          </div>
          <div class="player right">
            <span class="fed">${PLAYERS.sindarov.flag} ${PLAYERS.sindarov.fed}</span>
            <span class="pname">${PLAYERS.sindarov.name}</span>
          </div>
        </div>
        <p class="status-line">${escapeHtml(status)}</p>
        <button type="button" class="refresh" id="refresh-btn">Обновить</button>
        <p class="source">${escapeHtml(sourceNote)}</p>
      </section>

      ${renderOdds(state)}

      <section class="section" aria-labelledby="results-heading">
        <h2 id="results-heading">Результаты партий</h2>
        ${renderResults(state)}
      </section>

      <section class="section" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Ближайшие партии</h2>
        ${renderUpcoming(state)}
      </section>

      <section class="section past-section">
        <details class="past-details">
          <summary>Прошедшие даты</summary>
          ${renderPastDates(state)}
        </details>
      </section>

      <footer class="footer">
        <p>Время — MSK. Трансляция и оценка — Lichess. Коэффициенты на партию: Elo-модель; победитель матча — снимок bet365/Kalshi.</p>
      </footer>
    </div>
  `

  root.querySelector('#refresh-btn')?.addEventListener('click', () => {
    location.reload()
  })
}

export function renderLoading(root: HTMLElement): void {
  root.innerHTML = `
    <div class="page is-loading">
      <div class="atmosphere" aria-hidden="true"></div>
      <header class="hero">
        <p class="brand">Матч за звание чемпиона мира по шахматам</p>
        <h1 class="matchup">
          <span class="name">${PLAYERS.gukesh.flag} Gukesh</span>
          <span class="vs">—</span>
          <span class="name">${PLAYERS.sindarov.flag} Sindarov</span>
        </h1>
        <p class="sub">Загрузка результатов…</p>
      </header>
    </div>
  `
}

export function startCountdownTicker(root: HTMLElement): () => void {
  const el = root.querySelector<HTMLElement>('#countdown-clock')
  if (!el) return () => {}
  const startsAt = Number(el.dataset.startsAt)
  if (!Number.isFinite(startsAt)) return () => {}

  const tick = () => {
    const left = startsAt - Date.now()
    el.textContent = formatCountdown(left)
    if (left <= 0) {
      el.textContent = '00:00:00'
    }
  }
  tick()
  const id = window.setInterval(tick, 1000)
  return () => window.clearInterval(id)
}
