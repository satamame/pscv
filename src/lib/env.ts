// Android で実行しているかの判定
const ua = navigator.userAgent.toLowerCase()
export const isAndroid = ua.indexOf("android") >= 0

// PWA として実行しているかの判定
export const isPwa = window.matchMedia('(display-mode: standalone)').matches
