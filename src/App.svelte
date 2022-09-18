<script lang="ts">
  import Header from "./components/Header.svelte"
  import Toc from "./components/Toc.svelte"
  import MainMenu from "./components/MainMenu.svelte"
  import LoremIpsum from './components/LoremIpsum.svelte'

  let tocIsOpen = false
  let menuIsOpen = false
  $: isModal = tocIsOpen || menuIsOpen
</script>

<Header
  on:openToc={() => { tocIsOpen = true }}
  on:openMainMenu={() => { menuIsOpen = true }}
/>

<main>

  <LoremIpsum blockCount={4} />

</main>

{#if tocIsOpen}
  <Toc on:close={() => { tocIsOpen = false }} />
{/if}

{#if menuIsOpen}
  <MainMenu on:close={() => { menuIsOpen = false }} />
{/if}

<style>
  main {
    position: fixed;
    top: 48px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 2px 12px 12px 18px;
  }
</style>
