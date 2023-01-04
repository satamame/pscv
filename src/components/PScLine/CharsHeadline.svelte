<script lang="ts">
  import type { PScLine } from '../../lib/psc'

  // コンポーネントプロパティ
  export let line: PScLine
</script>

<div>
  <p><span>{line.text}</span></p>
</div>

<style>
  p {
    margin: 0.4em 0;
    font-weight: bold;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
