import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hackathon/', // 🔁 MUST match your repo name
  plugins: [react()],
})
