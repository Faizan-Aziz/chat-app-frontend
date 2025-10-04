import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hope-by-aziz-serverapp.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
