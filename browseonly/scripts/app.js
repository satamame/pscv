const appVersion = '0.0.1';
const debug = true;

// グローバル変数の定義
let tocItems = [];                  // 見出し要素のインデックスリスト
let tocItemIndex = 0;               // 目次で現在地としている見出しインデックス
let scrollLocked = false;           // スクロールをロックしているかのフラグ
let trackingLineIndex = 0;
let viewTopTrackingId = null;
let lastFontSize = 4;
let lastWritingMode = 0;

const fontSizeInPixel = {
  1: '12px',
  2: '14px',
  3: '16px',
  4: '18px',
  5: '20px',
  6: '22px',
  7: '24px'
};

let fontSize = 4;           // 1-7
let writingMode = 0;        // 0: 横, 1: 縦, 2: 縦 (英数字も)

window.onload = (event) => {
  // tocItems を初期化する (browseronly 版のみ)
  const main = document.getElementById('main');
  const tocList = document.getElementById('tocList')
  for (let i = 0; i < main.children.length; i++) {
    // 見出しなら目次に追加する
    const elm = main.children[i];
    if (
      elm.classList.contains('title')
      || elm.classList.contains('chars-headline')
      || elm.classList.contains('headline-1')
      || elm.classList.contains('headline-2')
      || elm.classList.contains('headline-3')
    ) {
      const tocItem = document.createElement('li');
      tocItem.innerHTML = elm.textContent;
      tocItem.setAttribute('onclick', `jumpToTocItem(${tocItems.length});`);
      tocList.appendChild(tocItem);

      // 目次項目リストにも番号を追加する
      tocItems.push(i);
    }
  }

  // 文字サイズ選択メニューを初期化する
  initFontSizeMenu();

  // 横書き/縦書きを初期化する
  initWritingMode();

  // イベントハンドラを初期化する
  initEventHandlers();
};

// 画面回転時の処理
function orientationChanged() {
  // スクロールロック
  const lastScrollLocked = scrollLocked;
  if (!scrollLocked)
    lockScroll();

  let delay = 100;
  setTimeout(() => {
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

  // グローバル変数, HTML に反映させる
  changeFontSize();
}

// 文字サイズ選択メニューの値で文字サイズを反映させる関数
function changeFontSize() {
  // グローバル変数を更新
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  fontSize = parseInt(fontSizeSelect.value);

  // HTML に反映させる
  const main = document.getElementById('main');
  main.style.fontSize = fontSizeInPixel[fontSize];
}

// 横書き/縦書きを初期化する関数
function initWritingMode() {
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
  // グローバル変数を更新
  const writingModeSelect = document.getElementById('writingModeSelect');
  writingMode = parseInt(writingModeSelect.value);

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
}

// 設定を表示する関数
function showSetting() {
  lockScroll();
  lastFontSize = fontSize;        // フォントサイズを憶えておく
  lastWritingMode = writingMode;  // 横書き/縦書き を憶えておく
  document.getElementById("setting").style.visibility = "visible";
}

// 設定を閉じる関数
function hideSetting() {
  document.getElementById("setting").style.visibility = "hidden";
  // 台本やフォントサイズや 横書き/縦書き が変わったならスクロールを調整
  if (fontSize != lastFontSize || writingMode != lastWritingMode) {
    jumpToLine(trackingLineIndex);
    if (debug) console.log('*** Scroll restored.');
    unlockScroll();
    // ずれがあった時のために台本行の追跡をする
    startTrackingViewTop();
  } else {
    unlockScroll();
  }
}
