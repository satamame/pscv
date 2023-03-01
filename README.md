# pscv (台本ビューア)

## このプロジェクトは開発中です。

以前のバージョンは [こちら](https://github.com/satamame/pscv/tree/0.0.2) 。

## 概要

JSON で書かれた台本データを表示するための Web アプリです。  
PWA としてスマホ等にインストールすることが可能です。

## インストール

スマホ等にインストールするには、`yarn build` して dist フォルダ以下を https で公開しておく必要があります。  
ブラウザでそのページを開いて PWA としてインストールできます。  
URL が `https:// (ドメイン) /pscv/` の形になっている必要があります。  
そうでない場合、vite.config.ts 内の `defineConfig()` の `base` パラメタを変える必要があります。

## データ作成

Python の [playscript](https://pypi.org/project/playscript/) というパッケージで [Fountain (日本式)](https://satamame.github.io/playscript/master/fountain.html) から変換するのが良いです。  
[pscapi](https://github.com/satamame/pscapi) を使えば、Python や playscript をインストールしなくてもブラウザで変換できます。

台本ビューアに読み込む方法は、Web 経由で読み込む方法と、ファイルから読み込む方法があります。

### Web 経由で読み込む方法

1. 以下の形の JSON データを https で取得できるようにします。
    ```JSON
    {"psc": <playscript で作った JSON>}
    ```
2. 台本ビューアの「台本データ」画面 >「＋」>「ネットから」でその URL を入力します。

### ファイルから読み込む方法

1. playscript で作った JSON を .json ファイルとして保存します。
2. 台本ビューアの「台本データ」画面 >「＋」>「ファイルから」でそのファイルを選択します。
