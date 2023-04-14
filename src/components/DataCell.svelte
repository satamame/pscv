<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { ScriptIndex } from '../lib/db'

  // 画像ファイルを参照
  import bookIcon from '/ui_icon/article_black_24dp.svg'
  import infoIcon from '/ui_icon/info_outline_black_24dp.svg'
  import dragHandle from '/ui_icon/drag_handle_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let scIndex: ScriptIndex
  export let isShadow: boolean = false // ドラッグ先のシャドウとして表示
</script>

<div class="cell" on:click="{() => dispatch('showPSc')}">
  <div class="icon">
    <img alt="本" src="{bookIcon}" />
  </div>
  <div class="label">{scIndex.name}</div>
  <button
    class="icon-button info-button"
    on:click|stopPropagation="{() => dispatch('showInfo')}"
  >
    <img alt="情報" src="{infoIcon}" />
  </button>
  <div
    class="icon-button drag-handle"
    on:mousedown="{() => dispatch('startDrag')}"
    on:touchstart="{() => dispatch('startDrag')}"
  >
    <img alt="ドラッグ" src="{dragHandle}" />
  </div>
  {#if isShadow}
    <div class="overlay" />
  {/if}
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
  .icon {
    vertical-align: middle;
    margin-right: 6px;
  }
  .icon img {
    vertical-align: middle;
  }
  .cell .label {
    vertical-align: middle;
    margin-right: 62px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cell .icon-button img {
    vertical-align: middle;
  }
  .info-button {
    position: absolute;
    right: 40px;
  }
  .drag-handle {
    position: absolute;
    right: 8px;
  }
  .overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: lightgray;
    opacity: 0.75;
  }
</style>
