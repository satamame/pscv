<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { HEADER_HEIGHT, SAMPLES } from '../lib/const'
  import { PSc } from '../lib/psc'

  // 子コンポーネント
  import Overlay from './Overlay.svelte'
  import Spinner from './Spinner.svelte'

  // 要素のインスタンス
  let panel: HTMLDivElement

  const dispatch = createEventDispatcher()

  let gone = true
  let srcType = 'sample'
  let sampleSelected = SAMPLES[0]
  let url = ''
  let files: FileList | null = null
  let disabled = false
  let maxHeight = window.innerHeight - HEADER_HEIGHT - 10
  let pscFetched: PSc | null = null
  let isLoading = false

  // srcType を切り替えた時のリアクティブ処理
  $: if (srcType == 'sample') {
    disabled = !sampleSelected
    files = null
  } else if (srcType == 'url') {
    disabled = !url
    files = null
  } else {
    disabled = !(files?.length)
  }

  /** ウィンドウサイズに合わせて高さを調整する */
  function adjustHeight() {
    maxHeight = window.innerHeight - HEADER_HEIGHT - 10
  }

  onMount(async () => {
    window.addEventListener('resize', adjustHeight)
    setTimeout(() => { gone = false }, 0)
  })

  export function close() {
    // Back ボタンで閉じる場合の処理は親が受け持つ
    if (gone || isLoading) { return }
    gone = true
    window.removeEventListener('resize', adjustHeight)
    setTimeout(() => {
      dispatch('close')
    }, 200)
  }

  /** 台本の追加処理 */
  async function add() {
    isLoading = true
    try {
      if (srcType == 'sample') {
        pscFetched = await PSc.fromUrl(sampleSelected.path)
      } else if (srcType == 'url') {
        pscFetched = await PSc.fromUrl(url)
      } else {

      }
      if (pscFetched) {
        isLoading = false
        dispatch('addPSc', { psc: pscFetched })
        close()
      } else {
        throw Error()
      }
    } catch(error) {
      alert('読み込めませんでした。')
      isLoading = false
    }
  }
</script>

<div class="overlay" class:gone>
  <Overlay on:click="{close}" />
</div>

<div
  bind:this="{panel}"
  class="panel"
  class:gone
  style:top="{HEADER_HEIGHT}px"
  style:max-height="{maxHeight}px"
>
  <div class="container">
    <h2>台本の追加</h2>
    <div>
      <label>どこから読込みますか？
        <select bind:value="{srcType}">
          <option value="sample">サンプルから</option>
          <option value="url">ネットから</option>
          <option value="file">ファイルから</option>
        </select>
      </label>
    </div>
    <div>
      {#if srcType == "sample"}
        <label>サンプルを選んでください。
          <select bind:value="{sampleSelected}">
            {#each SAMPLES as sample }
              <option value="{sample}">{sample.title}</option>
            {/each}
          </select>
        </label>
      {:else if srcType == "url"}
        <label>URL を入力してください。
          <input type="text" bind:value="{url}" />
        </label>
      {:else}
        <label>ファイルを選んでください。
          <input type="file" bind:files accept="text/json" />
        </label>
      {/if}
    </div>
    <div class="buttonArea">
      <button on:click="{close}">キャンセル</button>
      <button on:click="{add}" disabled="{disabled}">読込む</button>
    </div>
  </div>
</div>

{#if isLoading}
  <Spinner />
{/if}

<style>
  .panel {
    position: fixed;
    left: 10px;
    right: 10px;
    padding: 10px;
    border-radius: 6px;
    background: white;
    overflow: auto;
    transition: transform 0.2s, opacity 0.2s;
  }
  .panel.gone {
    transform: translateY(270px);
    opacity: 0;
  }
  .overlay {
    transition: opacity 0.2s;
  }
  .overlay.gone {
    opacity: 0;
  }
  .container {
    margin: 16px 16px 14px;
  }
  .container h2 {
    margin-left: 0;
    margin-bottom: 24px;
  }
  .container div {
    margin-top: 16px;
  }
  select, input {
    margin: 8px auto;
  }
  .buttonArea {
    margin-top: 40px;
    text-align: center;
  }
  .buttonArea > button {
    min-width: 108px;
    margin: 8px 4px;
  }
</style>
