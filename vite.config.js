import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
                    'vendor-gsap': ['gsap', '@gsap/react'],
                },
            },
        },
    },
})
