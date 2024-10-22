<svelte:options runes={true} />
<script lang="ts">
  import type { PScLine } from '../../lib/psc'

  // コンポーネントプロパティ
  type Props = {
    line: PScLine;  // 表示する行
  }
  const { line }: Props = $props()
</script>

<div>
  <p class="name"><span>{line.name}</span></p>
  {#if line.text}
    <p class="text"><span>{line.text}</span></p>
  {/if}
</div>

<style>
  p.name {
    margin: 0.4em 0 0.1em 1em;
  }
  p.text {
    margin: 0.1em 0 0.4em 3em;
    font-size: 0.9em;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
