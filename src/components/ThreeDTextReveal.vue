<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ThreeDTextReveal.css'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  items: { type: Array, default: () => ['Scroll', 'To', 'Reveal', '3D', 'Text'] },
  className: { type: String, default: '' },
  textClassName: { type: String, default: '' },
  scrollDistance: { type: String, default: '300vh' },
  perspective: { type: Number, default: 1000 },
  radiusOffset: { type: Number, default: 0.4 },
  startRotation: { type: Number, default: -80 },
  endRotation: { type: Number, default: 270 },
  scrubSmoothing: { type: Number, default: 1 },
  fontSize: { type: String, default: 'clamp(3rem, 9vw, 7rem)' },
  fontWeight: { type: Number, default: 900 },
  gap: { type: Number, default: 15 }
})

const wrapperRef = ref(null)
const containerRef = ref(null)
const itemsRef = ref([])

let timeline = null
let refreshHandler = null

function setItemRef(el, index) {
  if (el) itemsRef.value[index] = el
}

function updatePositions() {
  if (!containerRef.value) return
  const radius = window.innerHeight * props.radiusOffset

  itemsRef.value.forEach((item, index) => {
    if (!item) return
    const angleInDegrees = index * props.gap
    const angleInRadians = (angleInDegrees * Math.PI) / 180
    const y = Math.sin(angleInRadians) * radius
    const z = Math.cos(angleInRadians) * radius
    const rotation = -angleInDegrees

    gsap.set(item, {
      y,
      z,
      rotateX: rotation,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%'
    })
  })
}

onMounted(() => {
  if (!wrapperRef.value || !containerRef.value) return

  updatePositions()

  refreshHandler = () => updatePositions()
  ScrollTrigger.addEventListener('refresh', refreshHandler)

  const scroller = wrapperRef.value.closest('[data-scroll-container]')

  const scrollTriggerConfig = {
    trigger: wrapperRef.value,
    start: 'top top',
    end: `+=${props.scrollDistance}`,
    pin: true,
    scrub: props.scrubSmoothing,
    anticipatePin: 1,
    invalidateOnRefresh: true
  }

  if (scroller) {
    scrollTriggerConfig.scroller = scroller
  }

  timeline = gsap.timeline({ scrollTrigger: scrollTriggerConfig })

  timeline.fromTo(
    containerRef.value,
    { rotateX: props.startRotation },
    { rotateX: props.endRotation, ease: 'none' }
  )
})

onUnmounted(() => {
  if (refreshHandler) {
    ScrollTrigger.removeEventListener('refresh', refreshHandler)
  }
  if (timeline) {
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
})
</script>

<template>
  <div
    ref="wrapperRef"
    :class="['text-reveal-3d-wrapper', className]"
    :style="{
      perspective: `${perspective}px`,
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
    }"
  >
    <div ref="containerRef" class="text-reveal-3d-container">
      <div
        v-for="(item, index) in items"
        :key="`${item}-${index}`"
        :ref="(el) => setItemRef(el, index)"
        :class="['text-reveal-3d-item', textClassName]"
        :style="{ fontSize, fontWeight }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
