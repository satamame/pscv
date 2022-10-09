<script lang="ts">
  import { APP_VERSION } from './lib/const'
  import Header from "./components/Header.svelte"
  import Toc from "./components/Toc.svelte"
  import MainMenu from "./components/MainMenu.svelte"
  import LoremIpsum from './components/LoremIpsum.svelte'
  import About from './components/About.svelte'
  import ReloadPrompt from "./components/ReloadPrompt.svelte"

  let main

  let tocIsOpen = false
  let menuIsOpen = false
  let aboutIsOpen = false
  let reloadIsOpen = true

  $: isModal = tocIsOpen || menuIsOpen

  // Scroll lock/unlock
  $: if (main) {
    const root = document.documentElement
    if (isModal) {
      const scrollTop = root.scrollTop
      root.style.position = 'fixed'
      main.style.top = `${48 - scrollTop}px`
    } else {
      const scrollTop = 48 - main.offsetTop
      main.style.top = '48px'
      root.style.position = 'static'
      root.scrollTop = scrollTop
    }
  }
</script>

<main bind:this="{main}" >
  <div>{APP_VERSION}</div>
  <LoremIpsum blockCount="{4}" />
</main>

<Header
  on:openToc="{() => { tocIsOpen = true }}"
  on:openMainMenu="{() => { menuIsOpen = true }}"
/>

{#if tocIsOpen}
  <Toc on:close="{() => { tocIsOpen = false }}" />
{/if}

{#if menuIsOpen}
  <MainMenu
    on:close="{() => { menuIsOpen = false }}"
    on:openAbout="{() => {aboutIsOpen = true}}"
  />
{/if}

{#if aboutIsOpen}
  <About on:close="{() => { aboutIsOpen = false }}" />
{/if}

{#if reloadIsOpen}
  <ReloadPrompt on:close="{() => { reloadIsOpen = false }}" />
{/if}

<style>
  main {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    padding: 8px 12px 12px 18px;
  }
</style>
