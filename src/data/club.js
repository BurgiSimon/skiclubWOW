// Central club facts. Edit here – the whole site picks it up.

export const club = {
  name: 'Skiclub Kestenholz',
  dialectName: 'Chestehouz',
  place: 'Kestenholz SO',
  founded: 2023,
  founders: 8,
  members: 18,
  minAge: 18,
  season: '2026/27',

  contact: {
    // Leave empty until the club has an address – buttons then point to the agenda instead.
    email: '',
    instagram: '',
  },
}

export const navLinks = [
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'gruender', label: 'Gründer' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'mitmachen', label: 'Mitmachen' },
]

/** Short chronicle for the founders section. */
export const chronicle = [
  { year: '2023', text: 'Acht Kollegen gründen den Skiclub Kestenholz.' },
  { year: '2025', text: 'Season End Party am Karfreitag im Schlachthaus.' },
  { year: 'Jan. 2026', text: 'Neuschnee in Chestehouz: Schanze geschaufelt, Wiese befahren.' },
  { year: '2026', text: '3. GV im Pöstli, Kappel – alle einstimmig wiedergewählt. Bravo!' },
  { year: '2027', text: 'Premiere: der erste öffentliche Chestehouzer Skitag.' },
]

/** Captions for the pointing polaroid in the hero – a click cycles through them. */
export const pointingCaptions = [
  'Dört! Neuschnee!',
  'Dört isch d’Bar.',
  'Wo isch dr Lift?',
  'Lueg, e Gönner!',
  'Dr Präsi het gseit: links.',
]

/**
 * Builds a mailto link if the club has an e-mail address, otherwise falls back to the agenda
 * (the honest answer for now: "talk to us at the next event").
 */
export function contactHref(subject) {
  if (!club.contact.email) return '#agenda'
  return `mailto:${club.contact.email}?subject=${encodeURIComponent(subject)}`
}
