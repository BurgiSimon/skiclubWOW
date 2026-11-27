<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import ResponsiveImage from '@/components/ResponsiveImage.vue'
import { club, instagramUrl } from '@/data/club.js'
import { gallery, GALLERY_FILTERS } from '@/data/photos.js'
import { useLightbox } from '@/composables/useUi.js'

const { open } = useLightbox()
const filter = ref('alle')

const items = computed(() =>
  filter.value === 'alle' ? gallery : gallery.filter((item) => item.category === filter.value),
)

function count(id) {
  return id === 'alle' ? gallery.length : gallery.filter((item) => item.category === id).length
}
</script>

<template>
  <section id="galerie" class="section section--dark gallery" aria-labelledby="gallery-title">
    <div class="container">
      <div class="gallery__head">
        <div class="gallery__title-wrap">
          <p v-reveal class="section-label">05 · Galerie</p>
          <h2 id="gallery-title" v-reveal class="section-title">So isch’s gsi.</h2>
        </div>
        <div class="gallery__filters" role="group" aria-label="Fotos filtern">
          <button
            v-for="item in GALLERY_FILTERS"
            :key="item.id"
            type="button"
            class="tab"
            :class="{ 'is-active': filter === item.id }"
            :aria-pressed="filter === item.id ? 'true' : 'false'"
            @click="filter = item.id"
          >
            {{ item.label }}
            <span class="tab__count">{{ count(item.id) }}</span>
          </button>
        </div>
      </div>

      <ul :key="filter" class="gallery__grid" role="list">
        <li
          v-for="(item, index) in items"
          :key="item.file"
          v-reveal="(index % 3) * 80"
          class="gallery__item"
        >
          <button type="button" class="gallery__btn" @click="open(items, index)">
            <ResponsiveImage
              :image="item"
              :alt="item.alt"
              fit="natural"
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
            />
            <span class="gallery__caption hand">{{ item.caption }}</span>
            <span class="visually-hidden">– Foto vergrössern</span>
          </button>
        </li>
      </ul>

      <div v-if="instagramUrl" v-reveal class="gallery__more">
        <p class="gallery__more-text">
          <span class="hand">Das war längst nicht alles.</span>
          Die neusten Fotos, Flyer und Geschichten gibt's auf Instagram.
        </p>
        <a class="btn btn--light" :href="instagramUrl" target="_blank" rel="noopener">
          <AppIcon name="instagram" />
          @{{ club.contact.instagram }}
          <span class="visually-hidden">(öffnet in neuem Tab)</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 2rem;
  margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
}

.gallery__title-wrap {
  display: grid;
  gap: 1.1rem;
}

.gallery__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: var(--c-ink-2);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 40px;
  padding: 0.4rem 1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgb(255 255 255 / 0.75);
  font-size: 0.92rem;
  font-weight: 650;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.tab:hover {
  color: #fff;
}

.tab.is-active {
  background: #fff;
  color: var(--c-ink);
}

.tab__count {
  font-size: 0.75rem;
  opacity: 0.6;
}

.gallery__grid {
  columns: 3 300px;
  column-gap: 1.1rem;
  margin: 0;
}

.gallery__item {
  break-inside: avoid;
  margin-bottom: 1.1rem;
}

.gallery__btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background: var(--c-ink-2);
  overflow: hidden;
  text-align: left;
  cursor: zoom-in;
}

.gallery__btn :deep(img) {
  transition:
    transform 0.6s var(--ease-out),
    opacity 0.6s ease;
}

.gallery__btn:hover :deep(img),
.gallery__btn:focus-visible :deep(img) {
  transform: scale(1.04);
}

.gallery__caption {
  position: absolute;
  inset: auto 0 0;
  padding: 3.25rem 1rem 0.85rem;
  background: linear-gradient(to top, rgb(6 7 9 / 0.92), rgb(6 7 9 / 0.6) 55%, transparent);
  color: #fff;
  text-shadow: 0 1px 10px rgb(0 0 0 / 0.5);
  font-size: 1.45rem;
  line-height: 1.1;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--ease-out);
}

.gallery__btn:hover .gallery__caption,
.gallery__btn:focus-visible .gallery__caption {
  opacity: 1;
  transform: none;
}

.gallery__more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  margin-top: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.4rem, 3vw, 2rem) clamp(1.4rem, 3vw, 2.25rem);
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(213 43 30 / 0.28), transparent 55%), var(--c-ink-2);
}

.gallery__more-text {
  display: grid;
  gap: 0.2rem;
  max-width: 36rem;
  color: var(--c-muted-on-dark);
}

.gallery__more-text .hand {
  font-size: 2rem;
  color: #fff;
}

@media (hover: none) {
  .gallery__caption {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 560px) {
  .gallery__filters {
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tab {
    flex: none;
    padding: 0.4rem 0.75rem;
    font-size: 0.88rem;
  }
}
</style>
