// vite.config.js
import { defineConfig } from 'vite'
import react    from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // all /api/* requests will be forwarded to your real server:
      '/api': {
        target: 'http://localhost:3000',   
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
