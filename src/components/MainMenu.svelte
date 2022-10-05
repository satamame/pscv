<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import Overlay from "./Overlay.svelte"

  import closeIcon from '/ui_icon/close_black_24dp.svg'

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

  function openAbout() {
    close()
    dispatch('openAbout')
  }
</script>

<div class="overlay overlay-gone" bind:this="{overlay}" >
  <Overlay on:click="{close}" />
</div>
<div class="panel panel-gone" bind:this="{panel}" >
  <h1>メニュー</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <ul>
    <li>表示</li>
    <li>台本データ</li>
    <li on:click="{openAbout}">バージョン情報</li>
  </ul>

</div>

<style>
  .panel {
    position: fixed;
    top: 0;
    right: 0;
    min-width: 180px;
    max-width: 100%;
    max-height: 100%;
    background: white;
    overflow: auto;
    transition: transform 0.2s, opacity 0.2s;
  }
  .panel-gone {
    transform: translateX(180px);
    opacity: 0;
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
  .close-button {
    position: absolute;
    top: 10px;
    right: 16px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  li {
    border-top: 1px solid #555;
    padding: 8px;
    cursor: pointer;
  }
</style>
