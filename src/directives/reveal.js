// v-reveal: fades/slides an element in once it scrolls into view.
// Usage: <div v-reveal> or <div v-reveal="120"> (delay in ms). Styles live in styles/main.css.

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    }
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed')
      return
    }
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
