<script setup>
import VelocityText from './VelocityText.vue'
import './ScrollVelocity.css'

const props = defineProps({
  scrollContainerRef: { type: Object, default: null },
  texts: { type: Array, default: () => [] },
  velocity: { type: Number, default: 100 },
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
</script>

<template>
  <section>
    <VelocityText
      v-for="(text, index) in texts"
      :key="index"
      :className="className"
      :baseVelocity="index % 2 !== 0 ? -velocity : velocity"
      :scrollContainerRef="scrollContainerRef"
      :damping="damping"
      :stiffness="stiffness"
      :numCopies="numCopies"
      :velocityMapping="velocityMapping"
      :parallaxClassName="parallaxClassName"
      :scrollerClassName="scrollerClassName"
      :parallaxStyle="parallaxStyle"
      :scrollerStyle="scrollerStyle"
    >
      {{ text }}
    </VelocityText>
  </section>
</template>
