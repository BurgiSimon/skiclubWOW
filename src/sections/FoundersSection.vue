<script setup>
import BootIcon from '@/components/brand/BootIcon.vue'
import ResponsiveImage from '@/components/ResponsiveImage.vue'
import { chronicle, club } from '@/data/club.js'
import { photo } from '@/data/photos.js'

const founders = photo('gruender-bande')

// Coordinates in % of the photo (x) and % of the photo height (y).
// The SVG uses a 100×75 viewBox (= the photo's 4:3 ratio), so y is scaled by 0.75 there.
const annotations = [
  {
    label: 'Club-Fleece',
    box: { x: 2, y: 36 },
    arrow: 'M 10 31.6 Q 14 39 21.5 41.3',
    head: 'M 20.41 40.13 L 21.5 41.3 L 19.94 41.66',
    rotate: -4,
  },
  {
    label: 'Feierabendbier',
    box: { x: 74, y: 35 },
    arrow: 'M 80 31.5 Q 76 35 71.5 37',
    head: 'M 73.09 37.17 L 71.5 37 L 72.44 35.71',
    rotate: 3,
  },
  {
    label: 'Eigene Bande',
    box: { x: 82, y: 60 },
    arrow: 'M 88 50 Q 87 54 80.5 56',
    head: 'M 82.06 56.36 L 80.5 56 L 81.59 54.83',
    rotate: -3,
  },
]

const joined = club.members - club.founders
const slots = [
  ...Array.from({ length: club.founders }, (_, i) => ({ id: `f${i}`, kind: 'founder' })),
  ...Array.from({ length: joined }, (_, i) => ({ id: `j${i}`, kind: 'member' })),
  { id: 'free', kind: 'free' },
]
</script>

<template>
  <section id="gruender" class="section section--dark founders" aria-labelledby="founders-title">
    <div class="container">
      <div class="founders__head">
        <div>
          <p v-reveal class="section-label">03 · Gründer</p>
          <h2 id="founders-title" v-reveal class="section-title">Acht Kollegen.<br />Eine Idee.</h2>
        </div>
        <p v-reveal="120" class="section-intro muted">
          {{ club.founded }} haben acht Kollegen beschlossen: Kestenholz braucht einen Skiclub.
          Keinen mit Rennkader und Vereinsmeierei, sondern einen, der Skitage, Feste und Kollegen
          zusammenbringt. Drei Jahre später sind wir {{ club.members }} – mit eigener Bande am
          Sportplatz und einer Agenda, die sich sehen lassen kann.
        </p>
      </div>

      <figure v-reveal class="founders__figure">
        <div class="annotated">
          <ResponsiveImage
            :image="founders"
            alt="Die acht Gründungsmitglieder stehen lachend hinter der schwarzen Skiclub-Kestenholz-Bande am Fussballplatz"
            sizes="(min-width: 1320px) 1240px, 94vw"
          />
          <svg class="annotated__arrows" viewBox="0 0 100 75" aria-hidden="true">
            <g v-for="(note, index) in annotations" :key="note.label" :style="{ '--i': index }">
              <path class="annotated__line" :d="note.arrow" />
              <path class="annotated__head" :d="note.head" />
            </g>
          </svg>
          <ul class="annotated__labels" role="list">
            <li
              v-for="(note, index) in annotations"
              :key="note.label"
              class="annotated__label"
              :style="{
                left: `${note.box.x}%`,
                top: `${note.box.y}%`,
                '--rot': `${note.rotate}deg`,
                '--i': index,
              }"
            >
              <span class="annotated__num">{{ index + 1 }}</span>
              <span class="annotated__text hand">{{ note.label }} ✓</span>
            </li>
          </ul>
        </div>
        <figcaption class="founders__caption">
          Die Gründungsmitglieder an unserer Bande beim Sportplatz.
          <span class="founders__legend">
            <template v-for="(note, index) in annotations" :key="note.label">
              <span class="founders__legend-item">{{ index + 1 }} {{ note.label }}</span>
            </template>
          </span>
        </figcaption>
      </figure>

      <div class="founders__bottom">
        <div v-reveal class="members">
          <h3 class="members__title">Von {{ club.founders }} auf {{ club.members }}</h3>
          <ol class="members__grid" role="list" aria-label="Mitglieder-Übersicht">
            <li
              v-for="(slot, index) in slots"
              :key="slot.id"
              class="members__slot"
              :class="`is-${slot.kind}`"
              :style="{ '--i': index }"
            >
              <template v-if="slot.kind === 'free'">
                <a href="#mitmachen" class="members__free">
                  <span aria-hidden="true">Du?</span>
                  <span class="visually-hidden">Platz 19 ist frei – mitmachen</span>
                </a>
              </template>
              <BootIcon v-else />
            </li>
          </ol>
          <ul class="members__legend" role="list">
            <li><span class="swatch swatch--founder" /> {{ club.founders }} Gründer</li>
            <li><span class="swatch swatch--member" /> {{ joined }} dazugekommen</li>
            <li><span class="swatch swatch--free" /> Platz {{ club.members + 1 }}: frei</li>
          </ul>
          <a href="#mitmachen" class="members__cta hand"
            >Platz {{ club.members + 1 }} isch no frei →</a
          >
        </div>

        <div v-reveal="120" class="chronicle">
          <h3 class="chronicle__title">Chronik</h3>
          <ol class="chronicle__list" role="list">
            <li v-for="entry in chronicle" :key="entry.year + entry.text" class="chronicle__item">
              <span class="chronicle__year">{{ entry.year }}</span>
              <span class="chronicle__text">{{ entry.text }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.founders__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem clamp(2rem, 6vw, 6rem);
  align-items: end;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.founders__head > div {
  display: grid;
  gap: 1.1rem;
}

.founders__figure {
  display: grid;
  gap: 1rem;
}

.annotated {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 30px 80px -40px rgb(0 0 0 / 0.9);
}

.annotated__arrows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.55));
}

.annotated__arrows path {
  fill: none;
  stroke: #fff;
  stroke-width: 0.42;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.annotated__line {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
}

.annotated__head {
  opacity: 0;
}

.is-revealed .annotated__line {
  animation: draw 0.8s var(--ease-out) forwards;
  animation-delay: calc(0.7s + var(--i) * 0.25s);
}

.is-revealed .annotated__head {
  animation: appear 0.2s ease forwards;
  animation-delay: calc(1.4s + var(--i) * 0.25s);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}

.annotated__labels {
  margin: 0;
}

.annotated__label {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.2rem 0.75rem 0.25rem 0.3rem;
  border-radius: 999px;
  background: #fff;
  color: var(--c-ink);
  box-shadow: 0 6px 18px -6px rgb(0 0 0 / 0.6);
  white-space: nowrap;
  transform: rotate(var(--rot)) scale(0);
  transform-origin: center;
}

.is-revealed .annotated__label {
  animation: pop 0.5s var(--ease-spring) forwards;
  animation-delay: calc(0.5s + var(--i) * 0.25s);
}

@keyframes pop {
  to {
    transform: rotate(var(--rot)) scale(1);
  }
}

.annotated__num {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--c-red);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
}

.annotated__text {
  font-size: clamp(1.15rem, 1.9vw, 1.6rem);
}

.founders__caption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  font-size: 0.92rem;
  color: var(--c-muted-on-dark);
}

.founders__legend {
  display: none;
  gap: 1rem;
}

.founders__legend-item {
  font-weight: 600;
  color: #fff;
}

@media (max-width: 760px) {
  .annotated__label {
    padding: 0.15rem;
  }

  .annotated__text {
    display: none;
  }

  .founders__legend {
    display: inline-flex;
    flex-wrap: wrap;
  }
}

.founders__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(2rem, 6vw, 6rem);
  margin-top: clamp(3.5rem, 8vw, 6rem);
}

.members__title,
.chronicle__title {
  margin-bottom: 1.5rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.95;
  text-transform: uppercase;
}

.members__grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: clamp(0.4rem, 1.2vw, 0.8rem);
  margin: 0;
}

.members__slot {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 12px;
  font-size: clamp(1.4rem, 3vw, 2rem);
}

.members__slot.is-founder {
  background: #fff;
  color: var(--c-ink);
}

.members__slot.is-member {
  background: var(--c-ink-3);
  color: #fff;
}

.members__slot.is-free {
  border: 2px dashed rgb(255 255 255 / 0.5);
}

.members__slot .boot-icon {
  width: 62%;
  height: 62%;
}

.members__free {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-hand);
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  font-weight: 700;
  color: #ff6a5e;
  text-decoration: none;
  animation: wiggle 2.8s ease-in-out infinite;
}

@keyframes wiggle {
  0%,
  80%,
  100% {
    transform: rotate(0deg);
  }
  85% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(8deg);
  }
  95% {
    transform: rotate(-4deg);
  }
}

.members__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 1.25rem 0 0;
  font-size: 0.9rem;
  color: var(--c-muted-on-dark);
}

.members__legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.swatch {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 4px;
}

.swatch--founder {
  background: #fff;
}

.swatch--member {
  background: var(--c-ink-3);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3);
}

.swatch--free {
  border: 1.5px dashed rgb(255 255 255 / 0.6);
}

.members__cta {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 1.7rem;
  color: #fff;
  text-decoration: none;
  transform: rotate(-2deg);
}

.members__cta:hover {
  color: #ff6a5e;
}

.chronicle__list {
  position: relative;
  display: grid;
  gap: 1.1rem;
  margin: 0;
  padding-left: 1.5rem;
}

.chronicle__list::before {
  content: '';
  position: absolute;
  left: 0.3rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 2px;
  background: linear-gradient(var(--c-red), rgb(255 255 255 / 0.15));
}

.chronicle__item {
  position: relative;
  display: grid;
  gap: 0.15rem;
}

.chronicle__item::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 0.45rem;
  width: 0.8rem;
  height: 0.8rem;
  border: 2px solid var(--c-red);
  border-radius: 50%;
  background: var(--c-ink);
}

.chronicle__item:last-child::before {
  background: var(--c-red);
}

.chronicle__year {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff6a5e;
}

.chronicle__text {
  font-weight: 500;
  line-height: 1.45;
}

@media (max-width: 1023px) {
  .founders__head,
  .founders__bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .members__grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
</style>
