<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  /** `{ picture, placeholder }` as returned by `photo()` in data/photos.js */
  image: { type: Object, required: true },
  alt: { type: String, required: true },
  sizes: { type: String, default: '100vw' },
  loading: { type: String, default: 'lazy' },
  fetchpriority: { type: String, default: 'auto' },
  /** 'cover' fills its parent, 'natural' keeps the photo's aspect ratio, 'contain' letterboxes */
  fit: { type: String, default: 'cover' },
  position: { type: String, default: '50% 50%' },
})

const imgRef = ref(null)
const loaded = ref(false)

onMounted(() => {
  const img = imgRef.value
  if (img?.complete && img.naturalWidth > 0) loaded.value = true
})
</script>

<template>
  <picture
    class="rimg"
    :class="[`rimg--${props.fit}`, { 'is-loaded': loaded }]"
    :style="{ '--placeholder': `url(${props.image.placeholder})` }"
  >
    <source
      v-for="(srcset, format) in props.image.picture.sources"
      :key="format"
      :type="`image/${format}`"
      :srcset="srcset"
      :sizes="props.sizes"
    />
    <img
      ref="imgRef"
      :src="props.image.picture.img.src"
      :width="props.image.picture.img.w"
      :height="props.image.picture.img.h"
      :alt="props.alt"
      :loading="props.loading"
      :fetchpriority="props.fetchpriority"
      decoding="async"
      :style="{ objectPosition: props.position }"
      @load="loaded = true"
    />
  </picture>
</template>

<style scoped>
.rimg {
  position: relative;
  display: block;
  overflow: hidden;
  background: #c9ced3;
}

.rimg::before {
  content: '';
  position: absolute;
  inset: -8%;
  background-image: var(--placeholder);
  background-size: cover;
  background-position: center;
  filter: blur(14px);
  transition: opacity 0.6s ease;
}

.rimg.is-loaded::before {
  opacity: 0;
}

.rimg img {
  position: relative;
  width: 100%;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.rimg.is-loaded img {
  opacity: 1;
}

.rimg--cover,
.rimg--contain {
  width: 100%;
  height: 100%;
}

.rimg--cover img {
  height: 100%;
  object-fit: cover;
}

.rimg--contain {
  background: transparent;
}

.rimg--contain::before {
  display: none;
}

.rimg--contain img {
  height: 100%;
  object-fit: contain;
}
</style>
