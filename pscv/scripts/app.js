// グローバル変数の定義
let scrollV = 0;
let dataList = [];
let selectedDataUrl = '';

window.onload = (event) => {
  // Android OS なら、Back ボタンの制御をする
  const ua = window.navigator.userAgent.toLowerCase();
  if(ua.indexOf("android") !== -1) {
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

  // 「新規」ボタンにクリックハンドラを設定
  document.getElementById("scAddButton").addEventListener("click", (e) => {
    scAdd();
  });

  // 「再読込」ボタンにクリックハンドラを設定
  document.getElementById("reloadButton").addEventListener("click", (e) => {
    reload();
  });

  // dataList を初期化する
  initDataList();
};

// dataList を初期化する関数
const initDataList = () => {
  // localStorage にあれば取得する
  const dataJson = localStorage.dataList;
  if (dataJson) {
    dataList = JSON.parse(dataJson);
  }
  const url = localStorage.selectedDataUrl;
  if (url) {
    selectedDataUrl = url;
  }

  // 台本選択メニューに要素をセットする
  const scSelect = document.getElementById('scSelect');
  while(scSelect.lastChild){
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

// リソースを再読込する関数
const reload = () => {
  window.navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
  window.location.reload(true);
  alert('再読込を反映するには、台本ビューアを再起動してください。');
};

// 台本をスクロールできなくする関数
const disableScrolling = () => {
  scrollV = document.scrollingElement.scrollTop;
  const main = document.getElementById('main');
  main.classList.add('scroll-disabled');
  main.style.setProperty('top', `-${scrollV}px`);
};

// 台本をスクロール可能にする関数
const enableScrolling = () => {
  const main = document.getElementById('main');
  main.classList.remove('scroll-disabled');
  document.scrollingElement.scrollTop = scrollV;
};

// 目次を表示する関数
const showToc = () => {
  disableScrolling();
  document.getElementById("toc").style.visibility = "visible";
  // バックボタン対応のため履歴を追加
  window.history.pushState({activity: 'toc'}, '');
};

// 目次を閉じる関数
const hideToc = () => {
  document.getElementById("toc").style.visibility = "hidden";
  enableScrolling();
  // バックボタン対応のため追加した履歴を削除
  window.history.back();
};

// 設定を表示する関数
const showSetting = () => {
  disableScrolling();
  document.getElementById("setting").style.visibility = "visible";
  // バックボタン対応のため履歴を追加
  window.history.pushState({activity: 'setting'}, '');
};

// 設定を閉じる関数
const hideSetting = () => {
  document.getElementById("setting").style.visibility = "hidden";
  enableScrolling();
  // バックボタン対応のため追加した履歴を削除
  window.history.back();
};

// 台本データを追加する関数
const scAdd = () => {
  let url = prompt('台本データの URL');
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
};

// 台本データをリストに追加する関数
const scAddToList = (data, url) => {
  // すでに同じ URL があれば、古い方を削除する
  const dupe = dataList.find(value => value.url == url);
  if (dupe) {
    dataList = dataList.filter(item => {
      return (item.url != url);
    });
    alert('同じ URL の古いエントリを削除しました。');
  }

  // localStorage に反映する
  data.url = url;
  data.title = data.psc.title;
  dataList.push(data);
  localStorage.dataList = JSON.stringify(dataList);
  localStorage.selectedDataUrl = url;

  // 台本選択メニューに反映する
  initDataList();
};
