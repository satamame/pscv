import { writable } from 'svelte/store'

/** Hold function that updates the app if available */
export const appUpdateFunc = writable(null)
