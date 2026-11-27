<script setup>
// An event, styled as a ski day-pass. The stub carries the piste colour (difficulty).
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import PisteBadge from './PisteBadge.vue'
import { barcode } from '@/utils/barcode.js'
import { countdownLabel, dateParts, daysUntil } from '@/utils/date.js'
import { downloadCalendar } from '@/utils/ics.js'
import { joinNames } from '@/utils/text.js'

const props = defineProps({
  event: { type: Object, required: true },
  now: { type: Date, required: true },
  isNext: { type: Boolean, default: false },
})

const parts = computed(() => (props.event.date ? dateParts(props.event.date) : null))
const days = computed(() => (props.event.date ? daysUntil(props.event.date, props.now) : null))
const isPast = computed(() => days.value !== null && days.value < 0)
const code = computed(() => barcode(props.event.id))
const ticketNo = computed(() =>
  props.event.date ? `SCK ${props.event.date.replace(/-/g, '')}` : 'SCK · TBA',
)

function addToCalendar() {
  downloadCalendar([props.event], `skiclub-kestenholz-${props.event.id}.ics`)
}
</script>

<template>
  <div class="ticket-wrap" :class="{ 'is-past': isPast }">
    <article
      class="ticket"
      :class="[`ticket--${event.piste}`, { 'ticket--pending': !event.date }]"
      :aria-label="`${event.title}${parts ? `, ${parts.long}` : `, ${event.when}`}`"
    >
      <div class="ticket__stub">
        <template v-if="parts">
          <span class="ticket__weekday">{{ parts.weekday }}</span>
          <span class="ticket__day">{{ parts.day }}</span>
          <span class="ticket__month">{{ parts.month }}</span>
          <span class="ticket__year">{{ parts.year }}</span>
        </template>
        <span v-else class="ticket__when">{{ event.when }}</span>
      </div>

      <div class="ticket__body">
        <div class="ticket__top">
          <span v-if="isNext" class="ticket__next">Nächster Anlass</span>
          <span class="ticket__type" :class="{ 'is-public': event.public }">
            <AppIcon :name="event.public ? 'users' : 'star'" />
            {{ event.public ? 'Öffentlich' : 'Mitglieder' }}
          </span>
          <PisteBadge :piste="event.piste" />
        </div>

        <h3 class="ticket__title">
          {{ event.title }}
          <span v-if="event.dayNote" class="ticket__daynote">{{ event.dayNote }}</span>
        </h3>
        <p class="ticket__location"><AppIcon name="pin" /> {{ event.location }}</p>
        <p class="ticket__desc">{{ event.description }}</p>
        <p class="ticket__note hand">{{ event.pisteNote }}</p>

        <div v-if="event.organizers || (event.date && !isPast)" class="ticket__foot">
          <p v-if="event.organizers" class="ticket__ok">
            <span class="visually-hidden">Organisation: </span>OK: {{ joinNames(event.organizers)
            }}<template v-if="event.helpers"> · Support: {{ joinNames(event.helpers) }}</template>
          </p>
          <div class="ticket__actions">
            <span v-if="days !== null && !isPast" class="ticket__countdown">
              {{ countdownLabel(days) }}
            </span>
            <button
              v-if="event.date && !isPast"
              type="button"
              class="ticket__cal"
              @click="addToCalendar"
            >
              <AppIcon name="calendar-plus" />
              <span
                >Kalender<span class="visually-hidden">: {{ event.title }} eintragen</span></span
              >
            </button>
          </div>
        </div>

        <div class="ticket__code" aria-hidden="true">
          <svg :viewBox="`0 0 20 ${code.width}`" preserveAspectRatio="none">
            <rect
              v-for="(bar, i) in code.bars"
              :key="i"
              x="0"
              :y="bar.x"
              width="20"
              :height="bar.width"
            />
          </svg>
          <span>{{ ticketNo }}</span>
        </div>
      </div>

      <span v-if="isPast" class="ticket__stamp" aria-hidden="true">Entwertet</span>
      <span v-if="isPast" class="visually-hidden">(vorbei)</span>
    </article>
  </div>
</template>

<style scoped>
.ticket-wrap {
  filter: drop-shadow(0 1px 1px rgb(10 11 13 / 0.08)) drop-shadow(0 14px 22px rgb(10 11 13 / 0.12));
  transition:
    transform 0.45s var(--ease-spring),
    filter 0.3s;
}

.ticket-wrap:hover {
  transform: translateY(-4px) rotate(-0.4deg);
}

.ticket-wrap.is-past {
  filter: grayscale(1);
  opacity: 0.6;
}

.ticket {
  --stub: 6.5rem;
  --notch: 11px;
  --stub-bg: var(--c-blue);
  --stub-fg: #fff;
  position: relative;
  display: grid;
  grid-template-columns: var(--stub) 1fr;
  min-height: 100%;
  background: var(--c-paper);
  border-radius: var(--radius);
  -webkit-mask:
    radial-gradient(circle var(--notch) at var(--stub) 0, #0000 98%, #000) top / 100% 51% no-repeat,
    radial-gradient(circle var(--notch) at var(--stub) 100%, #0000 98%, #000) bottom / 100% 51%
      no-repeat;
  mask:
    radial-gradient(circle var(--notch) at var(--stub) 0, #0000 98%, #000) top / 100% 51% no-repeat,
    radial-gradient(circle var(--notch) at var(--stub) 100%, #0000 98%, #000) bottom / 100% 51%
      no-repeat;
}

.ticket--red {
  --stub-bg: var(--c-red);
}

.ticket--black {
  --stub-bg: var(--c-ink);
}

.ticket--yellow {
  --stub-bg: var(--c-yellow);
  --stub-fg: var(--c-ink);
}

.ticket__stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 1.25rem 0.5rem;
  background: var(--stub-bg);
  color: var(--stub-fg);
  border-radius: var(--radius) 0 0 var(--radius);
  text-align: center;
  text-transform: uppercase;
}

.ticket--pending .ticket__stub {
  background-image: repeating-linear-gradient(
    -45deg,
    rgb(255 255 255 / 0.12) 0 8px,
    transparent 8px 16px
  );
  background-color: var(--stub-bg);
}

.ticket__weekday,
.ticket__month,
.ticket__year {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.ticket__day {
  font-size: 3.4rem;
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.95;
}

.ticket__year {
  opacity: 0.7;
  font-weight: 500;
}

.ticket__when {
  font-size: 1.35rem;
  font-stretch: 62%;
  font-weight: 820;
  line-height: 1;
  hyphens: auto;
}

.ticket__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.4rem 1.1rem;
  border-left: 2px dashed var(--c-line);
  margin-left: -1px;
}

.ticket__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
}

.ticket__type {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.ticket__type.is-public {
  color: var(--c-blue);
}

.ticket__title {
  font-size: clamp(1.7rem, 2.6vw, 2.2rem);
  font-stretch: 62%;
  font-weight: 820;
  line-height: 0.95;
  text-transform: uppercase;
}

.ticket__daynote {
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  background: var(--c-ice);
  font-size: 0.42em;
  font-stretch: 100%;
  font-weight: 700;
  letter-spacing: 0.1em;
  vertical-align: middle;
}

.ticket__location {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.92rem;
  font-weight: 600;
}

.ticket__location .app-icon {
  color: var(--c-red);
}

.ticket__desc {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--c-muted);
}

.ticket__note {
  font-size: 1.45rem;
  color: var(--c-ink);
  transform: rotate(-1deg);
  transform-origin: left;
}

.ticket__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem 1rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--c-line);
}

.ticket__ok {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-muted);
}

.ticket__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: auto;
}

.ticket__countdown {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--c-red);
  white-space: nowrap;
}

.ticket__cal {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  padding: 0.4rem 0.8rem;
  border: 1.5px solid var(--c-ink);
  border-radius: 999px;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 650;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.ticket__cal:hover {
  background: var(--c-ink);
  color: #fff;
}

.ticket__code {
  position: absolute;
  top: 1.3rem;
  right: 0.85rem;
  display: none;
  gap: 3px;
  align-items: flex-start;
}

.ticket__code svg {
  width: 14px;
  height: 78px;
  fill: var(--c-ink);
}

.ticket__code span {
  writing-mode: vertical-rl;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: var(--c-muted);
}

@media (min-width: 640px) {
  .ticket__body {
    padding-right: 3.4rem;
  }

  .ticket__code {
    display: flex;
  }
}

.ticket__next {
  margin-right: auto;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: var(--c-red);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ticket__stamp {
  position: absolute;
  top: 50%;
  left: 55%;
  padding: 0.3rem 0.8rem;
  border: 3px solid var(--c-red);
  border-radius: 6px;
  color: var(--c-red);
  font-size: 1.6rem;
  font-stretch: 62%;
  font-weight: 820;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translate(-50%, -50%) rotate(-14deg);
  mix-blend-mode: multiply;
}
</style>
