<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const scrollerRef = ref(null)
const copyRef = ref(null)

let baseX = 0
let directionFactor = 1
let scrollVelocity = 0
let smoothVelocity = 0
let lastScrollY = 0
let lastTime = 0
let animationId = null
let copyWidth = 0

function wrap(min, max, v) {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(inMin, Math.min(inMax, Math.abs(value)))
  const normalized = (clamped - inMin) / (inMax - inMin)
  const result = outMin + normalized * (outMax - outMin)
  return value < 0 ? -result : result
}

function handleScroll() {
  const now = performance.now()
  const dt = now - lastTime
  if (dt > 0) {
    const container = props.scrollContainerRef?.value ?? null
    const currentScrollY = container ? container.scrollTop : window.scrollY
    scrollVelocity = ((currentScrollY - lastScrollY) / dt) * 1000
    lastScrollY = currentScrollY
    lastTime = now
  }
}

function animate(timestamp, delta) {
  if (!delta) delta = 16
  // Spring-like smoothing
  const springForce = (scrollVelocity - smoothVelocity) * (props.stiffness / 10000)
  const dampingForce = smoothVelocity * (props.damping / 10000)
  smoothVelocity += (springForce - dampingForce) * (delta / 16)

  const input = props.velocityMapping?.input || [0, 1000]
  const output = props.velocityMapping?.output || [0, 5]
  const velocityFactor = mapRange(smoothVelocity, input[0], input[1], output[0], output[1])

  if (velocityFactor < 0) {
    directionFactor = -1
  } else if (velocityFactor > 0) {
    directionFactor = 1
  }

  let moveBy = directionFactor * props.baseVelocity * (delta / 1000)
  moveBy += directionFactor * moveBy * velocityFactor

  baseX += moveBy

  if (copyWidth > 0 && scrollerRef.value) {
    const wrappedX = wrap(-copyWidth, 0, baseX)
    scrollerRef.value.style.transform = `translateX(${wrappedX}px)`
  }
}

let prevTimestamp = null
function loop(timestamp) {
  const delta = prevTimestamp ? timestamp - prevTimestamp : 16
  prevTimestamp = timestamp
  animate(timestamp, delta)
  animationId = requestAnimationFrame(loop)
}

function updateWidth() {
  if (copyRef.value) {
    copyWidth = copyRef.value.offsetWidth
  }
}

onMounted(() => {
  const container = props.scrollContainerRef?.value ?? null
  const scrollTarget = container || window
  lastScrollY = container ? container.scrollTop : window.scrollY
  lastTime = performance.now()

  scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateWidth)
  updateWidth()
  animationId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  const container = props.scrollContainerRef?.value ?? null
  const scrollTarget = container || window
  scrollTarget.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateWidth)
  if (animationId) cancelAnimationFrame(animationId)
})

const copies = Array.from({ length: props.numCopies }, (_, i) => i)
</script>

<template>
  <div :class="parallaxClassName" :style="parallaxStyle">
    <div ref="scrollerRef" :class="scrollerClassName" :style="scrollerStyle">
      <span
        v-for="i in copies"
        :key="i"
        :ref="i === 0 ? (el) => (copyRef = el) : undefined"
        :class="className"
      >
        <slot />&nbsp;
      </span>
    </div>
  </div>
</template>
