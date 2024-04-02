import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

/** Hold function that updates the app if available */
export const appUpdateFunc: Writable<Function | null> = writable(null)
