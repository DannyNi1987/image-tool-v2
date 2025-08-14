import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/image-tool-v2/',
  plugins: [react()],
  worker: {
    format: 'es'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'codec-worker': ['./src/workers/codecWorker.ts']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})

