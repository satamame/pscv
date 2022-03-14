# pscv (台本ビューア)

## 概要

JSON で書かれた台本データを表示するための Web アプリです。  
PWA としてスマホ等にインストールすることが可能です。

## インストール

スマホ等にインストールするには、pscv フォルダ以下を https で公開しておく必要があります。  
[こちら](https://satamame.github.io/pscv/)で公開しているので、これを開いても良いです。  
ブラウザでそのページを開いて PWA としてインストールできます。

自分で公開する場合、URL が `https://xx.xx/pscv/` の形になっている必要があります。  
そうでない場合、sw.js の「キャッシュ対象ファイル」のパスを変える必要があります。

## データ作成

Python の [playscript](https://pypi.org/project/playscript/) というパッケージで JSON データを作ります。  
playscript で JSON データを作るには、[Fountain (日本式)](https://satamame.github.io/playscript/master/fountain.html) で書いたものを変換するのが良いです。

台本ビューアに読み込む方法は、Web 経由で読み込む方法と、ファイルから読み込む方法があります。

### Web 経由で読み込む方法

1. 以下の形の JSON データを https で取得できるようにします。
    ```JSON
    {"psc": <playscript で作った JSON>}
    ```
2. 台本ビューアの設定画面の「URL から読み込む」でその URL を入力します。

### ファイルから読み込む方法

1. playscript で作った JSON を .json ファイルとして保存します。
2. 台本ビューアの設定画面の「ファイルから読み込む」でそのファイルを選択します。
