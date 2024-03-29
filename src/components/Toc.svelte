<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'
  import type { PSc } from '../lib/psc'

  // 子コンポーネント
  import Overlay from "./UI/Overlay.svelte"

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let psc: PSc
  export let current: number

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

  /** index 番目の見出し行にスクロールする */
  function goToHeadline(index: number) {
    dispatch('goToHeadline', { index })
    // Android の場合は履歴を遡りながらスクロールする必要がある
    // close() 後に履歴を遡るとスクロールがリセットされてしまう
    if (isAndroid) {
      back()
    } else {
      close()
    }
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div class="panel" class:gone>
  <h1>目次</h1>
  <button class="icon-button close-button" on:click="{close}">
    <img alt="閉じる" src="{closeIcon}" />
  </button>

  <ul>
    {#each psc.headlines as item, index}
      <li>
        <button
          class:current="{ index == current }"
          on:click="{() => { goToHeadline(index) }}"
        >
          {item.text}
        </button>
      </li>
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
    padding: 0;
  }
  li > button {
    display: block;
    width: 100%;
    height: 100%;
    padding: 8px 12px;
    border-top: 1px solid #555;
    border-radius: 0;
    color: black;
    background-color: transparent;
    text-align: left;
  }
  .current {
    font-weight: bold;
  }
</style>
