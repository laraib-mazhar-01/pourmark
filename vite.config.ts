import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH lets the same build serve from a sub-path (e.g. GitHub Pages: /pourmark/)
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
