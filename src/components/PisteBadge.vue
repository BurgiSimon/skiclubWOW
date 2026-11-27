<script setup>
import { computed } from 'vue'
import { PISTES } from '@/data/events.js'

const props = defineProps({
  piste: { type: String, required: true },
  showLevel: { type: Boolean, default: true },
})

const info = computed(() => PISTES[props.piste])
</script>

<template>
  <span class="piste" :class="`piste--${piste}`">
    <span class="piste__swatch" aria-hidden="true" />
    <span class="piste__label">
      <span class="visually-hidden">Schwierigkeitsgrad: </span>{{ info.label
      }}<template v-if="showLevel"
        ><span class="piste__level"> · {{ info.level }}</span></template
      >
    </span>
  </span>
</template>

<style scoped>
.piste {
  --swatch: var(--c-blue);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.piste--red {
  --swatch: var(--c-red);
}

.piste--black {
  --swatch: var(--c-ink);
}

.piste--yellow {
  --swatch: var(--c-yellow);
}

.piste__swatch {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  background: var(--swatch);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);
}

.piste--yellow .piste__swatch {
  /* Striped swatch for the "Skiroute" category: not prepared yet */
  background: repeating-linear-gradient(-45deg, var(--c-yellow) 0 3px, var(--c-ink) 3px 5px);
}

.piste__level {
  font-weight: 500;
  opacity: 0.75;
}
</style>
