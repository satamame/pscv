<script lang="ts">
  // コンポーネントプロパティ
  export let files: FileList
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
    /* background-color: #F8F8F8; */
    padding: 2px 8px;
    margin-right: 6px;
  }
  input {
    display: none;
  }
</style>