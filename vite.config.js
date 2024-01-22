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
        name: 'Courir ',
        short_name: 'Courir',
        description: 'Une description de votre application.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
  
          {
            src: 'logo-48-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'logo-96-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'logo-192-192.png',
            sizes: '192x192',
            type: 'image/png',
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
});
