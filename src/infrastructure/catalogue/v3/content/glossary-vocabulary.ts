import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Final terminology pass shared conceptually with the user-facing glossary.
 *
 * The catalogue deliberately has some practice ids that predate the vocabulary shown to users.
 * This pass keeps those stable ids while making the visible wording use the canonical glossary term,
 * so the dedicated glossary and inline definitions never describe a different name for the same idea.
 */
const PRACTICE_VOCABULARY: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'forced-orgasm': {
    en: 'Forced orgasm',
    es: 'Orgasmo forzado',
  },
  'free-use-unaware-roleplay': {
    en: 'Free use',
    es: 'Free use',
  },
  'adult-ageplay-roleplay': {
    en: 'Adult ageplay',
    es: 'Ageplay adulto',
  },
  'futanari-fantasy': {
    en: 'Futanari fantasy',
    es: 'Fantasía futanari',
  },
  'furry-anthro-fantasy': {
    en: 'Furry / anthro fantasy',
    es: 'Fantasía furry / anthro',
  },
  'vore-fantasy': {
    en: 'Vore fantasy',
  },
  'brat-dynamic': {
    en: 'Brat dynamic / Brat tamer',
  },
  swinging: {
    en: 'Swinging',
    es: 'Swinging',
  },
  'same-room-sex': {
    en: 'Same-room sex',
    es: 'Sexo en la misma habitación',
  },
  'erotic-media-exchange': {
    en: 'Erotic media exchange',
    es: 'Intercambio de contenido erótico',
  },
  'sexual-service': {
    descriptionEn: 'Service submission through sexual service: pleasing or sexually attending to a partner is deliberately framed as service within the power dynamic.',
    descriptionEs: 'Sumisión de servicio mediante servicio sexual: complacer o atender sexualmente a la pareja se vive deliberadamente como servicio dentro de la dinámica de poder.',
  },
  'praise-kink': {
    en: 'Praise kink',
    es: 'Praise kink / gusto por el elogio',
  },
  'body-worship': {
    en: 'Body worship',
    es: 'Adoración corporal',
  },
  objectification: {
    en: 'Objectification',
    es: 'Cosificación',
  },
  'fear-play': {
    en: 'Fear play',
    es: 'Juego con el miedo',
  },
  flogging: {
    en: 'Flogging',
    es: 'Flogging',
  },
  cropping: {
    en: 'Cropping',
    es: 'Cropping / fusta',
  },
  caning: {
    en: 'Caning',
    es: 'Caning / vara',
  },
  'oral-anal': {
    es: 'Rimming / anilingus',
  },
  'strap-on': {
    es: 'Strap-on / dildo con arnés',
  },
  'fire-play': {
    es: 'Fire play / juego con fuego',
  },
  'stocks-restraint': {
    es: 'Cepo / stocks',
  },
  'dungeon-venue': {
    es: 'Dungeon / sala BDSM',
  },
  'wand-vibrator': {
    es: 'Vibrador wand',
  },
  'urine-play': {
    en: 'Watersports / urine play',
    es: 'Watersports / juego con orina',
  },
  'deep-throat': {
    en: 'Deep throat',
    es: 'Deep throat',
  },
  'pussy-torture': {
    descriptionEs: 'Edge play de alta intensidad centrado en dolor o vulnerabilidad de la vulva y los genitales externos femeninos. Se separa de la tortura vaginal, centrada en el canal interno.',
  },
};

export function applyGlossaryVocabulary(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => ({
      ...practice,
      ...(PRACTICE_VOCABULARY[practice.id] ?? {}),
    })),
  }));
}
