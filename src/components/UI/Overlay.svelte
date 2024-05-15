<!-- svelte-ignore export_let_unused -->
<script lang="ts">
  /**
   * Overlay component for modal interface
   */
  // コンポーネントプロパティ
  export let color = 'black'
  export let opacity = 0.25
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  style:background-color="{color}"
  style:opacity
  on:click
  role="dialog"
></div>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
