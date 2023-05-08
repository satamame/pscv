# 仕様

## 画面構成

- App.svelte
    - Viewer.svelte
    - Header.svelte
    - Toc.svelte
    - MainMenu.svelte
    - DataList.svelte
        - DataAdd.svelte
        - DataInfo.svelte
    - About.svelte
    - ReloadPrompt.svelte

### 遷移

- Header のアイコンから Toc や Menu を開く
- Toc で見出しをクリックすると、Toc を閉じて頭出しする
- Toc で検索ボタンを押すと、Toc を閉じて検索モードになる
- MainMenu で項目を選択すると各種画面に遷移する
- 遷移先から Android の back ボタンで戻れる
    - 設定などは即座に反映し、back しても決定とする

## localStorage

- curScript
    - id
    - line
- settings
    - fontSize
    - writingMode

## IndexedDB

名前: pscvDB

テーブル:

- scriptIndex (台本インデックスのテーブル)
    - id
    - sortKey
    - name
    - scriptId
- scriptData (台本データのテーブル)
    - id
    - pscJson
    - srcType
    - url
    - userData
