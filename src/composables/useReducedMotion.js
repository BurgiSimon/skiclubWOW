import { readonly, ref } from 'vue'

const query =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

const reduced = ref(query?.matches ?? false)
query?.addEventListener?.('change', (event) => {
  reduced.value = event.matches
})

/** Reactive `prefers-reduced-motion` flag, shared by all components. */
export function useReducedMotion() {
  return readonly(reduced)
}
