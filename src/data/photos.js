// All photos live in src/assets/photos. At build time vite-imagetools turns every file into
// responsive AVIF + WebP variants (metadata stripped) plus a tiny blurred placeholder.
// To add a photo: drop the .jpg into the folder and add an entry to `gallery` below.

const pictures = import.meta.glob('../assets/photos/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=480;800;1200;1600&format=avif;webp&as=picture',
})

const placeholders = import.meta.glob('../assets/photos/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=24&format=webp&quality=40&inline',
})

/** Returns `{ picture, placeholder }` for a file name in src/assets/photos. */
export function photo(name) {
  const key = `../assets/photos/${name}.jpg`
  if (!pictures[key]) throw new Error(`Foto nicht gefunden: ${name}.jpg`)
  return { picture: pictures[key], placeholder: placeholders[key] }
}

export const GALLERY_FILTERS = [
  { id: 'alle', label: 'Alle' },
  { id: 'pischte', label: 'Pischte' },
  { id: 'feschte', label: 'Feschte' },
  { id: 'chestehouz', label: 'Chestehouz' },
]

export const gallery = [
  {
    file: 'skitag-grat',
    category: 'pischte',
    alt: 'Skiclub-Mitglieder auf einem verschneiten Grat mit Bergpanorama',
    caption: 'Gratwanderung – aber mit Ski.',
  },
  {
    file: 'paradisli-aussicht',
    category: 'feschte',
    alt: 'Festgäste vor der Paradisli-Hütte unter grossen Eichen, im Hintergrund der Jura',
    caption: 'Das Paradisli: Eiche, Hütte, Jura-Blick.',
  },
  {
    file: 'skitag-zwerge',
    category: 'pischte',
    alt: 'Gruppenfoto auf der Piste zwischen bunten Zwergen-Figuren',
    caption: 'Sieben Aufnahmegesuche. Leider alle zu klein.',
  },
  {
    file: 'chestehouz-schanzenbau',
    category: 'chestehouz',
    alt: 'Zwei Mitglieder schaufeln im Neuschnee eine Schanze',
    caption: 'Schanzenbau, Chestehouzer Art.',
  },
  {
    file: 'skibrille',
    category: 'pischte',
    alt: 'Blick durch eine Skibrille mit Skiclub-Sticker auf verschneite Berge',
    caption: 'Durchblick mit Club-Sticker.',
  },
  {
    file: 'paradisli-fest',
    category: 'feschte',
    alt: 'Volle Festbänke am Paradislifest vor der Holzhütte mit alten Ski an der Wand',
    caption: 'Paradislifest: volle Bänke, volle Teller.',
  },
  {
    file: 'skitag-wolken',
    category: 'pischte',
    alt: 'Drei Skifahrer unter einer dichten Wolkendecke im Hochgebirge',
    caption: 'Wolkendecke? Pischte isch Pischte.',
  },
  {
    file: 'paradisli-brunnen',
    category: 'feschte',
    alt: 'Brunnentrog voller Eis und Getränkedosen',
    caption: 'Kühlsystem: Brunnentrog plus Eis. Swiss Engineering.',
  },
  {
    file: 'chestehouz-feuer',
    category: 'chestehouz',
    alt: 'Gruppe am Feuer im verschneiten Kestenholz',
    caption: 'Après-Ski in Chestehouz: Feuer statt Hütte.',
  },
  {
    file: 'skitag-sessellift',
    category: 'pischte',
    alt: 'Skifahrer bei einer Pause neben dem Sessellift, Sonne und Bergpanorama',
    caption: 'Kurze Lagebesprechung vor der nächsten Abfahrt.',
  },
  {
    file: 'herbst-feuer',
    category: 'feschte',
    alt: 'Herbstabend mit Feuerstelle, Festbänken und Mitgliedern im Wald',
    caption: 'Herbst-Höck am Feuer.',
  },
  {
    file: 'skitag-doert',
    category: 'pischte',
    alt: 'Sechs Skifahrer zeigen gleichzeitig dramatisch in dieselbe Richtung',
    caption: '«Dört!» – Was genau, weiss heute niemand mehr.',
  },
  {
    file: 'herbst-wald',
    category: 'feschte',
    alt: 'Mitglieder stehen in der Dämmerung zwischen Festbänken unter Herbstbäumen',
    caption: 'Feuer, Bänke, Kollegen. Mehr braucht’s nicht.',
  },
  {
    file: 'flyer-season-end-2025',
    category: 'feschte',
    alt: 'Flyer der Season End Party 2025 mit Gondel und Skifahrer',
    caption: 'Flyer Season End Party 2025 – Karfreitag im Schlachthaus.',
  },
].map((item) => ({ ...item, ...photo(item.file) }))
