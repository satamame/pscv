// Android で実行しているかの判定
const ua = navigator.userAgent.toLowerCase()
export const isAndroid = ua.indexOf("android") >= 0

// iOS で実行しているかの判定
export const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent)

// PWA として実行しているかの判定
export const isPwa = window.matchMedia('(display-mode: standalone)').matches
