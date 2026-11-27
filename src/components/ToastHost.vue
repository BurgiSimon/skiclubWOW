<script setup>
import { useToast } from '@/composables/useUi.js'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <button
        v-for="toast in toasts"
        :key="toast.id"
        type="button"
        class="toast"
        title="Schliessen"
        @click="dismiss(toast.id)"
      >
        <span class="toast__icon" aria-hidden="true">{{ toast.icon }}</span>
        <span>{{ toast.message }}</span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: 50%;
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  z-index: 70;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  width: min(92vw, 30rem);
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.2rem;
  border: 0;
  border-radius: 999px;
  background: var(--c-ink);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 550;
  line-height: 1.35;
  text-align: left;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.12),
    var(--shadow-2);
  pointer-events: auto;
}

.toast__icon {
  font-size: 1.2rem;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--ease-spring);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
