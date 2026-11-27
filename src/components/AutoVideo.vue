<script setup>
// Muted looping clip that only loads/plays while it is on screen.
// With reduced motion it waits for an explicit click.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useReducedMotion } from '@/composables/useReducedMotion.js'

const props = defineProps({
  src: { type: String, required: true },
  /** Optional VP9 fallback for browsers without H.264 */
  webm: { type: String, default: '' },
  poster: { type: String, required: true },
  label: { type: String, required: true },
})

const videoRef = ref(null)
const playing = ref(false)
const reducedMotion = useReducedMotion()
let userPaused = false
let observer = null

function play() {
  videoRef.value?.play().catch(() => {
    playing.value = false
  })
}

function toggle() {
  const video = videoRef.value
  if (!video) return
  if (video.paused) {
    userPaused = false
    play()
  } else {
    userPaused = true
    video.pause()
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      const video = videoRef.value
      if (!video) return
      if (entry.isIntersecting && !userPaused && !reducedMotion.value) play()
      else if (!entry.isIntersecting) video.pause()
    },
    { threshold: 0.35 },
  )
  observer.observe(videoRef.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="auto-video">
    <video
      ref="videoRef"
      :poster="props.poster"
      :aria-label="props.label"
      muted
      loop
      playsinline
      preload="none"
      disablepictureinpicture
      @play="playing = true"
      @pause="playing = false"
    >
      <source :src="props.src" type="video/mp4" />
      <source v-if="props.webm" :src="props.webm" type="video/webm" />
    </video>
    <button type="button" class="auto-video__toggle" @click="toggle">
      <AppIcon :name="playing ? 'pause' : 'play'" />
      <span class="visually-hidden">{{ playing ? 'Video pausieren' : 'Video abspielen' }}</span>
    </button>
  </div>
</template>

<style scoped>
.auto-video {
  position: relative;
  width: 100%;
  height: 100%;
  background: #cfd6dc;
}

.auto-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auto-video__toggle {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: rgb(10 11 13 / 0.6);
  color: #fff;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  transition:
    background-color 0.2s,
    transform 0.3s var(--ease-spring);
}

.auto-video__toggle:hover {
  background: rgb(10 11 13 / 0.85);
  transform: scale(1.06);
}

.auto-video__toggle .app-icon {
  width: 18px;
  height: 18px;
}
</style>
