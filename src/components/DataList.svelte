<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { liveQuery } from 'dexie'
  import { dndzone } from 'svelte-dnd-action'

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
  import DataInfo from './DataInfo.svelte'

  const dispatch = createEventDispatcher()

  // コンポーネントのインスタンス
  let dataAdd: DataAdd
  let dataInfo: DataInfo

  // パネル開閉状態
  let addIsOpen = false
  let infoIsOpen = false

  let gone = true
  let infoScIndexId: number

  // リストに DB の内容が自動的に反映されるようにする
  let scIndexes = liveQuery(
    () => db.scriptIndex.orderBy('sortKey').toArray()
  )
  $: items = $scIndexes

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
    if (dataInfo) {
      dataInfo.close()
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

  function showInfo(scIndexId: number) {
    infoScIndexId = scIndexId
    infoIsOpen = true
  }

  /** Drag & Drop */
  const flipDurationMs = 300;
  const handleDndConsider = evt => {
    items = evt.detail.items;
  }
  const handleDndFinalize = evt => {
    items = evt.detail.items;
    const scriptIds = items.map(item => item.scriptId)
    db.sortByScriptIds(scriptIds)
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

  {#if items}
    <div
      class="container"
      style="top: {HEADER_HEIGHT}px;"
      use:dndzone="{{ items, flipDurationMs }}"
      on:consider="{handleDndConsider}"
      on:finalize="{handleDndFinalize}"
    >
      {#each items as item(item.id)}
        <DataCell
          scIndex="{item}"
          on:showPSc="{() => showPSc(item.scriptId)}"
          on:showInfo="{() => showInfo(item.id)}"
        />
      {/each}
    </div>
  {/if}
</div>

{#if addIsOpen}
  <DataAdd
    bind:this="{dataAdd}"
    on:close="{() => { addIsOpen = false }}"
    on:showPSc="{e => showPSc(e.detail.psc)}"
  />
{/if}

{#if infoIsOpen}
  <DataInfo
    bind:this="{dataInfo}"
    bind:scIndexId="{infoScIndexId}"
    on:close="{() => { infoIsOpen = false }}"
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
