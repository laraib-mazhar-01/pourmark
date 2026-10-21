import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH lets the same build serve from a sub-path (e.g. GitHub Pages: /pourmark/)
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

export default defineConfig({
  base: env.BASE_PATH ?? '/',
  plugins: [react()],
})
