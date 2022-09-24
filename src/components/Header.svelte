<script lang="ts">
  import { headerColor } from '../lib/const'
  import { createEventDispatcher } from 'svelte'

  import tocIcon from '/ui_icon/toc_black_24dp.svg'
  import menuIcon from '/ui_icon/menu_open_black_24dp.svg'

  const dispatch = createEventDispatcher()
</script>

<header style="background-color: {headerColor};">
  <button class="left-button" on:click="{() => dispatch('openToc')}" >
    <img alt="目次" src="{tocIcon}" />
  </button>

  <h1>タイトル</h1>

  <button class="right-button" on:click="{() => dispatch('openMainMenu')}" >
    <img alt="メニュー" src="{menuIcon}" />
  </button>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    text-align: center;
  }
  header h1 {
    color: white;
    font-size: 24px;
    line-height: 24px;
    margin: 14px 52px 10PX;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button {
    width: 28px;
    height: 28px;
    border-width: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }
  button img {
    width: 100%;
    height: 100%;
  }
  button.left-button {
    position: fixed;
    top: 10px;
    left: 16px;
  }
  button.right-button {
    position: fixed;
    top: 10px;
    right: 16px;
  }
</style>
