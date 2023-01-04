<script lang="ts">
  import type { PScLine } from '../../lib/psc'

  // コンポーネントプロパティ
  export let line: PScLine
</script>

<div>
  <p class="name"><span>{line.name}</span></p>
  <p class="text"><span>{line.text}</span></p>
</div>

<style>
  p.name {
    margin: 0.4em 0 0.1em;
    font-size: 0.9em;
    font-weight: bold;
  }
  p.text {
    margin: 0.1em 0 0.4em 1em;
  }
  span {
    overflow-wrap: anywhere;
  }
</style>
