import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';
import { AFFECTION_INTIMACY, CLOTHING_APPEARANCE, MANUAL_MASTURBATION, ORAL } from './soft';
import { PENETRATION, TOYS, ORGASM_CONTROL, BODY_FETISHES } from './sexual';
import { GROUPS, ROLEPLAY, EXHIBITIONISM } from './social';
import { POWER, RESTRAINT, PSYCHOLOGICAL, SENSATION } from './bdsm';
import { FLUIDS, EDGE } from './intense';

const RAW_CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = [
  AFFECTION_INTIMACY,
  CLOTHING_APPEARANCE,
  MANUAL_MASTURBATION,
  ORAL,
  PENETRATION,
  TOYS,
  ORGASM_CONTROL,
  BODY_FETISHES,
  GROUPS,
  ROLEPLAY,
  EXHIBITIONISM,
  POWER,
  RESTRAINT,
  PSYCHOLOGICAL,
  SENSATION,
  FLUIDS,
  EDGE,
];

/**
 * V3 is being semantically reviewed before release. These entries were either duplicate aliases,
 * combinations already expressible by other questions, or one-sided duplicates of a builder that
 * already exposes both roles. Keeping the retirement list explicit makes the curation auditable.
 */
export const RETIRED_V3_PRACTICE_IDS = new Set<string>([
  'praise-during-sex',
  'finger-sucking',
  'masturbation-in-front-of-partner',
  'throat-fucking',
  'licking-genitals',
  'sucking-genitals',
  'oral-with-eye-contact',
  'oral-while-standing',
  'oral-under-table',
  'oral-wake-up',
  'receiving-oral-while-restrained',
  'cum-in-mouth',
  'swallowing-semen',
  'from-behind',
  'double-penetration',
  'vulva-suction-toy',
  'sex-furniture',
  'blindfold-accessory',
  'gag-accessory',
  'feather-tickler',
  'nipple-clamps',
  'permission-to-orgasm',
  'tease-and-denial',
  'long-edging-session',
  'countdown-orgasm',
  'orgasm-on-command',
  'partner-decides-orgasm',
  'decide-partner-orgasm',
  'delayed-orgasm',
  'orgy',
  'reverse-gangbang',
  'being-center-of-group',
  'participating-around-center',
  'partner-swapping',
  'being-watched-with-other',
  'polysexual-scene',
  'kidnapping-roleplay',
  'being-watched',
  'partner-watching',
  'watching-partner',
  'posing-for-erotic-photos',
  'anonymous-encounter-roleplay',
  'formal-protocol',
  'chores-service',
  'orgasm-authority',
  'pleading',
  'interrogation',
  'worship-dynamic',
  'butt-slapping',
  'rough-body-play',
  'urinating-on-partner',
  'being-urinated-on',
  'creampie',
  'squirting-on-partner',
  'heavy-caning',
  'heavy-whipping',
  'sensory-deprivation-intense',
  'consensual-abduction-scene',
  'consensual-non-consent-intense',
  'medical-needle-scene',
  'extreme-humiliation',
]);

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  cuddling: {
    kind: 'directed',
    descriptionEn: 'Affectionate holding and close physical comfort, rated separately for giving and receiving it.',
    descriptionEs: 'Abrazar, acurrucarse y dar cercanía física afectuosa, valorando por separado darla y recibirla.',
  },
  'verbal-affection': {
    kind: 'directed',
    descriptionEn: 'Expressing affection through words, rated separately for giving and receiving it.',
    descriptionEs: 'Expresar afecto con palabras, valorando por separado darlo y recibirlo.',
  },
  suits: {
    descriptionEn: 'Formal clothing such as a tailored suit, shirt or tie; it does not imply a specific profession or role.',
    descriptionEs: 'Ropa formal como traje de chaqueta, camisa o corbata; no implica una profesión o rol concreto.',
  },
  uniforms: {
    descriptionEn: 'Clothing associated with a recognizable profession, institution or role, whether realistic or fantasy-based.',
    descriptionEs: 'Ropa asociada a una profesión, institución o rol reconocible, ya sea realista o de fantasía.',
  },
  cosplay: {
    descriptionEn: 'Dressing as a specific fictional character or recognizable fictional archetype.',
    descriptionEs: 'Vestirse como un personaje ficticio concreto o un arquetipo de ficción reconocible.',
  },
  'partial-nudity': {
    en: 'Partially clothed during sex',
    es: 'Parcialmente vestido/a durante el sexo',
    kind: 'state',
    descriptionEn: 'Keeping some clothing on during sexual activity, rated separately for yourself and your partner.',
    descriptionEs: 'Mantener parte de la ropa durante la actividad sexual, valorándolo por separado en ti y en tu pareja.',
  },
  'full-nudity': {
    en: 'Fully nude during sex',
    es: 'Completamente desnudo/a durante el sexo',
    kind: 'state',
    descriptionEn: 'Being completely nude during sexual activity, rated separately for yourself and your partner.',
    descriptionEs: 'Estar completamente desnudo/a durante la actividad sexual, valorándolo por separado en ti y en tu pareja.',
  },
  'solo-masturbation': {
    kind: 'self',
    counterpartScoped: false,
    descriptionEn: 'Stimulating yourself sexually on your own; this is an individual preference rather than an action on a partner.',
    descriptionEs: 'Estimularte sexualmente por tu cuenta; es una preferencia individual y no una acción sobre la pareja.',
  },
  'hands-free-masturbation': {
    kind: 'self',
    counterpartScoped: false,
    descriptionEn: 'Reaching sexual stimulation or orgasm without using your hands directly.',
    descriptionEs: 'Buscar estimulación sexual u orgasmo sin usar directamente las manos.',
  },
  'watch-partner-masturbate': {
    en: 'Masturbation while watching / being watched',
    es: 'Masturbación mirando / siendo observado',
    descriptionEn: 'One partner masturbates while the other watches; watching and being watched are rated separately.',
    descriptionEs: 'Una persona se masturba mientras la otra mira; se valoran por separado mirar y ser observado/a.',
  },
  cunnilingus: {
    descriptionEn: 'Oral stimulation of the vulva and clitoris.',
    descriptionEs: 'Estimulación oral de la vulva y el clítoris.',
  },
  fellatio: {
    descriptionEn: 'Oral stimulation of the penis.',
    descriptionEs: 'Estimulación oral del pene.',
  },
  'sixty-nine': {
    descriptionEn: 'Both partners give and receive oral stimulation at the same time.',
    descriptionEs: 'Ambas personas dan y reciben estimulación oral al mismo tiempo.',
  },
  'deep-throat': {
    descriptionEn: 'Oral sex involving deeper penetration into the mouth or throat.',
    descriptionEs: 'Sexo oral con penetración más profunda de la boca o la garganta.',
  },
  'oral-anal': {
    descriptionEn: 'Oral stimulation of the anus, also known as rimming or anilingus.',
    descriptionEs: 'Estimulación oral del ano, también llamada rimming o anilingus.',
  },
  'fisting-vaginal': { anatomySex: 'female' },
  'cervix-contact': { anatomySex: 'female' },
  'prostate-massager': {
    anatomySex: 'male',
    descriptionEn: 'A toy shaped to stimulate the prostate through the anus.',
    descriptionEs: 'Juguete diseñado para estimular la próstata a través del ano.',
  },
  'rabbit-vibrator': { anatomySex: 'female' },
  'clitoral-suction-toy': { anatomySex: 'female' },
  'kegel-balls': { anatomySex: 'female' },
  penis: { anatomySex: 'male' },
  vulva: { anatomySex: 'female' },
  testicles: { anatomySex: 'male' },
  'watching-partner-with-other': {
    en: 'Partner with someone else',
    es: 'Pareja con otra persona',
    descriptionEn: 'A partner is sexual with someone else; watching it and being the partner who is watched are rated separately.',
    descriptionEs: 'La pareja mantiene actividad sexual con otra persona; se valoran por separado mirar y ser quien es observado/a.',
  },
  'soft-swap': {
    descriptionEn: 'Partner swapping that excludes penetrative sex with the other couple or guest.',
    descriptionEs: 'Intercambio de parejas que excluye el sexo con penetración con la otra pareja o invitado/a.',
  },
  'full-swap': {
    descriptionEn: 'Partner swapping that can include penetrative sex with the other couple or guest.',
    descriptionEs: 'Intercambio de parejas que puede incluir sexo con penetración con la otra pareja o invitado/a.',
  },
  gangbang: {
    descriptionEn: 'A group scene centered on one person with multiple participants; center and participant roles are rated separately.',
    descriptionEs: 'Escena grupal centrada en una persona con varios participantes; se valoran por separado el centro y quienes participan alrededor.',
  },
  'consensual-non-consent-roleplay': {
    en: 'Non-consent roleplay (CNC)',
    es: 'Roleplay de no consentimiento (CNC)',
    descriptionEn: 'A pre-agreed roleplay that simulates resistance or lack of consent within established limits.',
    descriptionEs: 'Roleplay previamente acordado que simula resistencia o falta de consentimiento dentro de límites establecidos.',
  },
  voyeurism: {
    en: 'Watching / being watched',
    es: 'Mirar / ser observado',
    descriptionEn: 'Watching sexual activity or being watched during it, within the catalogue-wide consent assumption.',
    descriptionEs: 'Mirar actividad sexual o ser observado/a durante ella, dentro del marco de consentimiento general del catálogo.',
  },
  'taking-erotic-photos': {
    en: 'Erotic photography',
    es: 'Fotografía erótica',
    descriptionEn: 'Taking erotic photographs of a partner or having a partner photograph you.',
    descriptionEs: 'Hacer fotografías eróticas a la pareja o que la pareja te las haga a ti.',
  },
  shibari: {
    descriptionEn: 'Japanese-influenced rope bondage that emphasizes structured ties, aesthetics and body positioning.',
    descriptionEs: 'Bondage con cuerdas de influencia japonesa que enfatiza ataduras estructuradas, estética y posición corporal.',
  },
  mummification: {
    descriptionEn: 'Immobilizing much of the body by wrapping it in material such as film, fabric or bondage tape.',
    descriptionEs: 'Inmovilizar gran parte del cuerpo envolviéndolo con material como film, tela o cinta de bondage.',
  },
  'spreader-bar': {
    descriptionEn: 'A rigid bar used to keep limbs separated at a fixed distance.',
    descriptionEs: 'Barra rígida utilizada para mantener las extremidades separadas a una distancia fija.',
  },
  'small-penis-humiliation': { anatomySex: 'male' },
  'female-ejaculation': {
    en: 'Squirting / female ejaculation',
    es: 'Squirting / eyaculación femenina',
    kind: 'state',
    anatomySex: 'female',
    descriptionEn: 'Female ejaculation or squirting, rated separately as something you experience and something a partner experiences.',
    descriptionEs: 'Eyaculación femenina o squirting, valorada por separado como algo que ocurre en ti o en tu pareja.',
  },
  snowballing: {
    descriptionEn: 'Passing semen between mouths, typically through kissing or mouth-to-mouth transfer.',
    descriptionEs: 'Pasar semen de una boca a otra, normalmente mediante beso o transferencia boca a boca.',
  },
  'cock-and-ball-torture': { anatomySex: 'male' },
  'predicament-bondage': {
    descriptionEn: 'Restraint arranged so that changing position relieves one discomfort while increasing another.',
    descriptionEs: 'Restricción preparada para que cambiar de postura alivie una incomodidad mientras aumenta otra.',
  },
};

const ADDITIONAL_PRACTICES: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  'clothing-appearance': [{
    id: 'clothed-sex',
    en: 'Fully clothed during sex',
    es: 'Completamente vestido/a durante el sexo',
    kind: 'state',
    descriptionEn: 'Keeping ordinary clothing on during sexual activity, rated separately for yourself and your partner.',
    descriptionEs: 'Mantener la ropa puesta durante la actividad sexual, valorándolo por separado en ti y en tu pareja.',
  }],
};

export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = RAW_CATALOGUE_V3_CONTENT.map(
  (category) => ({
    ...category,
    en: cleanEnglish(category.en),
    es: cleanSpanish(category.es),
    descriptionEn: cleanEnglish(category.descriptionEn),
    descriptionEs: cleanSpanish(category.descriptionEs),
    practices: [
      ...category.practices
        .filter((practice) => !RETIRED_V3_PRACTICE_IDS.has(practice.id))
        .map(curatePractice),
      ...(ADDITIONAL_PRACTICES[category.id] ?? []),
    ],
  }),
);

function curatePractice(seed: CataloguePracticeSeed): CataloguePracticeSeed {
  const cleaned: CataloguePracticeSeed = {
    ...seed,
    en: cleanEnglish(seed.en),
    es: cleanSpanish(seed.es),
    ...(seed.descriptionEn ? { descriptionEn: cleanEnglish(seed.descriptionEn) } : {}),
    ...(seed.descriptionEs ? { descriptionEs: cleanSpanish(seed.descriptionEs) } : {}),
  };
  return { ...cleaned, ...(PRACTICE_OVERRIDES[seed.id] ?? {}) };
}

function cleanEnglish(value: string): string {
  return normalizeWhitespace(value
    .replace(/\bconsensual\s+/gi, '')
    .replace(/\s+consensual\b/gi, ''));
}

function cleanSpanish(value: string): string {
  return normalizeWhitespace(value
    .replace(/\b(?:consensuad[oa]s?|consentid[oa]s?)\s+/gi, '')
    .replace(/\s+(?:consensuad[oa]s?|consentid[oa]s?)\b/gi, ''));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
}
