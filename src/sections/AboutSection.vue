<script setup>
import AppIcon from '@/components/AppIcon.vue'
import CountUp from '@/components/CountUp.vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { club } from '@/data/club.js'

const statement =
  'Keine Rennen, keine Ranglisten, kein Trainingsplan. Dafür Skitage, Feste, eine eigene Bar – und ein Jass, den wir ernster nehmen als jede Piste.'

const disciplines = [
  {
    icon: 'ski',
    title: 'Skifahre',
    text: 'Zwei bis drei interne Skitage pro Saison – und 2027 zum ersten Mal ein öffentlicher Skitag für alle.',
  },
  {
    icon: 'party',
    title: 'Feschte',
    text: 'Season End Party, Paradislifest und rund zweimal im Jahr unsere eigene Skiclub-Bar in Kestenholz.',
  },
  {
    icon: 'jass',
    title: 'Jasse',
    text: 'Der Skiclub-Jass im Oktober: der einzige Wettkampf, den wir wirklich ernst nehmen.',
  },
  {
    icon: 'trip',
    title: 'Zäme sii',
    text: 'Vereinsreise, GV und spontane Höcks. Am Ende sind wir vor allem eins: ein Haufen guter Kollegen.',
  },
]
</script>

<template>
  <section id="ueber-uns" class="section about" aria-labelledby="about-title">
    <div class="container">
      <div class="about__intro">
        <div class="about__head">
          <p class="section-label">01 · Wer mir sind</p>
          <h2 id="about-title" class="section-title">Kei normale<br />Skiclub.</h2>
        </div>

        <div class="about__text">
          <ScrollReveal
            as="p"
            :text="statement"
            container-class-name="about__statement"
            text-class-name="about__statement-text"
            :base-rotation="2"
            :blur-strength="5"
            rotation-end="bottom center"
            word-animation-end="bottom center"
          />
          <p v-reveal class="about__body">
            Gegründet {{ club.founded }} von {{ club.founders }} Kollegen aus Kestenholz, heute
            {{ club.members }} Mitglieder – alle volljährig, alle mit Freude am Schnee und an guter
            Gesellschaft. Was uns verbindet: gemeinsame Tage in den Bergen und alles, was danach
            kommt.
          </p>
        </div>
      </div>

      <dl class="stats">
        <div v-reveal class="stat">
          <dt>Gegründet</dt>
          <dd>
            <span class="stat__value">{{ club.founded }}</span>
          </dd>
        </div>
        <div v-reveal="80" class="stat">
          <dt>Mitglieder</dt>
          <dd>
            <span class="stat__value"><CountUp :to="club.members" /></span>
          </dd>
        </div>
        <div v-reveal="160" class="stat">
          <dt>Skitage pro Saison</dt>
          <dd><span class="stat__value">2–3</span></dd>
        </div>
        <div v-reveal="240" class="stat stat--joke">
          <dt>Skilifte in Kestenholz</dt>
          <dd>
            <span class="stat__value"><CountUp :from="9" :to="0" :duration="1800" /></span>
            <a class="stat__note hand" href="#heimspiel">Hat uns nie aufgehalten →</a>
          </dd>
        </div>
      </dl>

      <ul class="disciplines" role="list">
        <li
          v-for="(item, index) in disciplines"
          :key="item.title"
          v-reveal="index * 90"
          class="discipline"
        >
          <span class="discipline__icon"><AppIcon :name="item.icon" /></span>
          <span class="discipline__num">Disziplin {{ index + 1 }}</span>
          <h3 class="discipline__title">{{ item.title }}</h3>
          <p class="discipline__text">{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-top: calc(var(--section-pad) + 1rem);
}

.about__intro {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}

.about__head {
  display: grid;
  gap: 1.1rem;
  position: sticky;
  top: calc(var(--header-h) + 2rem);
}

.about__text :deep(.about__statement) {
  margin: 0;
}

.about__text :deep(.about__statement-text) {
  font-size: clamp(1.6rem, 3.1vw, 2.65rem);
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.about__body {
  max-width: 38rem;
  margin-top: 2rem;
  font-size: 1.125rem;
  color: var(--c-muted);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: clamp(3.5rem, 8vw, 6rem) 0 clamp(3rem, 7vw, 5rem);
  border-top: 2px solid var(--c-ink);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 0.35rem;
  padding: 1.5rem 1.25rem 0 0;
}

.stat + .stat {
  padding-left: 1.25rem;
  border-left: 1px solid var(--c-line);
}

.stat dt {
  font-size: 0.85rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.stat dd {
  margin: 0;
  display: grid;
  gap: 0.4rem;
}

.stat__value {
  font-size: clamp(3.4rem, 7vw, 5.6rem);
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}

.stat--joke .stat__value {
  color: var(--c-red);
}

.stat__note {
  justify-self: start;
  font-size: 1.3rem;
  text-decoration: none;
  color: var(--c-ink);
  transform: rotate(-2deg);
  transform-origin: left;
}

.stat__note:hover {
  color: var(--c-red);
}

.disciplines {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.discipline {
  position: relative;
  display: grid;
  align-content: start;
  gap: 0.6rem;
  padding: 1.6rem 1.4rem 1.7rem;
  border-radius: var(--radius-lg);
  background: var(--c-paper);
  box-shadow: var(--shadow-1);
  transition:
    transform 0.4s var(--ease-spring),
    box-shadow 0.3s;
}

.discipline:hover {
  transform: translateY(-6px) rotate(-0.6deg);
  box-shadow: var(--shadow-2);
}

.discipline__icon {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  margin-bottom: 0.6rem;
  border-radius: 14px;
  background: var(--c-ink);
  color: #fff;
}

.discipline:nth-child(2) .discipline__icon {
  background: var(--c-red);
}

.discipline:nth-child(3) .discipline__icon {
  background: var(--c-blue);
}

.discipline:nth-child(4) .discipline__icon {
  background: var(--c-yellow);
  color: var(--c-ink);
}

.discipline__icon .app-icon {
  width: 1.65rem;
  height: 1.65rem;
}

.discipline__num {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.discipline__title {
  font-size: 2.1rem;
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.95;
  text-transform: uppercase;
}

.discipline__text {
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--c-muted);
}

@media (max-width: 1023px) {
  .about__intro {
    grid-template-columns: 1fr;
  }

  .about__head {
    position: static;
  }

  .stats,
  .disciplines {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .stat:nth-child(n + 3) {
    margin-top: 1.5rem;
    border-top: 1px solid var(--c-line);
  }
}

@media (max-width: 560px) {
  .disciplines {
    grid-template-columns: 1fr;
  }
}
</style>
