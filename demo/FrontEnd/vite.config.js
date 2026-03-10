import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
    server: {
       proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        }),
        react(),
    ],
})