<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte'
  import { liveQuery } from 'dexie'

  import { isAndroid } from '../lib/env'
  import { HEADER_HEIGHT } from '../lib/const'
  import { keepBackable, back } from '../lib/back'
  import { g } from '../lib/g.svelte'
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
  let dataAdd: DataAdd | undefined = $state()
  let dataInfo: DataInfo | undefined = $state()

  // パネル開閉状態
  let addIsOpen = $state(false)
  let infoIsOpen = $state(false)

  // 閉じている (閉じようとしている)
  let gone = $state(true)

  let infoScIndexId: number = $state(0)

  // リストに DB の内容が反映されるようにする
  let scIndexes = liveQuery(
    () => db.scriptIndex.orderBy('sortKey').toArray()
  )
  let items: ScriptIndex[] = $state([])
  $effect(() => {
    // items が空なら $scIndexes (空でない) を反映する
    if (!items.length && $scIndexes?.length) {
      items = $scIndexes
    }
    // $scIndexes の要素数が変わったなら items をリセットする。
    // この処理が必要な理由:
    // items は DndList にリアクティブに反映されるはずだが、
    // Svelte5 だとドラッグで並べ替えた後の削除時だけ変になる。
    // ※Svelte5 のバグかもしれないのでウォッチすること。
    else if ($scIndexes && items.length != $scIndexes.length) {
      items = []
      setTimeout(() => items = $scIndexes, 0)
    }
  })

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
    // 親のハンドラを実行する
    onShowPSc(scriptId)
    // 自身を閉じる
    closeSelf()
  }

  /** 台本の情報を表示する */
  function showInfo(scIndexId: number) {
    infoScIndexId = scIndexId
    infoIsOpen = true
  }

  /** DndList で並べ替えが起きた時に呼ばれるハンドラ */
  function listSorted(ids: number[]) {
    db.sortByIds(ids).then(() => {
      items = $scIndexes
    })
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
    {#if items.length}
      <DndList
        items={items}
        onSorted={listSorted}
      >
        {#snippet cell(item: DndCellItem)}
          <DataCell
            item={item}
            cellId="cell{item.id}"
            onShowPSc={showPSc}
            onShowInfo={showInfo}
          />
        {/snippet}
      </DndList>
    {/if}
  </div>
</div>

{#if addIsOpen}
  <DataAdd
    bind:this={dataAdd}
    onClose={() => addIsOpen = false}
  />
{/if}

{#if infoIsOpen}
  <DataInfo
    bind:this={dataInfo}
    scIndexId={infoScIndexId}
    onClose={() => infoIsOpen = false}
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
