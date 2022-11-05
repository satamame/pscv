import { log } from './store'
let logString: string
log.subscribe((value) => {
  logString = value
})

export type BackFunc = {
  toc: (() => void) | undefined,
  menu: (() => void) | undefined,
  about: (() => void) | undefined,
}

/** Be ready to hook next back */
export function keepBackable() {
  log.set(logString + `keepBackable called. (${history.length}, ${JSON.stringify(history.state)})<br>`)
  if (!history.state?.backHook) {
    history.pushState({ backHook: true }, '')
  }
}

/** Clear back hook history */
export function back() {
  log.set(logString + `back called. (${history.length}, ${JSON.stringify(history.state)})<br>`)
  if (history.state?.backHook) {
    history.back()
  }
}

/** Prepare back button handler */
export function initBackHandler(getBackFunc: () => BackFunc): void {
  // When back button pressed, call appropriate function
  window.addEventListener('popstate', function (event) {
    log.set(logString + `popstate handler called. (${history.length}, ${JSON.stringify(history.state)})<br>`)
    const backFunc = getBackFunc()
    if (backFunc.toc) {
      backFunc.toc()
    } else if (backFunc.menu) {
      backFunc.menu()
    } else if (backFunc.about) {
      backFunc.about()
    }
  })
  // Clear backHook history just in case
  back()
}
