export type PanelCloseFunc = {
  toc: (() => void) | undefined,
  menu: (() => void) | undefined,
  about: (() => void) | undefined,
}

/** Prepare back button handler */
export function initBackHandler(getCloseFunc: () => PanelCloseFunc): void {
  // When window loaded, push a history to hook the next back
  window.addEventListener('load', function (event) {
    window.history.pushState({}, '')
  })

  // When back button pressed, close appropriate panel
  window.addEventListener('popstate', function (event) {
    if (getCloseFunc().toc) {
      getCloseFunc().toc()
    } else if (getCloseFunc().menu) {
      getCloseFunc().menu()
    } else if (getCloseFunc().about) {
      getCloseFunc().about()
    }
    // Then push a history to hook the next back
    window.history.pushState({}, '')
  })
}
