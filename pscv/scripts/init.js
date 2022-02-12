// イベントハンドラを初期化する関数
function initEventHandlers() {
  // Window が回転した時の処理を設定
  if (ua.indexOf("android") !== -1) {
    // Android OS ならキーボードを閉じて main の高さを調整
    window.addEventListener("orientationchange", () => {
      let delay = 100;
      // キーボードが出ていたら閉じて、その分待つ
      if (document.activeElement.id == 'srchInput') {
        document.activeElement.blur();
        delay = 200;
      }
      // 少し待って main の高さを画面の高さに合わせる
      setTimeout(fixMainHeight, delay);
    });
  }

  // main にスクロールハンドラを設定
  document.getElementById('main').addEventListener("scroll", (e) => {
    if (viewTopTrackingEnabled && viewTopTrackingId == null)
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

  // 「検索」ボタンにクリックハンドラを設定
  document.getElementById("srchButton").addEventListener("click", (e) => {
    startSearching();
  })

  // 検索フィールドにキープレスハンドラを設定
  document.getElementById("srchInput").addEventListener("keypress", (e) => {
    // エンターキーなら検索を実行する
    if (e.key == 'Enter') {
      searchByEnterKey(e);
    }
  })

  // 検索ヘッダの虫眼鏡ボタンにクリックハンドラを設定
  document.getElementById("headerSrchButton").addEventListener("click", (e) => {
    showToc();
  })

  // 検索ヘッダの閉じるボタンにクリックハンドラを設定
  document.getElementById("srchCloseButton").addEventListener("click", (e) => {
    stopSearching();
  })

  // 検索ヘッダの「前」「次」ボタンにクリックハンドラを設定
  document.getElementById("srchPrevButton").addEventListener("click", (e) => {
    srchPrev();
  })
  document.getElementById("srchNextButton").addEventListener("click", (e) => {
    srchNext();
  })

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

  // 「読込」ボタンにクリックハンドラを設定
  document.getElementById("scLoadButton").addEventListener("click", (e) => {
    scLoadFromMenu();
  });

  // 「新規」ボタンにクリックハンドラを設定
  document.getElementById("scAddButton").addEventListener("click", (e) => {
    scAdd();
  });

  // 「削除」ボタンにクリックハンドラを設定
  document.getElementById("scDeleteButton").addEventListener("click", (e) => {
    scDelete();
  });

  // 文字サイズ選択メニューに選択ハンドラを設定
  document.getElementById('fontSizeSelect').addEventListener("change", (e) => {
    changeFontSize();
  });

  // 向きメニューに選択ハンドラを設定
  document.getElementById('writingModeSelect').addEventListener("change", (e) => {
    changeWritingMode();
  });

  // 「更新」ボタンにクリックハンドラを設定
  document.getElementById("updateButton").addEventListener("click", (e) => {
    reload();
  });
  }
