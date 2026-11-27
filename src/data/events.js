// Agenda – source: GV protocol 2026 (Traktandum «Anlässe").
// Dates are ISO (YYYY-MM-DD). Past events are dimmed automatically, the next one is
// highlighted in the hero – so nothing needs to be touched when a date has passed.

/** Every event gets a piste colour – the Skiclub way of rating its difficulty. */
export const PISTES = {
  blue: { label: 'Blau', level: 'leicht' },
  red: { label: 'Rot', level: 'mittel' },
  black: { label: 'Schwarz', level: 'schwer' },
  yellow: { label: 'Gelb', level: 'Skiroute' },
}

export const events = [
  {
    id: 'skitag-januar-2027',
    title: '1. Skitag',
    kicker: 'Saisonstart',
    type: 'ski',
    date: '2027-01-10',
    public: false,
    location: 'Skigebiet wird intern bekannt gegeben',
    piste: 'red',
    pisteNote: 'Wadli nach der Sommerpause noch im Aufbau.',
    description:
      'Der erste interne Skitag der Saison: Kanten schleifen, Wadli testen, Kollegen treffen.',
    organizers: ['Schoi', 'Janik'],
  },
  {
    id: 'chestehouzer-skitag-2027',
    title: 'Chestehouzer Skitag',
    kicker: 'Premiere · öffentlich',
    type: 'ski',
    date: '2027-03-06',
    public: true,
    featured: true,
    location: 'Melchsee-Frutt OW',
    piste: 'blue',
    pisteNote: 'Für alle. Wir fahren hin – du fährst Ski.',
    description:
      'Unser erster öffentlicher Skitag! Der Skiclub organisiert die Hin- und Rückreise, mitkommen dürfen alle. Flyer, Infos und Anmeldung folgen zeitnah.',
    facts: [
      ['Anreise', 'Hin- und Rückreise organisiert der Skiclub'],
      ['Für wen', 'Alle – Mitglied oder nicht'],
      ['Anmeldung', 'Infos und Flyer folgen zeitnah'],
    ],
    organizers: ['Joi', 'Mige'],
  },
  {
    id: 'season-end-party-2027',
    title: 'Season End Party',
    kicker: 'Saisonabschluss',
    type: 'party',
    date: '2027-03-26',
    dayNote: 'Karfreitag',
    public: true,
    location: 'Ort folgt',
    piste: 'black',
    pisteNote: 'Shotski-Gefahr. Nur für Geübte.',
    description: 'Der offizielle Saisonabschluss – wie schon 2025 am Karfreitag.',
    organizers: ['Ben', 'Dävu'],
  },
  {
    id: 'paradislifest-2027',
    title: 'Paradislifest',
    kicker: 'Sommerfest',
    type: 'party',
    date: '2027-08-15',
    public: true,
    location: 'Paradisli, Kestenholz',
    piste: 'blue',
    pisteNote: 'Für die ganze Familie – mit Aussicht auf den Jura.',
    description:
      'Festbänke unter der grossen Eiche, kalte Getränke aus dem Brunnentrog und die beste Aussicht im Gäu.',
    organizers: ['Pädu', 'Dani'],
    helpers: ['Nik', 'Janik'],
  },
  {
    id: 'skiclub-jass-2027',
    title: 'Skiclub-Jass',
    kicker: 'Herbst',
    type: 'jass',
    date: '2027-10-08',
    public: true,
    location: 'Ort folgt',
    piste: 'black',
    pisteNote: 'Hier wird’s ernst. Trumpf ist Pflicht.',
    description: 'Der einzige Wettkampf, den wir wirklich ernst nehmen.',
    organizers: ['Tim', 'Simi'],
  },
]

/** Events without a fixed date yet. */
export const pendingEvents = [
  {
    id: 'skiclub-bar',
    title: 'Skiclub-Bar',
    type: 'bar',
    when: '2× pro Jahr',
    public: true,
    location: 'Kestenholz',
    piste: 'blue',
    pisteNote: 'Für alle Durstigen.',
    description: 'Rund zweimal im Jahr öffnen wir in Kestenholz unsere eigene Bar. Daten folgen.',
  },
  {
    id: 'vereinsreise-2027',
    title: 'Vereinsreise',
    type: 'trip',
    when: 'Datum folgt',
    public: false,
    location: 'Ziel: noch geheim (auch für uns)',
    piste: 'yellow',
    pisteNote: 'Skiroute – noch unpräpariert.',
    description: 'Datum und Ziel werden zeitnah bekannt gegeben.',
    organizers: ['Janik', 'Nik'],
  },
  {
    id: 'skiweekend-riederalp',
    title: 'Skiweekend Riederalp',
    type: 'ski',
    when: 'Saison 2027/28',
    public: false,
    location: 'Riederalp VS',
    piste: 'red',
    pisteNote: 'Verschoben – 2028 ist ein Schaltjahr, also ein Tag mehr Ski!',
    description: 'Auf die nächste Saison verlegt. Begründung siehe Schwierigkeitsgrad.',
    organizers: ['Dävu', 'Hösi'],
  },
]
