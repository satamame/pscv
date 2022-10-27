export type PanelCloseFunc = {
  toc: (() => void) | undefined,
  menu: (() => void) | undefined,
  about: (() => void) | undefined,
}

// Be ready to hook next back
export function keepBackable() {
  if (!history.state || !history.state.hookBack) {
    history.pushState({ hookBack: true }, '')
  }
}

/** Prepare back button handler */
export function initBackHandler(getCloseFunc: () => PanelCloseFunc): void {
  // When back button pressed, close appropriate panel
  window.addEventListener('popstate', function (event) {
    if (getCloseFunc().toc) {
      keepBackable()
      getCloseFunc().toc()
    } else if (getCloseFunc().menu) {
      keepBackable()
      getCloseFunc().menu()
    } else if (getCloseFunc().about) {
      keepBackable()
      getCloseFunc().about()
    }
  })
}
