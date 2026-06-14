import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'react-three-fiber': '@react-three/fiber'
    },
    dedupe: ['react', 'react-dom', 'three', '@emotion/react', '@emotion/styled']
  }
})
