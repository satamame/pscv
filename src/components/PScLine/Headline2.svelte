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
    margin: 0.8em 0 0.6em;
    font-size: 1.1em;
    font-weight: bold;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
