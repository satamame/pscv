<svelte:options runes={true} />
<script lang="ts">
  import type { ScriptIndex } from '../lib/db'
  import type { DndCellItem } from './UI/DndList.svelte'

  // 画像ファイルを参照
  import bookIcon from '/ui_icon/article_black_24dp.svg'
  import infoIcon from '/ui_icon/info_outline_black_24dp.svg'
  import dragHandle from '/ui_icon/drag_indicator_black_24dp.svg'

  // コンポーネントプロパティ
  type Props = {
    item: DndCellItem;     // 表示するデータ (実際は ScriptIndex 型)
    cellId: string;        // div 要素の id として使う文字列
    onShowPSc: Function;   // 親が台本を表示するハンドラ
    onShowInfo: Function;  // 親が台本情報を表示するハンドラ
  }
  const { item, cellId, onShowPSc, onShowInfo }: Props = $props()

  // item は、DndList の定義の都合で DndCellItem 型だったので
  // ScriptIndex 型にして scIndex 変数に詰め替える
  let scIndex = item as ScriptIndex

  function showPSc() {
    onShowPSc(scIndex.scriptId)
  }

  function showInfo(event: Event) {
    // セル自体の onclick が発火しないようにする
    event.stopPropagation();
    onShowInfo(scIndex.id)
  }
</script>

<div
  id="{cellId}"
  class="cell bottom-line"
  onclick="{showPSc}"
  onkeydown="{e => e.key == 'Enter' && showPSc()}"
  role="button"
  tabindex="0"
>
  <div class="icon">
    <img alt="本" src="{bookIcon}" />
  </div>
  <div class="label">{scIndex.name}</div>
  <button
    class="icon-button info-button"
    onclick="{showInfo}"
    onkeydown="{e => e.key == 'Enter' && showInfo(e)}"
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
