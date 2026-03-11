<script setup>
import { ref, computed, onMounted, onUnmounted, useSlots } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollFloat.css'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  scrollContainerRef: { type: Object, default: null },
  containerClassName: { type: String, default: '' },
  textClassName: { type: String, default: '' },
  animationDuration: { type: Number, default: 1 },
  ease: { type: String, default: 'back.inOut(2)' },
  scrollStart: { type: String, default: 'center bottom+=50%' },
  scrollEnd: { type: String, default: 'bottom bottom-=40%' },
  stagger: { type: Number, default: 0.03 }
})

const slots = useSlots()
const containerRef = ref(null)
let triggers = []

const characters = computed(() => {
  const slotContent = slots.default?.()
  if (!slotContent || !slotContent.length) return []
  // Extract text from slot VNodes
  const text = slotContent
    .map((vnode) => {
      if (typeof vnode.children === 'string') return vnode.children
      return ''
    })
    .join('')
  return text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
})

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  const scroller =
    props.scrollContainerRef && props.scrollContainerRef.value
      ? props.scrollContainerRef.value
      : window

  const charElements = el.querySelectorAll('.char')

  gsap.fromTo(
    charElements,
    {
      willChange: 'opacity, transform',
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: '50% 0%'
    },
    {
      duration: props.animationDuration,
      ease: props.ease,
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger: props.stagger,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: props.scrollStart,
        end: props.scrollEnd,
        scrub: true
      }
    }
  )

  triggers = ScrollTrigger.getAll().filter((t) => t.trigger === el)
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <h2 ref="containerRef" :class="['scroll-float', containerClassName]">
    <span :class="['scroll-float-text', textClassName]">
      <span v-for="(char, index) in characters" :key="index" class="char">{{ char }}</span>
    </span>
  </h2>
</template>
