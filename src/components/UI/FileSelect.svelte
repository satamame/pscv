<script lang="ts">
  // コンポーネントプロパティ
  export let files: FileList | null
  export let accept=''

  let filename = 'ファイルを選択'

  $: if (files) {
    if (files.length) {
      filename = files[0].name
    } else {
      filename = 'ファイルを選択'
    }
  }
</script>

<div>
  <label>
    <input type="file" bind:files accept="{accept}" />{filename}
  </label>
</div>

<style>
  label {
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    border: 1px solid #555;
    border-radius: 5px;
    padding: 6px 8px;
  }
  input {
    display: none;
  }
</style>