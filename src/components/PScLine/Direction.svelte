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
  <p><span>{line.text}</span></p>
</div>

<style>
  p {
    margin: 0.8em 0 0.8em 3.5em;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
