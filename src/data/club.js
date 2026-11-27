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
    // Optional. If set, the «Mitmachen» buttons become mailto: links; otherwise they go to Instagram.
    email: '',
    instagram: 'skiclub_kestenholz',
  },
}

export const instagramUrl = club.contact.instagram
  ? `https://www.instagram.com/${club.contact.instagram}/`
  : ''

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
 * Where a contact button leads: e-mail if the club has an address, otherwise an Instagram DM
 * via the profile, otherwise the agenda ("talk to us at the next event").
 * Returns `{ href, kind, attrs }` – spread `attrs` onto the <a> (new tab for Instagram).
 */
export function contactLink(subject) {
  if (club.contact.email) {
    return {
      href: `mailto:${club.contact.email}?subject=${encodeURIComponent(subject)}`,
      kind: 'mail',
      attrs: {},
    }
  }
  if (instagramUrl) {
    return { href: instagramUrl, kind: 'instagram', attrs: { target: '_blank', rel: 'noopener' } }
  }
  return { href: '#agenda', kind: 'agenda', attrs: {} }
}
