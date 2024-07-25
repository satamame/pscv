<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte'

  import { db, getScTitle } from '../lib/db'
  import type { ScriptIndex, ScriptData } from '../lib/db'
  import { HEADER_HEIGHT } from '../lib/const'

  // 子コンポーネント
  import Overlay from './UI/Overlay.svelte'
  import Spinner from './UI/Spinner.svelte'

  // 画像ファイルを参照
  import closeIcon from '/ui_icon/close_black_24dp.svg'
  import editIcon from '/ui_icon/edit_black_24dp.svg'

  // コンポーネントプロパティ
  type Props = {
    scIndexId: number;    // 台本インデックスの ID
    onClose: Function;    // 親が台本情報パネルを閉じるハンドラ
  }
  const { scIndexId, onClose }: Props = $props()

  let gone = $state(true)
  let maxHeight = $state(window.innerHeight - HEADER_HEIGHT - 10)
  let isLoading = $state(false)
  let scIndex: ScriptIndex | undefined = $state()
  let scData: ScriptData | undefined = $state()

  /** ウィンドウサイズに合わせてパネルの高さを調整する */
  function adjustHeight() {
    maxHeight = window.innerHeight - HEADER_HEIGHT - 10
  }

  onMount(async () => {
    // リサイズ時に高さを調整するハンドラを設定する
    window.addEventListener('resize', adjustHeight)

    // 台本インデックスを DB から取得する
    scIndex = await db.scriptIndex.get(scIndexId)
    if (scIndex) { // 型ガード
      // 台本データを DB から取得する
      scData = await db.scriptData.get(scIndex.scriptId)
    }

    /// Back ボタンに反応するようにする
    setTimeout(() => gone = false, 0)
  })

  export function close() {
    if (gone || isLoading) { return }
    gone = true
    window.removeEventListener('resize', adjustHeight)

    // close イベントを発行して親に処理してもらう
    setTimeout(() => {
      onClose()
    }, 200)
  }

  /** 表示中の台本を削除してパネルを閉じる */
  async function deleteScript() {
    if (!scIndex) { // 型ガード
      alert('すでに削除されています。')
      return
    }

    const approved = confirm(`「${scIndex.name}」を削除します。`)
    if (!approved) { return }

    isLoading = true
    await db.deleteScript(scIndex.scriptId)
    isLoading = false
    close()
  }
</script>

<div class="overlay" class:gone>
  <Overlay onClick={close} />
</div>

<div
  class="panel"
  class:gone
  style:top="{HEADER_HEIGHT}px"
  style:max-height="{maxHeight}px"
>
  <div class="container">
    <h2>台本の情報</h2>
    <button
      class="icon-button close-button"
      disabled={isLoading}
      onclick={close}
    >
      <img alt="閉じる" src={closeIcon} />
    </button>

    {#if scIndex && scData}
      <table>
        <tbody>
          <tr>
            <td>表示名</td><td>{scIndex.name}</td>
            <td><img alt="編集" src={editIcon} /></td>
          </tr>
          <tr>
            <td>台本</td>
            <td colspan="2">{getScTitle(scData)}</td>
          </tr>
          <tr>
            <td>ソース</td><td>{scData.srcType}</td>
            <td><img alt="編集" src={editIcon} /></td>
          </tr>
          <tr>
            <td>{#if scData.srcType != 'file'}URL{/if}</td>
            <td colspan="2">{scData.url}</td>
          </tr>
        </tbody>
      </table>
    {/if}

    <div class="buttonArea">
      <p>
        <button>再読込み (上書き)</button>
      </p>
      <p>
        <button class="delete-button" onclick={deleteScript}>削除</button>
      </p>
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
    margin: 14px;
  }
  h2 {
    margin-left: 0;
    margin-bottom: 24px;
  }
  .close-button {
    position: absolute;
    top: 18px;
    right: 18px;
  }
  table {
    width: 100%;
    font-size: 0.9em;
  }
  table tr td {
    vertical-align: top;
  }
  table tr td:first-child {
    width: 4em;
  }
  table tr td:nth-child(2) {
    overflow-wrap: anywhere;
  }
  table tr td:nth-child(3) {
    width: 24px;
    padding: 0;
  }
  .buttonArea {
    margin-top: 40px;
  }
</style>
