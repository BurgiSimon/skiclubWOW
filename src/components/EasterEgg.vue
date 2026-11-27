<script setup>
// Type "ski" anywhere (or click the boot in the footer) and the boot takes a run across the page.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BootIcon from './brand/BootIcon.vue'
import { useToast } from '@/composables/useUi.js'
import { useReducedMotion } from '@/composables/useReducedMotion.js'

const running = ref(false)
const reducedMotion = useReducedMotion()
const { show } = useToast()
let buffer = ''

function trigger() {
  if (running.value) return
  show('Bravo, Geheimcode gfunde! Dr Skischue macht e Abfahrt.', { icon: '🎿' })
  if (reducedMotion.value) return
  running.value = true
  setTimeout(() => (running.value = false), 2600)
}

function onKeydown(event) {
  if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return
  buffer = (buffer + event.key.toLowerCase()).slice(-3)
  if (buffer === 'ski') {
    buffer = ''
    trigger()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('skiclub:abfahrt', trigger)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('skiclub:abfahrt', trigger)
})
</script>

<template>
  <div v-if="running" class="egg" aria-hidden="true">
    <div class="egg__run">
      <div class="egg__jump">
        <BootIcon class="egg__boot" />
        <svg class="egg__ski" viewBox="0 0 120 14"><path d="M4 8h92c10 0 14-3 18-6" /></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.egg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 12vh;
  z-index: 60;
  pointer-events: none;
}

.egg__run {
  width: 110px;
  animation: egg-run 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
}

.egg__jump {
  animation: egg-jump 2.5s ease-in-out forwards;
  filter: drop-shadow(0 6px 10px rgb(0 0 0 / 0.35));
}

.egg__boot {
  width: 84px;
  height: 84px;
  margin-left: 10px;
  color: #fff;
  background: var(--c-ink);
  border-radius: 18px;
  padding: 8px;
}

.egg__ski {
  display: block;
  width: 120px;
  height: 14px;
  margin-top: -4px;
  fill: none;
  stroke: var(--c-red);
  stroke-width: 7;
  stroke-linecap: round;
}

@keyframes egg-run {
  from {
    transform: translateX(-140px);
  }
  to {
    transform: translateX(calc(100vw + 40px));
  }
}

@keyframes egg-jump {
  0%,
  34% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-150px) rotate(-18deg);
  }
  60% {
    transform: translateY(-120px) rotate(6deg);
  }
  70%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
}
</style>
