<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { club, contactHref } from '@/data/club.js'

const hasEmail = Boolean(club.contact.email)

const options = [
  {
    icon: 'beanie',
    title: 'Mitglied werden',
    text: `Du bist ${club.minAge}+, fährst gern Ski – oder zumindest gern mit – und hast Lust auf Feste, Jass und gute Gesellschaft? Dann komm an einen Anlass und lern uns kennen.`,
    perks: [
      'Eine Mütze. Eine NEUE. (GV-Beschluss 2026)',
      'Skitage, Feste und Vereinsreise',
      `${club.members} neue Kollegen auf einen Schlag`,
    ],
    cta: 'Meld di',
    fallbackCta: 'Komm am nächsten Anlass vorbei',
    subject: 'Mitglied werden beim Skiclub Kestenholz',
  },
  {
    icon: 'heart',
    title: 'Gönner werden',
    text: 'Der Skiclub soll auf eigenen Beinen stehen und finanziert sich über seine Anlässe – und über Gönnerinnen und Gönner, die uns den Rücken stärken.',
    perks: [
      'Ewige Dankbarkeit (mindestens bis zur nächsten GV)',
      'Ein Prost auf dich am nächsten Anlass',
      'Achtung: Bei zu vielen Gönnern droht ein Gönner-Apéro.*',
    ],
    cta: 'Gönner werden',
    fallbackCta: 'Sprich uns am Anlass an',
    subject: 'Gönner werden beim Skiclub Kestenholz',
  },
  {
    icon: 'star',
    title: 'Sponsor werden',
    text: 'Für unsere neuen Club-Skijacken suchen wir noch einen Sponsor. Dein Logo fährt mit – auf jeder Piste, an jedem Fest, in jedem Gruppenfoto.',
    perks: [
      'Sichtbarkeit auf Jacken und Pisten',
      'Erwähnung hier auf der Website',
      'Sympathiepunkte im ganzen Gäu',
    ],
    cta: 'Sponsor werden',
    fallbackCta: 'Lass uns am Anlass reden',
    subject: 'Sponsoring Skiclub Kestenholz',
  },
]
</script>

<template>
  <section id="mitmachen" class="section join" aria-labelledby="join-title">
    <div class="container">
      <div class="join__head">
        <p v-reveal class="section-label">06 · Mitmachen</p>
        <h2 id="join-title" v-reveal class="section-title">
          Platz Nr. {{ club.members + 1 }}<br />isch no frei.
        </h2>
        <p v-reveal class="section-intro">
          Ob als Mitglied, Gönnerin, Gönner oder Sponsor: Beim Skiclub Kestenholz ist jede Hilfe
          willkommen – und jede Hilfe wird gefeiert.
        </p>
      </div>

      <div class="join__cards">
        <article
          v-for="(option, index) in options"
          :key="option.title"
          v-reveal="index * 100"
          class="join-card"
        >
          <span class="join-card__icon"><AppIcon :name="option.icon" /></span>
          <h3 class="join-card__title">{{ option.title }}</h3>
          <p class="join-card__text">{{ option.text }}</p>
          <ul class="join-card__perks" role="list">
            <li v-for="perk in option.perks" :key="perk">
              <AppIcon name="check" />
              <span>{{ perk }}</span>
            </li>
          </ul>
          <a class="btn join-card__cta" :href="contactHref(option.subject)">
            {{ hasEmail ? option.cta : option.fallbackCta }}
            <AppIcon :name="hasEmail ? 'mail' : 'arrow-right'" />
          </a>
        </article>
      </div>

      <div class="join__foot">
        <p v-if="hasEmail" class="join__contact">
          Lieber direkt? Schreib uns:
          <a :href="`mailto:${club.contact.email}`">{{ club.contact.email }}</a>
        </p>
        <p v-else class="join__contact">
          Die Kontaktadresse folgt. Bis dahin: Sprich uns an der Skiclub-Bar, am Paradislifest oder
          am Jass an – wir sind die mit den Fleecejacken.
        </p>
        <p class="join__footnote">
          * Kein Witz: «Bei zu vielen Gönnern wäre ein Gönner-Apéro die Folge.» – GV-Protokoll 2026
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.join {
  background: var(--c-red);
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

.join::before {
  /* oversized boot watermark */
  content: '';
  position: absolute;
  right: -6rem;
  top: -4rem;
  z-index: -1;
  width: 34rem;
  height: 34rem;
  background: currentColor;
  opacity: 0.06;
  -webkit-mask: url('../assets/brand/boot.svg') center / contain no-repeat;
  mask: url('../assets/brand/boot.svg') center / contain no-repeat;
}

.join .section-label {
  color: #fff;
}

.join__head {
  display: grid;
  gap: 1.1rem;
  max-width: 48rem;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.join__head .section-intro {
  color: rgb(255 255 255 / 0.88);
}

.join__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.join-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: clamp(1.5rem, 3vw, 2.2rem);
  border-radius: var(--radius-lg);
  background: var(--c-paper);
  color: var(--c-ink);
  box-shadow: 0 30px 60px -30px rgb(80 10 5 / 0.7);
  transition: transform 0.45s var(--ease-spring);
}

.join-card:hover {
  transform: translateY(-6px) rotate(0.5deg);
}

.join-card:nth-child(2):hover {
  transform: translateY(-6px) rotate(-0.5deg);
}

.join-card__icon {
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: var(--c-ink);
  color: #fff;
}

.join-card__icon .app-icon {
  width: 1.7rem;
  height: 1.7rem;
}

.join-card__title {
  font-size: 2.3rem;
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.95;
  text-transform: uppercase;
}

.join-card__text {
  color: var(--c-muted);
}

.join-card__perks {
  display: grid;
  gap: 0.55rem;
  margin: 0.25rem 0 0.75rem;
}

.join-card__perks li {
  display: flex;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
}

.join-card__perks .app-icon {
  margin-top: 0.1rem;
  color: var(--c-red);
}

.join-card__cta {
  margin-top: auto;
  white-space: normal;
  text-align: center;
}

.join__foot {
  display: grid;
  gap: 0.75rem;
  margin-top: 2.5rem;
}

.join__contact {
  font-size: 1.15rem;
  font-weight: 600;
}

.join__contact a {
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.join__footnote {
  font-size: 0.85rem;
  color: rgb(255 255 255 / 0.75);
}

.join :focus-visible {
  outline-color: #fff;
}

@media (max-width: 1023px) {
  .join__cards {
    grid-template-columns: 1fr;
    max-width: 36rem;
  }
}
</style>
