<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte'

  import { isPwa, isAndroid } from '../lib/env'
  import { APP_VERSION, COPY_RIGHT } from '../lib/const'
  import { keepBackable, back } from '../lib/back'
  import { appUpdateFunc } from '../lib/store'

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  // 子コンポーネント
  import Spinner from './UI/Spinner.svelte'

  // コンポーネントプロパティ
  type Props = {
    onClose: Function;  // 親がメニューを閉じるハンドラ
  }
  const { onClose }: Props = $props()

  // 閉じている (閉じようとしている)
  let gone = $state(true)
  // ローディング中
  let isLoading = $state(false)

  onMount(async () => {
    if (isAndroid) { keepBackable() }
    setTimeout(() => gone = false, 0)
  })

  export function close() {
    if (isLoading) {
      // ローディング中に Back ボタンが押された場合
      // 良く分からないが、こうするのが良いみたい
      location.reload()
      return
    }

    if (gone) { return }
    gone = true
    setTimeout(() => {
      onClose()
      if (isAndroid) { back() }
    }, 200)
  }

  function update() {
    if (isLoading) { return }
    if ($appUpdateFunc != null) { // 型ガード
      isLoading = true
      $appUpdateFunc(true)
    }
  }
</script>

<div class="panel" class:gone>
  <h1>台本ビューアについて</h1>
  <button class="icon-button close-button" onclick="{close}">
    <img alt="閉じる" src="{closeIcon}" />
  </button>

  <div class="container">
    <p>バージョン<br>{APP_VERSION}</p>
    {#if $appUpdateFunc}
      <button onclick="{update}">
        今すぐ台本ビューアを更新する
      </button>
      <div style="text-align: left;">
        <p>
          更新が途中で止まった場合は、一度アプリを終了して起動しなおしてください。
        </p>
      </div>
    {/if}
    {#if !isPwa}
      <div style="text-align: left;">
        <p>
          新しいバージョンは自動的に配信されます。<br />
          常に最新のバージョンを使うには、このページを PWA としてインストールするか、キャッシュをクリアして再読込みしてください。
        </p>
      </div>
    {/if}
    <p>{COPY_RIGHT}</p>
  </div>
</div>

{#if isLoading}
  <Spinner />
{/if}

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
