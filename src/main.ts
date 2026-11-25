import './style.css'
import { loadMatchState } from './lichess'
import { renderApp, renderLoading } from './ui'

const app = document.querySelector<HTMLDivElement>('#app')

async function boot(): Promise<void> {
  if (!app) return
  renderLoading(app)
  const state = await loadMatchState()
  renderApp(app, state)
}

void boot()
