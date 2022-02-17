// イベントハンドラを初期化する関数
function initEventHandlers() {
  // 画面回転時の処理を設定
  window.addEventListener("orientationchange", () => {
    orientationChanged();
  });

  // main にスクロールハンドラを設定
  document.getElementById('main').addEventListener("scroll", (e) => {
    // スクロールロック中は台本行の追跡を開始しない
    if (!scrollLocked && viewTopTrackingId == null)
      startTrackingViewTop();
  });

  // 目次ボタンにクリックハンドラを設定
  document.getElementById("tocButton").addEventListener("click", (e) => {
    showToc();
  });

  // 目次パネルのオーバーレイにクリックハンドラを設定
  const toc = document.getElementById("toc");
  const tocOverlay = toc.getElementsByClassName("overlay")[0];
  tocOverlay.addEventListener("click", (e) => {
    hideToc();
  });

  // 目次パネルの閉じるボタンにクリックハンドラを設定
  document.getElementById("tocCloseButton").addEventListener("click", (e) => {
    hideToc();
  });

  // 設定ボタンにクリックハンドラを設定
  document.getElementById("settingButton").addEventListener("click", (e) => {
    showSetting();
  });

  // 設定パネルのオーバーレイにクリックハンドラを設定
  const setting = document.getElementById("setting");
  const settingOverlay = setting.getElementsByClassName("overlay")[0];
  settingOverlay.addEventListener("click", (e) => {
    hideSetting();
  });

  // 設定パネルの閉じるボタンにクリックハンドラを設定
  document.getElementById("settingCloseButton").addEventListener("click", (e) => {
    hideSetting();
  });

  // 文字サイズ選択メニューに選択ハンドラを設定
  document.getElementById('fontSizeSelect').addEventListener("change", (e) => {
    changeFontSize();
  });

  // 向きメニューに選択ハンドラを設定
  document.getElementById('writingModeSelect').addEventListener("change", (e) => {
    changeWritingMode();
  });
}
