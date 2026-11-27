<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import ResponsiveImage from './ResponsiveImage.vue'
import { useLightbox } from '@/composables/useUi.js'

const { lightbox, close, step } = useLightbox()
const dialogRef = ref(null)
const closeRef = ref(null)
const item = computed(() => lightbox.items[lightbox.index])
const total = computed(() => lightbox.items.length)

let touchX = null

watch(
  () => lightbox.open,
  async (open) => {
    document.documentElement.classList.toggle('is-lightbox-open', open)
    if (open) {
      await nextTick()
      closeRef.value?.focus()
    }
  },
)

function onKeydown(event) {
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowLeft') step(-1)
  else if (event.key === 'ArrowRight') step(1)
  else if (event.key === 'Tab') trapFocus(event)
}

function trapFocus(event) {
  const focusable = [...dialogRef.value.querySelectorAll('button')]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onTouchStart(event) {
  touchX = event.changedTouches[0].clientX
}

function onTouchEnd(event) {
  if (touchX === null) return
  const dx = event.changedTouches[0].clientX - touchX
  touchX = null
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightbox.open && item"
        ref="dialogRef"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Fotogalerie"
        @keydown="onKeydown"
        @click.self="close"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
      >
        <button ref="closeRef" type="button" class="lightbox__btn lightbox__close" @click="close">
          <AppIcon name="close" />
          <span class="visually-hidden">Schliessen</span>
        </button>

        <figure class="lightbox__figure" @click.self="close">
          <div class="lightbox__media" @click.self="close">
            <ResponsiveImage
              :key="item.file"
              :image="item"
              :alt="item.alt"
              fit="contain"
              sizes="(min-width: 1400px) 1400px, 100vw"
              loading="eager"
            />
          </div>
          <figcaption class="lightbox__caption">
            <span class="lightbox__count">{{ lightbox.index + 1 }} / {{ total }}</span>
            <span class="hand">{{ item.caption }}</span>
          </figcaption>
        </figure>

        <template v-if="total > 1">
          <button type="button" class="lightbox__btn lightbox__prev" @click="step(-1)">
            <AppIcon name="chevron-left" />
            <span class="visually-hidden">Vorheriges Foto</span>
          </button>
          <button type="button" class="lightbox__btn lightbox__next" @click="step(1)">
            <AppIcon name="chevron-right" />
            <span class="visually-hidden">Nächstes Foto</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 4.5rem 1rem 1.5rem;
  background: rgb(6 7 9 / 0.94);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  color: #fff;
}

.lightbox__figure {
  display: grid;
  gap: 1rem;
  justify-items: center;
  width: min(100%, 1400px);
}

.lightbox__media {
  width: 100%;
  height: calc(100svh - 11rem);
}

.lightbox__caption {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem 1rem;
  text-align: center;
}

.lightbox__caption .hand {
  font-size: 1.6rem;
}

.lightbox__count {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-muted-on-dark);
}

.lightbox__btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 50%;
  background: rgb(255 255 255 / 0.06);
  color: #fff;
  transition: background-color 0.2s;
}

.lightbox__btn:hover {
  background: rgb(255 255 255 / 0.16);
}

.lightbox__btn .app-icon {
  width: 24px;
  height: 24px;
}

.lightbox__close {
  top: 1rem;
  right: 1rem;
}

.lightbox__prev,
.lightbox__next {
  top: 50%;
  transform: translateY(-50%);
}

.lightbox__prev {
  left: 1rem;
}

.lightbox__next {
  right: 1rem;
}

@media (max-width: 640px) {
  .lightbox__prev,
  .lightbox__next {
    top: auto;
    bottom: 1rem;
    transform: none;
  }

  .lightbox__media {
    height: calc(100svh - 13rem);
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>

<style>
html.is-lightbox-open {
  overflow: hidden;
}
</style>
