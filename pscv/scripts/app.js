const appVersion = '0.0.1';
const debug = true;

// グローバル変数の定義
let tocItems = [];                  // 見出し要素のインデックスリスト
let tocItemIndex = 0;               // 目次で現在地としている見出しインデックス
let scrollLocked = false;           // スクロールをロックしているかのフラグ
let srchWord = '';
let srchTarget = 'all';
let srchMatches = [];
let srchMatchIndex = 0;
let trackingLineIndex = 0;
let viewTopTrackingId = null;
let lastFontSize = 4;
let lastWritingMode = 0;
let scUpdated = false;
const ua = window.navigator.userAgent.toLowerCase();

const fontSizeInPixel = {
  1: '12px',
  2: '14px',
  3: '16px',
  4: '18px',
  5: '20px',
  6: '22px',
  7: '24px'
};

// localStorage に保存するデータ
let dataList = [];
let selectedDataId = -1;    // ID は 0 以上, 選択なしなら -1
let fontSize = 4;           // 1-7
let writingMode = 0;        // 0: 横, 1: 縦, 2: 縦 (英数字も)

window.onload = (event) => {
  // Android OS なら main の高さを固定する (キーボード対策)
  const main = document.getElementById("main");
  if (ua.indexOf("android") !== -1) {
    fixMainHeight();
  } else {
    // Android OS でなければ画面サイズに合わせる
    main.style.bottom = 0;
  }

  // Android OS なら、Back ボタンの制御をする
  if (ua.indexOf("android") !== -1) {
    controlBackBtn();
  }

  // 文字サイズ選択メニューを初期化する
  initFontSizeMenu();

  // 横書き/縦書きを初期化する
  initWritingMode();

  // dataList を初期化して台本を描画する
  initDataList();

  // バージョンを表示する
  document.getElementById('appVersion').innerHTML = appVersion;

  // イベントハンドラを初期化する
  initEventHandlers();
};

// サービスワーカーとリソースを再読込する関数
function reload() {
  if (!('serviceWorker' in navigator))
    return;

  navigator.serviceWorker.getRegistration()
  .then(registration => {
    if (registration.waiting != null) {
      // registration.unregister();  // 効果が疑わしいので保留
      alert('インストール済みの更新があります。台本ビューアを再起動してください。');
      disableUpdateButton();
    }
    else {
      registration.update()
      .then(registration => {
        const installingWorker = registration.installing;
        if (installingWorker != null) {
          installingWorker.onstatechange = e => {
            if (e.target.state == 'installed') {
              // registration.unregister();  // 効果が疑わしいので保留
              alert('更新がインストールされました。台本ビューアを再起動してください。');
              disableUpdateButton();
            }
          }
        }
        else {
          alert('更新はありませんでした。');
        }
      });
    }
  });
}

// 更新ボタンを無効化しメッセージを表示する関数
function disableUpdateButton() {
  document.getElementById('updateButton').disabled = true;
  document.getElementById('updateAlert').textContent = '台本ビューアを再起動してください。';
}

// 台本部分の高さを画面に合わせて固定する関数 (Android キーボード対策)
function fixMainHeight() {
  const main = document.getElementById("main");
  let h = window.innerHeight;
  if (h == main.width)
    h = window.innerWidth;
  document.getElementById("main").style.height = `${h - 48}px`;
}

// 画面回転時の処理
function orientationChanged() {
  // スクロールロック
  const lastScrollLocked = scrollLocked;
  if (!scrollLocked)
    lockScroll();

  let delay = 100;
  // キーボードが出ていたら閉じて、その分待つ
  if (document.activeElement.id == 'srchInput') {
    document.activeElement.blur();
    delay = 300;
  }
  // 少し待って Android なら main の高さを画面の高さに合わせる
  setTimeout(() => {
    if (ua.indexOf("android") !== -1)
      fixMainHeight();

    // スクロール位置を調整してスクロールをアンロック
    jumpToLine(trackingLineIndex);
    if (!lastScrollLocked) {
      unlockScroll();
      // ずれがあった時のために台本行の追跡をする
      startTrackingViewTop();
    }
  }, delay);
}

// 文字サイズ選択メニューを初期化する関数
function initFontSizeMenu() {
  // localStorage から fontSize を取得する
  if (localStorage.fontSize)
    if (localStorage.fontSize in fontSizeInPixel)
      fontSize = localStorage.fontSize;

  // 文字サイズ選択メニューを初期化する
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  while (fontSizeSelect.lastChild) {
    fontSizeSelect.removeChild(fontSizeSelect.lastChild);
  }
  for (const key in fontSizeInPixel) {
    const op = document.createElement("option");
    op.value = key;
    op.text = key;
    fontSizeSelect.appendChild(op);
    if (op.value == fontSize) {
      op.selected = true;
    }
  }

  // グローバル変数, localStorage, HTML に反映させる
  changeFontSize();
}

// 文字サイズ選択メニューの値で文字サイズを反映させる関数
function changeFontSize() {
  // グローバル変数と localStorage を更新
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  fontSize = parseInt(fontSizeSelect.value);
  localStorage.fontSize = fontSize;

  // HTML に反映させる
  const main = document.getElementById('main');
  main.style.fontSize = fontSizeInPixel[fontSize];
}

// 横書き/縦書きを初期化する関数
function initWritingMode() {
  // localStorage から writingMode を取得する
  if (localStorage.writingMode)
    writingMode = localStorage.writingMode;

  // 向きメニューを更新する
  const writingModeSelect = document.getElementById('writingModeSelect');
  for (const option of writingModeSelect.options) {
    option.selected = (parseInt(option.value) == writingMode);
  }

  // HTML に反映させる
  applyWritingMode();
}

// 向きメニューの値で横書き/縦書きを反映させる関数
function changeWritingMode() {
  // グローバル変数と localStorage を更新
  const writingModeSelect = document.getElementById('writingModeSelect');
  writingMode = parseInt(writingModeSelect.value);
  localStorage.writingMode = writingMode;

  // HTML に反映させる
  applyWritingMode();
}

// 横書き/縦書きを HTML に反映させる関数
function applyWritingMode() {
  const main = document.getElementById('main');
  if (writingMode > 0) {
    main.classList.add('vertical');
    if (writingMode > 1)
      main.classList.add('upright');
    else
      main.classList.remove('upright');
  } else {
    main.classList.remove('vertical');
    main.classList.remove('upright');
  }
}

// dataList を初期化して台本を描画する関数
function initDataList() {
  // localStorage から dataList を取得する
  const dataJson = localStorage.dataList;
  if (dataJson)
    dataList = JSON.parse(dataJson);

  // localStorage から選択中の台本の ID を取得する
  const id = localStorage.selectedDataId;
  if (id >= 0)
    selectedDataId = id;

  // dataList と selectedDataId から台本選択メニューを更新する
  updateScMenu();
  // dataList と selectedDataId の状態を HTML に反映させる
  scLoad();
}

// dataList と selectedDataId から台本選択メニューを更新する関数
function updateScMenu() {
  // 台本選択メニューに要素をセットする
  const scSelect = document.getElementById('scSelect');
  while (scSelect.lastChild) {
    scSelect.removeChild(scSelect.lastChild);
  }
  for (const dataItem of dataList) {
    const op = document.createElement("option");
    op.value = dataItem.id;
    op.text = dataItem.title;
    scSelect.appendChild(op);
    if (op.value == selectedDataId) {
      op.selected = true;
    }
  }
}

// 台本のスクロールをロックする関数
function lockScroll() {
  scrollLocked = true;
  // 台本行の追跡中なら中断する
  if (viewTopTrackingId != null)
    window.clearInterval(viewTopTrackingId);
  const main = document.getElementById('main');
  main.classList.add('scroll-disabled');
}

// 台本のスクロールロックを解除する関数
function unlockScroll() {
  const main = document.getElementById('main');
  main.classList.remove('scroll-disabled');
  scrollLocked = false;
}

// 目次を表示する関数
function showToc() {
  lockScroll();
  document.getElementById("toc").style.visibility = "visible";
  showUpCurrentTocItem();

  if (document.getElementById("srchHeader").style.visibility == "visible") {
    // 検索ヘッダが表示中ならバックボタン対応のための履歴を差し替え
    window.history.replaceState({ activity: 'toc' }, '');
  } else {
    // さもなくばバックボタン対応のため履歴を追加
    window.history.pushState({ activity: 'toc' }, '');
  }
}

// 現在地の目次項目を目立たせる関数
function showUpCurrentTocItem() {
  // 強調解除
  const tocList = document.getElementById('tocList');
  tocList.children[tocItemIndex].classList.remove('current');

  // 現在地を検出
  tocItemIndex = detectTocItemIndex();

  // 現在地の目次項目を強調する
  const currentItem = tocList.children[tocItemIndex];
  currentItem.classList.add('current');
  currentItem.scrollIntoView({block: 'center'});
}

// 目次を閉じる関数
function hideToc() {
  document.getElementById("toc").style.visibility = "hidden";
  unlockScroll();

  if (document.getElementById("srchHeader").style.visibility != "visible") {
    // 検索ヘッダが表示中でなければ、バックボタン対応のため追加した履歴を削除
    window.history.back();
  }
}

// 検索を開始する関数
function startSearching() {
  srchWord = document.getElementById("srchInput").value;
  if (!srchWord)
    return;

  // 検索ヘッダを表示する
  document.getElementById("srchWord").innerText = srchWord;
  document.getElementById("normalHeader").style.visibility = "hidden";
  document.getElementById("srchHeader").style.visibility = "visible";

  if (document.getElementById("toc").style.visibility == "visible") {
    // 目次が表示中なら閉じて、バックボタン対応のための履歴を差し替え
    document.getElementById("toc").style.visibility = "hidden";
    unlockScroll();
    window.history.replaceState({ activity: 'search' }, '');
  } else {
    // さもなくばバックボタン対応のため履歴を追加
    window.history.pushState({ activity: 'search' }, '');
  }

  // 検索実行
  srchTarget = document.getElementById("srchTargetSelect").value;
  srchMatches = listSrchMatches(srchWord, srchTarget);
  srchMatchIndex = indexOfSrchMatchInView();
  gotoSrchMatch(srchMatchIndex);
}

// エンターキーが押されたことによって検索をする関数
function searchByEnterKey(e) {
  e.currentTarget.blur();
  startSearching();
  e.preventDefault();
}

// 注目する検索結果をひとつ前にする関数
function srchPrev() {
  if (srchMatchIndex <= 0)
    return;
  if (srchMatchIndex <= 1)
    gotoSrchMatch(srchMatches.length);
  else {
    gotoSrchMatch(srchMatchIndex - 1);
  }
}

// 注目する検索結果をひとつ後にする関数
function srchNext() {
  if (srchMatchIndex <= 0)
    return;
  if (srchMatchIndex >= srchMatches.length)
    gotoSrchMatch(1);
  else {
    gotoSrchMatch(srchMatchIndex + 1);
  }
}

// 検索ヘッダを閉じる関数
function stopSearching() {
  // 検索結果の強調表示をクリア
  clearSrchMatches();

  document.getElementById("normalHeader").style.visibility = "visible";
  document.getElementById("srchHeader").style.visibility = "hidden";

  // バックボタン対応のため追加した履歴を削除
  window.history.back();
}

// 設定を表示する関数
function showSetting() {
  lockScroll();
  scUpdated = false;              // 台本が変わったフラグを初期化
  lastFontSize = fontSize;        // フォントサイズを憶えておく
  lastWritingMode = writingMode;  // 横書き/縦書き を憶えておく
  document.getElementById("setting").style.visibility = "visible";
  // バックボタン対応のため履歴を追加
  window.history.pushState({ activity: 'setting' }, '');
}

// 設定を閉じる関数
function hideSetting() {
  document.getElementById("setting").style.visibility = "hidden";

  if (debug) console.log(`*** scUpdated: ${scUpdated}`);

  // 台本やフォントサイズや 横書き/縦書き が変わったならスクロールを調整
  if (scUpdated || fontSize != lastFontSize || writingMode != lastWritingMode) {
    jumpToLine(trackingLineIndex);
    if (debug) console.log('*** Scroll restored.');
    unlockScroll();
    // ずれがあった時のために台本行の追跡をする
    startTrackingViewTop();
  } else {
    unlockScroll();
  }
  // バックボタン対応のため追加した履歴を削除
  window.history.back();
}

// dataList と selectedDataId の状態を HTML に反映させる関数
function scLoad() {
  // 台本が変わったフラグを立てる
  scUpdated = true;
  // 台本が反映されたかの判定用にタイトルを初期化
  let title = '';

  // dataList から選択中の台本データを抽出
  const selected = dataList.filter(item => {
    return (item.id == selectedDataId);
  });

  if (selected.length >= 1) {
    // PSc データを main 要素に反映させる
    loadPSc(selected[0].psc);

    // タイトルを設定する
    title = selected[0].title;
  }

  // タイトルが設定されていなければヘルプを表示
  if (!title) {
    title = '台本ビューア';
    fetch('psc/help.json').then(response => {
      if (response.ok) {
        response.json().then(data => {
          loadPSc(data.psc);
          title = data.title;
        });
      } else {
        clearPSc();
      }
    })
    .catch(error => {
      clearPSc();
    });
  }

  // タイトルをヘッダに反映させる
  const headerTitle = document.getElementById('headerTitle');
  headerTitle.innerHTML = title;
}

// 台本選択メニューで選択された台本を読み込む関数 (変更があった時)
function scLoadFromMenu() {
  // 選択中の ID を取得
  const scSelect = document.getElementById('scSelect');
  let id = -1;
  if (scSelect.selectedOptions.length >= 1)
    id = scSelect.value;
  if (debug) console.log(`*** scLoadFromMenu ID: ${id}`);

  if (id != selectedDataId) {
    // この台本を選択中にする
    selectedDataId = parseInt(id);
    localStorage.selectedDataId = selectedDataId;

    // dataList と selectedDataId の状態を HTML に反映させる
    scLoad();
  }
}

// 台本データを URL から読み込む関数
function scFromUrl() {
  const url = prompt('台本データの URL');
  if (!url)
    return;

  fetch(url).then(response => {
    if (response.ok) {
      response.json().then(data => {
        scAddToList(data, url);
      });
    } else {
      alert('台本データを読み込めませんでした。');
    }
  })
  .catch(error => {
    alert('台本データを読み込めませんでした。');
  });
}

// 台本データをファイルから読み込む関数
function scFromFile(e) {
  let fr = new FileReader();
  fr.addEventListener('load', (e) => {
    // 読み込んだ台本ファイル (JSON) からオブジェクトを作る
    const data = {psc: JSON.parse(e.target.result)};
    scAddToList(data, '');
  });
  fr.addEventListener('error', () => {
    alert('台本データを読み込めませんでした。');
  });
  fr.readAsText(e.target.files[0]);
}

// 新しい台本データ用の ID を与える関数
function getNewId () {
  const ids = dataList.map(item => item.id);
  let i = 0;
  while (ids.includes(i)) {
    i++;
  }
  return i;
}

// 台本データをリストに追加する関数
function scAddToList(data, url) {
  // すでに同じ URL があれば、古い方を削除する
  if (url) {
    const dupe = dataList.find(item => item.url == url);
    if (dupe) {
      dataList = dataList.filter(item => {
        return (item.url != url);
      });
      alert('同じ URL の古いエントリを削除しました。');
    }
  }

  // タイトルがなければ追加しない
  const title = data.psc.title;
  if (!title) {
    alert('台本データにタイトルがないため読み込めません。');
    return;
  }

  // 台本データに ID と URL とタイトルを埋め込む
  data.id = getNewId();
  data.url = url;
  data.title = title;

  // 台本データを dataList に加え、localStorage に保存する
  dataList.push(data);
  localStorage.dataList = JSON.stringify(dataList);

  // この台本を選択中にする
  selectedDataId = data.id
  localStorage.selectedDataId = selectedDataId;

  // 台本選択メニューを更新する
  updateScMenu();

  // dataList と selectedDataId の状態を HTML に反映させる
  scLoad();
}

// 台本データを再取得する関数
function scReload() {
  const scSelect = document.getElementById('scSelect');
  if (scSelect.selectedOptions.length < 1)
    return;

  const selected = scSelect.selectedOptions[0];
  const doReload = confirm(`「${selected.text}」を再取得します。`);
  if (!doReload) return;

  // dataList から選択中の台本データを抽出
  const id = parseInt(selected.value);
  const selectedData = dataList.filter(item => {return (item.id == id);});
  if (selectedData.length < 1)
    return;

  const url = selectedData[0].url;
  if (!url) {
    alert('再取得できませんでした。');
    return;
  }

  fetch(url).then(response => {
    if (response.ok) {
      response.json().then(data => {
        // データを上書きする
        selectedData[0].title = data.psc.title;
        selectedData[0].psc = data.psc;
        localStorage.dataList = JSON.stringify(dataList);
        // この台本を選択中にする
        selectedDataId = id;
        localStorage.selectedDataId = selectedDataId;
        // dataList と selectedDataUrl の状態を HTML に反映させる
        scLoad();
      });
    } else {
      alert('再取得できませんでした。');
    }
  })
  .catch(error => {
    alert('再取得できませんでした。');
  });
}

// 台本データを削除する関数
function scDelete() {
  const scSelect = document.getElementById('scSelect');
  if (scSelect.selectedOptions.length < 1)
    return;

  const selected = scSelect.selectedOptions[0];
  const doDelete = confirm(`「${selected.text}」を削除します。`);
  if (!doDelete) return;

  // 選択中の URL の台本を dataList から削除
  dataList = dataList.filter(item => {
    return (item.id != selected.value);
  });

  // localStorage に反映させる
  localStorage.dataList = JSON.stringify(dataList);

  // dataList と selectedDataUrl から台本選択メニューを更新する
  updateScMenu();

  // 台本選択メニューで選択された台本を読み込む
  scLoadFromMenu();
}
