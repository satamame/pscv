<script lang="ts">
  import { APP_VERSION } from '../lib/const'
  import { createEventDispatcher, onMount } from 'svelte'
  import { appUpdateAvailable } from '../lib/store'
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

  function updateApp() {
    if (!disabled) {
      close()
      dispatch('updateApp')
    }
  }
</script>

<div class="panel" class:gone>
  <h1>台本ビューアについて</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <div style="margin: 2px 16px 14px;">
    <p>バージョン {APP_VERSION}</p>
    {#if $appUpdateAvailable}
      <button on:click="{updateApp}">
        今すぐ台本ビューアを更新する
      </button>
    {/if}
  </div>
</div>

<style>
  .panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    overflow: auto;
    transition: transform 0.2s, opacity 0.2s;
  }
  .panel.gone {
    transform: translateY(540px);
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
