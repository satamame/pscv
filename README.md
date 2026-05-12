# pscv (台本ビューア)

## このプロジェクトは開発中です。

以前のバージョンは [こちら](https://github.com/satamame/pscv/tree/0.0.2) 。

## 概要

[Fountain (日本式)](https://satamame.github.io/playscript/master/fountain.html) で書かれた台本データを表示するための Web アプリです。  
PWA としてスマホ等にインストールすることが可能です。

## インストール

スマホ等にインストールするには、ビルドして dist フォルダ以下を https で公開しておく必要があります。  
ブラウザでそのページを開いて PWA としてインストールできます。  
URL が `https:// (ドメイン) /pscv/` の形になっている必要があります。  
そうでない場合、vite.config.ts 内の `defineConfig()` の `base` パラメタを変える必要があります。

## 使い方

🚧 TBD
