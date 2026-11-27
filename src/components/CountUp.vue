<script setup>
// Counts up to `to` once visible. Screen readers always get the final value.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion.js'

const props = defineProps({
  to: { type: Number, required: true },
  from: { type: Number, default: 0 },
  duration: { type: Number, default: 1400 },
})

const el = ref(null)
const value = ref(props.from)
const reducedMotion = useReducedMotion()
let observer = null
let frame = 0

function run() {
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 4)
    value.value = Math.round(props.from + (props.to - props.from) * eased)
    if (t < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
}

onMounted(() => {
  if (reducedMotion.value || !('IntersectionObserver' in window)) {
    value.value = props.to
    return
  }
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    run()
  })
  observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <span ref="el" class="count-up">
    <span aria-hidden="true">{{ value }}</span>
    <span class="visually-hidden">{{ to }}</span>
  </span>
</template>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
