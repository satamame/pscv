# 背景

- `svelte-next` ブランチで、Svelte 5 に対応しようとしている。
    - Svelte 5 はまだ正式リリースされていない。

# 参考

- [Rune 導入 (Introducing runes)](https://svelte.jp/blog/runes)
- [Svelte v5 で導入された Runes によるリアクティビティシステム](https://azukiazusa.dev/blog/svelte-reactivity-system-with-runes/)

# 対応

- 子コンポーネントを持つコンポーネントを Runes mode に対応させる。
- store を使っているところを rune で書き直す。

## TODO

- [x] App.svelte の Runes mode 対応
- [ ] Toc.svelte の Runes mode 対応
- [ ] Viewer.svelte の Runes mode 対応
- [ ] store.ts を rune を使って書き直す
