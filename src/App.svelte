<script lang="ts">
  import { isPwa, isAndroid } from './lib/env'
  import { HEADER_HEIGHT } from './lib/const'
  import type { BackFunc } from './lib/back'
  import { initBackHandler } from './lib/back'

  import type { PSc } from './lib/psc'

  // 子コンポーネント
  import Viewer from './components/Viewer.svelte'
  import Header from './components/Header.svelte'
  import Toc from './components/Toc.svelte'
  import MainMenu from './components/MainMenu.svelte'
  import Data from './components/Data.svelte'
  import About from './components/About.svelte'
  import ReloadPrompt from './components/ReloadPrompt.svelte'

  let viewer
  let toc
  let menu
  let data
  let about

  // パネル開閉状態
  let tocIsOpen = false
  let menuIsOpen = false
  let dataIsOpen = false
  let aboutIsOpen = false
  let reloadIsOpen = true

  let viewerTop = HEADER_HEIGHT

  let psc: PSc | undefined
  $: title = psc?.title ?? '台本ビューア'
  $: isModal = tocIsOpen || menuIsOpen || dataIsOpen || aboutIsOpen

  // Scroll lock/unlock
  $: if (viewer) {
    if (isModal) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }

  // Initialize Android's back button handler
  if (isAndroid) {
    initBackHandler((): BackFunc => {
      // This callback returns functions to be invoked by back button
      return {
        toc: toc?.close,
        menu: menu?.close,
        data: data?.close,
        about: about?.close,
      }
    })
  }

  function lockScroll(): void {
    const root = document.documentElement
    const scrollTop = root.scrollTop
    root.style.position = 'fixed'
    viewerTop = HEADER_HEIGHT - scrollTop
  }

  function unlockScroll(): void {
    const root = document.documentElement
    const scrollTop = HEADER_HEIGHT - viewerTop
    viewerTop = HEADER_HEIGHT
    root.style.position = 'static'
    root.scrollTop = scrollTop
  }
</script>

<Viewer
  bind:this="{viewer}"
  bind:psc
  bind:top="{viewerTop}"
/>

<Header
  bind:title
  bind:psc
  on:openToc="{() => { tocIsOpen = true }}"
  on:openMainMenu="{() => { menuIsOpen = true }}"
/>

{#if psc && tocIsOpen}
  <Toc
    bind:this="{toc}"
    bind:psc
    on:close="{() => { tocIsOpen = false }}"
  />
{/if}

{#if menuIsOpen}
  <MainMenu
    bind:this="{menu}"
    on:close="{() => { menuIsOpen = false }}"
    on:openData="{() => { dataIsOpen = true }}"
    on:openAbout="{() => { aboutIsOpen = true }}"
  />
{/if}

{#if dataIsOpen}
  <Data
    bind:this="{data}"
    on:close="{() => { dataIsOpen = false }}"
    on:showPSc="{(e) => { psc = e.detail.psc }}"
  />
{/if}

{#if aboutIsOpen}
  <About
    bind:this="{about}"
    on:close="{() => { aboutIsOpen = false }}"
  />
{/if}

{#if isPwa && reloadIsOpen}
  <ReloadPrompt
    on:close="{() => { reloadIsOpen = false }}"
  />
{/if}
