<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import PixelSnow from '@/components/PixelSnow.vue'
import PolaroidPhoto from '@/components/PolaroidPhoto.vue'
import { club, pointingCaptions } from '@/data/club.js'
import { events } from '@/data/events.js'
import { photo } from '@/data/photos.js'
import { useNow } from '@/composables/useNow.js'
import { countdownLabel, dateParts, daysUntil, splitByDate } from '@/utils/date.js'

const now = useNow()
const pointing = photo('skitag-doert')

const captionIndex = ref(0)
const caption = computed(() => pointingCaptions[captionIndex.value])
function nextCaption() {
  captionIndex.value = (captionIndex.value + 1) % pointingCaptions.length
}

const nextEvent = computed(() => splitByDate(events, now.value).upcoming[0] ?? null)
const nextParts = computed(() => (nextEvent.value ? dateParts(nextEvent.value.date) : null))
const nextDays = computed(() => (nextEvent.value ? daysUntil(nextEvent.value.date, now.value) : 0))

// Chunkier snow pixels on small screens
const snowResolution = ref(220)
function updateSnowResolution() {
  snowResolution.value = window.innerWidth < 700 ? 120 : 220
}
onMounted(() => {
  updateSnowResolution()
  window.addEventListener('resize', updateSnowResolution, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', updateSnowResolution))
</script>

<template>
  <section id="start" class="hero" aria-labelledby="hero-title">
    <PixelSnow
      class="hero__snow"
      :pixel-resolution="snowResolution"
      :density="0.26"
      :speed="1"
      :direction="118"
    />

    <div class="hero__inner container">
      <div class="hero__copy">
        <p class="hero__eyebrow eyebrow">
          <span class="hero__pulse" aria-hidden="true" />
          Gegründet {{ club.founded }} · {{ club.place }}
        </p>

        <h1 id="hero-title" class="hero__title">
          <span class="visually-hidden">Skiclub Kestenholz: </span>
          <span class="hero__line">Mir fahre</span>
          <span class="hero__line">Ski.</span>
          <span class="hero__scribble hand">meischtens.</span>
        </h1>

        <p class="hero__lead">
          {{ club.members }} Kollegen aus Chestehouz. Wir organisieren Skitage, Feste und einen
          legendären Jass – mit mehr Plausch als Ehrgeiz.
        </p>

        <div class="hero__ctas">
          <a class="btn btn--light" href="#agenda">
            Agenda 2027
            <AppIcon name="arrow-right" />
          </a>
          <a class="btn btn--ghost-light" href="#ueber-uns">Wer mir sind</a>
        </div>

        <a v-if="nextEvent" class="hero__next" href="#agenda">
          <span class="hero__next-label">Nächster Anlass</span>
          <span class="hero__next-title">
            {{ nextEvent.title }}<span v-if="!nextEvent.public" class="muted"> (intern)</span>
          </span>
          <span class="hero__next-date">{{ nextParts.weekday }}, {{ nextParts.numeric }}</span>
          <span class="hero__next-count">{{ countdownLabel(nextDays) }}</span>
        </a>
      </div>

      <div class="hero__visual">
        <div class="hero__polaroid" @click="nextCaption">
          <PolaroidPhoto
            :image="pointing"
            alt="Sechs Skiclub-Mitglieder in Skimontur zeigen gleichzeitig dramatisch in dieselbe Richtung"
            :rotate="4"
            ratio="4 / 5"
            position="50% 40%"
            loading="eager"
            sizes="(min-width: 1024px) 400px, 75vw"
          >
            <template #caption>
              <button type="button" class="hero__caption-btn" @click.stop="nextCaption">
                <Transition name="caption" mode="out-in">
                  <span :key="caption">«{{ caption }}»</span>
                </Transition>
                <span class="visually-hidden"> – andere Bildlegende anzeigen</span>
              </button>
            </template>
          </PolaroidPhoto>
        </div>
        <p class="hero__hint hand" aria-hidden="true">
          <svg viewBox="0 0 60 40" class="hero__hint-arrow">
            <path d="M54 34C40 34 22 28 12 8M12 8l-2 12M12 8l11 6" />
          </svg>
          Klick für e neui Bildlegände
        </p>
      </div>
    </div>

    <a href="#ueber-uns" class="hero__scroll">
      <span>Abfahrt</span>
      <AppIcon name="arrow-down" />
    </a>

    <svg class="hero__ridge" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
      <path
        class="hero__ridge-back"
        d="M0 140V70c90-14 170-30 270-26s170 22 260 14 150-40 250-44 160 24 250 26 150-30 240-32 130 14 170 20v112z"
      />
      <path
        class="hero__ridge-front"
        d="M0 140V104c120-10 220-26 330-24s190 18 300 10 170-34 290-34 180 26 280 26 150-18 240-22v80z"
      />
    </svg>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-h) + 2.5rem) 0 clamp(8rem, 13vw, 10rem);
  background: radial-gradient(120% 80% at 75% 10%, #1d232b 0%, rgb(10 11 13 / 0) 60%), var(--c-ink);
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

.hero__snow {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  color: rgb(255 255 255 / 0.75);
}

.hero__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-red);
  box-shadow: 0 0 0 0 rgb(213 43 30 / 0.7);
  animation: pulse 2.2s infinite;
}

@keyframes pulse {
  70% {
    box-shadow: 0 0 0 10px rgb(213 43 30 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(213 43 30 / 0);
  }
}

.hero__title {
  display: grid;
  font-size: clamp(5.2rem, 11vw, 10rem);
  font-stretch: 62%;
  font-weight: 850;
  line-height: 0.84;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.hero__line {
  display: block;
}

.hero__scribble {
  justify-self: start;
  margin: -0.05em 0 0 1.35em;
  font-size: 0.5em;
  font-stretch: 100%;
  line-height: 1;
  letter-spacing: 0;
  text-transform: none;
  color: #ff5a4a;
  transform: rotate(-7deg);
  transform-origin: left center;
}

.hero__lead {
  max-width: 34rem;
  margin-top: 1.75rem;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.55;
  color: rgb(255 255 255 / 0.82);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.hero__next {
  display: inline-grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0.15rem 1.25rem;
  margin-top: 2.25rem;
  padding: 0.9rem 1.2rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  border-left: 4px solid var(--c-red);
  border-radius: 10px;
  background: rgb(255 255 255 / 0.05);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  text-decoration: none;
  transition: background-color 0.2s;
}

.hero__next:hover {
  background: rgb(255 255 255 / 0.1);
}

.hero__next-label {
  grid-column: 1 / -1;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ff6a5e;
}

.hero__next-title {
  font-weight: 700;
}

.hero__next-title .muted {
  font-weight: 500;
  color: rgb(255 255 255 / 0.6);
}

.hero__next-date {
  font-size: 0.92rem;
  color: rgb(255 255 255 / 0.75);
}

.hero__next-count {
  grid-column: 1 / -1;
  font-family: var(--font-hand);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.1;
}

/* Polaroid: the six of them point right at the headline */
.hero__visual {
  position: relative;
  justify-self: center;
  width: min(100%, 400px);
}

.hero__polaroid {
  cursor: pointer;
}

.hero__polaroid :deep(.polaroid) {
  animation: drop-in 1s var(--ease-spring) 0.3s backwards;
}

.hero__polaroid:hover :deep(.polaroid) {
  transform: rotate(1.5deg) scale(1.02);
}

@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateY(-40px) rotate(14deg);
  }
}

.hero__caption-btn {
  padding: 0.1rem 0.4rem;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
}

.hero__hint {
  position: absolute;
  left: -1rem;
  bottom: -3.2rem;
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 1.35rem;
  color: rgb(255 255 255 / 0.7);
  transform: rotate(-4deg);
}

.hero__hint-arrow {
  width: 42px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  margin-bottom: 0.6rem;
}

.caption-enter-active,
.caption-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}

.caption-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.caption-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: clamp(4.2rem, 7vw, 5.5rem);
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  color: rgb(255 255 255 / 0.7);
  transform: translateX(-50%);
}

.hero__scroll .app-icon {
  animation: nudge 1.8s ease-in-out infinite;
}

@keyframes nudge {
  50% {
    transform: translateY(5px);
  }
}

.hero__ridge {
  position: absolute;
  left: 0;
  bottom: -1px;
  z-index: 0;
  width: 100%;
  height: clamp(60px, 9vw, 140px);
}

.hero__ridge-back {
  fill: rgb(255 255 255 / 0.07);
}

.hero__ridge-front {
  fill: var(--c-snow);
}

@media (max-width: 1023px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: clamp(4.2rem, 21vw, 9.5rem);
  }

  .hero__visual {
    width: min(78%, 340px);
    margin: 1.5rem auto 2.5rem;
  }

  .hero__hint {
    left: auto;
    right: -0.5rem;
    bottom: -2.8rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 560px) {
  .hero__next {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero__scroll {
    display: none;
  }
}
</style>
