import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// `vite build` builds the main site into dist/.
// `BUILD_TARGET=photo vite build` builds only the photo gallery + /admin into dist-photo/ (see scripts/build-photo.mjs).
// This is deliberately not a Vite mode: a custom mode would skip .env.production and bake .env.local's
// localhost API URL into the deployed site.
const isPhoto = process.env.BUILD_TARGET === 'photo'

export default defineConfig(() => {
    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        // The gallery copies only the public files it needs, not the 3D models etc.
        publicDir: isPhoto ? false : 'public',
        build: {
            outDir: isPhoto ? 'dist-photo' : 'dist',
            rollupOptions: {
                input: isPhoto
                    ? {
                        photo: resolve(import.meta.dirname, 'photo.html'),
                        admin: resolve(import.meta.dirname, 'admin/index.html'),
                    }
                    : resolve(import.meta.dirname, 'index.html'),
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return
                        if (/node_modules\/(three|@react-three)\//.test(id)) return 'vendor-three'
                        if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react'
                    },
                },
            },
        },
    }
})
