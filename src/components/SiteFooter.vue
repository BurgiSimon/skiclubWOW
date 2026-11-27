<script setup>
import AppIcon from './AppIcon.vue'
import BootIcon from './brand/BootIcon.vue'
import BrandWordmark from './brand/BrandWordmark.vue'
import { club, navLinks } from '@/data/club.js'

const year = new Date().getFullYear()

function abfahrt() {
  window.dispatchEvent(new CustomEvent('skiclub:abfahrt'))
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <button type="button" class="footer__boot" title="Psst …" @click="abfahrt">
          <BootIcon />
          <span class="visually-hidden">Geheime Abfahrt starten</span>
        </button>
        <p class="footer__claim hand">Mer gseh üs uf de Pischte!</p>
      </div>

      <div class="footer__grid">
        <div>
          <h2 class="footer__heading">Verein</h2>
          <p>
            {{ club.name }}<br />
            {{ club.place }}<br />
            Gegründet {{ club.founded }}
          </p>
        </div>

        <nav aria-label="Footer-Navigation">
          <h2 class="footer__heading">Navigation</h2>
          <ul role="list" class="footer__links">
            <li v-for="link in navLinks" :key="link.id">
              <a :href="`#${link.id}`">{{ link.label }}</a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="footer__heading">Kontakt</h2>
          <p v-if="club.contact.email">
            <a :href="`mailto:${club.contact.email}`" class="footer__icon-link">
              <AppIcon name="mail" /> {{ club.contact.email }}
            </a>
          </p>
          <p v-else>Kontaktadresse folgt. Bis dahin findest du uns an jedem Anlass.</p>
          <p v-if="club.contact.instagram">
            <a
              :href="`https://www.instagram.com/${club.contact.instagram}/`"
              class="footer__icon-link"
              rel="noopener"
              target="_blank"
            >
              <AppIcon name="instagram" /> @{{ club.contact.instagram }}
            </a>
          </p>
        </div>

        <div>
          <h2 class="footer__heading">Schlusswort GV 2026</h2>
          <blockquote class="footer__quote hand">«Geil siter aui do gse!»</blockquote>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© {{ year }} {{ club.name }}</p>
        <p class="footer__egg">
          Psst: Tipp mal <kbd>s</kbd> <kbd>k</kbd> <kbd>i</kbd> – oder klick den Schuh.
        </p>
        <a href="#start" class="footer__up">
          Zrügg uf e Gipfel
          <AppIcon name="arrow-up" />
        </a>
      </div>
    </div>

    <div class="footer__giant" aria-hidden="true">
      <BrandWordmark />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: clamp(4rem, 8vw, 6rem) 0 0;
  background: var(--c-ink);
  color: #fff;
  overflow: hidden;
}

.footer__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.12);
}

.footer__boot {
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 20px;
  background: transparent;
  color: #fff;
  font-size: 2.6rem;
  transition:
    transform 0.4s var(--ease-spring),
    background-color 0.2s;
}

.footer__boot:hover {
  background: rgb(255 255 255 / 0.08);
  transform: rotate(-10deg) translateY(-3px);
}

.footer__claim {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  transform: rotate(-2deg);
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  padding: 2.5rem 0;
  color: rgb(255 255 255 / 0.78);
}

.footer__heading {
  margin-bottom: 0.9rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ff6a5e;
}

.footer__links {
  display: grid;
  gap: 0.4rem;
  margin: 0;
}

.footer__links a,
.footer__icon-link {
  text-decoration: none;
  transition: color 0.2s;
}

.footer__links a:hover,
.footer__icon-link:hover {
  color: #fff;
}

.footer__icon-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.footer__quote {
  font-size: 1.9rem;
  color: #fff;
  transform: rotate(-2deg);
  transform-origin: left;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgb(255 255 255 / 0.12);
  font-size: 0.88rem;
  color: var(--c-muted-on-dark);
}

.footer__egg kbd {
  display: inline-grid;
  place-items: center;
  min-width: 1.6em;
  height: 1.6em;
  padding: 0 0.3em;
  border: 1px solid rgb(255 255 255 / 0.25);
  border-bottom-width: 2px;
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: #fff;
}

.footer__up {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 650;
  color: #fff;
  text-decoration: none;
}

.footer__up:hover .app-icon {
  transform: translateY(-3px);
}

.footer__up .app-icon {
  transition: transform 0.3s var(--ease-spring);
}

.footer__giant {
  display: flex;
  justify-content: center;
  margin-bottom: -1.6vw;
  padding-inline: 2vw;
  color: rgb(255 255 255 / 0.07);
}

.footer__giant .wordmark {
  width: 100%;
  height: auto;
}

@media (max-width: 860px) {
  .footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
