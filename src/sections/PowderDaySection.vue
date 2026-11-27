<script setup>
import AppIcon from '@/components/AppIcon.vue'
import AutoVideo from '@/components/AutoVideo.vue'
import PolaroidPhoto from '@/components/PolaroidPhoto.vue'
import { photo } from '@/data/photos.js'
import powderRun from '@/assets/media/powder-run.mp4'
import powderRunWebm from '@/assets/media/powder-run.webm'
import powderRunPoster from '@/assets/media/powder-run-poster.jpg'
import kicker from '@/assets/media/kicker.mp4'
import kickerWebm from '@/assets/media/kicker.webm'
import kickerPoster from '@/assets/media/kicker-poster.jpg'
// Licence plate blurred, sound and metadata removed (see README)
import halberSkilift from '@/assets/media/halber-skilift.mp4'
import halberSkiliftWebm from '@/assets/media/halber-skilift.webm'
import halberSkiliftPoster from '@/assets/media/halber-skilift-poster.jpg'

const schanzenbau = photo('chestehouz-schanzenbau')
const feuer = photo('chestehouz-feuer')

const facts = [
  { value: '0', label: 'Liftanlagen' },
  { value: '½', label: 'Skilift, Eigenbau', href: '#halber-skilift' },
  { value: '1', label: 'Schanze, handgeschaufelt' },
]

// The «lift info board» next to the trunk-lift clip
const liftSpecs = [
  ['Typ', 'Kofferraumlift'],
  ['Antrieb', '1 Peugeot'],
  ['Förderleistung', '2 Personen pro Fahrt'],
  ['Wartezeit', '0 Minuten'],
  ['Betrieb', 'Nur bei Neuschnee'],
  ['Tarif', 'Gratis'],
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
          aus dem Keller geholt, eine Schanze geschaufelt und einen halben Skilift improvisiert. Den
          Rest sind wir selber hochgelaufen. Après-Ski gab’s am Feuer.
        </p>

        <ul class="powder__facts" role="list">
          <li v-for="(fact, index) in facts" :key="fact.label" v-reveal="index * 100">
            <strong>{{ fact.value }}</strong>
            <a v-if="fact.href" :href="fact.href" class="powder__fact-link">
              {{ fact.label }} <AppIcon name="arrow-down" />
            </a>
            <span v-else>{{ fact.label }}</span>
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

    <div id="halber-skilift" class="container lift">
      <div v-reveal class="lift__clip">
        <PolaroidPhoto caption="Bitte einsteigen!" :rotate="-2" ratio="480 / 848">
          <template #media>
            <AutoVideo
              :src="halberSkilift"
              :webm="halberSkiliftWebm"
              :poster="halberSkiliftPoster"
              label="Ein Auto fährt auf einem verschneiten Feldweg vor, zwei Mitglieder sitzen mit ihren Ski im offenen Kofferraum"
            />
          </template>
        </PolaroidPhoto>
      </div>

      <article v-reveal="120" class="lift__board" aria-labelledby="lift-title">
        <p class="lift__kicker">
          <span class="lift__tag"><AppIcon name="lift" /> Anlage Nr. ½</span>
          <span class="lift__since">seit Januar 2026</span>
        </p>
        <h3 id="lift-title" class="lift__title">Halber Skilift</h3>
        <p class="lift__lead">
          Kein Lift im Dorf? Dann bauen wir uns einen – zumindest einen halben. Zwei Kollegen samt
          Ski in den Kofferraum, Klappe offen lassen, fertig.
        </p>
        <dl class="lift__specs">
          <div v-for="[term, value] in liftSpecs" :key="term">
            <dt>{{ term }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
        <p class="lift__note">Nicht zur Nachahmung empfohlen.</p>
      </article>
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

.powder__facts span,
.powder__fact-link {
  font-weight: 600;
}

.powder__fact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: rgb(213 43 30 / 0.45);
  text-underline-offset: 4px;
  transition: text-decoration-color 0.2s;
}

.powder__fact-link:hover {
  text-decoration-color: var(--c-red);
}

.powder__fact-link .app-icon {
  width: 1em;
  height: 1em;
  color: var(--c-red);
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

/* «Halber Skilift»: the trunk-lift clip next to a lift info board */
.lift {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
  margin-top: clamp(4.5rem, 9vw, 7rem);
  scroll-margin-top: 1rem;
}

.lift__clip {
  justify-self: center;
  width: min(100%, 330px);
}

.lift__board {
  position: relative;
  padding: clamp(1.75rem, 3.5vw, 2.75rem);
  border-radius: var(--radius-lg);
  background: var(--c-ink);
  color: #fff;
  box-shadow: var(--shadow-2);
}

/* four screws, like a sign at the valley station */
.lift__board::before {
  content: '';
  position: absolute;
  inset: 0.8rem;
  background:
    radial-gradient(circle, #59616b 2.5px, transparent 3px) left top / 8px 8px no-repeat,
    radial-gradient(circle, #59616b 2.5px, transparent 3px) right top / 8px 8px no-repeat,
    radial-gradient(circle, #59616b 2.5px, transparent 3px) left bottom / 8px 8px no-repeat,
    radial-gradient(circle, #59616b 2.5px, transparent 3px) right bottom / 8px 8px no-repeat;
  pointer-events: none;
}

.lift__kicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lift__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem 0.35rem 0.6rem;
  border-radius: 999px;
  background: var(--c-red);
  white-space: nowrap;
}

.lift__tag .app-icon {
  width: 1.3em;
  height: 1.3em;
}

.lift__since {
  color: var(--c-muted-on-dark);
}

.lift__title {
  margin-top: 1rem;
  font-size: clamp(3rem, 6.5vw, 5.2rem);
  font-stretch: 62%;
  font-weight: 850;
  line-height: 0.86;
  text-transform: uppercase;
}

.lift__lead {
  max-width: 32rem;
  margin-top: 1rem;
  font-size: 1.1rem;
  color: var(--c-muted-on-dark);
}

.lift__specs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1.5rem;
  margin: 1.5rem 0 0;
}

.lift__specs div {
  padding: 0.75rem 0;
  border-top: 1px dashed rgb(255 255 255 / 0.22);
}

.lift__specs dt {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-muted-on-dark);
}

.lift__specs dd {
  margin: 0.15rem 0 0;
  font-weight: 650;
}

.lift__note {
  margin-top: 1.25rem;
  font-size: 0.85rem;
  color: var(--c-muted-on-dark);
}

@media (max-width: 1023px) {
  .powder__grid,
  .lift {
    grid-template-columns: 1fr;
  }

  .lift__clip {
    width: min(78%, 320px);
  }
}

@media (max-width: 379px) {
  .lift__specs {
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
