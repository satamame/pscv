<svelte:options runes={true} />
<script lang="ts" module>
  export interface DndCellItem {
    id: number
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Snippet } from 'svelte'

  // コンポーネントプロパティ
  type Props = {
    items: DndCellItem[];
    onDisableScroll?: Function;
    onEnableScroll?: Function;
    onSorted?: Function;
    cell: Snippet<[DndCellItem]>;
  }
  let { items = $bindable(), ...rest }: Props = $props()
  const {
    onDisableScroll, onEnableScroll, onSorted, cell
  } = rest

  // DOM 参照
  let scrollBox: HTMLDivElement
  let cellsRow: HTMLDivElement

  let isDragging = false
  let dragStartY = 0
  let shadowEl: HTMLDivElement | undefined = undefined
  let ghostEl: HTMLDivElement | undefined = undefined
  let ghostInitialY = 0
  let targetHeight = 0
  let otherHeights: number[] = []
  let rszObsv: ResizeObserver | undefined = undefined

  // items の要素数が変わったら、各セルにドラッグ機能のための設定をする
  let itemCount = items.length
  $effect(() => {
    if (items.length != itemCount) {
      itemCount = items.length
      setTimeout(updateCells, 0)
    }
  })

  // スクロール関連
  const SCROLL_RATE = 20 // 自動スクロールは 1px/20ms とする
  let scrollItvId = 0    // 自動スクロールのインターバル ID
  let pointerPageY = 0   // pointermove イベントの座標を保持する

  /**
   * scrollBox のページ上での絶対 Y 座標を取得する
   */
  function listTop(): number {
    if (!scrollBox) {
      return 0
    }
    const scrollBoxTop = scrollBox.getBoundingClientRect().top
    return scrollBoxTop + window.scrollY
  }

  /**
   * ページ上での Y 座標をリスト上の Y 座標に変換する
   */
  function toListLocalY(pageY: number): number {
    return pageY - listTop() + scrollBox.scrollTop
  }

  /**
   * 自動スクロールダウンを開始する
   */
  function startScrollDown() {
    // すでに自動スクロールしていれば何もしない
    if (scrollItvId) return

    scrollItvId = window.setInterval(() => {
      if (scrollBox.scrollTop <= 1) {
        // スクロールが上端に達しそうなら上端にして停止
        scrollBox.scrollTo(0, 0)
        stopScrolling()
      } else {
        scrollBox.scrollBy({ top: -1, behavior: 'instant' as ScrollBehavior})
      }

      // ゴーストとシャドウの更新
      updateGhostAndShadow()

      // シャドウが scrollBox の表示領域外ならスクロールして中に入れる
      if (shadowEl) { // 型ガード
        if (shadowEl.offsetTop < scrollBox.scrollTop) {
          shadowEl.scrollIntoView()
        }
      }
    }, SCROLL_RATE)
  }

  /**
   * 自動スクロールアップを開始する
   */
   function startScrollUp() {
    // すでに自動スクロールしていれば何もしない
    if (scrollItvId) return

    const scrollBoxHeight = scrollBox.offsetHeight
    const cellsRowHeight = cellsRow.offsetHeight

    scrollItvId = window.setInterval(() => {
      let scrollBottom = scrollBox.scrollTop + scrollBoxHeight
      if (scrollBottom >= cellsRowHeight - 1) {
        // スクロールが下端に達しそうなら下端にして停止
        cellsRow.scrollIntoView(false)
        stopScrolling()
      } else {
        scrollBox.scrollBy({ top: 1, behavior: 'instant' as ScrollBehavior})
      }

      // ゴーストとシャドウの更新
      updateGhostAndShadow()

      // シャドウが scrollBox の表示領域外ならスクロールして中に入れる
      if (shadowEl) { // 型ガード
        const shadowBottom = shadowEl.offsetTop + shadowEl.offsetHeight
        scrollBottom = scrollBox.scrollTop + scrollBoxHeight
        if (shadowBottom > scrollBottom) {
          shadowEl.scrollIntoView(false)
        }
      }
    }, SCROLL_RATE)
  }

  /**
   * 自動スクロールを止める
   */
  function stopScrolling() {
    if (scrollItvId) {
      clearInterval(scrollItvId)
      scrollItvId = 0
    }
  }

  /**
   * ドラッグ開始時のイベントハンドラ
   */
  function startDragging(event: PointerEvent) {
    if (isDragging) return false
    isDragging = true

    event.preventDefault()
    if (onDisableScroll !== undefined) {
      onDisableScroll()
    }

    // カーソル変更用エリアの作成
    const cursorArea = document.createElement('div')
    cursorArea.id = 'cursor-area'
    document.documentElement.appendChild(cursorArea)
    cursorArea.style.position = 'absolute'
    cursorArea.style.top = '0'
    cursorArea.style.right = '0'
    cursorArea.style.bottom = '0'
    cursorArea.style.left = '0'
    cursorArea.style.cursor = 'grabbing'

    const handle = event.currentTarget as HTMLDivElement
    const targetCell = handle.closest('.cell') as HTMLDivElement

    // ドラッグ対象セルの高さを憶える
    targetHeight = targetCell.offsetHeight

    // ドラッグ対象以外のセルの高さをリストにして憶える
    otherHeights = []
    Array(...cellsRow.children).forEach(cell => {
      if (cell !== targetCell) {
        otherHeights.push((cell as HTMLDivElement).offsetHeight)
      }
    })

    // ドラッグ開始位置のリスト上での Y 座標を憶える
    dragStartY = toListLocalY(event.pageY)
    // ゴーストの初期位置の Y 座標を憶える (border を考慮して -1 する)
    ghostInitialY = targetCell.offsetTop - 1

    // ゴーストの作成
    ghostEl = targetCell.cloneNode(true) as HTMLDivElement
    ghostEl.id = 'ghost'
    ghostEl.style.borderBottom = 'solid 1px darkgray'
    ghostEl.style.borderTop = 'solid 1px darkgray'
    ghostEl.style.opacity = '0.5'
    scrollBox.appendChild(ghostEl)
    ghostEl.style.position = 'absolute'
    ghostEl.style.top = `${ghostInitialY}px`
    ghostEl.style.left = '0'
    ghostEl.style.right = '0'

    // 対象セルのシャドウ化
    shadowEl = targetCell
    const overlay = document.createElement('div')
    overlay.id = 'cell-overlay'
    overlay.style.backgroundColor = 'lightgray'
    overlay.style.opacity = '0.5'
    shadowEl.appendChild(overlay)
    overlay.style.position = 'absolute'
    overlay.style.top = '0'
    overlay.style.right = '0'
    overlay.style.bottom = '0'
    overlay.style.left = '0'

    // ドラッグ中とドラッグ終了時のイベントリスナーをセットする
    document.addEventListener('pointermove', dragging, { passive: false })
    document.addEventListener('pointerup', endDragging, { passive: false })
    document.addEventListener('pointercancel', endDragging, { passive: false })
  }

  /**
   * ゴーストとシャドウを更新する
   */
  function updateGhostAndShadow() {
    if (ghostEl === undefined) { // 型ガード
      return
    }
    if (shadowEl === undefined) { // 型ガード
      return
    }

    // ゴーストの移動先を求める
    const deltaY = toListLocalY(pointerPageY) - dragStartY
    let ghostY = ghostInitialY + deltaY

    // ゴーストが表示領域から出ないよう補正する
    ghostY = Math.max(ghostY, scrollBox.scrollTop - 1)
    const scrollBottom = scrollBox.scrollTop + scrollBox.offsetHeight
    ghostY = Math.min(ghostY, scrollBottom - ghostEl.offsetHeight + 1)

    // ゴーストの移動
    ghostEl.style.top = `${ghostY}px`

    // シャドウの移動先判定
    let totalH = 0
    let shadowPos = 0
    for (const curH of otherHeights){
      if (totalH + Math.min(targetHeight, curH / 2) > ghostY + 1) {
        break
      }
      totalH += curH
      shadowPos++
    }

    // シャドウの移動
    if (cellsRow.children[shadowPos] !== shadowEl) {
      cellsRow.removeChild(shadowEl)
      if (shadowPos < cellsRow.children.length) {
        cellsRow.children[shadowPos].before(shadowEl)
      } else {
        cellsRow.children[shadowPos - 1].after(shadowEl)
      }
    }
  }

  /**
   * ドラッグ中のイベントハンドラ
   */
  function dragging(event: PointerEvent) {
    // ドラッグ中しか呼ばれない想定だが念のためフラグをチェックする
    if (!isDragging) return false

    event.preventDefault()

    if (ghostEl === undefined) { // 型ガード
      return
    }

    // 自動スクロールをいったん止める
    stopScrolling()

    // ゴーストとシャドウの更新
    pointerPageY = event.pageY
    updateGhostAndShadow()

    // 必要なら自動スクロールダウンを開始する
    if (ghostEl.offsetTop < scrollBox.scrollTop) {
      startScrollDown()
      return
    }

    // 必要なら自動スクロールアップを開始する
    const ghostBottom = ghostEl.offsetTop + ghostEl.offsetHeight
    const scrollBottom = scrollBox.scrollTop + scrollBox.offsetHeight
    if (ghostBottom > scrollBottom) {
      startScrollUp()
    }
  }

  /**
   * ドラッグ終了時のイベントハンドラ
   */
  function endDragging(event: PointerEvent) {
    // ドラッグ中しか呼ばれない想定だが念のためフラグをチェックする
    if (!isDragging) return false

    event.preventDefault()

    // 自動スクロールを止める
    stopScrolling()

    // ドラッグ中とドラッグ終了時のイベントリスナーを削除する
    document.removeEventListener('pointermove', dragging)
    document.removeEventListener('pointerup', endDragging)
    document.removeEventListener('pointercancel', endDragging)

    // ゴーストの破棄
    if (ghostEl) { // 型ガード
      scrollBox.removeChild(ghostEl)
      ghostEl = undefined
    }

    if (shadowEl) { // 型ガード
      // シャドウのオーバーレイを削除する
      const overlay = shadowEl.querySelector('#cell-overlay')
      if (overlay) {
        shadowEl.removeChild(overlay)
      }

      // items を並べ替える
      // セルの ID が 'cell' + item.id なので4文字目からが item の id
      const targetId = parseInt(shadowEl.id.substring(4))
      const targetItem = items.filter(item => item.id == targetId)[0]
      const orgPos = items.indexOf(targetItem)
      const destPos = Array(...cellsRow.children).indexOf(shadowEl)

      const ids = items.map(item => item.id)
      if (orgPos != destPos) {
        // 並べ替えた ID の配列を作る
        ids.splice(orgPos, 1)
        ids.splice(destPos, 0, targetItem.id)

        // 親の onSorted ハンドラで items をソートする
        if (onSorted !== undefined) {
          onSorted(ids)
        }
      }
    }

    if (onEnableScroll !== undefined) {
      onEnableScroll()
    }

    // カーソル変更用エリアを削除する
    const cursorArea = document.getElementById('cursor-area')
    if (cursorArea) {
      document.documentElement.removeChild(cursorArea)
    }

    isDragging = false
  }

  /**
   * ドラッグハンドラのクリックイベントを伝播させないための関数
   * 無名関数にすると addEventListener するたびに追加されるので、
   * 名前のある関数にする
   */
  function cancelEvent(event: Event) {
    event.stopPropagation()
  }

  /**
   * 各セルにドラッグ機能のための設定をする
   */
  function updateCells() {
    items.forEach(item => {
      // 各セルの ID は 'cell' + item.id
      const cell = cellsRow.querySelector(`#cell${item.id}`) as HTMLDivElement
      const handle = cell.querySelector('#dragHandle') as HTMLElement

      // 独自のドラッグ処理をするためブラウザでのドラッグを無効にする
      handle.draggable = false
      handle.style.touchAction = 'pinch-zoom'

      // ドラッグハンドルにマウスポインタのスタイルを設定する
      handle.style.cursor = 'grab'

      // ドラッグハンドルにイベントリスナーを追加する
      handle.addEventListener('pointerdown', startDragging, { passive: false })
      // Safari でドラッグ終了時にクリックハンドラを呼ばれないようにする
      handle.addEventListener('click', cancelEvent)
    })

    // スクロールの可否を判定・設定する
    updateScrollBar()
  }

  /**
   * scrollBox のスクロールの可否を判定・設定する
   */
  function updateScrollBar() {
    // bottom-line なしの状態での cell 全体の高さを求める
    let cellsHeight = cellsRow.offsetHeight
    const lastCell = cellsRow.lastElementChild as HTMLDivElement
    if (!lastCell) return
    if (lastCell.classList.contains('bottom-line')) {
      cellsHeight--
    }

    // cell 全体の高さが scrollBox にぴったりかそれ以下ならスクロールしない
    // ドラッグ時にゴーストを動かしてもスクロールバーが出ないようにするため
    if (cellsHeight <= scrollBox.clientHeight) {
      scrollBox.style.overflowY = 'hidden'
    } else {
      scrollBox.style.overflowY = 'scroll'
    }

    // cell 全体の高さが scrollBox より低ければ bottom-line クラスを追加する
    const needsBottomLine = cellsHeight < scrollBox.clientHeight
    Array(...cellsRow.children).forEach((cell: Element) => {
      if (needsBottomLine) {
        cell.classList.add('bottom-line')
      } else {
        cell.classList.remove('bottom-line')
      }
    })
  }

  onMount(() => {
    // 各セルにドラッグ機能のための設定をする
    updateCells()

    // scrollBox または cellsRow のサイズが変わったらスクロールの可否を更新
    rszObsv = new ResizeObserver((entries, obsv) => {
      updateScrollBar()
    })
    rszObsv.observe(scrollBox)
    rszObsv.observe(cellsRow)
  })

  onDestroy(() => {
    if (rszObsv) {
      rszObsv.disconnect()
    }
  })
</script>

<div class="scroll-box" bind:this={scrollBox}>
  <div bind:this={cellsRow}>
    {#each items as item (item.id)}
      {@render cell(item)}
    {/each}
  </div>
</div>

<style>
  .scroll-box {
    position: relative;
    height: 100%;
    overflow-y: auto;
  }
</style>

<!--
  app.css の前提条件
  - すべての要素が box-sizing: border-box; となっていること。

  このコンポーネントのルール
  - cellsRow に cell 以外の子要素を追加しないこと。
  - scrollBox の表示領域に収まらない cell はサポート外。
  - 親が onDisableScroll イベントを受け取ったら、scrollBox 以外のスクロールをロックすること。
  - 親が onEnableScroll イベントを受け取ったら、scrollBox 以外のスクロールロックを解除すること。
  - 親が onSorted イベントを受け取ったら、ids に合わせて items をソートすること。

  cell の前提条件
  - item の型は DndCellItem を継承していること。
  - 'cell' + item.id を要素の id の値とすること。
  - last-child 以外は border-bottom が 1px であること。
  - ただし bottom-line クラスなら last-child であっても 1px であること。
  - id="dragHandle" であるドラッグハンドル用の要素があること。
-->
