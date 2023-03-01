import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import preprocess from 'svelte-preprocess'

const pwaOptions = {
  strategies: 'generateSW' as 'generateSW', // default (unnecessary)
  registerType: 'prompt' as 'prompt',       // default (unnecessary)
  manifest: {
    name: '台本ビューア',
    short_name: 'PSCV',
    description: '台本データ (JSON) を読むためのビューアです。',
    icons: [
      {
        src: 'app_icon/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'app_icon/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'app_icon/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    start_url: 'index.html',
    display: 'standalone',        // default (unnecessary)
    background_color: '#BD913F',
    theme_color: '#916028',
    lang: 'ja',
  },
  includeAssets: ['ui_icon/*.svg', 'sample/*.json'],
  devOptions: {
    enabled: true,
  },
}

const svelteOptions = {
  compilerOptions: {
    enableSourcemap: true,
  },
  preprocess: preprocess({
    sourceMap: true,
  }),
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pscv/',
  plugins: [
    svelte(svelteOptions),
    VitePWA(pwaOptions),
  ],
})
