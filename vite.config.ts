import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  manifest: {
    name: '台本ビューア',
    short_name: 'PSCV',
    description: '台本データ (JSON) を読むためのビューアです。',
    start_url: 'index.html',
    background_color: '#BD913F',
    theme_color: '#916028',
    lang: 'ja',
  },
  devOptions: {
    enabled: true,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pscv/',
  plugins: [
    svelte(),
    VitePWA(pwaOptions),
  ],
})
