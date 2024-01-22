import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'Ma Progressive Web App',
        short_name: 'PWA',
        description: 'Une description de votre application.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: new RegExp('/(.*).(png|gif|jpg|css)$/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'corentin',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0,200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    sourceMap: true,
  },
  // base: '/test/' // deploy le build dans un sous dossier 
});
