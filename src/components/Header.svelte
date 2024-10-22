<svelte:options runes={true} />
<script lang="ts">
  import { HEADER_COLOR, HEADER_HEIGHT } from '../lib/const'
  import type { PSc } from '../lib/psc'

  // 画像ファイルを参照
  import tocIcon from '/ui_icon/toc_black_24dp.svg'
  import menuIcon from '/ui_icon/menu_open_black_24dp.svg'

  // コンポーネントプロパティ
  type Props = {
    title: string;         // ヘッダに表示するタイトル
    psc?: PSc;             // 台本データ
    inert: boolean;        // 操作無効 (親がモーダル)
    onOpenToc: Function;   // 親が目次を開くハンドラ
    onOpenMenu: Function;  // 親がメニューを開くハンドラ
  }
  const { title, psc, inert, onOpenToc, onOpenMenu }: Props = $props()
</script>

<header style="background-color: {HEADER_COLOR}; height: {HEADER_HEIGHT}px;" inert={inert}>
  <button class="icon-button left-button" onclick={() => onOpenToc()} disabled={!psc}>
    <img alt="目次" src={tocIcon} />
  </button>

  <h1>{title}</h1>

  <button class="icon-button right-button" onclick={() => onOpenMenu()}>
    <img alt="メニュー" src={menuIcon} />
  </button>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  header h1 {
    color: white;
    margin: 14px 52px 10PX;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .left-button {
    position: fixed;
    top: 10px;
    left: 16px;
  }
  .right-button {
    position: fixed;
    top: 10px;
    right: 16px;
  }
</style>
