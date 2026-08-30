import {
  CATALOGUE_GLOSSARY,
  CatalogueGlossaryCategory,
  CatalogueGlossaryEntry,
  CatalogueGlossarySegment,
} from './catalogue-glossary';
import { Locale } from './locale';

export type FinalCatalogueGlossaryCategory = CatalogueGlossaryCategory | 'places-settings';

export interface FinalCatalogueGlossaryEntry extends Omit<CatalogueGlossaryEntry, 'category'> {
  readonly category: FinalCatalogueGlossaryCategory;
}

export interface LocalizedFinalCatalogueGlossaryEntry {
  readonly id: string;
  readonly category: FinalCatalogueGlossaryCategory;
  readonly title: string;
  readonly definition: string;
  readonly aliases: readonly string[];
}

const EXCLUDED_BASE_IDS = new Set([
  'hotwife',
  'cuckold',
  'voyeurism',
  'glory-hole',
  'vulva-pain-play',
  // Pegging no longer has a dedicated catalogue practice after the current penetration/toy split.
  // Keeping a standalone definition would make the glossary promise vocabulary the questionnaire does not use.
  'pegging',
]);

const CLOSING_GLOSSARY_ENTRIES: readonly FinalCatalogueGlossaryEntry[] = [
  term(
    'groups-non-monogamy', 'cuckold', 'Cuckold', 'Cuckold', ['cuckold'],
    'A framing where a man’s role as the partner of someone having sex with other people is itself part of the erotic interest. Jealousy, exclusion, submission or humiliation may appear, but are not required.',
    'Marco donde el papel de un hombre como pareja de alguien que tiene sexo con terceros forma parte del propio interés erótico. Puede incluir celos, exclusión, sumisión o humillación, pero no es obligatorio.',
  ),
  term(
    'groups-non-monogamy', 'compersion', 'Erotic compersion', 'Compersión erótica', ['compersion', 'compersión'],
    'Pleasure or arousal from knowing that a partner is enjoying sexual or romantic contact with someone else. The positive reaction to the partner’s enjoyment is the defining element.',
    'Placer o excitación al saber que la pareja disfruta de un contacto sexual o romántico con otra persona. Lo definitorio es la reacción positiva ante el disfrute de la pareja.',
  ),
  term(
    'visibility-media', 'voyeurism', 'Voyeurism', 'Voyeurismo', ['voyeurism', 'voyeurismo'],
    'Erotic interest in watching another person. In DesireSync the open-voyeurism entry means the observed partner knows they are being watched at that moment; observation without notice is a separate entry whose prior agreement is explained in its description.',
    'Interés erótico en observar a otra persona. En DesireSync el voyeurismo abierto implica que la pareja sabe que está siendo observada en ese momento; la observación sin aviso es otra entrada cuyo acuerdo previo se explica en su descripción.',
  ),

  term(
    'anatomy', 'urethra', 'Urethra', 'Uretra', ['urethra', 'urethral', 'uretra', 'uretral'],
    'The tube that carries urine from the bladder to the outside of the body. Urethral-focused interests are anatomically distinct from vaginal or general external-genital play.',
    'Conducto que lleva la orina desde la vejiga hasta el exterior del cuerpo. Los intereses centrados en la uretra son anatómicamente distintos del juego vaginal o genital externo general.',
  ),
  term(
    'edge', 'vulvar-torture', 'Pussy torture', 'Pussy torture', ['pussy torture', 'vulvar torture', 'vulva torture', 'tortura vulvar'],
    'High-intensity pain-focused play centred on the vulva or external female genitals. It refers to the external anatomy rather than the internal vaginal canal.',
    'Juego de dolor de alta intensidad centrado en la vulva o genitales externos femeninos. Se refiere a la anatomía externa, no al canal vaginal interno.',
  ),
  term(
    'edge', 'vaginal-torture', 'Vaginal torture', 'Vaginal torture', ['vaginal torture', 'tortura vaginal'],
    'High-intensity pain-focused play where the internal vaginal canal is the specific focus, distinct from external vulvar pain play.',
    'Juego de dolor de alta intensidad donde el canal vaginal interno es el foco específico, distinto del juego de dolor sobre la vulva externa.',
  ),
  term(
    'edge', 'urethral-torture', 'Urethral torture', 'Tortura uretral', ['urethral torture', 'tortura uretral'],
    'High-intensity edge play where pain, control or vulnerability of the urethra is itself the erotic focus.',
    'Juego edge de alta intensidad donde el dolor, el control o la vulnerabilidad de la uretra constituyen el propio foco erótico.',
  ),

  term(
    'restraint', 'stocks', 'Stocks', 'Cepo / stocks', ['stocks', 'cepo'],
    'Rigid restraint furniture that traps wrists, ankles or sometimes the neck in fixed openings. Imagine two solid sections closing around those body areas so the person cannot simply move away.',
    'Mobiliario rígido que inmoviliza muñecas, tobillos o a veces el cuello mediante aberturas fijas. La imagen típica son dos piezas sólidas que se cierran alrededor de esas zonas e impiden apartarse.',
  ),
  term(
    'restraint', 'st-andrews-cross', "St. Andrew's cross", 'Cruz de San Andrés', ["St. Andrew's cross", 'St Andrews cross', 'cruz de San Andrés'],
    'A large X-shaped BDSM frame used as a fixed support for restraint, commonly securing wrists and ankles so the frame determines the body position.',
    'Gran estructura BDSM en forma de X usada como soporte fijo para la restricción, normalmente sujetando muñecas y tobillos para que el propio marco determine la postura.',
  ),
  term(
    'restraint', 'bondage-bench', 'Bondage bench / table', 'Banco o mesa de bondage', ['bondage bench', 'bondage table', 'banco de bondage', 'mesa de bondage'],
    'A bench or padded table with attachment points used to hold a person in a defined lying, kneeling or bent position.',
    'Banco o mesa acolchada con puntos de sujeción para mantener a una persona en una postura tumbada, arrodillada o inclinada concreta.',
  ),
  term(
    'restraint', 'bondage-chair', 'Bondage chair', 'Silla de bondage', ['bondage chair', 'silla de bondage'],
    'A chair designed or adapted with restraint points so sitting posture and access to the body can be controlled.',
    'Silla diseñada o adaptada con puntos de sujeción para controlar la postura sentada y el acceso al cuerpo.',
  ),
  term(
    'restraint', 'cage-confinement', 'Cage confinement', 'Confinamiento en jaula', ['cage confinement', 'confinamiento en jaula'],
    'A confinement interest where a cage or similarly enclosed structure restricts the available space rather than one specific tie.',
    'Interés por confinamiento donde una jaula o estructura cerrada similar limita el espacio disponible, en lugar de depender de una atadura concreta.',
  ),
  term(
    'restraint', 'bondage-mitts', 'Bondage mitts', 'Manoplas de bondage', ['bondage mitts', 'manoplas de bondage'],
    'Restrictive mitts that reduce or prevent independent finger use, making ordinary hand movements difficult.',
    'Manoplas restrictivas que reducen o impiden usar los dedos por separado, dificultando movimientos normales de las manos.',
  ),
  term(
    'restraint', 'bit-gag', 'Bit gag', 'Mordaza de bocado', ['bit gag', 'bit-gag', 'mordaza de bocado'],
    'A gag with a bar or bit held between the teeth, visually similar to a horse bit rather than a ball filling the mouth.',
    'Mordaza con una barra o bocado entre los dientes, visualmente similar a un bocado de caballo en lugar de una bola que ocupa la boca.',
  ),

  term(
    'power-service', 'brat-tamer', 'Brat tamer', 'Brat-tamer', ['brat-tamer', 'brat tamer'],
    'The dominant counterpart in a brat dynamic, responding to playful resistance or provocation as part of the agreed power interaction.',
    'Contraparte dominante en una dinámica brat, respondiendo a resistencia juguetona o provocación como parte del intercambio de poder acordado.',
  ),
  term(
    'roleplay-fantasy', 'primal-play', 'Primal play', 'Primal play', ['primal play'],
    'Adult erotic play focused on instinctive physical energy such as pursuit, wrestling, growling or dominance signals. It is distinct from taking a pet/animal role.',
    'Juego erótico adulto centrado en una energía física instintiva, como persecución, forcejeo, gruñidos o señales de dominancia. Se diferencia de adoptar un rol de mascota o animal.',
  ),

  term(
    'places-settings', 'dungeon', 'BDSM dungeon', 'Dungeon / sala BDSM', ['dungeon', 'BDSM dungeon'],
    'A room or venue specifically equipped for BDSM scenes, often with fixed furniture, restraint points or impact-play equipment.',
    'Sala o local equipado específicamente para escenas BDSM, normalmente con mobiliario fijo, puntos de sujeción o material de juego de impacto.',
  ),
  term(
    'places-settings', 'glory-hole', 'Glory hole', 'Glory hole', ['glory hole', 'glory-hole'],
    'A sexual setting separated by a wall or partition with an opening through which sexual contact occurs, reducing visual contact between participants.',
    'Entorno sexual separado por una pared o mampara con una abertura a través de la cual se produce el contacto sexual, reduciendo el contacto visual entre participantes.',
  ),

  term(
    'toys-penetration', 'wand-vibrator', 'Wand vibrator', 'Vibrador wand', ['wand vibrator', 'vibrador wand', 'wand'],
    'A usually larger handheld vibrator with a broad rounded head, primarily associated with strong external vibration rather than a penetrative shape.',
    'Vibrador de mano normalmente grande, con cabeza ancha y redondeada, asociado sobre todo a vibración externa intensa y no a una forma pensada para penetración.',
  ),
  term(
    'toys-penetration', 'rabbit-vibrator', 'Rabbit vibrator', 'Vibrador rabbit', ['rabbit vibrator', 'vibrador rabbit', 'rabbit'],
    'A penetrative vibrator with a second external arm, commonly designed to stimulate the clitoral area at the same time.',
    'Vibrador de penetración con un segundo brazo externo, normalmente diseñado para estimular a la vez la zona del clítoris.',
  ),
] as const;

const FINAL_BASE_GLOSSARY: readonly FinalCatalogueGlossaryEntry[] = CATALOGUE_GLOSSARY
  .filter((entry) => !EXCLUDED_BASE_IDS.has(entry.id))
  .map((entry) => entry.id === 'forced-orgasm'
    ? {
        ...entry,
        titleEs: 'Orgasmo forzado',
        aliases: [...entry.aliases, 'orgasmo forzado'],
      }
    : entry);

export const FINAL_CATALOGUE_GLOSSARY: readonly FinalCatalogueGlossaryEntry[] = [
  ...FINAL_BASE_GLOSSARY,
  ...CLOSING_GLOSSARY_ENTRIES,
];

const ALIASES = FINAL_CATALOGUE_GLOSSARY
  .flatMap((entry) =>
    [...new Set([...entry.aliases, entry.titleEn, entry.titleEs])]
      .map((alias) => ({ alias, entry })),
  )
  .sort((left, right) => right.alias.length - left.alias.length);
const ALIAS_LOOKUP = new Map(ALIASES.map(({ alias, entry }) => [alias.toLocaleLowerCase(), entry]));
const TERM_PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(${ALIASES.map(({ alias }) => escapeRegex(alias)).join('|')})(?![\\p{L}\\p{N}])`,
  'giu',
);

export function localizedFinalCatalogueGlossary(locale: Locale): readonly LocalizedFinalCatalogueGlossaryEntry[] {
  return FINAL_CATALOGUE_GLOSSARY
    .map((entry) => ({
      id: entry.id,
      category: entry.category,
      title: locale === 'es' ? entry.titleEs : entry.titleEn,
      definition: locale === 'es' ? entry.es : entry.en,
      aliases: entry.aliases,
    }))
    .sort((left, right) => left.title.localeCompare(right.title, locale));
}

export function splitFinalCatalogueGlossaryText(text: string, locale: Locale): readonly CatalogueGlossarySegment[] {
  if (!text) return [];
  const segments: CatalogueGlossarySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TERM_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    const matchedText = match[0];
    const entry = ALIAS_LOOKUP.get(matchedText.toLocaleLowerCase());
    segments.push(entry
      ? { text: matchedText, termId: entry.id, definition: locale === 'es' ? entry.es : entry.en }
      : { text: matchedText });
    cursor = index + matchedText.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
}

function term(
  category: FinalCatalogueGlossaryCategory,
  id: string,
  titleEn: string,
  titleEs: string,
  aliases: readonly string[],
  en: string,
  es: string,
): FinalCatalogueGlossaryEntry {
  return { id, category, aliases, titleEn, titleEs, en, es };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
