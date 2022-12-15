<script lang="ts">
  import { APP_VERSION, COPY_RIGHT } from '../lib/const'
  import { createEventDispatcher, onMount } from 'svelte'
  import { appUpdateFunc } from '../lib/store'
  import { isAndroid } from '../lib/ua'
  import { keepBackable, back } from '../lib/back'

  import closeIcon from '/ui_icon/close_black_24dp.svg'

  const dispatch = createEventDispatcher()

  let gone = true

  onMount(async () => {
    if (isAndroid) { keepBackable() }
    setTimeout(() => { gone = false }, 0)
  })

  export function close() {
    if (gone) { return }
    gone = true
    setTimeout(() => {
      dispatch('close')
      if (isAndroid) { back() }
    }, 200)
  }
</script>

<div class="panel" class:gone>
  <h1>台本ビューアについて</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <div class="container">
    <p>バージョン<br>{APP_VERSION}</p>
    {#if $appUpdateFunc}
      <button on:click|once="{() => $appUpdateFunc(true)}">
        今すぐ台本ビューアを更新する
      </button>
    {/if}
    <p>{@html COPY_RIGHT}</p>
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
    transform: translateY(270px);
    opacity: 0;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 16px;
  }
  .container {
    text-align: center;
    margin: 24px 16px 14px;
  }
</style>
