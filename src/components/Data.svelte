<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
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
  <h1>台本データ</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <h2>サンプル</h2>
  <div class="container">
    <select>
      <option>台本ビューアの使い方</option>
      <option>マダムと謎のいいがかり</option>
    </select>
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
    margin: 10px 16px;
  }
</style>
