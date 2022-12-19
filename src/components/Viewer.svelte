<script lang="ts">
  import type { PSc } from '../lib/psc'

  export let psc: PSc | undefined
</script>

<div>
  {#if psc}
    {#each psc.lines as line }
      <p>{line.name ?? ''} : {line.text ?? ''}</p>
    {/each}
  {/if}
</div>
