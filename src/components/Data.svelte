<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { SAMPLES } from '../lib/const'
  import { isAndroid } from '../lib/env'
  import { keepBackable, back } from '../lib/back'
  import { PSc } from '../lib/psc'

  // 画像ファイルを参照
  import addIcon from '/ui_icon/add_black_24dp.svg'
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  // 子コンポーネント
  import DataAdd from './DataAdd.svelte'

  // コンポーネントのインスタンス
  let dataAdd: DataAdd

  // パネル開閉状態
  let addIsOpen = false

  const dispatch = createEventDispatcher()

  let gone = true

  onMount(async () => {
    if (isAndroid) { keepBackable() }
    setTimeout(() => { gone = false }, 0)
  })

  export function close() {
    // back 処理から呼ばれた場合を考え、追加パネルがあれば閉じる
    if (dataAdd) {
      dataAdd.close()
      if (isAndroid) { keepBackable() }
      return
    }

    // 上にパネルが載っていなければ自身を閉じる
    closeSelf()
  }

  function closeSelf() {
    if (gone) { return }
    gone = true
    setTimeout(() => {
      dispatch('close')
      if (isAndroid) { back() }
    }, 200)
  }

  async function addPSc(psc: PSc) {
    dispatch('showPSc', { psc })
    closeSelf()
  }
</script>

<div class="panel" class:gone>
  <button class="icon-button add-button">
    <img alt="追加" src="{addIcon}" on:click="{() => { addIsOpen = true }}" />
  </button>
  <h1>台本データ</h1>
  <button class="icon-button close-button">
    <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
  </button>

  <div class="container">

  </div>
</div>

{#if addIsOpen}
  <DataAdd
    bind:this="{dataAdd}"
    on:close="{() => { addIsOpen = false }}"
    on:addPSc="{(e) => { addPSc(e.detail.psc) }}"
  />
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
  h1 {
    margin: 14px 52px 10PX;
    text-align: center;
  }
  .add-button {
    position: absolute;
    top: 10px;
    left: 16px;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 16px;
  }
  .container {
    margin: 24px 16px 14px;
  }
</style>
