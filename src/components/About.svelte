<script lang="ts">
  import { APP_VERSION } from '../lib/const'
  import { createEventDispatcher, onMount } from 'svelte'

  import closeIcon from '/ui_icon/close_black_24dp.svg'

  const dispatch = createEventDispatcher()

  let panel
  let disabled = false

  onMount(async () => {
    setTimeout(() => {
      panel.classList.remove('panel-gone')
    }, 0)
  })

  function close() {
    // Just in case clicked during transition.
    if (disabled) { return }
    disabled = true

    panel.classList.add('panel-gone')
    setTimeout(() => {
      dispatch('close')
    }, 200)
  }
</script>

<div class="panel panel-gone" bind:this="{panel}" >
  <h1>台本ビューアについて</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <div style="padding: 2px 16px 14px;">
    バージョン {APP_VERSION}
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
  .panel-gone {
    transform: translateY(180px);
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