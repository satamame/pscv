<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { liveQuery } from "dexie";

  import { isAndroid } from '../lib/env'
  import { HEADER_HEIGHT } from '../lib/const'
  import { keepBackable, back } from '../lib/back'
  import { db } from '../lib/db'
  import { PSc } from '../lib/psc'

  // 画像ファイルを参照
  import addIcon from '/ui_icon/add_black_24dp.svg'
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  // 子コンポーネント
  import DataCell from './DataCell.svelte'
  import DataAdd from './DataAdd.svelte'

  // コンポーネントのインスタンス
  let dataAdd: DataAdd

  // パネル開閉状態
  let addIsOpen = false

  const dispatch = createEventDispatcher()

  let gone = true

  // リストに DB の内容が自動的に反映されるようにする
  let scIndexes = liveQuery(
    () => db.scriptIndex.orderBy('sortKey').toArray()
  )

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

  /** 選択した台本を表示する */
  async function showPSc(scriptId: number) {
    // DB から JSON を取って PSc のインスタンスにして親に渡す
    const scData = await db.scriptData.get(scriptId)
    const psc = PSc.fromJson(scData.pscJson)
    dispatch('showPSc', { psc })

    // 自身を閉じる
    closeSelf()
  }
</script>

<div class="panel" class:gone>
  <div class="header">
    <button class="icon-button add-button">
      <img alt="追加" src="{addIcon}" on:click="{() => { addIsOpen = true }}" />
    </button>
    <h1>台本データ</h1>
    <button class="icon-button close-button">
      <img alt="閉じる" src="{closeIcon}" on:click="{close}" />
    </button>
  </div>

  <div class="container" style="top: {HEADER_HEIGHT}px;">
    {#if $scIndexes}
      {#each $scIndexes as scIndex}
        <DataCell
          scIndex="{scIndex}"
          on:showPSc="{() => { showPSc(scIndex.scriptId) }}"
        />
      {/each}
    {/if}
  </div>
</div>

{#if addIsOpen}
  <DataAdd
    bind:this="{dataAdd}"
    on:close="{() => { addIsOpen = false }}"
    on:showPSc="{(e) => { showPSc(e.detail.psc) }}"
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
  .header {
    border-bottom: 1px solid #555;
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
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
