<script setup>
import { BOOT_PATH, BOOT_VIEWBOX } from './brand-paths.js'

defineProps({
  /** Accessible name. Without it the icon is decorative. */
  title: { type: String, default: '' },
})
</script>

<template>
  <svg
    class="boot-icon"
    :viewBox="BOOT_VIEWBOX"
    xmlns="http://www.w3.org/2000/svg"
    :role="title ? 'img' : undefined"
    :aria-label="title || undefined"
    :aria-hidden="title ? undefined : 'true'"
    focusable="false"
  >
    <path :d="BOOT_PATH" fill="currentColor" />
  </svg>
</template>

<style scoped>
.boot-icon {
  display: block;
  width: 1em;
  height: 1em;
  overflow: visible;
}
</style>
