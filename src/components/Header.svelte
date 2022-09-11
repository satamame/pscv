<script lang="ts">
</script>

<header>
  <button class="left-button">
    <img alt="目次" src="public/format_list_bulleted_black_24dp.svg" />
  </button>
  <h1>タイトル</h1>
  <button class="right-button">
    <img alt="設定" src="public/settings_black_24dp.svg" />
  </button>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 48px;
    background: #EEB63D;
    text-align: center;
  }
  header h1 {
    color: white;
    font-size: 24px;
    margin: 12px 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button {
    width: 28px;
    height: 28px;
    border-width: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }
  button img {
    width: 100%;
    height: 100%;
  }
  button.left-button {
    position: fixed;
    top: 10px;
    left: 16px;
  }
  button.right-button {
    position: fixed;
    top: 10px;
    right: 16px;
  }
</style>
