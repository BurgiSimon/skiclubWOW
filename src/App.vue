<script setup>
import EasterEgg from '@/components/EasterEgg.vue'
import LightboxDialog from '@/components/LightboxDialog.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SnowOverlay from '@/components/SnowOverlay.vue'
import ToastHost from '@/components/ToastHost.vue'
import AboutSection from '@/sections/AboutSection.vue'
import ClubBand from '@/sections/ClubBand.vue'
import EventsSection from '@/sections/EventsSection.vue'
import FoundersSection from '@/sections/FoundersSection.vue'
import GallerySection from '@/sections/GallerySection.vue'
import HeroSection from '@/sections/HeroSection.vue'
import JoinSection from '@/sections/JoinSection.vue'
import PowderDaySection from '@/sections/PowderDaySection.vue'
import { useSnowCannon } from '@/composables/useUi.js'

const { snowing } = useSnowCannon()
</script>

<template>
  <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  <SiteHeader />

  <main id="inhalt" tabindex="-1">
    <HeroSection />
    <ClubBand />
    <AboutSection />
    <PowderDaySection />
    <FoundersSection />
    <EventsSection />
    <GallerySection />
    <JoinSection />
  </main>

  <SiteFooter />

  <Transition name="fade">
    <SnowOverlay v-if="snowing" />
  </Transition>
  <LightboxDialog />
  <ToastHost />
  <EasterEgg />
</template>

<style>
.skip-link {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 100;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  background: #fff;
  color: var(--c-ink);
  font-weight: 700;
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 0.2s;
}

.skip-link:focus {
  transform: none;
}

main {
  overflow-x: clip;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
