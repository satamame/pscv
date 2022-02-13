# pscv (台本ビューア)

## 概要

JSON で書かれた台本データを表示するための Web アプリです。  
PWA としてスマホ等にインストールすることが可能です。

## インストール

スマホ等にインストールするには、pscv フォルダ以下を https で公開しておく必要があります。  
[こちら](https://satamame.github.io/pscv/)で公開しているので、これを開いても良いです。  
ブラウザでそのページを開いて PWA としてインストールできます。

自分で公開する場合、URL が https://xx.xx/pscv/ の形になっている必要があります。  
そうでない場合、sw.js の「キャッシュ対象ファイル」のパスを変える必要があります。

## データ作成

Python の [playscript](https://pypi.org/project/playscript/) というパッケージで JSON データを作って、以下の形にして .json ファイルとして保存します。

    {"psc": <playscript で作った JSON>}

できたファイルを適当なサーバにアップロードして、台本ビューアの設定画面の「新規」でその URL を入力すると、読み込まれてローカルに保存されます。

playscript で JSON データを作るには、[Fountain (日本式)](https://satamame.github.io/playscript/master/fountain.html) で書いたものを変換するのが良いです。
