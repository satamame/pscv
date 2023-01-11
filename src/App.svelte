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

  let main
  let viewer
  let toc
  let menu
  let data
  let about

  let tocIsOpen = false
  let menuIsOpen = false
  let dataIsOpen = false
  let aboutIsOpen = false
  let reloadIsOpen = true

  let psc: PSc | undefined
  $: title = psc?.title ?? '台本ビューア'
  $: isModal = tocIsOpen || menuIsOpen || dataIsOpen || aboutIsOpen

  // Scroll lock/unlock
  $: if (main) {
    const root = document.documentElement
    if (isModal) {
      const scrollTop = root.scrollTop
      root.style.position = 'fixed'
      main.style.top = `${HEADER_HEIGHT - scrollTop}px`
    } else {
      const scrollTop = HEADER_HEIGHT - main.offsetTop
      main.style.top = `${HEADER_HEIGHT}px`
      root.style.position = 'static'
      root.scrollTop = scrollTop
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
</script>

<main bind:this="{main}" style="top: {HEADER_HEIGHT}px">
  <Viewer
    bind:this="{viewer}"
    bind:psc
  />
</main>

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

<style>
  main {
    position: absolute;
    left: 0;
    right: 0;
    padding: 8px 12px 12px 18px;
  }
</style>
