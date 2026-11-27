// Event dates are plain calendar dates (YYYY-MM-DD). They are handled in UTC so that no
// timezone can shift them by a day.

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'Aug',
  'Sept',
  'Okt',
  'Nov',
  'Dez',
]

const weekdayShort = new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', weekday: 'short' })
const longDate = new Intl.DateTimeFormat('de-CH', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const numericDate = new Intl.DateTimeFormat('de-CH', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Local calendar date of `now` as YYYY-MM-DD. */
export function toISODate(now) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function dateParts(iso) {
  const date = parseISODate(iso)
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: MONTHS_SHORT[date.getUTCMonth()],
    year: date.getUTCFullYear(),
    weekday: weekdayShort.format(date),
    long: longDate.format(date),
    numeric: numericDate.format(date),
  }
}

/** Whole days from today (local) until the given ISO date. Negative = in the past. */
export function daysUntil(iso, now) {
  const today = parseISODate(toISODate(now))
  return Math.round((parseISODate(iso) - today) / 86_400_000)
}

export function countdownLabel(days) {
  if (days < 0) return 'Vorbei'
  if (days === 0) return 'Heute!'
  if (days === 1) return 'Morgen!'
  return `Noch ${days} Tage`
}

/** Splits events into upcoming (sorted) and past, relative to `now`. */
export function splitByDate(list, now) {
  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date))
  return {
    upcoming: sorted.filter((e) => daysUntil(e.date, now) >= 0),
    past: sorted.filter((e) => daysUntil(e.date, now) < 0),
  }
}
