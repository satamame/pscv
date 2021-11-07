function controlBackBtn() {
  alert('controlBackBtn called.');

  // 戻るコマンドを1回無効化する関数
  function hookHistoryBack() {
    if (!window.history.state || !window.history.state.hookBackBtn) {
      console.log("hook back btn.");
      window.history.pushState({hookBackBtn: true}, '')
    } else {
      console.log("already hooked back button.");
    }
  }

  // 戻るボタンが押された時のイベントハンドラを設定
  window.addEventListener('popstate', function (event) {
    alert(event.state);

    // 戻るコマンドを無効化
    hookHistoryBack();
  });
}
