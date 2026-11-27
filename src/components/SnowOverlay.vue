<script setup>
// Page-wide snowfall for the "Schneekanone" button. Plain canvas 2D with a pre-rendered
// flake sprite; the bluish rim keeps flakes visible on the white sections too.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)
let ctx = null
let sprite = null
let flakes = []
let frame = 0
let last = 0
let width = 0
let height = 0
let ratio = 1

function makeSprite() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const c = canvas.getContext('2d')
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.72, 'rgba(160,182,204,0.55)')
  g.addColorStop(1, 'rgba(160,182,204,0)')
  c.fillStyle = g
  c.fillRect(0, 0, size, size)
  return canvas
}

function makeFlake(randomY = true) {
  const r = 1.6 + Math.random() ** 2 * 5
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -r * 2,
    r,
    vy: 28 + r * 14 + Math.random() * 20,
    amp: 8 + Math.random() * 30,
    freq: 0.4 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
  }
}

function resize() {
  const canvas = canvasRef.value
  ratio = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  const count = Math.round(Math.min(260, Math.max(70, (width * height) / 6500)))
  flakes = Array.from({ length: count }, () => makeFlake())
}

function tick(now) {
  frame = requestAnimationFrame(tick)
  const dt = Math.min((now - last) / 1000, 0.05)
  last = now
  if (document.hidden) return
  ctx.clearRect(0, 0, width, height)
  const t = now / 1000
  for (const f of flakes) {
    f.y += f.vy * dt
    if (f.y > height + f.r * 2) Object.assign(f, makeFlake(false))
    const x = f.x + Math.sin(f.phase + t * f.freq) * f.amp
    const d = f.r * 2
    ctx.drawImage(sprite, x - f.r, f.y - f.r, d, d)
  }
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  sprite = makeSprite()
  resize()
  window.addEventListener('resize', resize)
  last = performance.now()
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="snow-overlay" aria-hidden="true" />
</template>

<style scoped>
.snow-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
