<script setup>
// Words fade in (and un-blur) while the text scrolls through the viewport.
// GSAP is loaded lazily so it does not block the first paint.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion.js'
import './ScrollReveal.css'

const props = defineProps({
  text: { type: String, required: true },
  /** Wrapper element, e.g. 'h2', 'p' or 'blockquote' */
  as: { type: String, default: 'div' },
  scrollContainerRef: { type: Object, default: null },
  enableBlur: { type: Boolean, default: true },
  baseOpacity: { type: Number, default: 0.1 },
  baseRotation: { type: Number, default: 3 },
  blurStrength: { type: Number, default: 4 },
  containerClassName: { type: String, default: '' },
  textClassName: { type: String, default: '' },
  rotationEnd: { type: String, default: 'bottom bottom' },
  wordAnimationEnd: { type: String, default: 'bottom bottom' },
})

const containerRef = ref(null)
const reducedMotion = useReducedMotion()
let context = null
let disposed = false

const segments = computed(() =>
  props.text.split(/(\s+)/).map((text, key) => ({ text, key, isSpace: /^\s+$/.test(text) })),
)

onMounted(async () => {
  if (reducedMotion.value) return
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  const el = containerRef.value
  if (disposed || !el) return
  gsap.registerPlugin(ScrollTrigger)

  const scroller = props.scrollContainerRef?.value ?? window
  const trigger = { trigger: el, scroller, scrub: true }

  context = gsap.context(() => {
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: props.baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: { ...trigger, start: 'top bottom', end: props.rotationEnd },
      },
    )

    const words = el.querySelectorAll('.sr-word')
    const wordTrigger = { ...trigger, start: 'top bottom-=20%', end: props.wordAnimationEnd }

    gsap.fromTo(
      words,
      { opacity: props.baseOpacity, willChange: 'opacity' },
      { ease: 'none', opacity: 1, stagger: 0.05, scrollTrigger: wordTrigger },
    )

    if (props.enableBlur) {
      gsap.fromTo(
        words,
        { filter: `blur(${props.blurStrength}px)` },
        { ease: 'none', filter: 'blur(0px)', stagger: 0.05, scrollTrigger: wordTrigger },
      )
    }
  }, el)
})

onBeforeUnmount(() => {
  disposed = true
  context?.revert()
})
</script>

<template>
  <component :is="as" ref="containerRef" :class="['scroll-reveal', containerClassName]">
    <span :class="['scroll-reveal-text', textClassName]">
      <template v-for="segment in segments" :key="segment.key">
        <span v-if="!segment.isSpace" class="sr-word">{{ segment.text }}</span>
        <template v-else>{{ segment.text }}</template>
      </template>
    </span>
  </component>
</template>
