import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      srcDir: 'src/game/pwa',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: 'src/game/pwa/sw.ts'
      },
      registerType: 'autoUpdate',
      manifest: false
    })
  ],
  build: {
    target: 'esnext'
  },
  worker: {
    format: 'es'
  }
});
