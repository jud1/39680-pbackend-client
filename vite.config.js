import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      host: true,
      proxy: {
         '/api': 'https://39680-pbackend-server-production.up.railway.app'
      }
   }
})
