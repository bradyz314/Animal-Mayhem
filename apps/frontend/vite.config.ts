import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/account': {
        target: 'http://localhost:8080',
        secure: false,
      },
      '/skills': {
        target: 'http://localhost:8080',
        secure: false,
      },
      '/level': {
        target: 'http://localhost:8080',
        secure: false,
      }
    }
  }
})
