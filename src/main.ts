import './style.css'
import { fetchCloudEval } from './eval'
import { loadMatchState } from './lichess'
import { renderApp, renderLoading, startCountdownTicker } from './ui'

const app = document.querySelector<HTMLDivElement>('#app')
let stopTicker: (() => void) | undefined

async function boot(): Promise<void> {
  if (!app) return
  stopTicker?.()
  renderLoading(app)

  const state = await loadMatchState()

  if (state.phase.kind === 'live' && state.phase.fen) {
    renderApp(app, state, { evalLoading: true })
    stopTicker = startCountdownTicker(app)
    const positionEval = await fetchCloudEval(state.phase.fen)
    stopTicker?.()
    renderApp(app, state, { positionEval, evalLoading: false })
    stopTicker = startCountdownTicker(app)
    return
  }

  renderApp(app, state)
  stopTicker = startCountdownTicker(app)
}

void boot()
