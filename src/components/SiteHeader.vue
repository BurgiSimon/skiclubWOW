<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BootIcon from './brand/BootIcon.vue'
import BrandWordmark from './brand/BrandWordmark.vue'
import AppIcon from './AppIcon.vue'
import { club, instagramUrl, navLinks } from '@/data/club.js'
import { useSnowCannon, useToast } from '@/composables/useUi.js'
import { useReducedMotion } from '@/composables/useReducedMotion.js'

// The red CTA already covers «Mitmachen» on desktop
const desktopLinks = navLinks.filter((link) => link.id !== 'mitmachen')

const scrolled = ref(false)
const progress = ref(0)
const activeId = ref('')
const menuOpen = ref(false)
const menuRef = ref(null)
const toggleRef = ref(null)

const { snowing } = useSnowCannon()
const { show } = useToast()
const reducedMotion = useReducedMotion()

let ticking = false
let spy = null
let closingViaLink = false

function measure() {
  ticking = false
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrolled.value = y > 24
  progress.value = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(measure)
}

function onKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) menuOpen.value = false
}

function closeFromLink() {
  closingViaLink = true
  menuOpen.value = false
}

function toggleSnow() {
  if (reducedMotion.value) {
    show('Schnee gibt’s nur mit Bewegung – und dein Gerät wünscht sich weniger davon.', {
      icon: '🙈',
    })
    return
  }
  snowing.value = !snowing.value
  show(
    snowing.value
      ? 'Schneekanone läuft. Chestehouz sagt merci!'
      : 'Schneekanone aus. Zurück zum Gäu-Grün.',
    { icon: snowing.value ? '❄' : '🌱' },
  )
}

watch(menuOpen, async (open) => {
  document.documentElement.classList.toggle('is-menu-open', open)
  if (open) {
    await nextTick()
    menuRef.value?.querySelector('a')?.focus()
  } else if (!closingViaLink) {
    toggleRef.value?.focus()
  }
  closingViaLink = false
})

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)

  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activeId.value = entry.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  document.querySelectorAll('main section[id]').forEach((section) => spy.observe(section))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.removeEventListener('keydown', onKeydown)
  spy?.disconnect()
  document.documentElement.classList.remove('is-menu-open')
})
</script>

<template>
  <header
    class="header"
    :class="{ 'is-scrolled': scrolled || menuOpen, 'show-progress': scrolled && !menuOpen }"
  >
    <div class="header__inner container">
      <a class="header__brand" href="#start" aria-label="Skiclub Kestenholz – zum Seitenanfang">
        <BootIcon class="header__boot" />
        <BrandWordmark class="header__wordmark" aria-hidden="true" />
      </a>

      <nav class="header__nav" aria-label="Hauptnavigation">
        <ul role="list">
          <li v-for="link in desktopLinks" :key="link.id">
            <a
              :href="`#${link.id}`"
              :class="{ 'is-active': activeId === link.id }"
              :aria-current="activeId === link.id ? 'location' : undefined"
              >{{ link.label }}</a
            >
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <button
          type="button"
          class="icon-btn snow-toggle"
          :class="{ 'is-on': snowing }"
          :aria-pressed="snowing ? 'true' : 'false'"
          :title="snowing ? 'Schneekanone ausschalten' : 'Schneekanone einschalten'"
          @click="toggleSnow"
        >
          <AppIcon name="snowflake" />
          <span class="visually-hidden">Schneekanone</span>
        </button>
        <a
          v-if="instagramUrl"
          class="icon-btn header__insta"
          :href="instagramUrl"
          target="_blank"
          rel="noopener"
          :title="`Instagram @${club.contact.instagram}`"
        >
          <AppIcon name="instagram" />
          <span class="visually-hidden">Instagram @{{ club.contact.instagram }}</span>
        </a>
        <a class="btn btn--red btn--sm header__cta" href="#mitmachen">Mitmachen</a>
        <button
          ref="toggleRef"
          type="button"
          class="icon-btn menu-toggle"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-toggle__bars" aria-hidden="true" />
          <span class="visually-hidden">{{ menuOpen ? 'Menü schliessen' : 'Menü öffnen' }}</span>
        </button>
      </div>
    </div>

    <div class="header__progress" :style="{ '--p': progress }" aria-hidden="true">
      <span class="header__progress-bar" />
      <span class="header__skier">
        <BootIcon />
        <svg viewBox="0 0 40 6" class="header__ski"><path d="M2 3h31c3 0 4-1 5-2" /></svg>
      </span>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="menu">
      <div v-if="menuOpen" id="mobile-menu" ref="menuRef" class="mobile-menu">
        <nav aria-label="Menü">
          <ol role="list" class="mobile-menu__list">
            <li v-for="(link, index) in navLinks" :key="link.id" :style="{ '--i': index }">
              <a :href="`#${link.id}`" @click="closeFromLink">
                <span class="mobile-menu__num">0{{ index + 1 }}</span>
                {{ link.label }}
              </a>
            </li>
          </ol>
        </nav>
        <div class="mobile-menu__foot">
          <a
            v-if="instagramUrl"
            class="mobile-menu__insta"
            :href="instagramUrl"
            target="_blank"
            rel="noopener"
          >
            <AppIcon name="instagram" /> @{{ club.contact.instagram }}
          </a>
          <p class="mobile-menu__claim hand">Mer gseh üs uf de Pischte!</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  color: #fff;
  transition:
    background-color 0.35s ease,
    border-color 0.35s ease;
  border-bottom: 1px solid transparent;
}

.header.is-scrolled {
  background: rgb(10 11 13 / 0.86);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
  border-bottom-color: rgb(255 255 255 / 0.08);
}

.header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  margin-right: auto;
  text-decoration: none;
  color: #fff;
}

.header__boot {
  font-size: 30px;
  transition: transform 0.4s var(--ease-spring);
}

.header__brand:hover .header__boot {
  transform: rotate(-12deg) translateY(-2px);
}

.header__wordmark {
  height: 15px;
}

.header__nav ul {
  display: flex;
  gap: 0.35rem;
  margin: 0;
}

.header__nav a {
  position: relative;
  display: block;
  padding: 0.55rem 0.8rem;
  font-size: 0.95rem;
  font-weight: 550;
  text-decoration: none;
  color: rgb(255 255 255 / 0.76);
  transition: color 0.2s;
}

.header__nav a:hover,
.header__nav a.is-active {
  color: #fff;
}

.header__nav a::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.2rem;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--c-red);
  transform: translateX(-50%) scale(0);
  transition: transform 0.3s var(--ease-spring);
}

.header__nav a.is-active::after {
  transform: translateX(-50%) scale(1);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  transition:
    background-color 0.2s,
    transform 0.3s var(--ease-spring);
}

.icon-btn:hover {
  background: rgb(255 255 255 / 0.1);
}

.snow-toggle .app-icon,
.header__insta .app-icon {
  width: 22px;
  height: 22px;
  transition: transform 0.6s var(--ease-out);
}

.header__insta:hover .app-icon {
  transform: rotate(-8deg) scale(1.08);
}

.snow-toggle:hover .app-icon {
  transform: rotate(60deg);
}

.snow-toggle.is-on {
  background: #fff;
  color: var(--c-ink);
}

.snow-toggle.is-on .app-icon {
  animation: spin 6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-toggle {
  display: none;
}

.menu-toggle__bars,
.menu-toggle__bars::before,
.menu-toggle__bars::after {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.3s var(--ease-out),
    opacity 0.2s;
}

.menu-toggle__bars {
  position: relative;
}

.menu-toggle__bars::before,
.menu-toggle__bars::after {
  content: '';
  position: absolute;
  left: 0;
}

.menu-toggle__bars::before {
  transform: translateY(-7px);
}

.menu-toggle__bars::after {
  transform: translateY(7px);
}

.menu-toggle.is-open .menu-toggle__bars {
  background: transparent;
}

.menu-toggle.is-open .menu-toggle__bars::before {
  transform: rotate(45deg);
}

.menu-toggle.is-open .menu-toggle__bars::after {
  transform: rotate(-45deg);
}

/* Scroll progress: a little boot skis along the bottom edge of the header */
.header__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s;
}

.header.show-progress .header__progress {
  opacity: 1;
}

.header__progress-bar {
  position: absolute;
  inset: 0;
  background: var(--c-red);
  transform-origin: left center;
  transform: scaleX(var(--p));
}

.header__skier {
  position: absolute;
  bottom: 1px;
  left: calc(var(--p) * 100%);
  width: 16px;
  transform: translateX(-60%);
  color: #fff;
  font-size: 13px;
}

.header__skier .boot-icon {
  margin-left: 2px;
}

.header__ski {
  display: block;
  width: 20px;
  height: 4px;
  margin-top: -1px;
  fill: none;
  stroke: var(--c-red);
  stroke-width: 3;
  stroke-linecap: round;
}

@media (max-width: 1023px) {
  .header__nav {
    display: none;
  }

  .menu-toggle {
    display: inline-grid;
  }
}

@media (max-width: 560px) {
  .header__cta {
    display: none;
  }

  .header__wordmark {
    height: 13px;
  }
}

/* Mobile menu (teleported to <body>, so it is not clipped by the header's backdrop-filter) */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 45;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--header-h) + 2rem) var(--gutter) 2.5rem;
  background: var(--c-ink);
  color: #fff;
  overflow-y: auto;
}

.mobile-menu__list {
  display: grid;
  gap: 0.25rem;
}

.mobile-menu__list a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: clamp(2.6rem, 12vw, 4.5rem);
  font-stretch: 62%;
  font-weight: 820;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
}

.mobile-menu__num {
  font-size: 0.9rem;
  font-stretch: 100%;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #ff6a5e;
}

.mobile-menu__list li {
  animation: menu-item 0.5s var(--ease-out) both;
  animation-delay: calc(80ms + var(--i) * 50ms);
}

@media (max-width: 379px) {
  .header__insta {
    display: none;
  }
}

.mobile-menu__foot {
  display: grid;
  gap: 1.25rem;
  justify-items: start;
}

.mobile-menu__insta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.1rem;
  border: 1px solid rgb(255 255 255 / 0.25);
  border-radius: 999px;
  font-weight: 650;
  text-decoration: none;
}

.mobile-menu__claim {
  font-size: 1.9rem;
  color: var(--c-muted-on-dark);
  transform: rotate(-3deg);
}

@keyframes menu-item {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>

<style>
html.is-menu-open {
  overflow: hidden;
}
</style>
