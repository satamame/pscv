const ua = navigator.userAgent.toLowerCase()
export const isAndroid = ua.indexOf("android") >= 0

const url = new URL(window.location.href)
const params = url.searchParams
export const isPwa = params.get('pwa') === 'true'
