<svelte:options runes={true} />
<script lang="ts">
  // コンポーネントプロパティ
  type Props = {
    files: FileList | null;  // input タグで選択されたファイルの配列
    accept: string;          // input タグの accept 属性 ('.json' など)
  }
  let { files = $bindable(), accept }: Props = $props()

  let filename = $derived(
    files && files.length ? files[0].name : 'ファイルを選択')

</script>

<div>
  <label>
    <input type="file" bind:files accept={accept} />{filename}
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