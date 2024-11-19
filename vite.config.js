import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
  },
  plugins: [react()],
})
