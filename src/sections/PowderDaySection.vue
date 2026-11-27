<script setup>
import AutoVideo from '@/components/AutoVideo.vue'
import PolaroidPhoto from '@/components/PolaroidPhoto.vue'
import { photo } from '@/data/photos.js'
import powderRun from '@/assets/media/powder-run.mp4'
import powderRunWebm from '@/assets/media/powder-run.webm'
import powderRunPoster from '@/assets/media/powder-run-poster.jpg'
import kicker from '@/assets/media/kicker.mp4'
import kickerWebm from '@/assets/media/kicker.webm'
import kickerPoster from '@/assets/media/kicker-poster.jpg'

const schanzenbau = photo('chestehouz-schanzenbau')
const feuer = photo('chestehouz-feuer')

const facts = [
  { value: '0', label: 'Liftanlagen' },
  { value: '1', label: 'Schanze, handgeschaufelt' },
  { value: '100 %', label: 'der Höhenmeter zu Fuss' },
]
</script>

<template>
  <section id="heimspiel" class="section section--ice powder" aria-labelledby="powder-title">
    <div class="container powder__grid">
      <div class="powder__copy">
        <p v-reveal class="section-label">02 · Heimspiel</p>
        <h2 id="powder-title" v-reveal class="section-title">Kei Lift?<br />Kei Problem.</h2>
        <p v-reveal class="section-intro">
          Skilifte in Kestenholz: null. Als im Januar 2026 trotzdem Neuschnee lag, haben wir die Ski
          aus dem Keller geholt, eine Schanze geschaufelt und sind die Wiese eben selber
          hochgelaufen. Après-Ski gab’s am Feuer.
        </p>

        <ul class="powder__facts" role="list">
          <li v-for="(fact, index) in facts" :key="fact.label" v-reveal="index * 100">
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.label }}</span>
          </li>
        </ul>
      </div>

      <div class="powder__media">
        <div v-reveal class="powder__phone">
          <div class="phone">
            <span class="phone__notch" aria-hidden="true" />
            <AutoVideo
              :src="powderRun"
              :webm="powderRunWebm"
              :poster="powderRunPoster"
              label="Ein Mitglied zieht Schwünge in den Neuschnee einer Wiese in Kestenholz"
            />
          </div>
          <p class="powder__tag hand">Pulverschnee in Chestehouz. Kein Witz.</p>
        </div>

        <div class="powder__side">
          <div v-reveal="120" class="powder__kicker">
            <AutoVideo
              :src="kicker"
              :webm="kickerWebm"
              :poster="kickerPoster"
              label="Mitglieder springen über die selbst geschaufelte Schanze"
            />
            <span class="powder__badge">Die Schanze · handmade</span>
          </div>

          <div class="powder__polaroids">
            <div v-reveal="200">
              <PolaroidPhoto
                :image="schanzenbau"
                alt="Zwei Mitglieder schaufeln im Neuschnee eine Schanze"
                caption="Bauphase"
                :rotate="-4"
                ratio="1 / 1"
                sizes="(min-width: 1024px) 240px, 45vw"
              />
            </div>
            <div v-reveal="280">
              <PolaroidPhoto
                :image="feuer"
                alt="Gruppe am Feuer im verschneiten Kestenholz"
                caption="Après-Ski"
                :rotate="3"
                ratio="1 / 1"
                position="50% 45%"
                sizes="(min-width: 1024px) 240px, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.powder {
  overflow-x: clip;
}

.powder__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
}

.powder__copy {
  display: grid;
  gap: 1.1rem;
}

.powder__facts {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.powder__facts li {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgb(10 11 13 / 0.12);
}

.powder__facts strong {
  min-width: 5.5rem;
  font-size: 2.4rem;
  font-stretch: 62%;
  font-weight: 820;
  line-height: 1;
  color: var(--c-red);
}

.powder__facts span {
  font-weight: 600;
}

.powder__media {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
  gap: clamp(1.25rem, 3vw, 2.25rem);
  align-items: center;
}

.powder__phone {
  position: relative;
}

.phone {
  position: relative;
  aspect-ratio: 9 / 18.5;
  padding: 10px;
  border-radius: 38px;
  background: var(--c-ink);
  box-shadow:
    inset 0 0 0 2px #2c3036,
    var(--shadow-2);
  transform: rotate(-3deg);
}

.phone :deep(.auto-video) {
  overflow: hidden;
  border-radius: 29px;
}

.phone__notch {
  position: absolute;
  top: 18px;
  left: 50%;
  z-index: 2;
  width: 32%;
  height: 22px;
  border-radius: 999px;
  background: var(--c-ink);
  transform: translateX(-50%);
}

.powder__tag {
  margin-top: 1.25rem;
  font-size: 1.45rem;
  text-align: center;
  transform: rotate(-3deg);
}

.powder__side {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.25rem);
}

.powder__kicker {
  position: relative;
  aspect-ratio: 832 / 464;
  border: 8px solid #fff;
  border-radius: 6px;
  box-shadow: var(--shadow-2);
  transform: rotate(1.5deg);
  overflow: hidden;
}

.powder__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--c-red);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.powder__polaroids {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.powder__polaroids :deep(.polaroid__caption) {
  min-height: 2.8rem;
  font-size: 1.35rem;
}

@media (max-width: 1023px) {
  .powder__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .powder__media {
    grid-template-columns: 1fr;
  }

  .powder__phone {
    width: min(72%, 300px);
    margin-inline: auto;
  }
}
</style>
