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
    margin: 0.8em 0 0.8em 3.5em;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
