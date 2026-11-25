import {
  PLAYERS,
  SCHEDULE,
  compactResult,
  formatDateMsk,
  formatDateOnlyFromIsoDate,
  formatDateTimeMsk,
  formatScore,
  matchStatusLabel,
  resultLabelRu,
  type MatchState,
  type ScheduleEvent,
} from './data'

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
    // Rest / tiebreak: show if calendar day is today or later (MSK)
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

function nextEventLine(state: MatchState): string {
  const upcoming = upcomingEvents(state)
  const next = upcoming[0]
  if (!next) return 'Расписание завершено'
  if (next.kind === 'game' && next.startsAtIso) {
    return `Далее: ${next.labelRu} · ${formatDateTimeMsk(Date.parse(next.startsAtIso))} MSK`
  }
  return `Далее: ${next.labelRu} · ${formatDateOnlyFromIsoDate(next.date)}`
}

function renderResults(state: MatchState): string {
  const played = state.games.filter((g) => g.finished)
  if (played.length === 0) {
    return `<p class="empty">Сыгранных партий пока нет.</p>`
  }

  return `
    <ul class="list results">
      ${played
        .map((g, i) => {
          const white = PLAYERS[g.white].name
          const moves = g.moves != null ? `${g.moves} ходов` : ''
          return `
            <li class="row" style="--i:${i}">
              <span class="badge">№${g.gameNumber}</span>
              <div class="row-main">
                <div class="row-title">${escapeHtml(resultLabelRu(g.status, g.white))}</div>
                <div class="row-meta">
                  ${escapeHtml(formatDateMsk(g.startsAt))} · белые: ${escapeHtml(white)}
                  ${moves ? ` · ${moves}` : ''}
                </div>
              </div>
              <span class="score-pill">${escapeHtml(compactResult(g.status))}</span>
            </li>`
        })
        .join('')}
    </ul>`
}

function renderUpcoming(state: MatchState): string {
  const events = upcomingEvents(state)
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
          const whiteHint =
            ev.kind === 'game' && ev.gameNumber != null
              ? ` · белые: ${PLAYERS[ev.gameNumber % 2 === 1 ? 'sindarov' : 'gukesh'].name}`
              : ''
          return `
            <li class="row" style="--i:${i}">
              <span class="badge badge-${ev.kind}">${escapeHtml(tag)}</span>
              <div class="row-main">
                <div class="row-title">${escapeHtml(ev.labelRu)}</div>
                <div class="row-meta">${escapeHtml(when)}${escapeHtml(whiteHint)}</div>
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

export function renderApp(root: HTMLElement, state: MatchState, loading = false): void {
  const status = matchStatusLabel(state)
  const sourceNote =
    state.source === 'lichess'
      ? 'Данные Lichess · обновите страницу для свежих результатов'
      : `Офлайн-срез${state.error ? `: ${state.error}` : ''}`

  root.innerHTML = `
    <div class="page ${loading ? 'is-loading' : ''}">
      <div class="atmosphere" aria-hidden="true"></div>
      <header class="hero">
        <p class="brand">Чемпионат мира 2026</p>
        <h1 class="matchup">
          <span class="name">${PLAYERS.gukesh.name}</span>
          <span class="vs">—</span>
          <span class="name">${PLAYERS.sindarov.name}</span>
        </h1>
        <p class="sub">Женева · классический матч до 7½ очков</p>
        <p class="next-line">${escapeHtml(nextEventLine(state))}</p>
      </header>

      <section class="scoreboard" aria-label="Счёт матча">
        <div class="score-grid">
          <div class="player left">
            <span class="fed">${PLAYERS.gukesh.fed}</span>
            <span class="pname">${PLAYERS.gukesh.name}</span>
          </div>
          <div class="score-pair">
            <span class="pts">${formatScore(state.gukesh)}</span>
            <span class="dash">—</span>
            <span class="pts">${formatScore(state.sindarov)}</span>
          </div>
          <div class="player right">
            <span class="fed">${PLAYERS.sindarov.fed}</span>
            <span class="pname">${PLAYERS.sindarov.name}</span>
          </div>
        </div>
        <p class="status-line">${escapeHtml(status)}</p>
        <button type="button" class="refresh" id="refresh-btn">Обновить</button>
        <p class="source">${escapeHtml(sourceNote)}</p>
      </section>

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
        <p>Время указано по Москве (MSK). Источник трансляции — Lichess Broadcast.</p>
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
        <p class="brand">Чемпионат мира 2026</p>
        <h1 class="matchup">
          <span class="name">Gukesh</span>
          <span class="vs">—</span>
          <span class="name">Sindarov</span>
        </h1>
        <p class="sub">Загрузка результатов…</p>
      </header>
    </div>
  `
}
