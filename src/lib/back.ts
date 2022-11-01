export type BackFunc = {
  toc: (() => void) | undefined,
  menu: (() => void) | undefined,
  about: (() => void) | undefined,
}

/** Be ready to hook next back */
export function keepBackable() {
  if (!history.state?.backHook) {
    history.pushState({ backHook: true }, '')
  }
}

/** Prepare back button handler */
export function initBackHandler(getBackFunc: () => BackFunc): void {
  // When back button pressed, call appropriate function
  window.addEventListener('popstate', function (event) {
    const backFunc = getBackFunc()
    if (backFunc.toc) {
      keepBackable()
      backFunc.toc()
    } else if (backFunc.menu) {
      keepBackable()
      backFunc.menu()
    } else if (backFunc.about) {
      keepBackable()
      backFunc.about()
    }
  })
  // Clear backHook history just in case
  if (history.state?.backHook) {
    history.back()
  }
}
