import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from your LAN
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend server
        secure: false,
      }
    }
  }
})
