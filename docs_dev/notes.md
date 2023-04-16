使用する material icon
https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Icons
- Rounded
- Web
- Density: 1x
- Size: 24dp
- Color: Black

(Vite) デプロイ先で画像ファイルのパスの整合性を保つ方法
[Static Asset Handling | Vite](https://vitejs.dev/guide/assets.html)

(Vite) プロジェクトルートの、デプロイ先でのパスを指定する方法
[Shared Options | Vite](https://vitejs.dev/config/shared-options.html#base)

[svelte-dnd-action - npm](https://www.npmjs.com/package/svelte-dnd-action)
- 問題点
  - このエラーが出る。
  ```
  [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
  ```
  - セルの中心がリストの外へ出るとドロップできない。
  - ドラッグとスクロールが同時に起きる。
  - ドラッグハンドル以外を触ってスクロールしようとして、その方向にスクロールできなかった場合、向きを変えてもスクロールできない。
    - 例: 一番上までスクロールした状態でさらに上にスクロールしようとして、指を離さずに向きを変えて下にスクロールしようとしても、下にスクロールできない。
    - 原因: スクロール限界でスクロールしようとすると、親要素をスクロールするっぽい。親要素は上下ともスクロール限界なので、ドラッグし続けてもどちらへもスクロールしない。
