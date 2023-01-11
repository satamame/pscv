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

  let container

  // スクロール位置を top の値に合わせる
  $: if (container) {
    container.style.top = `${top}px`
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
