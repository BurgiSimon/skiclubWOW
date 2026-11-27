import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works on GitHub Pages (https://<user>.github.io/<repo>/)
  // as well as on a custom domain, without hard-coding the repository name.
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    // Generates responsive AVIF/WebP/JPEG variants at build time and strips EXIF/GPS metadata.
    imagetools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
