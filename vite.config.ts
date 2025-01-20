import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CC Tools by Madhu',
        short_name: 'CC Tools',
        description: 'A collection of tools for Comic Con volunteer management',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/batman.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/images/WhatsappAnalysis.webp',
            sizes: '1024x1024',
            type: 'image/webp',
          },
        ],
        screenshots: [
          {
            src: '/images/screenshot-wide.png',
            sizes: '3354x1794',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: '/images/screenshot-narrow.png',
            sizes: '854x1668',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
