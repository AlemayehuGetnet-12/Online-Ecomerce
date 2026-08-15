import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI / animation
          'vendor-ui': ['framer-motion', 'react-icons'],
          // Data / utils
          'vendor-data': ['axios', 'react-hot-toast', 'i18next', 'react-i18next'],
          // Charts (used only in admin)
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
})
