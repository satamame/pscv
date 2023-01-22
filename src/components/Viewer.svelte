<script lang="ts">
  import { HEADER_HEIGHT } from '../lib/const'

  import type { PSc } from '../lib/psc'
  import { PSC_LINE_TYPE } from '../lib/psc'

  import Title from './PScLine/Title.svelte'
  import Author from './PScLine/Author.svelte'
  import CharsHeadline from './PScLine/CharsHeadline.svelte'
  import Character from './PScLine/Character.svelte'
  import Headline1 from './PScLine/Headline1.svelte'
  import Headline2 from './PScLine/Headline2.svelte'
  import Headline3 from './PScLine/Headline3.svelte'
  import Direction from './PScLine/Direction.svelte'
  import Dialogue from './PScLine/Dialogue.svelte'
  import Endmark from './PScLine/Endmark.svelte'
  import Comment from './PScLine/Comment.svelte'

  // コンポーネントプロパティ
  export let psc: PSc | undefined
  export let top = HEADER_HEIGHT

  let container: HTMLDivElement

  // コンポーネントの外から Y 座標を操作できるようにする
  $: if (container) {
    container.style.top = `${top}px`
  }

  /** 行の Y 座標を返す */
  export function getLineY(index: number): number {
    if (index == 0) {
      return 0
    }
    // 行には必ず <p> があるので children[0] を対象とする
    const target = container.children[index].children[0] as HTMLElement
    const marginTop = window.getComputedStyle(target).marginTop
    const y = target.offsetTop - parseFloat(marginTop)
    return y
  }

  /** 見出し行の Y 座標を返す */
  export function getHeadlineY(index: number): number {
    return getLineY(psc.headlines[index].lineIndex)
  }

  /* DEBUG */
  // let topIndex = 0

  /** 指定した Y 座標以下にある最初の行の番号を返す */
  export function getLineIndexAtY(y: number): number {
    let min = 0
    let max = psc.lines.length - 1
    let mid: number
    while (true) {
      mid = Math.floor((min + max) / 2)
      if (mid == min) {
        break
      }
      const prevLineY = getLineY(mid - 1)
      const midLineY = getLineY(mid)
      if (prevLineY < y) {
        min = mid
      } else if (midLineY >= y) {
        max = mid
      }
    }

    /* DEBUG */
    // console.log(`**** Line index at ${y}: ${mid}`)
    // if (topIndex != mid) {
    //   (container.children[topIndex] as HTMLDivElement).style.backgroundColor = 'transparent';
    //   topIndex = mid;
    //   (container.children[topIndex] as HTMLDivElement).style.backgroundColor = 'red';
    //   console.log(`**** Headline No.: ${psc.headlineForline(topIndex)}`)
    // }

    return mid
  }
</script>

<div bind:this="{container}" class="container">
  {#if psc}
    {#each psc.lines as line }
      {#if line.type == PSC_LINE_TYPE.TITLE}
        <Title bind:line />
      {:else if line.type == PSC_LINE_TYPE.AUTHOR}
        <Author bind:line />
      {:else if line.type == PSC_LINE_TYPE.CHARSHEADLINE}
        <CharsHeadline bind:line />
      {:else if line.type == PSC_LINE_TYPE.CHARACTER}
        <Character bind:line />
      {:else if line.type == PSC_LINE_TYPE.H1}
        <Headline1 bind:line />
      {:else if line.type == PSC_LINE_TYPE.H2}
        <Headline2 bind:line />
      {:else if line.type == PSC_LINE_TYPE.H3}
        <Headline3 bind:line />
      {:else if line.type == PSC_LINE_TYPE.DIRECTION}
        <Direction bind:line />
      {:else if line.type == PSC_LINE_TYPE.DIALOGUE}
        <Dialogue bind:line />
      {:else if line.type == PSC_LINE_TYPE.ENDMARK}
        <Endmark bind:line />
      {:else if line.type == PSC_LINE_TYPE.COMMENT}
        <Comment bind:line />
      {/if}
    {/each}
  {/if}
</div>

<style>
  .container {
    position: absolute;
    left: 0;
    right: 0;
    padding: 8px 12px 12px 18px;
  }
</style>
