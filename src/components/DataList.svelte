<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte'
  import { liveQuery } from 'dexie'

  import { isAndroid } from '../lib/env'
  import { HEADER_HEIGHT } from '../lib/const'
  import { keepBackable, back } from '../lib/back'
  import { db } from '../lib/db'
  import type { ScriptIndex } from '../lib/db'
  import { PSc } from '../lib/psc'
  import type { DndCellItem } from './UI/DndList.svelte'

  // 画像ファイルを参照
  import addIcon from '/ui_icon/add_black_24dp.svg'
  import closeIcon from '/ui_icon/close_black_24dp.svg'

  // 子コンポーネント
  import DataCell from './DataCell.svelte'
  import DataAdd from './DataAdd.svelte'
  import DataInfo from './DataInfo.svelte'
  import DndList from './UI/DndList.svelte'

  // コンポーネントプロパティ
  type Props = {
    onClose: Function;    // 親が台本データ画面を閉じるハンドラ
    onShowPSc: Function;  // 親が台本を表示するハンドラ
  }
  const { onClose, onShowPSc }: Props = $props()

  // 子コンポーネントのインスタンス
  let dataAdd: DataAdd | undefined = $state(undefined)
  let dataInfo: DataInfo | undefined = $state(undefined)

  // パネル開閉状態
  let addIsOpen = $state(false)
  let infoIsOpen = $state(false)

  // 閉じている (閉じようとしている)
  let gone = $state(true)

  let infoScIndexId: number = $state(0)

  // リストに DB の内容が自動的に反映されるようにする
  let scIndexes = liveQuery(
    () => db.scriptIndex.orderBy('sortKey').toArray()
  )
  let items: ScriptIndex[] = $state([])
  $effect(() => {items = $scIndexes})

  // モーダル状態
  let isModal = $derived(addIsOpen || infoIsOpen)

  onMount(async () => {
    if (isAndroid) { keepBackable() }
    setTimeout(() => gone = false, 0)
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
      onClose()
      if (isAndroid) { back() }
    }, 200)
  }

  /** 選択した台本を表示する */
  async function showPSc(scriptId: number) {
    // DB から JSON を取って PSc のインスタンスにして親に渡す
    const scData = await db.scriptData.get(scriptId)
    if (!scData) {
      alert('データが無効です。')
      return
    }
    const psc = PSc.fromJson(scData.pscJson)
    onShowPSc(psc)

    // 自身を閉じる
    closeSelf()
  }

  function showInfo(scIndexId: number) {
    infoScIndexId = scIndexId
    infoIsOpen = true
  }

  function listSorted() {
    const ids = items.map(item => item.id)
    db.sortByIds(ids)
  }
</script>

<div class="panel" class:gone inert={isModal}>
  <div class="header">
    <button class="icon-button add-button" onclick={() => addIsOpen = true}>
      <img alt="追加" src={addIcon} />
    </button>
    <h1>台本データ</h1>
    <button class="icon-button close-button" onclick={close}>
      <img alt="閉じる" src={closeIcon} />
    </button>
  </div>

  <div
    class="container"
    style="top: {HEADER_HEIGHT + 1}px;"
  >
    <DndList
      items={items}
      onSorted={listSorted}
    >
      {#snippet cell(item: DndCellItem)}
        <DataCell
          item={item}
          cellId="cell{item.id}"
          onShowPSc={(scriptId: number) => showPSc(scriptId)}
          onShowInfo={(scIndexId: number) => showInfo(scIndexId)}
        />
      {/snippet}
    </DndList>
  </div>
</div>

{#if addIsOpen}
  <DataAdd
    bind:this={dataAdd}
    on:close={() => { addIsOpen = false }}
    on:showPSc={e => showPSc(e.detail.psc)}
  />
{/if}

{#if infoIsOpen}
  <DataInfo
    bind:this={dataInfo}
    bind:scIndexId={infoScIndexId}
    on:close={() => { infoIsOpen = false }}
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
