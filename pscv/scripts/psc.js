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

// PSc データを main 要素に反映させる関数
function loadPSc(pscData) {
  // main 要素の子孫を削除する
  const main = document.getElementById('main')
  while (main.lastChild) {
    main.removeChild(main.lastChild);
  }

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

  for (let pscLine of pscData.lines) {
    // 台本行要素
    let line_el = document.createElement('div');
    line_el.classList.add(map2class[pscLine.type]);

    if (pscLine.type == 'CHARACTER') {
      line_el.innerHTML = `<p>${e(pscLine.name)}</p>`;
      if (pscLine.text)
        line_el.innerHTML += `<p>${eSpc(e(pscLine.text))}</p>`;
    } else if (pscLine.type == 'DIALOGUE') {
      line_el.innerHTML = `<p>${e(pscLine.name)}</p>`;
      line_el.innerHTML += `<p>${eSpc(e(pscLine.text))}</p>`;
    } else {
      line_el.innerHTML = `<p>${eSpc(e(pscLine.text))}</p>`;
    }

    // 台本行要素を main の子供に追加する
    main.appendChild(line_el);
  }
}
