<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { HEADER_HEIGHT, SAMPLES } from '../lib/const'
  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'

  // 子コンポーネント
  import Overlay from './Overlay.svelte'

  // 要素のインスタンス
  let panel: HTMLDivElement

  const dispatch = createEventDispatcher()

  let gone = true

  $: if (panel) {
    panel.style.top = `${HEADER_HEIGHT}px`
  }

  onMount(async () => {
    setTimeout(() => { gone = false }, 0)
  })

  export function close() {
    // back 時の処理は親が受け持つ
    if (gone) { return }
    gone = true
    setTimeout(() => {
      dispatch('close')
    }, 200)
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div bind:this="{panel}" class="panel" class:gone>
  <div class="container">
    <h2>台本の追加</h2>
    <div>
      <label>どこから読み込みますか？
        <select>
          <option value="0">サンプル</option>
          <option value="1">インターネット</option>
          <option value="0">ファイル</option>
        </select>
      </label>
    </div>
    <div>
      <button on:click="{close}">キャンセル</button>
    </div>
  </div>
</div>

<style>
  .panel {
    position: fixed;
    /* margin: 8px auto; */
    left: 10px;
    right: 10px;
    padding: 10px;
    border-radius: 6px;
    background: white;
    overflow: auto;
    transition: transform 0.2s, opacity 0.2s;
  }
  .panel.gone {
    transform: translateY(270px);
    opacity: 0;
  }
  .overlay {
    transition: opacity 0.2s;
  }
  .overlay.gone {
    opacity: 0;
  }
  .container {
    margin: 16px 16px 14px;
  }
  .container h2 {
    margin-left: 0;
    margin-bottom: 24px;
  }
  select {
    margin: 10px auto;
  }
</style>
