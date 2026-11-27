<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import EventTicket from '@/components/EventTicket.vue'
import PisteBadge from '@/components/PisteBadge.vue'
import ResponsiveImage from '@/components/ResponsiveImage.vue'
import { events, pendingEvents, PISTES } from '@/data/events.js'
import { photo } from '@/data/photos.js'
import { useNow } from '@/composables/useNow.js'
import { useToast } from '@/composables/useUi.js'
import { countdownLabel, dateParts, daysUntil, splitByDate } from '@/utils/date.js'
import { downloadCalendar } from '@/utils/ics.js'
import { joinNames } from '@/utils/text.js'

const now = useNow()
const { show } = useToast()
const featuredImage = photo('skitag-grat')

const FILTERS = [
  { id: 'alle', label: 'Alle' },
  { id: 'public', label: 'Öffentlich' },
  { id: 'members', label: 'Mitglieder' },
]
const filter = ref('alle')

function matches(event) {
  if (filter.value === 'public') return event.public
  if (filter.value === 'members') return !event.public
  return true
}

const split = computed(() => splitByDate(events, now.value))
const featured = computed(() => split.value.upcoming.find((e) => e.featured) ?? null)
const nextId = computed(() => split.value.upcoming[0]?.id)
const upcoming = computed(() =>
  split.value.upcoming.filter((e) => e !== featured.value && matches(e)),
)
const past = computed(() => split.value.past.filter(matches).reverse())
const pending = computed(() => pendingEvents.filter(matches))
const showFeatured = computed(() => featured.value && matches(featured.value))

const counts = computed(() => {
  const all = [...events, ...pendingEvents]
  return {
    alle: all.length,
    public: all.filter((e) => e.public).length,
    members: all.filter((e) => !e.public).length,
  }
})

const featuredParts = computed(() => (featured.value ? dateParts(featured.value.date) : null))
const featuredDays = computed(() =>
  featured.value ? daysUntil(featured.value.date, now.value) : 0,
)

function addAllToCalendar() {
  downloadCalendar(split.value.upcoming, 'skiclub-kestenholz-agenda.ics')
  show('Agenda als Kalenderdatei geladen – einfach öffnen und importieren.', { icon: '📅' })
}

function addFeaturedToCalendar() {
  downloadCalendar([featured.value], `skiclub-kestenholz-${featured.value.id}.ics`)
}

async function shareFeatured() {
  const event = featured.value
  const url = `${window.location.href.split('#')[0]}#agenda`
  const text = `${event.title} am ${featuredParts.value.long} – ${event.location}. Mit dem Skiclub Kestenholz!`
  try {
    if (navigator.share) {
      await navigator.share({ title: event.title, text, url })
      return
    }
    await navigator.clipboard.writeText(`${text} ${url}`)
    show('Link kopiert – ab in den Gruppenchat damit!', { icon: '🔗' })
  } catch (error) {
    if (error?.name !== 'AbortError') show('Teilen hat nicht geklappt. Sorry!', { icon: '🙈' })
  }
}
</script>

<template>
  <section id="agenda" class="section events" aria-labelledby="events-title">
    <div class="container">
      <div class="events__head">
        <div class="events__title-wrap">
          <p v-reveal class="section-label">04 · Agenda</p>
          <h2 id="events-title" v-reveal class="section-title">Agenda 2027</h2>
          <p v-reveal class="section-intro muted">
            Was ansteht – mit Schwierigkeitsgrad. Die Daten stammen frisch von der GV, Details
            folgen jeweils zeitnah.
          </p>
        </div>

        <div v-reveal class="events__legend">
          <p class="events__legend-title">Pisten-Legende</p>
          <ul role="list">
            <li v-for="(info, key) in PISTES" :key="key">
              <PisteBadge :piste="key" />
            </li>
          </ul>
        </div>
      </div>

      <div class="events__toolbar">
        <div class="events__filters" role="group" aria-label="Anlässe filtern">
          <button
            v-for="item in FILTERS"
            :key="item.id"
            type="button"
            class="chip"
            :class="{ 'is-active': filter === item.id }"
            :aria-pressed="filter === item.id ? 'true' : 'false'"
            @click="filter = item.id"
          >
            {{ item.label }} <span class="chip__count">{{ counts[item.id] }}</span>
          </button>
        </div>
        <button
          v-if="split.upcoming.length"
          type="button"
          class="btn btn--ghost-dark btn--sm"
          @click="addAllToCalendar"
        >
          <AppIcon name="calendar" />
          Ganze Agenda in den Kalender
        </button>
      </div>

      <article
        v-if="showFeatured"
        v-reveal
        class="featured"
        :aria-label="`Highlight: ${featured.title}`"
      >
        <div class="featured__media">
          <ResponsiveImage
            :image="featuredImage"
            alt="Skiclub-Mitglieder auf einem sonnigen Grat mit Bergpanorama"
            sizes="(min-width: 1024px) 560px, 100vw"
          />
          <span class="featured__stamp">Premiere!</span>
        </div>

        <div class="featured__body">
          <div class="featured__top">
            <span class="featured__kicker">Tageskarte · {{ featured.kicker }}</span>
            <PisteBadge :piste="featured.piste" />
          </div>

          <div class="featured__main">
            <div>
              <h3 class="featured__title">{{ featured.title }}</h3>
              <p class="featured__location"><AppIcon name="pin" /> {{ featured.location }}</p>
            </div>
            <div class="featured__date" :aria-label="featuredParts.long">
              <span class="featured__weekday">{{ featuredParts.weekday }}</span>
              <span class="featured__day">{{ featuredParts.day }}</span>
              <span class="featured__month"
                >{{ featuredParts.month }} {{ featuredParts.year }}</span
              >
            </div>
          </div>

          <p class="featured__desc">{{ featured.description }}</p>
          <p class="featured__note hand">{{ featured.pisteNote }}</p>

          <dl class="featured__facts">
            <div v-for="[term, value] in featured.facts" :key="term">
              <dt>{{ term }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>

          <div class="featured__foot">
            <span class="featured__countdown">{{ countdownLabel(featuredDays) }}</span>
            <span class="featured__ok">OK: {{ joinNames(featured.organizers) }}</span>
            <div class="featured__actions">
              <button type="button" class="btn btn--red btn--sm" @click="addFeaturedToCalendar">
                <AppIcon name="calendar-plus" /> In Kalender
              </button>
              <button type="button" class="btn btn--ghost-dark btn--sm" @click="shareFeatured">
                <AppIcon name="share" /> Teilen
              </button>
            </div>
          </div>
        </div>
      </article>

      <TransitionGroup v-if="upcoming.length" name="list" tag="div" class="events__grid">
        <EventTicket
          v-for="event in upcoming"
          :key="event.id"
          :event="event"
          :now="now"
          :is-next="event.id === nextId"
        />
      </TransitionGroup>

      <template v-if="pending.length">
        <h3 class="events__subhead">Datum folgt</h3>
        <TransitionGroup name="list" tag="div" class="events__grid events__grid--pending">
          <EventTicket v-for="event in pending" :key="event.id" :event="event" :now="now" />
        </TransitionGroup>
      </template>

      <template v-if="past.length">
        <h3 class="events__subhead">Rückblick</h3>
        <div class="events__grid">
          <EventTicket v-for="event in past" :key="event.id" :event="event" :now="now" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.events__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: end;
  margin-bottom: 2.5rem;
}

.events__title-wrap {
  display: grid;
  gap: 1.1rem;
}

.events__legend {
  padding: 1.1rem 1.3rem;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  background: var(--c-paper);
}

.events__legend-title {
  margin-bottom: 0.6rem;
  font-family: var(--font-hand);
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1;
}

.events__legend ul {
  display: grid;
  gap: 0.45rem;
  margin: 0;
}

.events__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.events__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0.45rem 1rem;
  border: 1.5px solid var(--c-line);
  border-radius: 999px;
  background: var(--c-paper);
  font-size: 0.92rem;
  font-weight: 650;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.chip:hover {
  border-color: var(--c-ink);
}

.chip.is-active {
  border-color: var(--c-ink);
  background: var(--c-ink);
  color: #fff;
}

.chip__count {
  display: grid;
  place-items: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgb(10 11 13 / 0.08);
  font-size: 0.75rem;
}

.chip.is-active .chip__count {
  background: rgb(255 255 255 / 0.18);
}

/* Featured: the first public ski day */
.featured {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  margin-bottom: 2rem;
  border-radius: var(--radius-lg);
  background: var(--c-paper);
  box-shadow: var(--shadow-2);
  overflow: hidden;
}

.featured__media {
  position: relative;
  min-height: 320px;
}

.featured__media :deep(.rimg) {
  position: absolute;
  inset: 0;
}

.featured__stamp {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.35rem 1rem 0.45rem;
  border-radius: 6px;
  background: var(--c-red);
  color: #fff;
  font-family: var(--font-hand);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-6deg);
  box-shadow: var(--shadow-1);
}

.featured__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border-left: 3px dashed var(--c-line);
}

.featured__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
}

.featured__kicker {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-blue);
}

.featured__main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.featured__title {
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  font-stretch: 62%;
  font-weight: 850;
  line-height: 0.88;
  text-transform: uppercase;
}

.featured__location {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-weight: 650;
}

.featured__location .app-icon {
  color: var(--c-red);
}

.featured__date {
  display: grid;
  justify-items: center;
  min-width: 6.5rem;
  padding: 0.8rem 0.9rem;
  border-radius: var(--radius);
  background: var(--c-blue);
  color: #fff;
  text-transform: uppercase;
  text-align: center;
}

.featured__weekday,
.featured__month {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.featured__day {
  font-size: 3.4rem;
  font-stretch: 62%;
  font-weight: 850;
  line-height: 0.95;
}

.featured__desc {
  color: var(--c-muted);
}

.featured__note {
  font-size: 1.6rem;
  transform: rotate(-1deg);
  transform-origin: left;
}

.featured__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 0.25rem 0 0;
  padding: 1rem 0;
  border-block: 1px solid var(--c-line);
}

.featured__facts dt {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.featured__facts dd {
  margin: 0.2rem 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
}

.featured__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}

.featured__countdown {
  font-family: var(--font-hand);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--c-red);
}

.featured__ok {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-muted);
}

.featured__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: auto;
}

.events__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.events__grid--pending {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.events__subhead {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 3.5rem 0 1.5rem;
  font-size: 1.6rem;
  font-stretch: 62%;
  font-weight: 820;
  text-transform: uppercase;
}

.events__subhead::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--c-line);
}

.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s var(--ease-out);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.list-leave-active {
  position: absolute;
  visibility: hidden;
}

@media (max-width: 1100px) {
  .events__grid--pending {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1023px) {
  .events__head,
  .featured {
    grid-template-columns: minmax(0, 1fr);
  }

  .events__legend {
    justify-self: start;
  }

  .events__legend ul {
    grid-template-columns: repeat(2, auto);
    column-gap: 1.5rem;
  }

  .featured__media {
    min-height: 0;
    aspect-ratio: 16 / 9;
  }

  .featured__body {
    border-left: 0;
    border-top: 3px dashed var(--c-line);
  }
}

@media (max-width: 760px) {
  .events__grid,
  .events__grid--pending {
    grid-template-columns: 1fr;
  }

  .featured__facts {
    grid-template-columns: 1fr;
  }

  .featured__actions {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .events__legend ul {
    grid-template-columns: 1fr;
  }

  .featured__main {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .featured__date {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
  }

  .featured__day {
    font-size: 1.5rem;
  }

  .featured__title {
    font-size: clamp(2.2rem, 11vw, 2.8rem);
  }
}
</style>
