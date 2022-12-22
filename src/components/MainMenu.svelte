<script lang="ts">
  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'
  import { createEventDispatcher, onMount } from 'svelte'

  // 子コンポーネント
  import Overlay from './Overlay.svelte'

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'
  import infoIcon from '/ui_icon/info_black_24dp.svg'
  import booksIcon from '/ui_icon/library_books_black_24dp.svg'

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

  function openData() {
    if (gone) { return }
    gone = true
    setTimeout(() => { dispatch('close') }, 200)
    dispatch('openData')
  }

  function openAbout() {
    if (gone) { return }
    gone = true
    setTimeout(() => { dispatch('close') }, 200)
    dispatch('openAbout')
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div class="panel" class:gone>
  <h1>メニュー</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <ul>
    <li>表示</li>
    <li on:click="{openData}"><img alt="データ" src="{booksIcon}" /><span>台本データ</span></li>
    <li on:click="{openAbout}"><img alt="情報" src="{infoIcon}" /><span>バージョン情報</span></li>
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
  .panel.gone {
    transform: translateX(180px);
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
    padding: 8px;
    cursor: pointer;
  }
  li img {
    vertical-align: middle;
    margin-right: 4px;
  }
  li span {
    vertical-align: middle;
  }
</style>
