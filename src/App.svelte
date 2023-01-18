<script lang="ts">
  import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

  import { isPwa, isAndroid, isIOS } from './lib/env'
  import { HEADER_HEIGHT } from './lib/const'
  import type { BackFunc } from './lib/back'
  import { initBackHandler } from './lib/back'

  import type { PSc } from './lib/psc'

  // 子コンポーネント
  import Viewer from './components/Viewer.svelte'
  import Header from './components/Header.svelte'
  import Toc from './components/Toc.svelte'
  import MainMenu from './components/MainMenu.svelte'
  import Data from './components/Data.svelte'
  import About from './components/About.svelte'
  import ReloadPrompt from './components/ReloadPrompt.svelte'

  let viewer: Viewer
  let toc: Toc
  let menu: MainMenu
  let data: Data
  let about: About

  // パネル開閉状態
  let tocIsOpen = false
  let menuIsOpen = false
  let dataIsOpen = false
  let aboutIsOpen = false
  let reloadIsOpen = true

  let viewerTop = HEADER_HEIGHT
  // let viewerOpacity = 1

  // スクロールロックを解除した直後に実行するコールバック
  let scrollUnlockDoneCb: (() => void) | null = null

  let psc: PSc | undefined
  $: title = psc?.title ?? '台本ビューア'
  $: isModal = tocIsOpen || menuIsOpen || dataIsOpen || aboutIsOpen

  // Scroll lock/unlock
  $: if (viewer) {
    if (isModal) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }

  // Initialize Android's back button handler
  if (isAndroid) {
    initBackHandler((): BackFunc => {
      // This callback returns functions to be invoked by back button
      return {
        toc: toc?.close,
        menu: menu?.close,
        data: data?.close,
        about: about?.close,
      }
    })
  }

  /** スクロールロックする */
  function lockScroll(): void {
    // iOS の場合は style を書き換える方法を使う
    if (isIOS) {
      const root = document.documentElement
      const scrollTop = root.scrollTop
      root.style.position = 'fixed'
      viewerTop = HEADER_HEIGHT - scrollTop
    }
  }
  // iOS 以外では body-scroll-lock を使う
  $: if (!isIOS) {
    if (toc) { disableBodyScroll(toc) }
    if (menu) { disableBodyScroll(menu) }
    if (data) { disableBodyScroll(data) }
    if (about) { disableBodyScroll(about) }
  }

  /** スクロールロックを解除する */
  function unlockScroll(): void {
    if (isIOS) {
      // iOS の場合は style を書き換える方法を使う
      const root = document.documentElement
      const scrollTop = HEADER_HEIGHT - viewerTop
      // if (scrollUnlockBehavior?.hideFlicker) {
      //   viewerOpacity = 0
      // }
      viewerTop = HEADER_HEIGHT
      root.style.position = 'static'
      root.scrollTop = scrollTop
    } else {
      // iOS 以外では body-scroll-lock を使う
      clearAllBodyScrollLocks()
    }
    if (scrollUnlockDoneCb) {
      scrollUnlockDoneCb()
      scrollUnlockDoneCb = null
    }

    // setTimeout(() => {
    //   viewerOpacity = 1
    //   // コールバックがあれば実行して削除する
    //   if (scrollUnlockBehavior) {
    //     scrollUnlockBehavior.callback()
    //     scrollUnlockBehavior = null
    //   }
    // }, 0)
  }

  /** スクロールロック解除後、指定の見出し行にスクロールする */
  function goToHeadline(index: number): void {
    scrollUnlockDoneCb = () => {
        const root = document.documentElement
        const offsetY = viewer.getHeadlineOffsetY(index)
        root.scrollTop = offsetY

      // iOS はむしろ一瞬消えるのが目立つので Android のみ hide する
      // hideFlicker: isAndroid,
    }
  }
</script>

<Viewer
  bind:this="{viewer}"
  bind:psc
  bind:top="{viewerTop}"
/>
<!-- bind:opacity="{viewerOpacity}" -->

<Header
  bind:title
  bind:psc
  on:openToc="{() => { tocIsOpen = true }}"
  on:openMainMenu="{() => { menuIsOpen = true }}"
/>

{#if psc && tocIsOpen}
  <Toc
    bind:this="{toc}"
    bind:psc
    on:close="{() => { tocIsOpen = false }}"
    on:goToHeadline="{(e) => { goToHeadline(e.detail.index) }}"
  />
{/if}

{#if menuIsOpen}
  <MainMenu
    bind:this="{menu}"
    on:close="{() => { menuIsOpen = false }}"
    on:openData="{() => { dataIsOpen = true }}"
    on:openAbout="{() => { aboutIsOpen = true }}"
  />
{/if}

{#if dataIsOpen}
  <Data
    bind:this="{data}"
    on:close="{() => { dataIsOpen = false }}"
    on:showPSc="{(e) => { psc = e.detail.psc }}"
  />
{/if}

{#if aboutIsOpen}
  <About
    bind:this="{about}"
    on:close="{() => { aboutIsOpen = false }}"
  />
{/if}

{#if isPwa && reloadIsOpen}
  <ReloadPrompt
    on:close="{() => { reloadIsOpen = false }}"
  />
{/if}
