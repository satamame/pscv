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
}

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
  const lineElm = document.getElementById('main').children[lineNum];
  lineElm.scrollIntoView();
}

// 現在地の目次項目が何番目かを返す関数 // TODO: くわしく
function detectTocItemIndex() {
  const scrollTop = document.getElementById('main').scrollTop;
  console.log(scrollTop);

  let tocItemIndex;
  for (let i = 0; i < tocItems.length; i++) {
    const lineNum = tocItems[i];
    const lineElm = document.getElementById('main').children[lineNum];
    if (lineElm.offsetTop - scrollTop > 0) {
      tocItemIndex = i;
      break;
    }
  }

  const lineNum = tocItems[tocItemIndex];
  console.log(tocItemIndex, lineNum);

  if (lineNum > 0) {
    const prevElm = document.getElementById('main').children[lineNum - 1];
    const prevElmTop = prevElm.offsetTop - scrollTop;
    if (prevElmTop > 0)
    tocItemIndex -= 1;
  }

  return tocItemIndex;
}
