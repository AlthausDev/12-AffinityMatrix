import { RoleApplicability, SelfProfileApplicabilityExclusion } from '../../../../domain/catalogue/practice';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const HETEROSEXUAL_MALE_EXCLUSION: readonly SelfProfileApplicabilityExclusion[] = [
  { sex: 'male', orientation: 'heterosexual' },
];
const HETEROSEXUAL_FEMALE_EXCLUSION: readonly SelfProfileApplicabilityExclusion[] = [
  { sex: 'female', orientation: 'heterosexual' },
];

export const FINAL_ROLE_POLISH_RETIRED_PRACTICE_IDS = new Set<string>([
  'genital-torture',
]);

const PUSSY_TORTURE: CataloguePracticeSeed = {
  id: 'pussy-torture',
  en: 'Pussy / vulva pain play',
  es: 'Pussy torture / dolor vulvar',
  kind: 'directed',
  counterpartScoped: true,
  anatomySex: 'female',
  descriptionEn: 'Intense pain-focused play directed specifically at the vulva or external female genitals, such as pressure, impact, pinching or controlled rough stimulation. It is separated from cock-and-ball torture because the anatomy and techniques differ.',
  descriptionEs: 'Juego intenso centrado específicamente en dolor sobre la vulva o genitales externos femeninos, por ejemplo mediante presión, impacto, pellizcos o estimulación brusca controlada. Se separa del cock and ball torture porque la anatomía y las técnicas son distintas.',
  roleLabels: {
    give: { en: 'Apply vulva pain play to my partner', es: 'Aplicar dolor vulvar a mi pareja' },
    receive: { en: 'Receive vulva pain play', es: 'Recibir dolor vulvar' },
  },
};

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  snowballing: {
    roleApplicability: {
      participate: { selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION },
    },
  },
  'creampie-cleanup': {
    descriptionEn: 'Cleaning semen from a partner after internal ejaculation, for example orally or manually. The two roles distinguish doing the cleanup from being the person whose body is cleaned.',
    descriptionEs: 'Limpiar semen de la pareja después de una eyaculación interna, por ejemplo de forma oral o manual. Los dos roles distinguen entre realizar la limpieza y ser la persona cuyo cuerpo se limpia.',
    roleLabels: {
      give: { en: 'Clean my partner after a creampie', es: 'Limpiar a mi pareja después de un creampie' },
      receive: { en: 'Be cleaned after a creampie', es: 'Que me limpien después de un creampie' },
    },
    roleApplicability: {
      receive: { selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION },
    },
  },
  'female-ejaculation': {
    kind: 'state',
    counterpartScoped: false,
    anatomySex: 'female',
    descriptionEn: 'Experiencing female ejaculation or squirting. The options distinguish experiencing it yourself from being interested in a female partner experiencing it.',
    descriptionEs: 'Experimentar eyaculación femenina o squirting. Las opciones distinguen entre experimentarlo tú y que lo experimente una pareja femenina.',
  },
  'squirting-on-partner': {
    kind: 'directed',
    counterpartScoped: true,
    anatomySex: undefined,
    actorSex: 'female',
    descriptionEn: 'Squirting directly onto a partner. This is separate from simply experiencing squirting because the fluid landing on the partner is part of the preference.',
    descriptionEs: 'Hacer squirting directamente sobre la pareja. Se separa de simplemente experimentar squirting porque que el fluido caiga sobre la pareja forma parte de la preferencia.',
    roleLabels: {
      give: { en: 'Squirt on my partner', es: 'Hacer squirting sobre mi pareja' },
      receive: { en: 'Have my partner squirt on me', es: 'Que mi pareja haga squirting sobre mí' },
    },
  },
  gangbang: {
    roleApplicability: {
      center: { selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION },
      participate: { selfProfileExclusions: HETEROSEXUAL_FEMALE_EXCLUSION },
    },
  },
  'double-vaginal-penetration': {
    requiresAnyParticipantSex: ['female'],
  },
  'double-ended-dildo': {
    kind: 'dual-use-toy',
    counterpartScoped: false,
    targetSites: undefined,
    descriptionEn: 'A double-ended dildo used either jointly by two partners, with each person using one end, or by one woman using both ends on herself at the same time. The shared-use option is available regardless of partner sex.',
    descriptionEs: 'Dildo de dos extremos que puede usarse conjuntamente entre dos personas, usando cada una un extremo, o por una mujer usando ambos extremos sobre sí misma al mismo tiempo. La opción de uso compartido puede tener sentido independientemente del sexo de la pareja.',
    roleLabels: {
      'use-together': { en: 'Use it together with my partner', es: 'Usarlo conjuntamente con mi pareja' },
      'use-on-self': { en: 'Use both ends on myself', es: 'Usar ambos extremos conmigo' },
    },
    roleApplicability: {
      'use-on-self': { selfSex: ['female'] },
    },
  },
  'vacuum-cup-toys': {
    toyRoles: ['use-on-self'],
    descriptionEn: 'Penetrative toys fixed to a stable surface with a suction base so they can be used hands-free. The suction mount is the point of the setup, so this entry is rated as self-use rather than a partner holding or using the toy.',
    descriptionEs: 'Juguetes penetrativos fijados a una superficie estable mediante una ventosa para poder usarlos sin sujetarlos con la mano. La fijación es precisamente la característica de esta práctica, por lo que se valora como uso propio y no como que la pareja sostenga o use el juguete.',
  },
  'cock-and-ball-torture': {
    counterpartScoped: true,
    anatomySex: 'male',
    descriptionEn: 'Intense pain-focused play directed specifically at the penis and testicles, using controlled pressure, impact, squeezing, stretching or similar stimulation. It is the male-genital counterpart to vulva-focused pain play.',
    descriptionEs: 'Juego intenso centrado específicamente en dolor sobre pene y testículos mediante presión, impacto, compresión, estiramiento u otros estímulos controlados. Es la variante sobre genitales masculinos frente al juego de dolor vulvar.',
  },
  'breast-torture': {
    en: 'Chest / breast pain play',
    es: 'Juego de dolor en el pecho',
    anatomySex: undefined,
    descriptionEn: 'Pain-focused play applied to the chest or breast tissue, such as squeezing, pressure or controlled impact. It can be relevant to people of any sex; intense nipple-specific play is rated separately.',
    descriptionEs: 'Juego de dolor aplicado al pecho o tejido mamario, por ejemplo mediante presión, compresión o impacto controlado. Puede ser relevante para personas de cualquier sexo; el juego intenso centrado específicamente en pezones se valora aparte.',
  },
};

const SURREAL_ROLE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'futanari-fantasy': pairedFantasy(
    'Have the fantasy anatomy', 'Tener esa anatomía fantástica',
    'Be with someone who has it', 'Estar con alguien que la tenga',
  ),
  'transformation-fantasy': pairedFantasy(
    'Be transformed', 'Ser transformado/a',
    'Be with someone transformed', 'Estar con alguien transformado/a',
  ),
  'size-change-fantasy': pairedFantasy(
    'Experience the size change', 'Experimentar el cambio de tamaño',
    'Be with someone whose size changes', 'Estar con alguien cuyo tamaño cambie',
  ),
  'extra-anatomy-fantasy': pairedFantasy(
    'Have the impossible / extra anatomy', 'Tener la anatomía imposible / adicional',
    'Be with someone who has it', 'Estar con alguien que la tenga',
  ),
  'furry-anthro-fantasy': pairedFantasy(
    'Be the anthropomorphic character', 'Ser el personaje antropomórfico',
    'Be with an anthropomorphic character', 'Estar con un personaje antropomórfico',
  ),
  'monster-roleplay': pairedFantasy(
    'Be the fictional creature / monster', 'Ser la criatura / monstruo ficticio',
    'Be with the fictional creature / monster', 'Estar con la criatura / monstruo ficticio',
  ),
  'alien-fantasy': pairedFantasy(
    'Be the alien / extraterrestrial character', 'Ser el personaje alienígena / extraterrestre',
    'Be with an alien / extraterrestrial character', 'Estar con un personaje alienígena / extraterrestre',
  ),
  'vore-fantasy': {
    kind: 'paired',
    counterpartScoped: false,
    pairedRoles: [
      { id: 'swallow', en: 'Swallow the other person', es: 'Tragar a la otra persona', perspective: 'active' },
      { id: 'be-swallowed', en: 'Be swallowed', es: 'Ser tragado/a', perspective: 'receptive' },
    ],
  },
  'tentacle-fantasy': {
    kind: 'paired',
    counterpartScoped: false,
    pairedRoles: [
      { id: 'watch-tentacles', en: 'Watch tentacles act on someone', es: 'Observar cómo los tentáculos actúan sobre alguien', perspective: 'active' },
      { id: 'tentacles-on-me', en: 'Have the tentacles act on me', es: 'Que los tentáculos actúen sobre mí', perspective: 'receptive' },
    ],
  },
};

const SHORT_CATEGORY_COPY: Readonly<Record<string, { readonly en: string; readonly es: string }>> = {
  'affection-intimacy': { en: 'Affection, closeness, kissing, cuddling and intimate contact.', es: 'Afecto, cercanía, besos, mimos y contacto íntimo.' },
  'sexual-style': { en: 'Overall pace, mood and style of a sexual encounter.', es: 'Ritmo, ambiente y estilo general del encuentro sexual.' },
  'clothing-appearance': { en: 'Clothing, materials, presentation and degrees of nudity.', es: 'Ropa, materiales, presentación y grados de desnudez.' },
  'manual-masturbation': { en: 'Solo masturbation and stimulation with hands or fingers.', es: 'Masturbación y estimulación con manos o dedos.' },
  oral: { en: 'Oral and mouth-focused sexual practices.', es: 'Prácticas sexuales orales y centradas en la boca.' },
  penetration: { en: 'Types, depth, pace and combinations of penetration.', es: 'Tipos, profundidad, ritmo y combinaciones de penetración.' },
  'sexual-positions': { en: 'Body positions used during sexual activity.', es: 'Posturas corporales durante la actividad sexual.' },
  toys: { en: 'Sex toys, accessories and meaningful ways of using them.', es: 'Juguetes, accesorios y formas relevantes de utilizarlos.' },
  'orgasm-control': { en: 'Orgasm, edging, denial, timing and partner control.', es: 'Orgasmo, edging, negación, momento y control por la pareja.' },
  'body-fetishes': { en: 'Body parts, physical traits, sizes and visual preferences.', es: 'Partes del cuerpo, rasgos físicos, tamaños y preferencias visuales.' },
  groups: { en: 'Threesomes, groups, swapping and multi-partner dynamics.', es: 'Tríos, grupos, intercambio y dinámicas con varias personas.' },
  roleplay: { en: 'Adult characters, roles and scene-based fantasies.', es: 'Personajes adultos, roles y fantasías basadas en escenas.' },
  exhibitionism: { en: 'Watching, being watched, recording and exposure.', es: 'Mirar, ser visto/a, grabación y exposición.' },
  'places-settings': { en: 'Places and environments where sexual activity happens.', es: 'Lugares y entornos donde ocurre la actividad sexual.' },
  power: { en: 'Dominance, submission, authority and service dynamics.', es: 'Dominación, sumisión, autoridad y dinámicas de servicio.' },
  restraint: { en: 'Bondage, immobilization and physical restriction.', es: 'Bondage, inmovilización y restricción física.' },
  psychological: { en: 'Psychological control, humiliation, praise and mind-focused play.', es: 'Control psicológico, humillación, elogio y juego mental.' },
  sensation: { en: 'Impact, temperature, texture and other physical sensations.', es: 'Impacto, temperatura, texturas y otras sensaciones físicas.' },
  fluids: { en: 'Saliva, sexual fluids and other bodily-fluid or messy play.', es: 'Saliva, fluidos sexuales y otros juegos corporales o pringosos.' },
  'taboo-fantasies': { en: 'Adult roleplay built around taboo or transgressive premises.', es: 'Roleplay adulto basado en premisas tabú o transgresoras.' },
  surrealism: { en: 'Impossible bodies, creatures, transformations and fictional scenarios.', es: 'Cuerpos imposibles, criaturas, transformaciones y escenarios ficticios.' },
  edge: { en: 'Higher-intensity practices requiring clearer limits and extra care.', es: 'Prácticas de mayor intensidad que exigen límites claros y especial cuidado.' },
};

export function applyFinalRolePolish(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    let practices = category.practices
      .filter((practice) => !FINAL_ROLE_POLISH_RETIRED_PRACTICE_IDS.has(practice.id))
      .map((practice) => applyPracticeOverride(practice));

    if (category.id === 'edge') practices = [...practices, PUSSY_TORTURE];
    return { ...category, practices };
  });
}

export function applyConciseCategoryCopy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const copy = SHORT_CATEGORY_COPY[category.id];
    return copy ? { ...category, descriptionEn: copy.en, descriptionEs: copy.es } : category;
  });
}

function applyPracticeOverride(practice: CataloguePracticeSeed): CataloguePracticeSeed {
  const override = {
    ...(PRACTICE_OVERRIDES[practice.id] ?? {}),
    ...(SURREAL_ROLE_OVERRIDES[practice.id] ?? {}),
  };
  const merged = { ...practice, ...override } as CataloguePracticeSeed;

  const roleApplicability = mergeRoleApplicabilityMaps(
    practice.roleApplicability,
    override.roleApplicability,
  );
  return roleApplicability ? { ...merged, roleApplicability } : merged;
}

function pairedFantasy(
  selfEn: string,
  selfEs: string,
  partnerEn: string,
  partnerEs: string,
): Partial<CataloguePracticeSeed> {
  return {
    kind: 'paired',
    counterpartScoped: false,
    pairedRoles: [
      { id: 'be-role', en: selfEn, es: selfEs, perspective: 'neutral' },
      { id: 'be-with-role', en: partnerEn, es: partnerEs, perspective: 'neutral' },
    ],
  };
}

function mergeRoleApplicabilityMaps(
  base?: Readonly<Record<string, RoleApplicability | undefined>>,
  override?: Readonly<Record<string, RoleApplicability | undefined>>,
): Readonly<Record<string, RoleApplicability | undefined>> | undefined {
  if (!base && !override) return undefined;
  const result: Record<string, RoleApplicability | undefined> = { ...(base ?? {}) };
  for (const [roleId, applicability] of Object.entries(override ?? {})) {
    if (!applicability) continue;
    const current = result[roleId];
    result[roleId] = {
      ...(current ?? {}),
      ...applicability,
      ...(current?.selfProfileExclusions || applicability.selfProfileExclusions
        ? {
            selfProfileExclusions: [
              ...(current?.selfProfileExclusions ?? []),
              ...(applicability.selfProfileExclusions ?? []),
            ],
          }
        : {}),
    };
  }
  return result;
}
