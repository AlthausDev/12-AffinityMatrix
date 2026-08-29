import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_NOISE_RETIRED_PRACTICE_IDS = new Set<string>([
  'energetic-sex',
]);

const ORAL_POSITION_IDS = [
  'oral-kneeling-standing-position',
  'oral-lying-between-legs-position',
  'oral-side-lying-position',
  'oral-edge-position',
] as const;

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'guided-touch': {
    en: "Guiding a partner's hand",
    es: 'Guiar la mano de la pareja',
    kind: 'paired',
    counterpartScoped: true,
    descriptionEn: 'One person physically guides the other person’s hand to show where or how they want to be touched.',
    descriptionEs: 'Una persona guía físicamente la mano de la otra para indicar dónde o cómo quiere que la toque.',
    pairedRoles: [
      { id: 'guide', en: "Guide my partner's hand", es: 'Guiar la mano de mi pareja', perspective: 'receptive' },
      { id: 'be-guided', en: 'Have my hand guided by my partner', es: 'Dejar que mi pareja guíe mi mano', perspective: 'active' },
    ],
  },
  'semen-cleanup-manual': directedSelf(
    'Manually clean semen from my partner', 'Limpiar manualmente semen de mi pareja',
    'Have my partner manually clean semen from me', 'Que mi pareja limpie manualmente semen de mi cuerpo',
    'Manually clean semen from my own body', 'Limpiar manualmente semen de mi propio cuerpo',
    'Cleaning semen with the hands, whether from a partner or from your own body.',
    'Limpiar semen con las manos, ya sea del cuerpo de la pareja o del propio.',
  ),
  'semen-cleanup-oral-external': directedSelf(
    'Orally clean external semen from my partner', 'Limpiar oralmente semen exterior de mi pareja',
    'Have my partner orally clean external semen from me', 'Que mi pareja limpie oralmente semen exterior de mi cuerpo',
    'Orally clean semen from my own body / bring it to my mouth', 'Limpiar oralmente semen de mi propio cuerpo o acercarlo a mi boca',
    'Using the mouth or tongue to clean semen after external ejaculation, including from your own reachable body area.',
    'Usar la boca o la lengua para limpiar semen tras una eyaculación exterior, incluida una zona accesible del propio cuerpo.',
  ),
  'semen-cleanup-other': directedSelf(
    'Erotically clean semen from my partner in another way', 'Limpiar eróticamente semen de mi pareja de otra forma',
    'Have my partner clean semen from me in another erotic way', 'Que mi pareja limpie semen de mi cuerpo de otra forma erótica',
    'Use another erotic cleanup on semen on my own body', 'Usar otra forma de limpieza erótica con semen de mi propio cuerpo',
    'Another clearly different erotic way of cleaning semen when manual or oral cleanup does not describe it well.',
    'Otra forma erótica claramente distinta de limpiar semen cuando la manual o la oral no la describen bien.',
  ),
  'pussy-torture': {
    en: 'Pussy torture',
    es: 'Pussy torture',
    descriptionEn: 'High-intensity pain play focused on the vulva and external female genitals, separate from internal vaginal torture.',
    descriptionEs: 'Juego de dolor intenso centrado en la vulva y los genitales externos femeninos, separado de la tortura vaginal interna.',
    roleLabels: {
      give: { en: 'Apply pussy torture to my partner', es: 'Aplicar pussy torture a mi pareja' },
      receive: { en: 'Receive pussy torture', es: 'Recibir pussy torture' },
    },
  },
  'vaginal-torture': {
    en: 'Vaginal torture',
    es: 'Vaginal torture',
    descriptionEn: 'High-intensity pain or pressure play focused on the internal vaginal canal rather than the external vulva.',
    descriptionEs: 'Juego intenso de dolor o presión centrado en el canal vaginal interno y no en la vulva externa.',
    roleLabels: {
      give: { en: 'Apply vaginal torture to my partner', es: 'Aplicar vaginal torture a mi pareja' },
      receive: { en: 'Receive vaginal torture', es: 'Recibir vaginal torture' },
    },
  },
  clothespins: {
    en: 'Clothespins on nipples / skin',
    es: 'Pinzas de tender en pezones / piel',
    descriptionEn: 'Using ordinary clothespins to create pinching pressure on nipples or other small folds of skin, distinct from purpose-made nipple clamps.',
    descriptionEs: 'Usar pinzas de tender para crear presión de pellizco en pezones u otros pliegues pequeños de piel, distinto de las pinzas de pezón diseñadas para ello.',
    roleLabels: {
      give: { en: 'Put clothespins on my partner', es: 'Poner pinzas de tender a mi pareja' },
      receive: { en: 'Have clothespins put on me', es: 'Que mi pareja me ponga pinzas de tender' },
    },
  },
  'everyday-object-play': {
    en: 'External play with everyday objects',
    es: 'Juego externo con objetos cotidianos',
    descriptionEn: 'Using an ordinary, non-sex-toy object for external erotic touch, pressure, texture or playful sensation; penetration is asked separately.',
    descriptionEs: 'Usar un objeto cotidiano no diseñado como juguete sexual para contacto, presión, textura o sensación externa; la penetración se pregunta aparte.',
    roleLabels: {
      give: { en: 'Use an everyday object externally with my partner', es: 'Usar externamente un objeto cotidiano con mi pareja' },
      receive: { en: 'Have my partner use an everyday object externally on me', es: 'Que mi pareja use externamente un objeto cotidiano conmigo' },
      self: { en: 'Use an everyday object externally on myself', es: 'Usar externamente un objeto cotidiano conmigo' },
    },
  },
  'food-body-play': {
    descriptionEn: 'Using food on the body for sensual texture or messiness, for example chocolate, cream, honey or fruit, without making penetration the focus.',
    descriptionEs: 'Usar alimentos sobre el cuerpo por su textura o para ensuciarse, por ejemplo chocolate, nata, miel o fruta, sin que la penetración sea el foco.',
  },
  'erotic-feeding': {
    descriptionEn: 'Feeding a partner or being fed as part of the erotic interaction, for example fruit, chocolate or another small bite where the act of feeding matters.',
    descriptionEs: 'Dar de comer a la pareja o recibir comida como parte de la interacción erótica, por ejemplo fruta, chocolate u otro bocado donde importa el gesto de alimentar.',
  },
  'adult-taboo-fantasy': {
    en: 'General transgressive fantasy',
    es: 'Fantasía transgresora general',
  },
  'family-role-taboo-fantasy': {
    en: 'Incest fantasy',
    es: 'Fantasía de incesto',
    descriptionEn: 'A fictional incest-themed roleplay between adults. The family relationship belongs to the imagined characters and does not require a real family relationship.',
    descriptionEs: 'Roleplay ficticio de temática incestuosa entre adultos. La relación familiar pertenece a los personajes imaginados y no requiere una relación familiar real.',
  },
  'religious-taboo-fantasy': {
    en: 'Religious / sacrilegious fantasy',
    es: 'Fantasía religiosa / sacrílega',
  },
};

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  'sexual-positions': [
    directed(
      ORAL_POSITION_IDS[0],
      'Kneeling / standing oral position',
      'Postura oral de rodillas / de pie',
      'One person stands while the other kneels to give oral stimulation.',
      'Una persona permanece de pie mientras la otra se arrodilla para dar estimulación oral.',
      'Give oral stimulation while kneeling', 'Dar sexo oral de rodillas',
      'Receive oral stimulation while standing', 'Recibir sexo oral de pie',
    ),
    directed(
      ORAL_POSITION_IDS[1],
      'Lying oral position',
      'Postura oral tumbado/a',
      'The receiving person lies down while the giving partner positions between or beside their legs.',
      'La persona que recibe permanece tumbada mientras quien da se coloca entre sus piernas o junto a ellas.',
      'Give oral stimulation to my lying partner', 'Dar sexo oral a mi pareja tumbada',
      'Receive oral stimulation while lying down', 'Recibir sexo oral estando tumbado/a',
    ),
    directed(
      ORAL_POSITION_IDS[2],
      'Side-lying oral position',
      'Postura oral de lado',
      'Oral stimulation with one or both people lying on their side, making the sideways body arrangement part of the preference.',
      'Estimulación oral con una o ambas personas tumbadas de lado, haciendo de esa colocación lateral parte de la preferencia.',
      'Give oral stimulation in a side-lying position', 'Dar sexo oral en postura lateral',
      'Receive oral stimulation in a side-lying position', 'Recibir sexo oral en postura lateral',
    ),
    directed(
      ORAL_POSITION_IDS[3],
      'Oral at the edge of a bed / sofa',
      'Sexo oral al borde de cama / sofá',
      'The receiving person is positioned at the edge of a bed or sofa while the other partner gives oral stimulation from below or in front.',
      'La persona que recibe se coloca al borde de una cama o sofá mientras la otra da sexo oral desde delante o desde una posición más baja.',
      'Give oral stimulation at the edge', 'Dar sexo oral al borde de cama o sofá',
      'Receive oral stimulation at the edge', 'Recibir sexo oral al borde de cama o sofá',
    ),
  ],
  fluids: [
    {
      id: 'sexual-fluids-in-food-drink',
      en: 'Sexual fluids in food / drink',
      es: 'Fluidos sexuales en comida / bebida',
      kind: 'directed-self',
      counterpartScoped: true,
      descriptionEn: 'Erotic interest in adding sexual fluids to food or drink for consumption, distinguishing your fluids, a partner’s fluids and your own consumption.',
      descriptionEs: 'Interés erótico en añadir fluidos sexuales a comida o bebida para consumirlos, diferenciando los propios, los de la pareja y el consumo propio.',
      roleLabels: {
        give: { en: 'Add my sexual fluids to food/drink for my partner', es: 'Añadir mis fluidos sexuales a comida/bebida para mi pareja' },
        receive: { en: "Consume food/drink with my partner's sexual fluids", es: 'Consumir comida/bebida con fluidos sexuales de mi pareja' },
        self: { en: 'Consume food/drink with my own sexual fluids', es: 'Consumir comida/bebida con mis propios fluidos sexuales' },
      },
    },
  ],
};

export function applyFinalNoiseCleanup(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  const bodyCategory = content.find((category) => category.id === 'body-fetishes');
  const bodyOrder = bodyCategory?.order;

  return content.map((category) => {
    const practices = category.practices
      .filter((practice) => !FINAL_NOISE_RETIRED_PRACTICE_IDS.has(practice.id))
      .map((practice) => ({ ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) }));
    const existing = new Set(practices.map((practice) => practice.id));
    const withAdditions = [
      ...practices,
      ...(ADDITIONS[category.id] ?? []).filter((practice) => !existing.has(practice.id)),
    ];

    return {
      ...category,
      ...(bodyOrder !== undefined
        ? category.id === 'body-fetishes'
          ? { order: 0 }
          : category.order < bodyOrder
            ? { order: category.order + 1 }
            : {}
        : {}),
      practices: orderPractices(category.id, withAdditions),
    };
  });
}

function orderPractices(
  categoryId: string,
  practices: readonly CataloguePracticeSeed[],
): readonly CataloguePracticeSeed[] {
  if (categoryId === 'sexual-positions') {
    return moveAfter(practices, 'face-sitting', ORAL_POSITION_IDS);
  }
  if (categoryId === 'fluids') {
    return moveAfter(practices, 'food-from-body', ['sexual-fluids-in-food-drink']);
  }
  if (categoryId === 'edge') {
    const order = [
      'pussy-torture',
      'vaginal-torture',
      'cock-and-ball-torture',
      'urethral-torture',
      'breast-torture',
      'nipple-torture',
    ];
    const index = new Map(order.map((id, position) => [id, position]));
    const selected = practices.filter((practice) => index.has(practice.id))
      .sort((left, right) => (index.get(left.id) ?? 0) - (index.get(right.id) ?? 0));
    const selectedIds = new Set(selected.map((practice) => practice.id));
    const firstIndex = practices.findIndex((practice) => selectedIds.has(practice.id));
    if (firstIndex < 0) return practices;
    const remaining = practices.filter((practice) => !selectedIds.has(practice.id));
    return [...remaining.slice(0, firstIndex), ...selected, ...remaining.slice(firstIndex)];
  }
  return practices;
}

function moveAfter(
  practices: readonly CataloguePracticeSeed[],
  anchorId: string,
  movedIds: readonly string[],
): readonly CataloguePracticeSeed[] {
  const movedSet = new Set(movedIds);
  const moved = movedIds
    .map((id) => practices.find((practice) => practice.id === id))
    .filter((practice): practice is CataloguePracticeSeed => Boolean(practice));
  const remaining = practices.filter((practice) => !movedSet.has(practice.id));
  const anchorIndex = remaining.findIndex((practice) => practice.id === anchorId);
  if (anchorIndex < 0) return [...remaining, ...moved];
  return [...remaining.slice(0, anchorIndex + 1), ...moved, ...remaining.slice(anchorIndex + 1)];
}

function directed(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
): CataloguePracticeSeed {
  return {
    id,
    en,
    es,
    descriptionEn,
    descriptionEs,
    kind: 'directed',
    counterpartScoped: true,
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
    },
  };
}

function directedSelf(
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
  selfEn: string,
  selfEs: string,
  descriptionEn: string,
  descriptionEs: string,
): Partial<CataloguePracticeSeed> {
  return {
    kind: 'directed-self',
    counterpartScoped: true,
    descriptionEn,
    descriptionEs,
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
      self: { en: selfEn, es: selfEs },
    },
  };
}
