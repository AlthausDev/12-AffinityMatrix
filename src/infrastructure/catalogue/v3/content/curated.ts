import {
  CATALOGUE_V3_CONTENT as FIRST_PASS_CONTENT,
  RETIRED_V3_PRACTICE_IDS as FIRST_PASS_RETIRED_IDS,
} from './index';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Second semantic pass across category boundaries. A practice is retired here only when it is a
 * clear alias, an umbrella already represented more usefully elsewhere, or a combination of two
 * preferences that are already independently expressible. Similar practices remain separate when
 * a person could reasonably answer them differently.
 */
const SECOND_PASS_RETIRED_IDS = [
  'edging-manual',
  'forced-masturbation-roleplay',
  'oral-edging',
  'saliva-during-oral',
  'penetration-without-orgasm',
  'temperature-toys',
  'app-controlled-toy',
  'orgasm-through-penetration',
  'orgasm-through-oral',
  'orgasm-through-toys',
  'fantasy-character-roleplay',
  'obedience',
  'behavior-control',
  'semen-on-body',
] as const;

export const RETIRED_V3_PRACTICE_IDS = new Set<string>([
  ...FIRST_PASS_RETIRED_IDS,
  ...SECOND_PASS_RETIRED_IDS,
]);

const CATEGORY_ORDER = [
  'affection-intimacy',
  'sexual-style',
  'clothing-appearance',
  'manual-masturbation',
  'oral',
  'penetration',
  'toys',
  'orgasm-control',
  'body-fetishes',
  'groups',
  'roleplay',
  'exhibitionism',
  'places-settings',
  'power',
  'restraint',
  'psychological',
  'sensation',
  'fluids',
  'edge',
] as const;

const NEW_CATEGORIES: Readonly<Record<string, Omit<CatalogueCategorySeed, 'order' | 'practices'>>> = {
  'sexual-style': {
    id: 'sexual-style',
    en: 'Sexual style, rhythm & atmosphere',
    es: 'Estilo, ritmo y ambiente sexual',
    descriptionEn: 'Preferences about pace, mood, timing, playfulness and the general atmosphere of sex.',
    descriptionEs: 'Preferencias sobre ritmo, ambiente, momento, juego y estilo general de las relaciones sexuales.',
  },
  'places-settings': {
    id: 'places-settings',
    en: 'Places & settings',
    es: 'Lugares y entornos',
    descriptionEn: 'Places and environments where sexual activity or a sexual scene takes place.',
    descriptionEs: 'Lugares y entornos en los que se desarrolla la actividad sexual o una escena.',
  },
};

const CATEGORY_OVERRIDES: Readonly<Record<string, Partial<CatalogueCategorySeed>>> = {
  'affection-intimacy': {
    descriptionEn: 'Affection, touch, closeness and shared intimacy outside the specific style or pace of sex.',
    descriptionEs: 'Afecto, contacto, cercanía e intimidad compartida, separados del ritmo o estilo concreto del sexo.',
  },
  roleplay: {
    en: 'Fantasies, roleplay & archetypes',
    es: 'Fantasías, roleplay y arquetipos',
    descriptionEn: 'Characters, archetypes and scene-based fantasies where the imagined role or premise matters.',
    descriptionEs: 'Personajes, arquetipos y fantasías de escena en las que importa el rol o la premisa imaginada.',
  },
  exhibitionism: {
    en: 'Exhibitionism, voyeurism & recording',
    es: 'Exhibicionismo, voyeurismo y grabación',
    descriptionEn: 'Watching, being watched, visual exposure, photography, recording and remote visual interaction.',
    descriptionEs: 'Mirar, ser observado, exposición visual, fotografía, grabación e interacción visual a distancia.',
  },
  fluids: {
    en: 'Fluids, substances & messy play',
    es: 'Fluidos, sustancias y juegos corporales',
    descriptionEn: 'Saliva, sexual fluids, urine, food, oils and other substances used as part of sexual play.',
    descriptionEs: 'Saliva, fluidos sexuales, orina, comida, aceites y otras sustancias utilizadas como parte del juego sexual.',
  },
};

const PRACTICE_CATEGORY_OVERRIDES: Readonly<Record<string, string>> = {
  'slow-sex': 'sexual-style',
  'passionate-sex': 'sexual-style',
  'morning-sex': 'sexual-style',
  'sleepy-sex': 'sexual-style',
  quickies: 'sexual-style',
  'extended-foreplay': 'sexual-style',
  'romantic-sex': 'sexual-style',
  'playful-sex': 'sexual-style',
  'eye-contact': 'sexual-style',
  'competitive-sex': 'sexual-style',

  'sex-in-car': 'places-settings',
  'sex-in-shower': 'places-settings',
  'sex-in-bath': 'places-settings',
  'sex-in-kitchen': 'places-settings',
  'sex-on-sofa': 'places-settings',
  'sex-on-floor': 'places-settings',
  'sex-in-hotel': 'places-settings',
  'sex-outdoors-private': 'places-settings',
  'semi-public-consensual-scene': 'places-settings',
  'sex-club': 'places-settings',
  'dungeon-venue': 'places-settings',
  'glory-hole': 'places-settings',

  'spitting-semen': 'fluids',
  'creampie-vaginal': 'fluids',
  'creampie-anal': 'fluids',

  'brat-dynamic': 'power',
};

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'remote-control-toy': {
    en: 'Remote / app-controlled toy',
    es: 'Juguete por control remoto / app',
    descriptionEn: 'A toy controlled at a distance with a remote control or an app.',
    descriptionEs: 'Juguete controlado a distancia mediante un mando o una aplicación.',
  },
  'group-sex': {
    descriptionEn: 'Sexual activity with several participants without fixing one exact composition or number.',
    descriptionEs: 'Actividad sexual con varias personas sin fijar una composición o un número exacto.',
  },
  service: {
    descriptionEn: 'A general service-oriented dynamic; sexual service and domestic service are asked separately.',
    descriptionEs: 'Dinámica general orientada al servicio; el servicio sexual y el doméstico se preguntan por separado.',
  },
  domination: {
    descriptionEn: 'General interest in a dominance/submission dynamic, separate from its more specific rules, protocols or activities.',
    descriptionEs: 'Interés general en una dinámica de dominación/sumisión, separado de reglas, protocolos o actividades concretas.',
  },
  humiliation: {
    descriptionEn: 'Erotic use of embarrassment, exposure or loss of status; specific humiliation themes are asked separately.',
    descriptionEs: 'Uso erótico de vergüenza, exposición o pérdida de estatus; algunos temas concretos se preguntan por separado.',
  },
  degradation: {
    descriptionEn: 'Erotic treatment that deliberately lowers status or dignity, distinct from simply feeling embarrassed.',
    descriptionEs: 'Trato erótico que rebaja deliberadamente estatus o dignidad, distinto de limitarse a sentir vergüenza.',
  },

  'showering-together': {
    descriptionEn: 'Sharing a shower as intimate physical closeness; sexual activity in the shower is asked separately under places and settings.',
    descriptionEs: 'Compartir una ducha como momento de cercanía íntima; tener sexo en la ducha se pregunta aparte en Lugares y entornos.',
  },
  'sex-in-shower': {
    descriptionEn: 'Sexual activity taking place in a shower, distinct from simply showering together.',
    descriptionEs: 'Actividad sexual realizada en una ducha, distinta de simplemente ducharse juntos.',
  },
  'bathing-together': {
    descriptionEn: 'Sharing a bath as intimate physical closeness; sexual activity in a bath is asked separately under places and settings.',
    descriptionEs: 'Compartir un baño como momento de cercanía íntima; tener sexo en la bañera se pregunta aparte en Lugares y entornos.',
  },
  'sex-in-bath': {
    descriptionEn: 'Sexual activity taking place in a bath or bathtub, distinct from simply bathing together.',
    descriptionEs: 'Actividad sexual realizada en una bañera, distinta de simplemente bañarse juntos.',
  },
  spooning: {
    descriptionEn: 'Lying closely together on the same side in a spooning embrace; penetrative spooning is asked separately.',
    descriptionEs: 'Tumbarse juntos de lado y abrazados en cucharita; la penetración en cucharita se pregunta aparte.',
  },
  'spooning-penetration': {
    descriptionEn: 'Penetration while both partners lie on their sides in a spooning position.',
    descriptionEs: 'Penetración mientras ambas personas están tumbadas de lado en posición de cucharita.',
  },
  'collars-fashion': {
    descriptionEn: 'Wearing a collar or choker primarily for appearance; symbolic collaring in a power relationship is asked separately.',
    descriptionEs: 'Llevar un collar o gargantilla principalmente por estética; el collaring simbólico en una relación de poder se pregunta aparte.',
  },
  collaring: {
    descriptionEn: 'Giving, receiving or wearing a collar as a symbol of a power relationship, commitment or role rather than simply as fashion.',
    descriptionEs: 'Dar, recibir o llevar un collar como símbolo de una relación de poder, compromiso o rol, y no sólo por estética.',
  },
  'harnesses-fashion': {
    descriptionEn: 'Wearing a body harness primarily for appearance, rather than using rope or a harness to restrain the body.',
    descriptionEs: 'Llevar un arnés corporal principalmente por estética, no como sistema de inmovilización o atadura.',
  },
  'chest-harness-bondage': {
    descriptionEn: 'Rope bondage arranged around the torso to restrain, position or structure the body.',
    descriptionEs: 'Bondage con cuerdas dispuesto alrededor del torso para inmovilizar, posicionar o estructurar el cuerpo.',
  },
  'sex-swing': {
    descriptionEn: 'A suspended seat or support used to hold sexual positions; suspension bondage is asked separately in Edge.',
    descriptionEs: 'Asiento o soporte suspendido utilizado para mantener posturas sexuales; el bondage en suspensión se pregunta aparte en Edge.',
  },
  'suspension-bondage': {
    descriptionEn: 'Bondage in which restraint equipment supports part or all of a person off the ground.',
    descriptionEs: 'Bondage en el que las ataduras sostienen parte o la totalidad del cuerpo separado del suelo.',
  },
  'warm-wax': {
    descriptionEn: 'Sensation play using wax intended to create controlled warmth on the skin; more intense heat is asked separately in Edge.',
    descriptionEs: 'Juego de sensaciones con cera pensado para producir calor controlado sobre la piel; el calor más intenso se pregunta aparte en Edge.',
  },
  'hot-wax-intense': {
    descriptionEn: 'Higher-intensity wax play where stronger heat is part of the desired sensation.',
    descriptionEs: 'Juego con cera de mayor intensidad en el que un calor más fuerte forma parte de la sensación buscada.',
  },
  'electrostimulation-mild': {
    descriptionEn: 'Low-intensity electrical stimulation used for tingling or muscle sensation; stronger electrostimulation is asked separately in Edge.',
    descriptionEs: 'Electroestimulación de baja intensidad utilizada para cosquilleo o sensación muscular; la intensidad alta se pregunta aparte en Edge.',
  },
  'electrostimulation-intense': {
    descriptionEn: 'Higher-intensity electrical stimulation where stronger sensation is deliberately part of the practice.',
    descriptionEs: 'Electroestimulación de mayor intensidad en la que una sensación más fuerte forma deliberadamente parte de la práctica.',
  },

  'deep-throat': { anatomySex: 'male' },
  breasts: { anatomySex: 'female' },
  chest: { anatomySex: 'male' },
  'breast-stimulation-by-hand': { anatomySex: 'female' },
  'oral-breasts': { anatomySex: 'female' },
  'breast-slapping': { anatomySex: 'female' },
  'breast-size-humiliation': { anatomySex: 'female' },
  'breast-torture': { anatomySex: 'female' },
  'hands-free-orgasm': { kind: 'self' },

  'semen-on-face': { actorSex: 'male', counterpartScoped: true },
  'semen-on-breasts': { actorSex: 'male', anatomySex: 'female', counterpartScoped: true },
  'semen-on-buttocks': { actorSex: 'male', counterpartScoped: true },
  'semen-in-mouth': { actorSex: 'male', counterpartScoped: true },
  swallowing: {
    kind: 'state',
    descriptionEn: 'Swallowing semen after it enters the mouth, rated separately as something you do and something a partner does.',
    descriptionEs: 'Tragar semen después de recibirlo en la boca, valorando por separado hacerlo tú y que lo haga tu pareja.',
  },
  'spitting-semen': {
    kind: 'state',
    descriptionEn: 'Spitting semen out after it enters the mouth, rated separately as something you do and something a partner does.',
    descriptionEs: 'Escupir el semen después de recibirlo en la boca, valorando por separado hacerlo tú y que lo haga tu pareja.',
  },
  'creampie-vaginal': { actorSex: 'male', anatomySex: 'female', counterpartScoped: true },
  'creampie-anal': { actorSex: 'male', counterpartScoped: true },
  'urine-drinking': {
    kind: 'state',
    descriptionEn: 'Drinking urine, rated separately as something you do and something a partner does.',
    descriptionEs: 'Beber orina, valorando por separado hacerlo tú y que lo haga tu pareja.',
  },
};

interface PracticeEntry {
  readonly targetCategoryId: string;
  readonly practice: CataloguePracticeSeed;
}

const BASE_CATEGORY_BY_ID = new Map(FIRST_PASS_CONTENT.map((category) => [category.id, category]));
const SECOND_PASS_RETIRED_SET = new Set<string>(SECOND_PASS_RETIRED_IDS);

const PRACTICES: readonly PracticeEntry[] = FIRST_PASS_CONTENT.flatMap((category) =>
  category.practices
    .filter((practice) => !SECOND_PASS_RETIRED_SET.has(practice.id))
    .map((practice) => ({
      targetCategoryId: PRACTICE_CATEGORY_OVERRIDES[practice.id] ?? category.id,
      practice: { ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) },
    })),
);

export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = CATEGORY_ORDER.map((categoryId, order) => {
  const base = BASE_CATEGORY_BY_ID.get(categoryId) ?? NEW_CATEGORIES[categoryId];
  if (!base) throw new Error(`Missing Catalogue V3 category definition: ${categoryId}`);
  const override = CATEGORY_OVERRIDES[categoryId] ?? {};
  return {
    ...base,
    ...override,
    id: categoryId,
    order,
    practices: PRACTICES
      .filter((entry) => entry.targetCategoryId === categoryId)
      .map((entry) => entry.practice),
  };
});
