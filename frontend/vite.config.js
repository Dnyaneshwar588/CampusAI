import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      // Dev proxy — forwards /api calls to FastAPI on :8000
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        }
      }
    },
    define: {
      // Make the backend URL available at build time from VITE_API_BASE_URL
      // Falls back to empty string (same-origin) when not set locally
      __API_BASE__: JSON.stringify(env.VITE_API_BASE_URL || ''),
    }
  }
})
