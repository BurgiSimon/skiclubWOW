import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './directives/reveal.js'

// Self-hosted fonts (no requests to Google): Archivo with width axis + Caveat for handwriting.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/caveat'
import './styles/main.css'

createApp(App).directive('reveal', vReveal).mount('#app')
