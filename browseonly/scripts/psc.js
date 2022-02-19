// 行番号を指定してジャンプする関数
function jumpToLine(lineNum) {
  let x = 0;
  let y = 0;

  if (lineNum > 0) {
    // スクロール先の要素を決める
    const main = document.getElementById('main');
    let lineElm = main.children[lineNum];

    // 子要素 (p とか) があれば、そっちを使う
    if (lineElm.childElementCount > 0) {
      lineElm = lineElm.children[0]
    }

    // スクロール先の座標を求める
    if (writingMode < 1) {
      // 横書きの場合
      const marginTop = window.getComputedStyle(lineElm).getPropertyValue('margin-top');
      y = lineElm.offsetTop - parseFloat(marginTop);
      if (debug) console.log(`*** y: ${y}`);
    } else {
      // 縦書きの場合
      const marginRight = window.getComputedStyle(lineElm).getPropertyValue('margin-right');
      const viewWidth = document.getElementById('main').offsetWidth;
      x = lineElm.offsetLeft + lineElm.offsetWidth + parseFloat(marginRight) - viewWidth;
    }
  }
  main.scrollTo(x, y);
}

// インデックスを指定して目次項目にジャンプする関数
function jumpToTocItem(i) {
  hideToc();

  // 台本行の追跡を中断し、現在地を更新する
  if (viewTopTrackingId != null)
    window.clearInterval(viewTopTrackingId);
  lineNum = tocItems[i];
  trackingLineIndex = lineNum;

  // その行へジャンプする
  jumpToLine(lineNum);
}

// 現在地の目次項目が何番目かを返す関数
function detectTocItemIndex() {
  if (writingMode < 1)
    return detectTocItemIndexH();
  else
    return detectTocItemIndexV();
}

// 現在地の目次項目が何番目かを返す関数 (横書きの場合)
function detectTocItemIndexH() {
  const main = document.getElementById('main');
  const scrollTop = main.scrollTop;

  // 下まで走査した時の初期値を、最後の目次項目にする
  let tocItemIndex = tocItems.length -1;

  // 画面の上端以下にある目次項目を探す
  for (let i = 0; i < tocItems.length; i++) {
    const lineNum = tocItems[i];
    const lineElm = main.children[lineNum];

    if (lineElm.offsetTop - scrollTop >= 0) {
      tocItemIndex = i;
      break;
    }
  }

  // 見つかった目次項目の行番号
  const lineNum = tocItems[tocItemIndex];

  if (lineNum > 0) {
    // 見つかった目次項目の、ひとつ上の台本行要素
    const prevElm = main.children[lineNum - 1];
    const prevElmTop = prevElm.offsetTop - scrollTop;

    // ひとつ上の要素が画面内に収まっていたら、ひとつ前の目次要素にする
    if (prevElmTop >= 0)
      tocItemIndex -= 1;
  }

  return tocItemIndex;
}

// 現在地の目次項目が何番目かを返す関数 (縦書きの場合)
function detectTocItemIndexV() {
  const main = document.getElementById('main');
  const scrollRight = main.scrollLeft + main.offsetWidth;

  // 目次項目が見つからなかった場合の値を、最後の目次項目にする
  let tocItemIndex = tocItems.length -1;

  // 画面の右端またはそれより左にある目次項目を探す
  for (let i = 0; i < tocItems.length; i++) {
    const lineNum = tocItems[i];
    const lineElm = main.children[lineNum];

    if (lineElm.offsetLeft + lineElm.offsetWidth - scrollRight <= 0) {
      tocItemIndex = i;
      break;
    }
  }

  // 見つかった目次項目の行番号
  const lineNum = tocItems[tocItemIndex];

  if (lineNum > 0) {
    // 見つかった目次項目の、ひとつ右の台本行要素
    const prevElm = main.children[lineNum - 1];
    const prevElmRight = prevElm.offsetLeft + prevElm.offsetWidth - scrollRight;

    // ひとつ右の要素が画面内に収まっていたら、ひとつ前の目次要素にする
    if (prevElmRight <= 0)
      tocItemIndex -= 1;
  }

  return tocItemIndex;
}

// 画面上端 (または右端) にある台本行の追跡を開始する
function startTrackingViewTop() {
  if (debug) console.log('*** startTrackingViewTop called.');

  // 追跡中なら現在の追跡を中断する
  if (viewTopTrackingId != null)
    window.clearInterval(viewTopTrackingId);

  // writingMode に応じて追跡用の関数を呼び続ける
  if (writingMode < 1)
    viewTopTrackingId = window.setInterval(trackViewTopH, 10);
  else
    viewTopTrackingId = window.setInterval(trackViewTopV, 10);
}

// 画面の上端にある台本行を追跡する (横書きの場合)
function trackViewTopH() {
  const main = document.getElementById('main');
  const curElm = main.children[trackingLineIndex];

  // 注目している台本行の上端が画面上端より上にあるなら、ひとつ下を注目する
  if (trackingLineIndex < main.childElementCount - 1) {
    if (curElm.offsetTop < main.scrollTop) {
      trackingLineIndex++;
      return;
    }
  }
  // 注目している台本行のひとつ前の台本行の上端が画面上端以下にあるなら、それを注目する
  if (trackingLineIndex > 0) {
    if (main.children[trackingLineIndex -1].offsetTop >= main.scrollTop) {
      trackingLineIndex--;
      return;
    }
  }
  // 注目している台本行が画面上端に位置しているので追跡を中断する
  window.clearInterval(viewTopTrackingId);
  viewTopTrackingId = null;
  if (debug) console.log(`*** trackingLineIndex: ${trackingLineIndex}`);
}

// 画面の右端にある台本行を追跡する (縦書きの場合)
function trackViewTopV() {
  const main = document.getElementById('main');
  const curElm = main.children[trackingLineIndex];

  // 注目している台本行の右端が画面上右端より右にあるなら、ひとつ左を注目する
  if (trackingLineIndex < main.childElementCount - 1) {
    if (curElm.offsetLeft + curElm.offsetWidth > main.scrollLeft + main.offsetWidth) {
      trackingLineIndex++;
      return;
    }
  }
  // 注目している台本行のひとつ前の台本行の右端が画面右端またはそれより左にあるなら、それを注目する
  if (trackingLineIndex > 0) {
    const prevElm = main.children[trackingLineIndex - 1];
    if (prevElm.offsetLeft + prevElm.offsetWidth <= main.scrollLeft + main.offsetWidth) {
      trackingLineIndex--;
      return;
    }
  }
  // 注目している台本行が画面右端に位置しているので追跡を中断する
  window.clearInterval(viewTopTrackingId);
  viewTopTrackingId = null;
  if (debug) console.log(`*** trackingLineIndex: ${trackingLineIndex}`);
}
