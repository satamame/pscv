# 背景

- `svelte-next` ブランチで、Svelte 5 に対応しようとしている。
    - Svelte 5 はまだ正式リリースされていない。

# 参考

- [Rune 導入 (Introducing runes)](https://svelte.jp/blog/runes)
- [Runes • Docs • Svelte 5 preview](https://svelte-5-preview.vercel.app/docs/runes)
- [Svelte v5 で導入された Runes によるリアクティビティシステム](https://azukiazusa.dev/blog/svelte-reactivity-system-with-runes/)
- [Svelte v5 における イベントハンドラの変更点](https://azukiazusa.dev/blog/svelte-v5-event-handlers/)
- [Svelte v5 で導入されるスニペット機能](https://azukiazusa.dev/blog/svelte-v5-snippet-feature/)

# 対応

- コンポーネントを Runes mode に対応させる。
    - リアクティブな変数を宣言する時に `let xx = $state(yy)` と書くようにする。
    - 変数を式に対してリアクティブにするには `let xx = $derived(yy + zz)` 等とする。
    - `$derived()` で TypeScript がエラーを出す時や、複雑な処理をする時は `$derived.by()` を使う。
    - 変数を更新する処理が副作用を伴う時は `$effect()` で書く。
    - コンポーネントプロパティを `export let xx` ではなく `let { xx } = $props()` で宣言する。
- 非推奨となったイベントハンドラを書き直す。
- store を使っているところを rune で書き直す。

## TODO

- コンポーネントの Runes mode 対応, イベントハンドラ更新
    - [x] App.svelte
    - [x] Viewer.svelte
    - [x] Header.svelte
    - [x] Toc.svelte
    - [x] MainMenu.svelte
    - [x] About.svelte
        - [x] 更新ボタンの動作確認
    - [x] ReloadPrompt.svelte
    - [x] DataList.svelte
    - [x] DataCell.svelte
    - [x] DataAdd.svelte
    - [x] DataInfo.svelte
    - PScLine
        - [x] Author
        - [x] Character
        - [x] CharsHeadline
        - [x] Comment
        - [x] Dialogue
        - [x] Direction
        - [x] Endmark
        - [x] Headline1
        - [x] Headline2
        - [x] Headline3
        - [x] Title
    - UI
    - [x] DndList.svelte
    - [x] FileSelect.svelte
    - [x] LoremIpsum.svelte
    - [x] Overlay.svelte
    - [x] ~~Spinner.svelte~~
- [ ] store.ts を rune を使って書き直す
