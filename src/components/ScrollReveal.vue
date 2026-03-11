<script setup>
import { ref, computed, onMounted, onUnmounted, useSlots } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
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

const slots = useSlots()
const containerRef = ref(null)
let triggers = []

const words = computed(() => {
  const slotContent = slots.default?.()
  if (!slotContent || !slotContent.length) return []
  const text = slotContent
    .map((vnode) => {
      if (typeof vnode.children === 'string') return vnode.children
      return ''
    })
    .join('')
  // Split by whitespace, preserving spaces as separate entries
  return text.split(/(\s+)/).map((segment, index) => ({
    text: segment,
    isSpace: /^\s+$/.test(segment),
    key: index,
  }))
})

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  const scroller =
    props.scrollContainerRef && props.scrollContainerRef.value
      ? props.scrollContainerRef.value
      : window

  gsap.fromTo(
    el,
    { transformOrigin: '0% 50%', rotate: props.baseRotation },
    {
      ease: 'none',
      rotate: 0,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom',
        end: props.rotationEnd,
        scrub: true,
      },
    },
  )

  const wordElements = el.querySelectorAll('.word')

  gsap.fromTo(
    wordElements,
    { opacity: props.baseOpacity, willChange: 'opacity' },
    {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: props.wordAnimationEnd,
        scrub: true,
      },
    },
  )

  if (props.enableBlur) {
    gsap.fromTo(
      wordElements,
      { filter: `blur(${props.blurStrength}px)` },
      {
        ease: 'none',
        filter: 'blur(0px)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: props.wordAnimationEnd,
          scrub: true,
        },
      },
    )
  }

  triggers = ScrollTrigger.getAll().filter((t) => t.trigger === el)
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <h2 ref="containerRef" :class="['scroll-reveal', containerClassName]">
    <p :class="['scroll-reveal-text', textClassName]">
      <template v-for="segment in words" :key="segment.key">
        <span v-if="!segment.isSpace" class="word">{{ segment.text }}</span>
        <template v-else>{{ segment.text }}</template>
      </template>
    </p>
  </h2>
</template>
