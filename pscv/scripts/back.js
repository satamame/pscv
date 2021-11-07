function controlBackBtn() {
  // 戻るコマンドを1回無効化する関数
  function hookHistoryBack() {
    if (!window.history.state || !window.history.state.hookBackBtn) {
      window.history.pushState({hookBackBtn: true}, '')
    }
  }

  // 戻るボタンが押された時のイベントハンドラを設定
  window.addEventListener('popstate', function (event) {
    // 目次が表示中なら閉じる
    if (document.getElementById("toc").style.visibility == "visible") {
      hookHistoryBack();
      hideToc();
    }

    // 設定が表示中なら閉じる
    if (document.getElementById("setting").style.visibility == "visible") {
      hookHistoryBack();
      hideSetting();
    }
  });
}
