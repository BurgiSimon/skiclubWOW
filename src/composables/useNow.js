import { readonly, ref } from 'vue'

// "Today" for countdowns and past/upcoming events. Ticks once a minute.
// For demos you can time-travel with ?heute=2027-03-07 in the URL.

function initialNow() {
  const override = new URLSearchParams(window.location.search).get('heute')
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) {
    const [y, m, d] = override.split('-').map(Number)
    return { date: new Date(y, m - 1, d, 12), frozen: true }
  }
  return { date: new Date(), frozen: false }
}

const start = initialNow()
const now = ref(start.date)
let timer = null

export function useNow() {
  if (!timer && !start.frozen) {
    timer = setInterval(() => {
      now.value = new Date()
    }, 60_000)
  }
  return readonly(now)
}
