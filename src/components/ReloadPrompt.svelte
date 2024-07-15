<svelte:options runes={true} />
<script lang="ts">
  import { fade } from 'svelte/transition'
  import { useRegisterSW } from 'virtual:pwa-register/svelte'

  import { isPwa } from '../lib/env'
  import { appUpdateFunc } from '../lib/store'

  // 子コンポーネント
  import Spinner from './UI/Spinner.svelte'

  // コンポーネントプロパティ
  type Props = {
    onClose: Function;  // 親が更新プロンプトを閉じるハンドラ
  }
  const { onClose }: Props = $props()

  let gone = $state(false)
  let isLoading = $state(false)

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    // SW が登録された時に呼ばれるメソッド
    onRegisteredSW(url, swr) {
      console.log(`SW registered: ${url}, ${swr}`)
    },
    // SW の登録に失敗した時に呼ばれるメソッド
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  });

  function close() {
    if (gone) { return }
    gone = true
    if ($needRefresh) { appUpdateFunc.set(updateServiceWorker) }
    setTimeout(() => onClose(), 100)
  }

  function update() {
    if (isLoading) { return }
    isLoading = true
    updateServiceWorker(true)
  }

  // ブラウザ実行時はトーストを表示しない
  let toast = $derived(isPwa && !gone && ($offlineReady || $needRefresh))
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
      <button onclick="{update}">
        更新する
      </button>
    {/if}
    <button onclick="{close}">
      閉じる
    </button>
  </div>
{/if}

{#if isLoading}
  <Spinner />
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
    outline: none;
    margin-right: 12px;
    padding: 4px 10px;
  }
</style>
