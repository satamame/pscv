const map2class = {
  TITLE: 'title',
  AUTHOR: 'author',
  CHARSHEADLINE: 'chars-headline',
  CHARACTER: 'character',
  H1: 'headline-1',
  H2: 'headline-2',
  H3: 'headline-3',
  DIRECTION: 'direction',
  DIALOGUE: 'dialogue',
  ENDMARK: 'endmark',
  COMMENT: 'comment',
  EMPTY: 'empty'
};

// main 要素内の台本をクリアする関数
function clearPSc() {
  // main 要素の子孫を削除する
  const main = document.getElementById('main')
  while (main.lastChild) {
    main.removeChild(main.lastChild);
  }
}

// tocList 内の項目をクリアする関数
function clearTocList() {
  // tocList の子孫を削除する
  const tocList = document.getElementById('tocList')
  while (tocList.lastChild) {
    tocList.removeChild(tocList.lastChild);
  }
  // 目次項目リストを初期化する
  tocItems = [];
}

// PSc データを main 要素に反映させる関数
function loadPSc(pscData) {
  // main 要素内の台本をクリアする
  clearPSc();

  // 目次をクリアする
  clearTocList();

  // HTML をエスケープする関数
  function e(str) {
    escaped = str.replace(/&/g, '&amp;');
    escaped = escaped.replace(/</g, '&lt;');
    escaped = escaped.replace(/>/g, '&gt;');
    return escaped;
  }

  // 空白文字をエスケープする関数
  function eSpc(str) {
    escaped = str.replace(/\r?\n/g, '<br>');
    escaped = escaped.replace(/\s/g, '&nbsp;');
    return escaped;
  }

  const tocList = document.getElementById('tocList')

  for (const [index, pscLine] of pscData.lines.entries()) {
    // 台本行要素
    const lineElm = document.createElement('div');
    lineElm.classList.add(map2class[pscLine.type]);

    if (pscLine.type == 'CHARACTER') {
      lineElm.innerHTML = `<p>${e(pscLine.name)}</p>`;
      if (pscLine.text)
        lineElm.innerHTML += `<p>${eSpc(e(pscLine.text))}</p>`;
    } else if (pscLine.type == 'DIALOGUE') {
      lineElm.innerHTML = `<p>${e(pscLine.name)}</p>`;
      lineElm.innerHTML += `<p>${eSpc(e(pscLine.text))}</p>`;
    } else {
      lineElm.innerHTML = `<p>${eSpc(e(pscLine.text))}</p>`;
    }

    // 見出しなら目次に追加する
    if (['TITLE', 'CHARSHEADLINE', 'H1', 'H2', 'H3'].includes(pscLine.type)) {
      const tocItem = document.createElement('li');
      tocItem.innerHTML = pscLine.text;
      tocItem.setAttribute('onclick', `jumpToLine(${index});`);
      tocList.appendChild(tocItem);

      // 目次項目リストにも番号を追加する
      tocItems.push(index);
    }

    // 台本行要素を main の子供に追加する
    document.getElementById('main').appendChild(lineElm);
  }
}

// 行番号を指定してジャンプする関数
function jumpToLine(lineNum) {
  hideToc();

  let x = 0;
  let y = 0;

  if (lineNum > 0) {
    // スクロール先の要素を決める
    const main = document.getElementById('main');
    let lineElm = main.children[lineNum];

    // 子要素があれば、そっちを使う
    if (lineElm.children.length > 0) {
      lineElm = lineElm.children[0]
    }

    // スクロール先の座標を求める
    if (writingMode < 1) {
      const marginTop = window.getComputedStyle(lineElm).getPropertyValue('margin-top');
      y = lineElm.offsetTop - parseFloat(marginTop);
    } else {
      const marginRight = window.getComputedStyle(lineElm).getPropertyValue('margin-right');
      const viewWidth = document.getElementById('main').offsetWidth;
      x = lineElm.offsetLeft + lineElm.offsetWidth + parseFloat(marginRight) - viewWidth;
    }
  }
  main.scrollTo(x, y);
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

// 検索結果の強調表示をクリアする関数
function clearSrchMatches() {
  const main = document.getElementById('main');

  // 強調表示された span を持つ p 要素を取得する
  let xpath = "//p[span[contains(@class, 'matched')]]";
  let matchedElements = document.evaluate(
    xpath, main, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  // 各 p 要素について、子の強調を解除する
  for ( var i=0 ; i < matchedElements.snapshotLength; i++ ) {
    const el = matchedElements.snapshotItem(i);
    let htmlStr = '';
    // 子ノードに分けて、強調された span ならテキストにする
    for (const node of el.childNodes) {
      if (node.nodeName.toLowerCase() == 'span' && node.classList.contains('matched'))
        htmlStr += node.textContent;
      else if (node.nodeType == Node.TEXT_NODE)
        htmlStr += node.textContent;
      else
        htmlStr += node.outerHTML;
    }
    el.innerHTML = htmlStr;
  }
}

// 検索に一致した文字列を HTML 要素にして配列に入れて返す関数
function listSrchMatches(srchWord, target) {
  /*
   srchWord: 検索ワード
   target:   対象 (all, name, line, direction)
  */

  clearSrchMatches();

  const main = document.getElementById('main');
  let xpath = '';
  switch (target) {
    case 'name':
      xpath = "div[@class='dialogue']/p[1]";
      break;
    case 'line':
      xpath = "div[@class='dialogue']/p[position()>1]";
      break;
    case 'direction':
      xpath = "div[@class='direction']/p";
      break;
    default:
      xpath = 'div/p';
  }

  // 検索対象となる p 要素を取得する
  let srchTargetElements = document.evaluate(
    xpath, main, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  // 正規表現オブジェクト
  let re = new RegExp(srchWord, 'gi');

  for ( var i=0 ; i < srchTargetElements.snapshotLength; i++ ) {
    const el = srchTargetElements.snapshotItem(i);
    let htmlStr = '';
    // 子ノードに分けて、テキストノードなら処理する
    for (const node of el.childNodes) {
      if (node.nodeType == Node.TEXT_NODE)
        // テキストノードだった場合はマッチした部分文字列を強調表示する
        htmlStr += node.textContent.replace(re, '<span class="matched">$&</span>');
      else
        htmlStr += node.outerHTML;
    }
    el.innerHTML = htmlStr;
  }

  // 強調表示した部分を取り出して配列にする
  const foundElements = [];
  xpath = "//span[@class='matched']";
  let matchedElements = document.evaluate(
    xpath, main, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for ( var j=0 ; j < matchedElements.snapshotLength; j++ ) {
    foundElements.push(matchedElements.snapshotItem(j));
  }

  return foundElements;
}
