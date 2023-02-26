<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { db } from '../lib/db'
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
  let isLoading = false

  // srcType を切り替えた時のリアクティブ処理
  $: if (srcType == 'sample') {
    disabled = !sampleSelected || isLoading
    files = null
  } else if (srcType == 'net') {
    const urlRe = /^https?:\/\/(.+\.)+.+\/.+/
    disabled = !urlRe.test(url) || isLoading
    files = null
  } else {
    disabled = !(files?.length) || isLoading
  }

  /** ウィンドウサイズに合わせてパネルの高さを調整する */
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

  /** URL から文字列を取得する */
  async function textFromUrl(url: string): Promise<string> {
    const res = await fetch(url)
    if (res.ok) {
      return await res.text()
    } else {
      throw new Error('読込めませんでした。')
    }
  }

  /** 台本の追加処理 */
  async function add() {
    isLoading = true
    // データを取得する
    try {
      let pscJson: string
      let srcUrl = ''

      if (srcType == 'sample') {
        srcUrl = sampleSelected.path
        pscJson = await textFromUrl(srcUrl)
      } else if (srcType == 'net') {
        srcUrl = url
        pscJson = await textFromUrl(srcUrl)
      } else {

      }

      if (pscJson) {
        // インスタンス生成
        const psc = PSc.fromJson(pscJson)
        // DB にデータを追加する
        await db.addScript(psc.title, pscJson, srcType, srcUrl)

        isLoading = false
        close()
      } else {
        throw Error('読込めませんでした。')
      }
    } catch(error) {
      isLoading = false
      alert(error.message)
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
          <option value="net">ネットから</option>
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
      {:else if srcType == "net"}
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
      <button
        class="cancel-button"
        disabled="{isLoading}"
        on:click="{close}"
      >キャンセル</button>
      <button disabled="{disabled}" on:click="{add}">読込む</button>
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
  .cancel-button {
    background-color: darkcyan;
  }
</style>
