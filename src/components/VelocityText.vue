<script setup>
// Infinite marquee whose speed (and direction) follows the scroll velocity.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion.js'
import './ScrollVelocity.css'

const props = defineProps({
  baseVelocity: { type: Number, default: 100 },
  scrollContainerRef: { type: Object, default: null },
  className: { type: String, default: '' },
  damping: { type: Number, default: 50 },
  stiffness: { type: Number, default: 400 },
  numCopies: { type: Number, default: 6 },
  velocityMapping: {
    type: Object,
    default: () => ({ input: [0, 1000], output: [0, 5] }),
  },
  parallaxClassName: { type: String, default: 'parallax' },
  scrollerClassName: { type: String, default: 'scroller' },
  parallaxStyle: { type: Object, default: () => ({}) },
  scrollerStyle: { type: Object, default: () => ({}) },
})

const rootRef = ref(null)
const scrollerRef = ref(null)
const reducedMotion = useReducedMotion()

let firstCopy = null
let copyWidth = 0
let baseX = 0
let directionFactor = 1
let scrollVelocity = 0
let smoothVelocity = 0
let lastScrollY = 0
let lastScrollTime = 0
let prevTimestamp = null
let frame = 0
let visible = false
let resizeObserver = null
let intersectionObserver = null

function setFirstCopy(el) {
  firstCopy = el
}

function wrap(min, max, value) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(inMin, Math.min(inMax, Math.abs(value)))
  const result = outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin)
  return value < 0 ? -result : result
}

function scrollTarget() {
  return props.scrollContainerRef?.value ?? window
}

function currentScrollY() {
  const container = props.scrollContainerRef?.value
  return container ? container.scrollTop : window.scrollY
}

function onScroll() {
  const now = performance.now()
  const dt = now - lastScrollTime
  if (dt <= 0) return
  const y = currentScrollY()
  scrollVelocity = ((y - lastScrollY) / dt) * 1000
  lastScrollY = y
  lastScrollTime = now
}

function tick(timestamp) {
  frame = requestAnimationFrame(tick)
  const delta = prevTimestamp ? Math.min(timestamp - prevTimestamp, 64) : 16
  prevTimestamp = timestamp
  if (!visible || copyWidth <= 0) return

  // No scroll event for a moment → the scroll velocity is zero again.
  if (performance.now() - lastScrollTime > 80) scrollVelocity = 0

  const springForce = (scrollVelocity - smoothVelocity) * (props.stiffness / 10000)
  const dampingForce = smoothVelocity * (props.damping / 10000)
  smoothVelocity += (springForce - dampingForce) * (delta / 16)

  const { input = [0, 1000], output = [0, 5] } = props.velocityMapping ?? {}
  const velocityFactor = mapRange(smoothVelocity, input[0], input[1], output[0], output[1])
  if (velocityFactor < 0) directionFactor = -1
  else if (velocityFactor > 0) directionFactor = 1

  let moveBy = directionFactor * props.baseVelocity * (delta / 1000)
  moveBy += directionFactor * moveBy * velocityFactor
  baseX += moveBy

  scrollerRef.value.style.transform = `translate3d(${wrap(-copyWidth, 0, baseX)}px, 0, 0)`
}

function start() {
  if (frame) return
  prevTimestamp = null
  frame = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
  if (scrollerRef.value) scrollerRef.value.style.transform = ''
}

onMounted(() => {
  lastScrollY = currentScrollY()
  lastScrollTime = performance.now()
  scrollTarget().addEventListener('scroll', onScroll, { passive: true })

  resizeObserver = new ResizeObserver(() => {
    copyWidth = firstCopy?.offsetWidth ?? 0
  })
  if (firstCopy) resizeObserver.observe(firstCopy)

  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  intersectionObserver.observe(rootRef.value)

  if (!reducedMotion.value) start()
})

watch(reducedMotion, (reduced) => (reduced ? stop() : start()))

onBeforeUnmount(() => {
  stop()
  scrollTarget().removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
})
</script>

<template>
  <div ref="rootRef" :class="parallaxClassName" :style="parallaxStyle">
    <div ref="scrollerRef" :class="scrollerClassName" :style="scrollerStyle">
      <span
        v-for="i in numCopies"
        :key="i"
        :ref="i === 1 ? setFirstCopy : undefined"
        :class="className"
        :aria-hidden="i > 1 ? 'true' : undefined"
      >
        <slot />&nbsp;
      </span>
    </div>
  </div>
</template>
