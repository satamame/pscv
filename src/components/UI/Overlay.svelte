<svelte:options runes={true} />
<script lang="ts">
  /**
   * Overlay component for modal interface
   */
  // コンポーネントプロパティ
  type Props = {
    color?: string;     // オーバーレイの色
    opacity?: number;   // オーバーレイの不透明度
    onClick: Function;  // クリックされた時の親の振る舞い
  }
  const { color = 'black', opacity = 0.25, onClick }: Props = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  style:background-color="{color}"
  style:opacity
  onclick="{() => onClick()}"
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
