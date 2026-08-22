import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_RELEASE_RETIRED_PRACTICE_IDS = new Set<string>([
  'pet-play',
]);

const MOVED_TO_TABOO = new Set<string>([
  'adult-taboo-fantasy',
  'caregiver-little-adult-roleplay',
  'consensual-non-consent-roleplay',
  'sleep-roleplay',
]);

const MOVED_TO_SURREALISM = new Set<string>([
  'surreal-fantasy-roleplay',
  'monster-roleplay',
]);

const paired = (
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  leftId: string,
  leftEn: string,
  leftEs: string,
  rightId: string,
  rightEn: string,
  rightEs: string,
): CataloguePracticeSeed => ({
  id,
  en,
  es,
  kind: 'paired',
  counterpartScoped: true,
  descriptionEn,
  descriptionEs,
  pairedRoles: [
    { id: leftId, en: leftEn, es: leftEs, perspective: 'active' },
    { id: rightId, en: rightEn, es: rightEs, perspective: 'receptive' },
  ],
});

const TABOO_ADDITIONS: readonly CataloguePracticeSeed[] = [
  {
    id: 'family-role-taboo-fantasy',
    en: 'Family-role taboo fantasy (adults)',
    es: 'Fantasía tabú de roles familiares (adultos)',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fictional adult-only roleplay whose taboo comes from pretending the characters have a family relationship. It refers to roleplay between adults, not to minors and not to requiring a real family relationship.',
    descriptionEs: 'Roleplay ficticio exclusivamente entre adultos cuyo componente tabú consiste en fingir que los personajes tienen una relación familiar. Se refiere a roles interpretados por adultos, no a menores ni a que exista una relación familiar real.',
  },
  paired(
    'adult-ageplay-roleplay',
    'Ageplay (adult roleplay)',
    'Ageplay (roleplay adulto)',
    'Adult-only roleplay in which one or both adults portray a different age or a deliberately younger/older persona. The age is part of the fictional role; every real participant is an adult.',
    'Roleplay exclusivamente entre adultos en el que una o ambas personas interpretan una edad distinta o una personalidad deliberadamente más joven o mayor. La edad forma parte del personaje ficticio; todas las personas reales participantes son adultas.',
    'older-role',
    'Older / authority-flavoured role',
    'Rol mayor / con autoridad',
    'younger-role',
    'Younger-presenting adult role',
    'Rol adulto que interpreta menor edad',
  ),
  {
    id: 'cheating-fantasy',
    en: 'Cheating / infidelity fantasy',
    es: 'Fantasía de infidelidad',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fictional or pre-agreed scenario built around the idea of cheating, secrecy or forbidden infidelity. The fantasy is the deception theme itself; it does not imply actually deceiving a partner.',
    descriptionEs: 'Escenario ficticio o previamente acordado centrado en la idea de engaño, secreto o infidelidad prohibida. Lo que se valora es la fantasía de la transgresión; no implica engañar realmente a la pareja.',
  },
  paired(
    'death-corpse-roleplay',
    'Death / corpse fantasy (roleplay)',
    'Fantasía de muerte / cadáver (roleplay)',
    'A fictional adult roleplay in which one adult portrays a dead, lifeless or corpse-like role and another interacts with that role. It is a simulated fantasy and does not involve a real deceased person.',
    'Roleplay ficticio entre adultos en el que una persona interpreta estar muerta, inerte o como un cadáver y otra interactúa con ese papel. Es una simulación y no implica a ninguna persona realmente fallecida.',
    'living-role',
    'Living / active role',
    'Rol vivo / activo',
    'corpse-role',
    'Lifeless / corpse role',
    'Rol inerte / cadáver',
  ),
  {
    id: 'extremist-war-symbolism-fantasy',
    en: 'Extremist / war symbolism fantasy',
    es: 'Fantasía con simbología extremista / bélica',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A taboo fantasy that uses authoritarian, extremist, Nazi or wartime uniforms, symbols or aesthetics as fictional scene material. Interest in the taboo imagery does not imply support for the ideology represented.',
    descriptionEs: 'Fantasía tabú que utiliza uniformes, símbolos o estética autoritaria, extremista, nazi o bélica como material ficticio de una escena. El interés por esa simbología tabú no implica apoyar la ideología representada.',
  },
  paired(
    'free-use-unaware-roleplay',
    'Free-use / unaware fantasy (pre-agreed)',
    'Fantasía free-use / unaware (preacordada)',
    'A pre-agreed adult fantasy in which one person plays being sexually available on demand or not fully aware of when an encounter will begin. The apparent lack of permission is part of the roleplay; real boundaries and consent are agreed in advance.',
    'Fantasía adulta previamente acordada en la que una persona interpreta estar sexualmente disponible a demanda o no saber exactamente cuándo comenzará un encuentro. La aparente ausencia de permiso forma parte del roleplay; los límites y el consentimiento reales se acuerdan de antemano.',
    'initiating-role',
    'Initiating / using role',
    'Rol iniciador / que usa',
    'available-role',
    'Available / unaware role',
    'Rol disponible / unaware',
  ),
  {
    id: 'religious-taboo-fantasy',
    en: 'Religious / sacrilegious taboo fantasy',
    es: 'Fantasía tabú religiosa / sacrílega',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fictional sexual fantasy that deliberately uses religious roles, ritual imagery, sacred/prohibited symbolism or sacrilegious framing because the transgressive contrast is part of the appeal.',
    descriptionEs: 'Fantasía sexual ficticia que utiliza deliberadamente roles religiosos, imaginería ritual, símbolos sagrados o prohibidos o un tono sacrílego porque el contraste transgresor forma parte del atractivo.',
  },
  paired(
    'public-use-fantasy',
    'Public-use fantasy (controlled simulation)',
    'Fantasía de uso público (simulación controlada)',
    'A fantasy of being treated as sexually available to others in a public-like situation, simulated with adult participants in a private or controlled environment so uninvolved bystanders are not made part of the scene.',
    'Fantasía de ser tratado/a como sexualmente disponible para otras personas en una situación que parece pública, simulada con participantes adultos en un entorno privado o controlado para no implicar a terceros ajenos.',
    'use-role',
    'Using / directing role',
    'Rol que usa / dirige',
    'public-use-role',
    'Public-use / available role',
    'Rol de uso público / disponible',
  ),
];

const SURREALISM_ADDITIONS: readonly CataloguePracticeSeed[] = [
  {
    id: 'tentacle-fantasy',
    en: 'Tentacle fantasy',
    es: 'Fantasía con tentáculos',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fictional sexual fantasy involving tentacles or tentacle-like appendages as part of an impossible or creature-based scene.',
    descriptionEs: 'Fantasía sexual ficticia en la que tentáculos o apéndices similares forman parte de una escena imposible o inspirada en criaturas.',
  },
  {
    id: 'furry-anthro-fantasy',
    en: 'Furry / anthropomorphic fantasy',
    es: 'Fantasía furry / antropomórfica',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fantasy involving adult fictional anthropomorphic characters with human-like minds and animal-inspired features. It refers to fictional characters, not sexual activity with real animals.',
    descriptionEs: 'Fantasía con personajes ficticios adultos antropomórficos, de mente humana y rasgos inspirados en animales. Se refiere a personajes ficticios, no a actividad sexual con animales reales.',
  },
  {
    id: 'transformation-fantasy',
    en: 'Transformation fantasy',
    es: 'Fantasía de transformación',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fantasy where a person changes body, species, form, sex characteristics, material or identity through impossible, magical, technological or dreamlike means.',
    descriptionEs: 'Fantasía en la que una persona cambia de cuerpo, especie, forma, características sexuales, material o identidad mediante medios imposibles, mágicos, tecnológicos u oníricos.',
  },
  {
    id: 'futanari-fantasy',
    en: 'Futanari / mixed fantasy anatomy',
    es: 'Futanari / anatomía fantástica combinada',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A stylized fictional fantasy involving adult characters with combinations of sexual anatomy commonly associated with futanari or similar fantasy art. It is a fantasy category and is not intended as a label for real intersex people.',
    descriptionEs: 'Fantasía ficticia estilizada con personajes adultos que presentan combinaciones de anatomía sexual asociadas habitualmente al futanari o a estilos similares de fantasía. Es una categoría de ficción y no pretende etiquetar a personas intersexuales reales.',
  },
  {
    id: 'alien-fantasy',
    en: 'Alien fantasy',
    es: 'Fantasía alienígena',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A sexual fantasy involving fictional extraterrestrial beings, alien anatomy, abduction-style science-fiction scenarios or other explicitly non-human science-fiction elements.',
    descriptionEs: 'Fantasía sexual con seres extraterrestres ficticios, anatomía alienígena, escenarios de ciencia ficción tipo abducción u otros elementos claramente no humanos.',
  },
  {
    id: 'size-change-fantasy',
    en: 'Size-change / giant-tiny fantasy',
    es: 'Fantasía de cambio de tamaño / gigante-miniatura',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'An impossible fantasy in which one or more people become dramatically larger or smaller, making the size difference itself central to the scene.',
    descriptionEs: 'Fantasía imposible en la que una o varias personas se vuelven enormemente más grandes o pequeñas, siendo la diferencia de escala una parte central de la escena.',
  },
  {
    id: 'extra-anatomy-fantasy',
    en: 'Extra / impossible anatomy fantasy',
    es: 'Fantasía de anatomía extra / imposible',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A fantasy involving impossible anatomy such as additional limbs, genitals, mouths, tails or other body structures that a real human body does not normally have.',
    descriptionEs: 'Fantasía con anatomía imposible, como extremidades, genitales, bocas, colas u otras estructuras corporales adicionales que un cuerpo humano real no posee normalmente.',
  },
  {
    id: 'vore-fantasy',
    en: 'Vore / swallowing fantasy',
    es: 'Fantasía vore / de ser tragado',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'An explicitly fictional fantasy about swallowing or being swallowed whole, usually involving impossible creatures, scale or anatomy. It is treated as surreal fantasy rather than a real-world act.',
    descriptionEs: 'Fantasía explícitamente ficticia sobre tragar o ser tragado/a entero/a, normalmente con criaturas, escalas o anatomías imposibles. Se trata como fantasía surrealista y no como una práctica realizable en el mundo real.',
  },
];

const PET_PLAY_ADDITIONS: readonly CataloguePracticeSeed[] = [
  paired(
    'pet-play-soft',
    'Pet play (soft)',
    'Pet play suave',
    'A playful pet/handler dynamic focused on affection, animal-inspired mannerisms and light roleplay: for example ears or a tail, pet names, being petted, a collar, simple commands or playful crawling. It does not require strict training or strong power exchange.',
    'Dinámica juguetona mascota/guía centrada en afecto, gestos inspirados en animales y roleplay ligero: por ejemplo orejas o cola, nombres de mascota, caricias, collar, órdenes sencillas o gatear de forma lúdica. No exige entrenamiento estricto ni un intercambio de poder intenso.',
    'handler',
    'Handler / owner role',
    'Guía / dueño/a',
    'pet',
    'Pet role',
    'Rol de mascota',
  ),
  paired(
    'pet-play-intense',
    'Pet play (immersive / intense)',
    'Pet play inmersivo / intenso',
    'A more immersive pet/handler dynamic in which the pet role may be treated much more like a domestic animal: collar and leash, walking on all fours or being walked, eating or drinking from a bowl, stricter commands, training, kennel/cage themes, discipline, or nudity when desired. Public-looking elements should be kept private or controlled rather than involving uninvolved bystanders.',
    'Dinámica mascota/guía más inmersiva en la que el rol de mascota puede ser tratado de forma mucho más parecida a un animal doméstico: collar y correa, desplazarse a cuatro patas o salir de paseo, comer o beber de un cuenco, órdenes más estrictas, entrenamiento, jaula/kennel, disciplina o desnudez si se desea. Los elementos que parezcan públicos deben mantenerse en entornos privados o controlados sin implicar a terceros ajenos.',
    'handler',
    'Handler / owner role',
    'Guía / dueño/a',
    'pet',
    'Pet role',
    'Rol de mascota',
  ),
];

const TABOO_CATEGORY: Omit<CatalogueCategorySeed, 'order' | 'practices'> = {
  id: 'taboo-fantasies',
  en: 'Taboo fantasies',
  es: 'Fantasías tabú',
  descriptionEn: 'Adult fantasies whose appeal comes partly from a forbidden, transgressive or socially taboo premise. Entries that would be unacceptable without consent or impossible to perform ethically are framed as pre-agreed roleplay or controlled simulation between adults.',
  descriptionEs: 'Fantasías adultas cuyo atractivo procede en parte de una premisa prohibida, transgresora o socialmente tabú. Las entradas que serían inaceptables sin consentimiento o no podrían realizarse éticamente se plantean como roleplay previamente acordado o simulación controlada entre adultos.',
};

const SURREALISM_CATEGORY: Omit<CatalogueCategorySeed, 'order' | 'practices'> = {
  id: 'surrealism',
  en: 'Surrealism & impossible fantasies',
  es: 'Surrealismo y fantasías imposibles',
  descriptionEn: 'Fictional sexual fantasies built around impossible bodies, creatures, transformations, altered scale or other elements that cannot literally exist. These entries describe imagination and fictional scenarios, not real non-human beings.',
  descriptionEs: 'Fantasías sexuales ficticias basadas en cuerpos imposibles, criaturas, transformaciones, cambios de escala u otros elementos que no pueden existir literalmente. Estas entradas describen imaginación y escenarios ficticios, no seres no humanos reales.',
};

function movedPractice(
  sourceById: ReadonlyMap<string, CataloguePracticeSeed>,
  id: string,
): CataloguePracticeSeed {
  const practice = sourceById.get(id);
  if (!practice) throw new Error(`Missing final Catalogue V3 practice while moving taxonomy: ${id}`);
  return practice;
}

export function applyFinalReleaseTaxonomy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  const sourceById = new Map(
    content.flatMap((category) => category.practices.map((practice) => [practice.id, practice] as const)),
  );

  const movedIds = new Set<string>([
    ...MOVED_TO_TABOO,
    ...MOVED_TO_SURREALISM,
    ...FINAL_RELEASE_RETIRED_PRACTICE_IDS,
  ]);

  const cleaned = content.map((category) => ({
    ...category,
    practices: category.practices.filter((practice) => !movedIds.has(practice.id)),
  }));

  const roleplay = cleaned.find((category) => category.id === 'roleplay');
  if (!roleplay) throw new Error('Missing roleplay category while applying final Catalogue V3 taxonomy');
  const roleplayWithPetPlay: CatalogueCategorySeed = {
    ...roleplay,
    descriptionEn: 'Adult characters, occupations, archetypes and scene-based roleplay. Taboo premises and impossible/surreal fantasies have their own categories near the end of the questionnaire.',
    descriptionEs: 'Personajes adultos, profesiones, arquetipos y roleplay basado en escenas. Las premisas tabú y las fantasías imposibles o surrealistas tienen categorías propias hacia el final del cuestionario.',
    practices: [...roleplay.practices, ...PET_PLAY_ADDITIONS],
  };

  const withoutRoleplay = cleaned.map((category) =>
    category.id === 'roleplay' ? roleplayWithPetPlay : category,
  );

  const tabooPractices = [
    ...[...MOVED_TO_TABOO].map((id) => movedPractice(sourceById, id)),
    ...TABOO_ADDITIONS,
  ];
  const surrealismPractices = [
    ...[...MOVED_TO_SURREALISM].map((id) => movedPractice(sourceById, id)),
    ...SURREALISM_ADDITIONS,
  ];

  const edgeIndex = withoutRoleplay.findIndex((category) => category.id === 'edge');
  if (edgeIndex < 0) throw new Error('Missing edge category while applying final Catalogue V3 taxonomy');

  const expanded: CatalogueCategorySeed[] = [
    ...withoutRoleplay.slice(0, edgeIndex),
    { ...TABOO_CATEGORY, order: 0, practices: tabooPractices },
    { ...SURREALISM_CATEGORY, order: 0, practices: surrealismPractices },
    ...withoutRoleplay.slice(edgeIndex),
  ];

  return expanded.map((category, order) => ({ ...category, order }));
}
