<script setup>
import ResponsiveImage from './ResponsiveImage.vue'

defineProps({
  image: { type: Object, required: true },
  alt: { type: String, required: true },
  caption: { type: String, default: '' },
  rotate: { type: Number, default: -3 },
  sizes: { type: String, default: '(min-width: 1024px) 420px, 80vw' },
  /** CSS aspect ratio of the photo area */
  ratio: { type: String, default: '4 / 5' },
  position: { type: String, default: '50% 50%' },
  loading: { type: String, default: 'lazy' },
})
</script>

<template>
  <figure class="polaroid" :style="{ '--rot': `${rotate}deg` }">
    <div class="polaroid__photo" :style="{ aspectRatio: ratio }">
      <ResponsiveImage
        :image="image"
        :alt="alt"
        :sizes="sizes"
        :position="position"
        :loading="loading"
      />
    </div>
    <figcaption v-if="caption || $slots.caption" class="polaroid__caption hand">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </figure>
</template>

<style scoped>
.polaroid {
  padding: 0.7rem 0.7rem 0;
  background: #fff;
  color: var(--c-ink);
  border-radius: 3px;
  box-shadow: var(--shadow-2);
  transform: rotate(var(--rot));
  transition: transform 0.5s var(--ease-spring);
}

.polaroid__photo {
  overflow: hidden;
  background: #ddd;
}

.polaroid__caption {
  min-height: 3.6rem;
  display: grid;
  place-items: center;
  padding: 0.5rem 0.4rem 0.7rem;
  font-size: clamp(1.35rem, 2.2vw, 1.75rem);
  text-align: center;
}
</style>
