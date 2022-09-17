<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import Overlay from "./Overlay.svelte"

  const dispatch = createEventDispatcher()

  let panel
  let overlay
  let disabled = false

  onMount(async () => {
    setTimeout(() => {
      overlay.classList.remove('overlay-gone')
      panel.classList.remove('panel-gone')
    }, 0)
  })

  function close() {
    // Just in case clicked during transition.
    if (disabled) { return }
    disabled = true

    overlay.classList.add('overlay-gone')
    panel.classList.add('panel-gone')
    setTimeout(() => {
      dispatch('close')
    }, 200)
  }
</script>

<div class="overlay overlay-gone" bind:this={overlay}>
  <Overlay on:click={close} />
</div>
<div class="panel panel-gone" bind:this={panel}>
  <h1>目次</h1>
  <button class="close-button">
    <img alt="閉じる" src="/ui_icon/close_black_24dp.svg" on:click={close} />
  </button>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>setting</div>
  <div>settings</div>
</div>

<style>
  .panel {
    position: fixed;
    top: 0;
    left: 0;
    min-width: 180px;
    max-height: 100%;
    background: white;
    overflow: auto;
    transition: transform 0.2s;
  }
  .panel-gone {
    transform: translateX(-180px);
  }
  .overlay {
    transition: opacity 0.2s;
  }
  .overlay-gone {
    opacity: 0;
  }
  h1 {
    margin: 14px 16px 10px;
    font-size: 24px;
    line-height: 24px;
  }
  button {
    width: 28px;
    height: 28px;
    border-width: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }
  button img {
    width: 100%;
    height: 100%;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 16px;
  }
</style>
