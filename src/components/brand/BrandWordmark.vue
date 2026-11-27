<script setup>
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from './brand-paths.js'
</script>

<template>
  <svg
    class="wordmark"
    :viewBox="WORDMARK_VIEWBOX"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Skiclub Kestenholz"
    focusable="false"
  >
    <path :d="WORDMARK_PATH" fill="currentColor" fill-rule="evenodd" />
  </svg>
</template>

<style scoped>
.wordmark {
  display: block;
  height: 1em;
  width: auto;
  aspect-ratio: 3341 / 382;
}
</style>
