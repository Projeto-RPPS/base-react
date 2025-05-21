import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // = 0.0.0.0, aceita conexões externas do container
    port: 5173,       // garante a porta que você quer expor
    strictPort: true, // falha se 5173 já estiver em uso
  }
})