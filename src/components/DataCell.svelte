<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { ScriptIndex } from '../lib/db'

  // 画像ファイルを参照
  import bookIcon from '/ui_icon/article_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let scIndex: ScriptIndex

</script>

<div class="cell" on:click="{() => { dispatch('showPSc') }}">
  <img alt="本" src="{bookIcon}" class="icon" />
  <span>{scIndex.name}</span>
</div>

<style>
  .cell {
    width: 100%;
    padding: 8px 12px;
    border-bottom: 1px solid #555;
  }
  .icon {
    vertical-align: middle;
    margin-right: 6px;
  }
  .cell span {
    vertical-align: middle;
  }
</style>