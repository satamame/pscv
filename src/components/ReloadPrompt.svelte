<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { appUpdateAvailable } from '../lib/store'
  import { useRegisterSW } from 'virtual:pwa-register/svelte'

  const dispatch = createEventDispatcher()

  let closed = false

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(url, swr) {
      console.log(`SW registered: ${url}, ${swr}`)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  });

  function close() {
    closed = true
    if ($needRefresh) { appUpdateAvailable.set(true) }
  }

  export function updateSW() {
    if (!closed) {
      closed = true
      updateServiceWorker(true)
    } else {
      if ($needRefresh) {
        updateServiceWorker(true)
      } else {
        alert('新しいバージョンが見つかりませんでした。')
      }
    }
  }

  $: toast = !closed && ($offlineReady || $needRefresh)
</script>

{#if toast}
  <div class="pwa-toast" role="alert" transition:fade="{{ duration: 100 }}">
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
      <button on:click="{updateSW}">
        更新する
      </button>
    {/if}
    <button on:click="{close}">
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
    border: 1px solid #555;
    border-radius: 6px;
    z-index: 1;
    text-align: left;
    box-shadow: 2px 2px 8px 0 darkgray;
    background-color: #FFFDF6;
  }
  .pwa-toast .message {
    font-size: large;
    margin-bottom: 12px;
  }
  .pwa-toast button {
    font-size: medium;
    outline: none;
    margin-right: 12px;
    padding: 4px 10px;
  }
</style>
