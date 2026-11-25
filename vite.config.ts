import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // GitHub Pages project site; local/dev uses root.
  base: command === 'build' ? '/geneva-match/' : '/',
}))
