<svelte:options runes={true} />
<script lang="ts">
  import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

  import { isAndroid, isIOS } from './lib/env'
  import { HEADER_HEIGHT } from './lib/const'
  import type { BackFunc } from './lib/back'
  import { initBackHandler } from './lib/back'
  import type { PSc } from './lib/psc'

  // 子コンポーネント
  import Viewer from './components/Viewer.svelte'
  import Header from './components/Header.svelte'
  import Toc from './components/Toc.svelte'
  import MainMenu from './components/MainMenu.svelte'
  import DataList from './components/DataList.svelte'
  import About from './components/About.svelte'
  import ReloadPrompt from './components/ReloadPrompt.svelte'

  // 子コンポーネントのインスタンス
  let viewer: Viewer
  let toc: Toc | undefined = $state(undefined)
  let menu: MainMenu | undefined = $state(undefined)
  let data: DataList | undefined = $state(undefined)
  let about: About | undefined = $state(undefined)

  // パネル開閉状態
  let tocIsOpen = $state(false)
  let menuIsOpen = $state(false)
  let dataIsOpen = $state(false)
  let aboutIsOpen = $state(false)
  let reloadIsOpen = $state(true)

  const rootElement = document.documentElement
  let viewerTop = $state(HEADER_HEIGHT)
  let psc: PSc | undefined = $state(undefined)
  let currentTocIndex = $state(0)

  // スクロールロックを解除した直後に実行するコールバック
  let onUnlockScroll: (() => void) | null = null

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

  // Notes: $derived で以下のように書くと TypeScript がエラーを出す
  // let title = $derived(psc?.title ?? '台本ビューア')
  let title = $derived.by(() => psc?.title ?? '台本ビューア')

  let isModal = $derived(tocIsOpen || menuIsOpen || dataIsOpen || aboutIsOpen)

  // モーダル状態が変わった時の処理
  $effect(() => {
    if (viewer) {
      if (isModal) {
        lockScroll()
      } else {
        unlockScroll()
      }
    }
  })

  /** スクロールロックする */
  function lockScroll(): void {
    // iOS の場合は style を書き換える方法を使う
    if (isIOS) {
      const scrollTop = rootElement.scrollTop
      rootElement.style.position = 'fixed'
      viewerTop = HEADER_HEIGHT - scrollTop
    }
  }
  // iOS 以外では body-scroll-lock を使う
  // body-scroll-lock の disableBodyScroll の引数に合わせて型アサーションする
  $effect(() => {
    if (!isIOS) {
      if (toc) {
        disableBodyScroll(toc as unknown as HTMLElement)
      } else if (menu) {
        disableBodyScroll(menu as unknown as HTMLElement)
      } else if (data) {
        disableBodyScroll(data as unknown as HTMLElement)
      } else if (about) {
        disableBodyScroll(about as unknown as HTMLElement)
      }
    }
  })

  /** スクロールロックを解除する */
  function unlockScroll(): void {
    if (isIOS) {
      // iOS の場合は style を書き換える方法を使う
      const scrollTop = HEADER_HEIGHT - viewerTop
      viewerTop = HEADER_HEIGHT
      rootElement.style.position = 'static'
      rootElement.scrollTop = scrollTop
    } else {
      // iOS 以外では body-scroll-lock を使う
      clearAllBodyScrollLocks()
    }
    // コールバックがあれば実行する
    if (onUnlockScroll) {
      setTimeout(() => {
        onUnlockScroll && onUnlockScroll()
        onUnlockScroll = null
      }, 0)
    }
  }

  /** スクロールロック解除後に見出し行に移動するという設定をする */
  function goToHeadline(index: number): void {
    onUnlockScroll = () => {
      const y = viewer.getHeadlineY(index)
      rootElement.scrollTop = y
    }
  }

  /** スクロール位置の見出しを判定してから目次を開く */
  function openToc(): void {
    if (!psc) { // 型ガード
      return
    }
    const currentLineIndex = viewer.getLineIndexAtY(rootElement.scrollTop)
    currentTocIndex = psc.headlineForLine(currentLineIndex)
    tocIsOpen = true
  }

  /* DEBUG */
  // window.addEventListener('scroll', (e) => {
  //   console.log('**** scrolling...')
  //   viewer.getLineIndexAtY(rootElement.scrollTop)
  // })
</script>

<Viewer
  bind:this="{viewer}"
  psc="{psc}"
  top="{viewerTop}"
  inert="{isModal}"
/>

<Header
  title="{title}"
  psc="{psc}"
  inert="{isModal}"
  onOpenToc="{openToc}"
  onOpenMainMenu="{() => menuIsOpen = true }"
/>

{#if psc && tocIsOpen}
  <Toc
    bind:this="{toc}"
    psc="{psc}"
    current="{currentTocIndex}"
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
  <DataList
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

{#if reloadIsOpen}
  <ReloadPrompt
    on:close="{() => { reloadIsOpen = false }}"
  />
{/if}
