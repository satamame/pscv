/**
 * Android でバックボタンを押された時の処理のためのモジュール
 */

export type BackFunc = {
  toc: (() => void) | undefined,
  menu: (() => void) | undefined,
  data: (() => void) | undefined,
  about: (() => void) | undefined,
}

/** Be ready to hook next back */
export function keepBackable() {
  if (!history.state?.backHook) {
    history.pushState({ backHook: true }, '')
  }
}

/** Clear back hook history */
export function back() {
  if (history.state?.backHook) {
    history.back()
  }
}

/** Prepare back button handler */
export function initBackHandler(getBackFunc: () => BackFunc): void {
  // When back button pressed, call appropriate function
  window.addEventListener('popstate', function (event) {
    const backFunc = getBackFunc()
    if (backFunc.toc) {
      backFunc.toc()
    } else if (backFunc.menu) {
      backFunc.menu()
    } else if (backFunc.data) {
      backFunc.data()
    } else if (backFunc.about) {
      backFunc.about()
    }
  })
  // Clear backHook history just in case
  back()
}
