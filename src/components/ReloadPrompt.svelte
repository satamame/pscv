<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });

  function close() {
    offlineReady.set(false)
    needRefresh.set(false)
  }

  $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
  <div
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      {#if $needRefresh}
        <span>
          台本ビューアの新しいバージョンがあります。今すぐ更新しますか？
        </span>
      {:else}
        <span>
          台本ビューアがキャッシュされてオフラインで使用可能になりました。
        </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button on:click={() => updateServiceWorker(true)}>
        更新する
      </button>
    {/if}
    <button on:click={close}>
      閉じる
    </button>
  </div>
{/if}

<style>
  .pwa-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 2px solid #444;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 4px 4px 8px 0 darkgray;
    background-color: white;
  }
  .pwa-toast .message {
    font-size: larger;
    margin-bottom: 8px;
  }
  .pwa-toast button {
    font-size: larger;
    border: 1px solid #444;
    outline: none;
    margin-right: 12px;
    border-radius: 4px;
    padding: 4px 10px;
  }
</style>
