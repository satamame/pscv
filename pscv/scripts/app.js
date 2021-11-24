// グローバル変数の定義
const appVersion = '0.0.1';
let scrollV = 0;

// localStorage に保存するデータ
let dataList = [];
let selectedDataUrl = '';

window.onload = (event) => {
  // Android OS なら、Back ボタンの制御をする
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf("android") !== -1) {
    controlBackBtn();
  }

  // 目次ボタンにクリックハンドラを設定
  document.getElementById("tocButton").addEventListener("click", (e) => {
      showToc();
  });

  // 目次ダイアログのオーバーレイにクリックハンドラを設定
  const toc = document.getElementById("toc");
  const tocOverlay = toc.getElementsByClassName("overlay")[0];
  tocOverlay.addEventListener("click", (e) => {
    hideToc();
  });

  // 目次ダイアログの閉じるボタンにクリックハンドラを設定
  document.getElementById("tocCloseButton").addEventListener("click", (e) => {
    hideToc();
  });

  // 設定ボタンにクリックハンドラを設定
  document.getElementById("settingButton").addEventListener("click", (e) => {
    showSetting();
  });

  // 設定ダイアログのオーバーレイにクリックハンドラを設定
  const setting = document.getElementById("setting");
  const settingOverlay = setting.getElementsByClassName("overlay")[0];
  settingOverlay.addEventListener("click", (e) => {
    hideSetting();
  });

  // 設定ダイアログの閉じるボタンにクリックハンドラを設定
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

  // 「再読込」ボタンにクリックハンドラを設定
  document.getElementById("reloadButton").addEventListener("click", (e) => {
    reload();
  });

  // dataList を初期化して台本を描画する
  initDataList();

  // バージョンを表示する
  document.getElementById('appVersion').innerHTML = appVersion;
};

// リソースを再読込するために sw を登録解除する関数
function reload() {
  window.navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
  alert('更新を反映するには、台本ビューアを再起動してください。');
}

// dataList を初期化して台本を描画する関数
function initDataList() {
  // localStorage から dataList を取得する
  const dataJson = localStorage.dataList;
  if (dataJson)
    dataList = JSON.parse(dataJson);

  // localStorage から選択中の台本の URL を取得する
  const url = localStorage.selectedDataUrl;
  if (url)
    selectedDataUrl = url;

  // dataList と selectedDataUrl から台本選択メニューを更新する
  updateScMenu();

  // dataList と selectedDataUrl の状態を HTML に反映させる
  scLoad();
}

// dataList と selectedDataUrl から台本選択メニューを更新する関数
function updateScMenu() {
  // 台本選択メニューに要素をセットする
  const scSelect = document.getElementById('scSelect');
  while (scSelect.lastChild) {
    scSelect.removeChild(scSelect.lastChild);
  }
  for (let dataItem of dataList) {
    let op = document.createElement("option");
    op.value = dataItem.url;
    op.text = dataItem.title;
    scSelect.appendChild(op);
    if (op.value == selectedDataUrl) {
      op.selected = true;
    }
  }
}

// 台本をスクロールできなくする関数
function disableScrolling() {
  const main = document.getElementById('main');
  scrollV = main.scrollTop;
  main.classList.add('scroll-disabled');
}

// 台本をスクロール可能にする関数
function enableScrolling() {
  const main = document.getElementById('main');
  main.classList.remove('scroll-disabled');
  main.scrollTop = scrollV;
}

// 目次を表示する関数
function showToc() {
  disableScrolling();
  document.getElementById("toc").style.visibility = "visible";
  // バックボタン対応のため履歴を追加
  window.history.pushState({ activity: 'toc' }, '');
}

// 目次を閉じる関数
function hideToc() {
  document.getElementById("toc").style.visibility = "hidden";
  enableScrolling();
  // バックボタン対応のため追加した履歴を削除
  window.history.back();
}

// 設定を表示する関数
function showSetting() {
  disableScrolling();
  document.getElementById("setting").style.visibility = "visible";
  // バックボタン対応のため履歴を追加
  window.history.pushState({ activity: 'setting' }, '');
}

// 設定を閉じる関数
function hideSetting() {
  document.getElementById("setting").style.visibility = "hidden";
  enableScrolling();
  // バックボタン対応のため追加した履歴を削除
  window.history.back();
}

// dataList と selectedDataUrl の状態を HTML に反映させる関数
function scLoad() {
  // 台本が反映されたかの判定用にタイトルを初期化
  let title = '';

  // dataList から選択中の台本データを抽出
  const selected = dataList.filter(item => {
    return (item.url == selectedDataUrl);
  });

  if (selected.length >= 1) {
    // PSc データを main 要素に反映させる
    loadPSc(selected[0].psc);

    // タイトルを設定する
    title = selected[0].title;
  }

  // タイトルが設定されていなければヘッダと main を初期化
  if (!title) {
    title = '台本ビューア';
    clearPSc();
  }

  // タイトルをヘッダに反映させる
  const headerTitle = document.getElementById('headerTitle');
  headerTitle.innerHTML = title;

  // スクロール位置をリセットする
  scrollV = 0;
}

// 台本選択メニューで選択された台本を読み込む関数
function scLoadFromMenu() {
  // 選択中の URL を取得
  const scSelect = document.getElementById('scSelect');
  const url = scSelect.value;

  if (url != selectedDataUrl) {
    // この台本を選択中にする
    selectedDataUrl = url;
    localStorage.selectedDataUrl = selectedDataUrl;

    // dataList と selectedDataUrl の状態を HTML に反映させる
    scLoad();
  }
}

// 台本データを追加する関数
function scAdd() {
  let url = prompt('台本データの URL');
  if (!url)
    return;

  fetch(url).then(response => {
    if (response.ok) {
      response.json().then(data => {
        scAddToList(data, url);
      });
    } else {
      alert('台本データを取得できませんでした。');
    }
  })
  .catch(error => {
    alert('台本データを取得できませんでした。');
  });
}

// 台本データをリストに追加する関数
function scAddToList(data, url) {
  // すでに同じ URL があれば、古い方を削除する
  const dupe = dataList.find(value => value.url == url);
  if (dupe) {
    dataList = dataList.filter(item => {
      return (item.url != url);
    });
    alert('同じ URL の古いエントリを削除しました。');
  }

  // 台本データに URL とタイトルを埋め込む
  data.url = url;
  data.title = data.psc.title;

  // 台本データを dataList に加え、localStorage に保存する
  dataList.push(data);
  localStorage.dataList = JSON.stringify(dataList);

  // この台本を選択中にする
  selectedDataUrl = url
  localStorage.selectedDataUrl = selectedDataUrl;

  // 台本選択メニューを更新する
  updateScMenu();

  // dataList と selectedDataUrl の状態を HTML に反映させる
  scLoad();
}

// 台本データを削除する関数
function scDelete() {
  const scSelect = document.getElementById('scSelect');
  const selected = scSelect.selectedOptions[0];
  const doDelete = confirm(`「${selected.text}」を削除します。`);

  if (doDelete) {
    // 選択中の URL の台本を dataList から削除
    dataList = dataList.filter(item => {
      return (item.url != selected.value);
    });

    // localStorage に反映させる
    localStorage.dataList = JSON.stringify(dataList);

    // dataList と selectedDataUrl から台本選択メニューを更新する
    updateScMenu();

    // 台本選択メニューで選択された台本を読み込む
    scLoadFromMenu();
  }
}
