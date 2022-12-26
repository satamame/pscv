<script lang="ts">
  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'
  import { createEventDispatcher, onMount } from 'svelte'

  import type { PSc } from '../lib/psc'

  // 子コンポーネント
  import Overlay from "./Overlay.svelte"

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let psc: PSc

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

  $: tocItems = psc.getTocItems()

  function goTo(index: number) {
    alert(index)
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

  <ul>
    {#each tocItems as item}
      <li on:click="{() => { goTo(item.index) }}">{item.text}</li>
    {/each}
  </ul>
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
    padding: 8px 12px;
    cursor: pointer;
  }
</style>
