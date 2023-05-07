<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { ScriptIndex } from '../lib/db'
  import type { DndCellItem } from './UI/DndList.svelte'

  // 画像ファイルを参照
  import bookIcon from '/ui_icon/article_black_24dp.svg'
  import infoIcon from '/ui_icon/info_outline_black_24dp.svg'
  import dragHandle from '/ui_icon/drag_indicator_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let item: DndCellItem
  export let cellId: string

  let scIndex = item as ScriptIndex
</script>

<div
  id="{cellId}"
  class="cell bottom-line"
  on:click="{() => dispatch('showPSc', { scriptId: scIndex.scriptId })}"
>
  <div class="icon">
    <img alt="本" src="{bookIcon}" />
  </div>
  <div class="label">{scIndex.name}</div>
  <button
    class="icon-button info-button"
    on:click|stopPropagation="{() => dispatch('showInfo', { id: scIndex.id })}"
  >
    <img alt="情報" src="{infoIcon}" />
  </button>
  <div id="dragHandle" class="icon drag-handle">
    <img src="{dragHandle}" alt="drag" />
  </div>
</div>

<style>
  .cell {
    display: flex;
    position: relative;
    align-items: center;
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #555;
    user-select: none;
  }
  .cell:last-child {
    border-bottom-width: 0;
  }
  .bottom-line:last-child {
    border-bottom-width: 1px;
  }
  .icon {
    margin-right: 6px;
  }
  .icon img {
    vertical-align: middle;
  }
  .label {
    margin-right: 62px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info-button {
    position: absolute;
    right: 40px;
  }
  .drag-handle {
    position: absolute;
    right: 8px;
    opacity: 0.5;
  }
</style>
