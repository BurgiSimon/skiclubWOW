<script setup>
// Pixel snow, rendered with plain WebGL2 (no three.js).
// The canvas is drawn at "snow pixel" resolution and scaled up with `image-rendering: pixelated`,
// so the ray-marching shader only runs once per visible snow pixel – cheap even on phones.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion.js'
import './PixelSnow.css'

const props = defineProps({
  color: { type: String, default: '#ffffff' },
  flakeSize: { type: Number, default: 0.01 },
  minFlakeSize: { type: Number, default: 1.25 },
  /** Number of snow pixels across the full width */
  pixelResolution: { type: Number, default: 200 },
  speed: { type: Number, default: 1.25 },
  depthFade: { type: Number, default: 8 },
  farPlane: { type: Number, default: 20 },
  brightness: { type: Number, default: 1 },
  gamma: { type: Number, default: 0.4545 },
  density: { type: Number, default: 0.3 },
  variant: { type: String, default: 'square' },
  direction: { type: Number, default: 125 },
  className: { type: String, default: '' },
})

const vertexShader = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const fragmentShader = `#version 300 es
precision highp float;
precision highp int;

uniform float uTime;
uniform vec2 uResolution;
uniform float uFlakeSize;
uniform float uMinFlakeSize;
uniform float uSpeed;
uniform float uDepthFade;
uniform float uFarPlane;
uniform vec3 uColor;
uniform float uBrightness;
uniform float uGamma;
uniform float uDensity;
uniform float uVariant;
uniform float uDirection;

out vec4 fragColor;

#define PI_OVER_6 0.5235988
#define PI_OVER_3 1.0471976
#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 2.3283064e-10

#define hash(n) (n * (n ^ (n >> 15)))
#define coord3(p) (uvec3(p).x * M1 ^ uvec3(p).y * M2 ^ uvec3(p).z * M3)

const vec3 camK = vec3(0.57735027, 0.57735027, 0.57735027);
const vec3 camI = vec3(0.70710678, 0.0, -0.70710678);
const vec3 camJ = vec3(-0.40824829, 0.81649658, -0.40824829);
const vec2 b1d = vec2(0.574, 0.819);

vec3 hash3(uint n) {
  uvec3 hashed = hash(n) * uvec3(1U, 511U, 262143U);
  return vec3(hashed) * F0;
}

float snowflakeDist(vec2 p) {
  float r = length(p);
  float a = atan(p.y, p.x);
  a = abs(mod(a + PI_OVER_6, PI_OVER_3) - PI_OVER_6);
  vec2 q = r * vec2(cos(a), sin(a));
  float dMain = max(abs(q.y), max(-q.x, q.x - 1.0));
  float b1t = clamp(dot(q - vec2(0.4, 0.0), b1d), 0.0, 0.4);
  float dB1 = length(q - vec2(0.4, 0.0) - b1t * b1d);
  float b2t = clamp(dot(q - vec2(0.7, 0.0), b1d), 0.0, 0.25);
  float dB2 = length(q - vec2(0.7, 0.0) - b2t * b1d);
  return min(dMain, min(dB1, dB2)) * 10.0;
}

void main() {
  // One fragment == one snow pixel (the canvas is rendered at snow-pixel resolution).
  vec2 fragCoord = floor(gl_FragCoord.xy);
  vec2 res = uResolution;
  float invResX = 1.0 / res.x;

  vec3 ray = normalize(vec3((fragCoord - res * 0.5) * invResX, 1.0));
  ray = ray.x * camI + ray.y * camJ + ray.z * camK;

  float timeSpeed = uTime * uSpeed;
  float windX = cos(uDirection) * 0.4;
  float windY = sin(uDirection) * 0.4;
  vec3 camPos = (windX * camI + windY * camJ + 0.1 * camK) * timeSpeed;
  vec3 pos = camPos;

  vec3 absRay = max(abs(ray), vec3(0.001));
  vec3 strides = 1.0 / absRay;
  vec3 raySign = step(ray, vec3(0.0));
  vec3 phase = fract(pos) * strides;
  phase = mix(strides - phase, phase, raySign);

  float rayDotCamK = dot(ray, camK);
  float invRayDotCamK = 1.0 / rayDotCamK;
  float invDepthFade = 1.0 / uDepthFade;
  float halfInvResX = 0.5 * invResX;
  vec3 timeAnim = timeSpeed * 0.1 * vec3(7.0, 8.0, 5.0);

  float t = 0.0;
  for (int i = 0; i < 128; i++) {
    if (t >= uFarPlane) break;

    vec3 fpos = floor(pos);
    uint cellCoord = coord3(fpos);
    float cellHash = hash3(cellCoord).x;

    if (cellHash < uDensity) {
      vec3 h = hash3(cellCoord);
      vec3 sinArg1 = fpos.yzx * 0.073;
      vec3 sinArg2 = fpos.zxy * 0.27;
      vec3 flakePos = 0.5 - 0.5 * cos(4.0 * sin(sinArg1) + 4.0 * sin(sinArg2) + 2.0 * h + timeAnim);
      flakePos = flakePos * 0.8 + 0.1 + fpos;

      float toIntersection = dot(flakePos - pos, camK) * invRayDotCamK;
      if (toIntersection > 0.0) {
        vec3 testPos = pos + ray * toIntersection - flakePos;
        float testX = dot(testPos, camI);
        float testY = dot(testPos, camJ);
        vec2 testUV = abs(vec2(testX, testY));

        float depth = dot(flakePos - camPos, camK);
        float flakeSize = max(uFlakeSize, uMinFlakeSize * depth * halfInvResX);

        float dist;
        if (uVariant < 0.5) {
          dist = max(testUV.x, testUV.y);
        } else if (uVariant < 1.5) {
          dist = length(testUV);
        } else {
          float invFlakeSize = 1.0 / flakeSize;
          dist = snowflakeDist(vec2(testX, testY) * invFlakeSize) * flakeSize;
        }

        if (dist < flakeSize) {
          float flakeSizeRatio = uFlakeSize / flakeSize;
          float intensity = exp2(-(t + toIntersection) * invDepthFade) *
                            min(1.0, flakeSizeRatio * flakeSizeRatio) * uBrightness;
          fragColor = vec4(uColor * pow(vec3(intensity), vec3(uGamma)), 1.0);
          return;
        }
      }
    }

    float nextStep = min(min(phase.x, phase.y), phase.z);
    vec3 sel = step(phase, vec3(nextStep));
    phase = phase - nextStep + strides * sel;
    t += nextStep;
    pos = mix(pos + ray * nextStep, floor(pos + ray * nextStep + 0.5), sel);
  }

  fragColor = vec4(0.0);
}`

const containerRef = ref(null)
const canvasRef = ref(null)
const reducedMotion = useReducedMotion()

let gl = null
let program = null
let uniforms = {}
let frame = 0
let running = false
let visible = true
let startTime = 0
let resizeObserver = null
let intersectionObserver = null

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value
  const int = parseInt(full, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

function compile(type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('PixelSnow shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function init() {
  const canvas = canvasRef.value
  gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  })
  if (!gl) return false

  const vs = compile(gl.VERTEX_SHADER, vertexShader)
  const fs = compile(gl.FRAGMENT_SHADER, fragmentShader)
  if (!vs || !fs) return false

  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('PixelSnow link error:', gl.getProgramInfoLog(program))
    return false
  }

  gl.useProgram(program)
  const names = [
    'uTime',
    'uResolution',
    'uFlakeSize',
    'uMinFlakeSize',
    'uSpeed',
    'uDepthFade',
    'uFarPlane',
    'uColor',
    'uBrightness',
    'uGamma',
    'uDensity',
    'uVariant',
    'uDirection',
  ]
  uniforms = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)]))
  gl.clearColor(0, 0, 0, 0)
  return true
}

function resize() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas || !gl) return
  const cssWidth = Math.max(1, container.clientWidth)
  const cssHeight = Math.max(1, container.clientHeight)
  // Integer CSS size per snow pixel keeps the upscaled pixels crisp and uniform.
  const pixelSize = Math.max(1, Math.round(cssWidth / props.pixelResolution))
  canvas.width = Math.ceil(cssWidth / pixelSize)
  canvas.height = Math.ceil(cssHeight / pixelSize)
  canvas.style.width = `${canvas.width * pixelSize}px`
  canvas.style.height = `${canvas.height * pixelSize}px`
  gl.viewport(0, 0, canvas.width, canvas.height)
  if (!running) draw(0)
}

function draw(time) {
  if (!gl || !program) return
  const variant = props.variant === 'round' ? 1 : props.variant === 'snowflake' ? 2 : 0
  gl.uniform1f(uniforms.uTime, time)
  gl.uniform2f(uniforms.uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.uniform1f(uniforms.uFlakeSize, props.flakeSize)
  gl.uniform1f(uniforms.uMinFlakeSize, props.minFlakeSize)
  gl.uniform1f(uniforms.uSpeed, props.speed)
  gl.uniform1f(uniforms.uDepthFade, props.depthFade)
  gl.uniform1f(uniforms.uFarPlane, props.farPlane)
  gl.uniform3fv(uniforms.uColor, hexToRgb(props.color))
  gl.uniform1f(uniforms.uBrightness, props.brightness)
  gl.uniform1f(uniforms.uGamma, props.gamma)
  gl.uniform1f(uniforms.uDensity, props.density)
  gl.uniform1f(uniforms.uVariant, variant)
  gl.uniform1f(uniforms.uDirection, (props.direction * Math.PI) / 180)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function loop(now) {
  frame = requestAnimationFrame(loop)
  if (!visible || document.hidden) return
  draw((now - startTime) / 1000)
}

function start() {
  if (running || !gl) return
  running = true
  startTime = performance.now() - 8000 // start mid-fall so the screen is not empty
  frame = requestAnimationFrame(loop)
}

function stop() {
  running = false
  cancelAnimationFrame(frame)
}

function onContextLost(event) {
  event.preventDefault()
  stop()
}

function onContextRestored() {
  if (init()) {
    resize()
    if (!reducedMotion.value) start()
  }
}

onMounted(() => {
  if (!init()) return
  const canvas = canvasRef.value
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(containerRef.value)
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  intersectionObserver.observe(containerRef.value)

  resize()
  if (reducedMotion.value) draw(12)
  else start()
})

watch(reducedMotion, (reduced) => {
  if (reduced) {
    stop()
    draw(12)
  } else {
    start()
  }
})

watch(
  () => props.pixelResolution,
  () => resize(),
)

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  const canvas = canvasRef.value
  canvas?.removeEventListener('webglcontextlost', onContextLost)
  canvas?.removeEventListener('webglcontextrestored', onContextRestored)
  if (gl && program) gl.deleteProgram(program)
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  gl = null
  program = null
})
</script>

<template>
  <div ref="containerRef" :class="['pixel-snow-container', className]" aria-hidden="true">
    <canvas ref="canvasRef" />
  </div>
</template>
