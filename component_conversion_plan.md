# React to Vue Component Conversion Plan

This document outlines the strategy for carefully converting the provided visually stunning React components into Vue 3 components using the `<script setup>` syntax.

## General Conversion Strategy
1. **Lifecycle Hooks**: `useEffect` and `useLayoutEffect` will be replaced with Vue's `onMounted`, `onUnmounted`, and potentially `watch` or `watchEffect`.
2. **State & Refs**: `useState` and `useRef` will be replaced with Vue's `ref` and `computed`.
3. **DOM References**: React's `ref={myRef}` handles will be translated to Vue's `ref="myRef"` template refs.
4. **Props**: React `props` will be converted using Vue's `defineProps` with typescript interfaces to ensure type safety and default values.
5. **Animation Libraries**: 
   - **GSAP**: Works agnostically. Instead of `@gsap/react`'s `useGSAP`, we will use standard GSAP within `onMounted` and clean up `ScrollTrigger` instances in `onUnmounted`. We will also utilize Vue's `nextTick` if DOM isn't ready.
   - **Motion (Framer Motion)**: The React components use `motion/react`. We will install and use `motion/vue` which provides the same APIs (like `useScroll`, `useSpring`, `useTransform`, `useVelocity`) but designed for Vue.
   - **Three.js**: Native Three.js code works perfectly in Vue. We just need to attach the renderer to a template ref in `onMounted`.

---

## Component-Specific Breakdown

### 1. `3DTextReveal` (GSAP)
- **Dependencies**: `gsap`
- **Conversion Process**: 
  - Remove `@gsap/react`.
  - Move the logic inside `useGSAP` into an `onMounted` lifecycle hook.
  - Map the `items` array over a `v-for` loop in the `<template>`.
  - Store references to multiple elements (the text items) using Vue's function refs `:ref="(el) => itemsRef[index] = el"`.
  - Clean up `ScrollTrigger.removeEventListener` and timelines in `onUnmounted`.

### 2. `ScrollFloat` (GSAP)
- **Dependencies**: `gsap`
- **Conversion Process**:
  - Convert `useMemo` for splitting text into a `computed` property that splits the string into an array of characters.
  - Use `v-for` in the template to render the characters.
  - Move the `gsap.fromTo` logic into `onMounted`. Ensure `ScrollTrigger` targets the Vue template `ref`.

### 3. `ScrollReveal` (GSAP)
- **Dependencies**: `gsap`
- **Conversion Process**:
  - Similar to `ScrollFloat`, translate the `useMemo` text-splitting logic (which splits by words here) into a Vue `computed` property.
  - Replace the `useEffect` with `onMounted`. Keep the `gsap.fromTo` animations for base rotation, blur, and opacity.
  - Make sure to call `ScrollTrigger.getAll().forEach(t => t.kill())` or specifically kill the triggers created in this component during `onUnmounted`.

### 4. `ScrollVelocity` (Motion / Framer Motion)
- **Dependencies**: `motion/vue` (Needs to be installed `bun add motion`)
- **Conversion Process**:
  - The React component heavily relies on `motion/react` hooks (`useScroll`, `useSpring`, `useTransform`, `useVelocity`, `useAnimationFrame`, `useMotionValue`).
  - We will use the equivalent exports from `motion/vue`. 
  - The inner `VelocityText` functional component will be split into a separate Vue component (e.g., `VelocityText.vue`) because Vue doesn't support declaring full components inside the setup of another component easily. `ScrollVelocity.vue` will import and loop over `VelocityText.vue`.

### 5. `Snow` (Three.js)
- **Dependencies**: `three`
- **Conversion Process**:
  - The component relies on raw WebGL/Three.js classes (`Scene`, `WebGLRenderer`, `ShaderMaterial`, etc.).
  - The `useEffect` that initializes the WebGL renderer will map cleanly to `onMounted`. 
  - We need to attach the `renderer.domElement` to a container `div` via a Vue `ref`.
  - The inner `requestAnimationFrame` loop will read the uniforms. Vue's `watch` or `watchEffect` will be used to reactively update the `materialRef.value.uniforms` when Vue props change.
  - ResizeObserver or window resize listeners will be cleaned up in `onUnmounted`, and `renderer.dispose()` will be called to prevent memory leaks.

### 6. `MetallicPaint`
- **Dependencies**: None specified directly in the sample, but likely requires a custom shader or canvas implementation.
- **Conversion Process**:
  - *Note*: The provided React markdown file only had the usage/props, not the actual implementation of `MetallicPaint`. If the user has the source, we will convert the underlying logic (likely WebGL/Canvas) similarly to `Snow`.

## Next Steps
1. Get user approval for both the main design plan and the component conversion strategy.
2. Install necessary dependencies (`gsap`, `three`, `motion`).
3. Create the `src/components` folder and begin building the Vue components iteratively.
