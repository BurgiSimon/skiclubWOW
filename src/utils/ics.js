// Minimal iCalendar (RFC 5545) export for all-day events – no dependencies.

import { joinNames } from './text.js'

const encoder = new TextEncoder()

function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** Lines longer than 75 octets must be folded (CRLF + space). */
function fold(line) {
  const parts = []
  let current = ''
  let size = 0
  let limit = 75
  for (const char of line) {
    const bytes = encoder.encode(char).length
    if (size + bytes > limit) {
      parts.push(current)
      current = ''
      size = 0
      limit = 74
    }
    current += char
    size += bytes
  }
  parts.push(current)
  return parts.join('\r\n ')
}

function compactDate(iso, addDays = 0) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + addDays))
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

function timestamp(date = new Date()) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function eventLines(event, url) {
  const description = [
    event.description,
    event.organizers?.length ? `Organisation: ${joinNames(event.organizers)}` : '',
    url,
  ]
    .filter(Boolean)
    .join('\n\n')

  return [
    'BEGIN:VEVENT',
    `UID:${event.id}@skiclub-kestenholz`,
    `DTSTAMP:${timestamp()}`,
    `DTSTART;VALUE=DATE:${compactDate(event.date)}`,
    `DTEND;VALUE=DATE:${compactDate(event.date, 1)}`,
    `SUMMARY:${escapeText(`${event.title} – Skiclub Kestenholz`)}`,
    event.location ? `LOCATION:${escapeText(event.location)}` : null,
    `DESCRIPTION:${escapeText(description)}`,
    url ? `URL:${url}` : null,
    'END:VEVENT',
  ].filter(Boolean)
}

export function buildCalendar(events, url = '') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skiclub Kestenholz//Agenda//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Skiclub Kestenholz',
    ...events.flatMap((event) => eventLines(event, url)),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function downloadCalendar(events, filename) {
  const url = window.location.href.split('#')[0]
  const blob = new Blob([buildCalendar(events, url)], { type: 'text/calendar;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}
