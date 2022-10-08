<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import Overlay from "./Overlay.svelte"
  import LoremIpsum from './LoremIpsum.svelte'
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  const dispatch = createEventDispatcher()

  let gone = true
  let disabled = false

  onMount(async () => {
    setTimeout(() => { gone = false }, 0)
  })

  function close() {
    // Just in case clicked during transition.
    if (disabled) { return }
    disabled = true

    gone = true
    setTimeout(() => { dispatch('close') }, 200)
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div class="panel" class:gone>
  <h1>目次</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <div style="padding: 2px 16px 14px;">
    <LoremIpsum lineLength="{20}" lineCount="{10}" blockCount="{2}" />
  </div>
</div>

<style>
  .panel {
    position: fixed;
    top: 0;
    left: 0;
    min-width: 180px;
    max-width: 100%;
    max-height: 100%;
    background: white;
    overflow: auto;
    transition: transform 0.2s, opacity 0.2s;
  }
  .panel.gone {
    transform: translateX(-180px);
    opacity: 0;
  }
  .overlay {
    transition: opacity 0.2s;
  }
  .overlay.gone {
    opacity: 0;
  }
  h1 {
    margin: 14px 16px 10px;
    font-size: 24px;
    line-height: 24px;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 16px;
  }
</style>
