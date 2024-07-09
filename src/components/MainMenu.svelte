<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte'

  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'

  // 子コンポーネント
  import Overlay from './UI/Overlay.svelte'

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'
  import infoIcon from '/ui_icon/info_black_24dp.svg'
  import booksIcon from '/ui_icon/library_books_black_24dp.svg'

  // コンポーネントプロパティ
  type Props = {
    onClose: Function;     // 親がメニューを閉じるハンドラ
    onOpenData: Function;  // 親が台本データを開くハンドラ
    onOpenAbout: Function; // 親が「台本ビューアについて」を開くハンドラ
  }
  const { onClose, onOpenData, onOpenAbout }: Props = $props()

  // 閉じている (閉じようとしている)
  let gone = $state(true)

  onMount(async () => {
    if (isAndroid) { keepBackable() }
    setTimeout(() => gone = false, 0)
  })

  function close() {
    if (gone) { return }
    gone = true
    setTimeout(() => {
      onClose()
      if (isAndroid) { back() }
    }, 200)
  }

  function openData() {
    if (gone) { return }
    gone = true
    setTimeout(() => onClose(), 200)
    onOpenData()
  }

  function openAbout() {
    if (gone) { return }
    gone = true
    setTimeout(() => onClose(), 200)
    onOpenAbout()
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div class="panel" class:gone>
  <h1>メニュー</h1>
  <button class="icon-button close-button" onclick="{close}">
    <img alt="閉じる" src="{closeIcon}" />
  </button>

  <ul>
    <li>
      <button>
        表示
      </button>
    </li>
    <li>
      <button onclick="{openData}">
        <img alt="データ" src="{booksIcon}" /><span>台本データ</span>
      </button>
    </li>
    <li>
      <button onclick="{openAbout}">
        <img alt="情報" src="{infoIcon}" /><span>バージョン情報</span>
      </button>
    </li>
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
  li > button > img {
    vertical-align: middle;
    margin-right: 6px;
  }
  li > button > span {
    vertical-align: middle;
  }
</style>
