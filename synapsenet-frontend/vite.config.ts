import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          motion: ['framer-motion']
        }
      }
    }
  },
  define: {
    // Only define specific environment variables needed
    'import.meta.env.VITE_WS_URL': JSON.stringify(process.env.VITE_WS_URL),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.VITE_CHAINLINK_CONTRACT': JSON.stringify(process.env.VITE_CHAINLINK_CONTRACT),
    'import.meta.env.VITE_POLYGON_AMOY_RPC': JSON.stringify(process.env.VITE_POLYGON_AMOY_RPC)
  }
})