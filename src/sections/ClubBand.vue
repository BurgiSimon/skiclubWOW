<script setup>
// Tilted "Bande" (like our banner at the sports ground) that speeds up while you scroll.
import BootIcon from '@/components/brand/BootIcon.vue'
import VelocityText from '@/components/VelocityText.vue'

const items = [
  'Skifahre',
  'Feschte',
  'Jasse',
  'Après-Ski',
  'Paradislifescht',
  'Skiclub-Bar',
  'Season End',
]
</script>

<template>
  <div class="band" aria-hidden="true">
    <div class="band__strip">
      <VelocityText
        :base-velocity="55"
        :num-copies="4"
        parallax-class-name="band__track"
        scroller-class-name="band__scroller"
        class-name="band__copy"
      >
        <template v-for="item in items" :key="item">
          <span class="band__item">{{ item }}</span>
          <BootIcon class="band__boot" />
        </template>
      </VelocityText>
    </div>
  </div>
</template>

<style scoped>
.band {
  position: relative;
  z-index: 3;
  margin: -1.75rem 0 -1.25rem;
  overflow-x: clip;
  background: transparent;
}

.band__strip {
  width: 110%;
  margin-left: -5%;
  padding: 0.95rem 0 0.85rem;
  background: var(--c-ink);
  color: #fff;
  transform: rotate(-2deg);
  box-shadow: 0 18px 40px -20px rgb(10 11 13 / 0.6);
}

.band :deep(.band__track) {
  position: relative;
  overflow: hidden;
}

.band :deep(.band__scroller) {
  display: flex;
  width: max-content;
  white-space: nowrap;
  will-change: transform;
}

.band :deep(.band__copy) {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.band__item {
  font-size: clamp(1.7rem, 4.2vw, 3.2rem);
  font-stretch: 62%;
  font-weight: 820;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.band__boot {
  width: clamp(1.4rem, 3vw, 2.2rem);
  height: clamp(1.4rem, 3vw, 2.2rem);
  margin: 0 clamp(1rem, 2.4vw, 2rem);
  color: var(--c-red);
}
</style>
