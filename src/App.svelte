<script lang="ts">
  import Header from "./components/Header.svelte"
  import Toc from "./components/Toc.svelte"
  import MainMenu from "./components/MainMenu.svelte"
  import LoremIpsum from './components/LoremIpsum.svelte'

  let main

  let tocIsOpen = false
  let menuIsOpen = false

  $: isModal = tocIsOpen || menuIsOpen

  // Scroll lock/unlock
  $: if (main) {
    if (isModal) {
      const scrollTop = document.documentElement.scrollTop
      document.documentElement.style.position = 'fixed'
      main.style.top = `${48 - scrollTop}px`
    } else {
      const scrollTop = 48 - main.offsetTop
      main.style.top = '48px'
      document.documentElement.style.position = 'static'
      document.documentElement.scrollTop = scrollTop
    }
  }
</script>

<main bind:this="{main}" >

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
  <MainMenu on:close="{() => { menuIsOpen = false }}" />
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
