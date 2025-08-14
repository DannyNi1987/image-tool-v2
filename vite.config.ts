import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'codec-worker': ['./src/workers/codecWorker.ts'],
          'image-worker': ['./src/workers/imageWorker.ts']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})

