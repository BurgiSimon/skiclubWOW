import { reactive, ref } from 'vue'

// Small app-wide UI state (no store library needed for a site this size).

/* --- Lightbox ------------------------------------------------------------- */

const lightbox = reactive({ open: false, items: [], index: 0 })
let returnFocusTo = null

export function useLightbox() {
  function open(items, index = 0) {
    returnFocusTo = document.activeElement
    lightbox.items = items
    lightbox.index = index
    lightbox.open = true
  }
  function close() {
    lightbox.open = false
    returnFocusTo?.focus?.({ preventScroll: true })
    returnFocusTo = null
  }
  function step(delta) {
    const count = lightbox.items.length
    lightbox.index = (lightbox.index + delta + count) % count
  }
  return { lightbox, open, close, step }
}

/* --- Toasts --------------------------------------------------------------- */

const toasts = ref([])
let toastId = 0

export function useToast() {
  function show(message, { icon = '❄', timeout = 4200 } = {}) {
    const id = ++toastId
    toasts.value = [...toasts.value.slice(-2), { id, message, icon }]
    setTimeout(() => dismiss(id), timeout)
  }
  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }
  return { toasts, show, dismiss }
}

/* --- Snow cannon (page-wide snowfall easter egg) -------------------------- */

const snowing = ref(false)

export function useSnowCannon() {
  return { snowing }
}
