import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const RELEASE_COPY_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'adult-taboo-fantasy': {
    en: 'Taboo fantasy (general)',
    es: 'Fantasía tabú (general)',
    descriptionEn: 'General attraction to fictional scenarios whose appeal comes from feeling forbidden, improper or socially transgressive, with all real participants being adults. Use the more specific entries in this category when the exact taboo matters.',
    descriptionEs: 'Atracción general por escenarios ficticios cuyo atractivo procede de sentirse prohibidos, impropios o socialmente transgresores, siendo adultas todas las personas reales participantes. Si importa el tabú concreto, conviene valorar también las entradas específicas de esta categoría.',
  },
  'caregiver-little-adult-roleplay': {
    descriptionEn: 'An adult-only Caregiver/Little dynamic where one adult takes a caring, guiding or authority-flavoured Daddy/Mommy/Caregiver role and the other takes a Little role. “Little” always means a role portrayed by an adult. It can involve comfort, rules, praise or dependency themes, but it does not require pretending to be a different age; explicit age portrayal is rated separately under Ageplay.',
    descriptionEs: 'Dinámica Caregiver/Little exclusivamente entre adultos en la que una persona adopta un rol Daddy/Mommy/Caregiver de cuidado, guía o autoridad y la otra un rol Little. «Little» significa siempre un rol interpretado por una persona adulta. Puede incluir cuidados, reglas, elogios o dependencia, pero no exige fingir otra edad; representar explícitamente una edad distinta se valora aparte en Ageplay.',
  },
  'consensual-non-consent-roleplay': {
    en: 'Non-consent roleplay (CNC)',
    es: 'Roleplay de no consentimiento (CNC)',
    descriptionEn: 'A pre-agreed adult roleplay that simulates resistance, refusal or lack of consent within established limits. Unlike free-use/unaware fantasy, the central theme is simulated non-consent or resistance rather than ongoing availability or uncertainty about when play begins.',
    descriptionEs: 'Roleplay adulto previamente acordado que simula resistencia, negativa o falta de consentimiento dentro de límites establecidos. A diferencia de free-use/unaware, el tema central es simular no consentimiento o resistencia, no estar disponible de forma continuada ni desconocer cuándo empezará el juego.',
  },
  'sleep-roleplay': {
    en: 'Sleep / unconscious-role fantasy',
    es: 'Fantasía de sueño / rol inconsciente',
    descriptionEn: 'A pre-agreed adult roleplay where one person portrays being asleep, unconscious or unresponsive while the other takes the awake role. The sleeping state is part of the simulation; this entry does not mean initiating sexual activity with an actually unaware person outside the agreed scenario.',
    descriptionEs: 'Roleplay adulto previamente acordado en el que una persona interpreta estar dormida, inconsciente o sin responder y la otra adopta el rol despierto. El estado de sueño forma parte de la simulación; no significa iniciar actividad sexual con una persona realmente ajena a lo acordado.',
  },
  'surreal-fantasy-roleplay': {
    en: 'Surreal / impossible fantasy (general)',
    es: 'Fantasía surrealista / imposible (general)',
    descriptionEn: 'General attraction to sexual fantasy that deliberately breaks real-world biology or physics, including impossible anatomy and other unreal elements. Use the specific entries below when tentacles, transformation, altered anatomy, unusual scale or a particular fictional creature is what matters.',
    descriptionEs: 'Atracción general por fantasías sexuales que rompen deliberadamente la biología o la física del mundo real, incluidas anatomías imposibles y otros elementos irreales. Conviene usar las entradas específicas cuando lo importante sean tentáculos, transformación, anatomía alterada, cambios de escala o una criatura ficticia concreta.',
  },
  'monster-roleplay': {
    en: 'Monster / fictional creature fantasy',
    es: 'Fantasía de monstruos / criaturas ficticias',
    descriptionEn: 'A fantasy involving an adult fictional monster or distinctly non-human imaginary creature. It is more creature-like than furry/anthro fantasy and refers only to fictional beings, not sexual activity with real animals.',
    descriptionEs: 'Fantasía con un monstruo ficticio adulto o una criatura imaginaria claramente no humana. Es más propia de criaturas que la fantasía furry/antropomórfica y se refiere únicamente a seres ficticios, no a actividad sexual con animales reales.',
  },
};

export function applyFinalReleaseCopy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => ({
      ...practice,
      ...(RELEASE_COPY_OVERRIDES[practice.id] ?? {}),
    })),
  }));
}
