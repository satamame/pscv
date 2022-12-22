<script lang="ts">
  import { HEADER_COLOR, HEADER_HEIGHT } from '../lib/const'
  import { createEventDispatcher } from 'svelte'

  // 画像ファイルを参照
  import tocIcon from '/ui_icon/toc_black_24dp.svg'
  import menuIcon from '/ui_icon/menu_open_black_24dp.svg'

  const dispatch = createEventDispatcher()

  // コンポーネントプロパティ
  export let title: string
</script>

<header style="background-color: {HEADER_COLOR}; height: {HEADER_HEIGHT}px;">
  <button class="icon-button left-button" on:click="{() => dispatch('openToc')}" >
    <img alt="目次" src="{tocIcon}" />
  </button>

  <h1>{title}</h1>

  <button class="icon-button right-button" on:click="{() => dispatch('openMainMenu')}" >
    <img alt="メニュー" src="{menuIcon}" />
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
