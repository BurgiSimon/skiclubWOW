<script setup>
// Line icons in the stroke style of the boot logo (24×24 grid).
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, default: '' },
})

const ICONS = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  calendar:
    'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4',
  'calendar-plus':
    'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4M12 12.5v5M9.5 15h5',
  share: 'M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  users:
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8',
  close: 'M6 6l12 12M18 6 6 18',
  'chevron-left': 'M15 5l-7 7 7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  pause: 'M8.5 5.5v13M15.5 5.5v13',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  mail: 'M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5zM4 7l8 6 8-6',
  instagram:
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.3 6.7h.01',
  ski: 'M2.5 20 9.5 7.5l3.4 6 2.3-3.6L21.5 20zM7.4 11.3l2 1.4 1.6-1.6',
  party:
    'M5 8.5h9v10A1.5 1.5 0 0 1 12.5 20h-6A1.5 1.5 0 0 1 5 18.5zM14 10.5h2a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2h-2M4.6 8.5a2.4 2.4 0 0 1 3.1-3.3 3 3 0 0 1 5.4.2 2.2 2.2 0 0 1 1.5 3.1M8 11.5v5.5M11 11.5v5.5M19.5 3v3M18 4.5h3',
  jass: 'M7 6.5v-2A1.5 1.5 0 0 1 8.5 3h9A1.5 1.5 0 0 1 19 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-2M5 6.5h9A1.5 1.5 0 0 1 15.5 8v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 20V8A1.5 1.5 0 0 1 5 6.5zM9.5 11l2 3-2 3-2-3z',
  trip: 'M3 16.6V8a2 2 0 0 1 2-2h10.4a2 2 0 0 1 1.7 1L20 11.4a2 2 0 0 1 .4 1.2v4a1 1 0 0 1-1 1h-1.2M5.7 17.6H4a1 1 0 0 1-1-1M9.8 17.6h4.4M3 11h17M8.5 6v5M13.5 6v5M7.75 19.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16.25 19.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  bar: 'M5 4h14l-7 8.5zM12 12.5V20M8 20h8M16.5 4 18.5 1.5',
  heart:
    'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  beanie:
    'M5 15.5a7 7 0 0 1 14 0zM4 15.5h16V19H4zM12 6.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM9 15.5v3.5M12 15.5v3.5M15 15.5v3.5',
}

const FILLED = {
  play: 'M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z',
}

const snowflakeArms = [0, 60, 120, 180, 240, 300]
const path = computed(() => ICONS[props.name])
const filled = computed(() => FILLED[props.name])
</script>

<template>
  <svg
    class="app-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="title ? 'img' : undefined"
    :aria-label="title || undefined"
    :aria-hidden="title ? undefined : 'true'"
    focusable="false"
  >
    <template v-if="name === 'snowflake'">
      <path
        v-for="angle in snowflakeArms"
        :key="angle"
        :transform="`rotate(${angle} 12 12)`"
        d="M12 12V2.6M9.7 4.6 12 6.9l2.3-2.3"
      />
    </template>
    <path v-else-if="filled" :d="filled" fill="currentColor" stroke="none" />
    <path v-else :d="path" />
  </svg>
</template>

<style scoped>
.app-icon {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  flex: none;
  vertical-align: -0.2em;
}
</style>
