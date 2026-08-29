import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/** Final content decisions from the release walkthrough. */
export const CLOSING_PASS_RETIRED_PRACTICE_IDS = new Set<string>([
  'hotwife-dynamic',
  'service',
  'pleasure-focused-service',
  'furniture-restraint',
  'semen-cleanup-oral',
]);

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  voyeurism: {
    en: 'Open voyeurism',
    es: 'Voyeurismo abierto',
    descriptionEn: 'Watching a partner while they know they are being watched at that moment. Unannounced watching covered by a prior agreement is asked separately.',
    descriptionEs: 'Observar a la pareja mientras sabe que está siendo observada en ese momento. La observación sin aviso pero acordada previamente se pregunta aparte.',
  },
  'watching-partner-with-other': {
    descriptionEn: 'Watching or knowingly experiencing a partner having sex with someone else, without assuming humiliation or a cuckold/cuckquean role.',
    descriptionEs: 'Ver o saber que la pareja tiene sexo con otra persona, sin asumir humillación ni un rol cuckold/cuckquean.',
  },
  'sexual-service': {
    en: 'Sexual & pleasure service',
    es: 'Servicio sexual y de placer',
    descriptionEn: 'Sexual acts or stimulation deliberately framed as serving and prioritising the other person’s pleasure within the power dynamic.',
    descriptionEs: 'Actos sexuales o estimulación vividos deliberadamente como servicio, priorizando el placer de la otra persona dentro de la dinámica de poder.',
  },
  'stocks-restraint': {
    en: 'Stocks restraint',
    es: 'Cepo de inmovilización',
    descriptionEn: 'Rigid furniture that fixes wrists, ankles or sometimes the neck in set openings, making the fixed position itself part of the restraint.',
    descriptionEs: 'Estructura rígida que fija muñecas, tobillos o a veces el cuello en aberturas concretas, haciendo de la postura fija parte de la restricción.',
    roleLabels: directedRoles(
      'Secure my partner in stocks', 'Inmovilizar a mi pareja en un cepo',
      'Be secured in stocks', 'Ser inmovilizado/a en un cepo',
    ),
  },
  'cage-confinement': {
    descriptionEn: 'Confinement inside a cage where the enclosure itself creates the restricted space rather than one specific tie or cuff.',
    descriptionEs: 'Confinamiento dentro de una jaula donde el propio espacio cerrado crea la restricción, sin depender de una atadura concreta.',
    roleLabels: directedRoles(
      'Confine my partner in a cage', 'Confinar a mi pareja en una jaula',
      'Be confined in a cage', 'Ser confinado/a en una jaula',
    ),
  },
};

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  groups: [
    paired(
      'erotic-compersion',
      'Erotic compersion',
      'Compersión erótica',
      'Erotic pleasure or arousal from knowing that a partner is enjoying sexual contact with someone else. The focus is their enjoyment, not humiliation or watching the scene.',
      'Placer o excitación erótica al saber que la pareja disfruta sexualmente con otra persona. El foco está en su disfrute, no en la humillación ni en observar la escena.',
      'experience-compersion', 'Feel aroused by my partner enjoying someone else', 'Excitarme al saber que mi pareja disfruta con otra persona',
      'be-compersion-focus', 'Have my partner be aroused by me enjoying someone else', 'Que a mi pareja le excite saber que disfruto con otra persona',
    ),
  ],
  exhibitionism: [
    {
      id: 'preagreed-unannounced-watching',
      en: 'Pre-agreed unannounced watching',
      es: 'Observación sin aviso dentro de un acuerdo previo',
      kind: 'watch',
      counterpartScoped: true,
      descriptionEn: 'The observed person does not know when the watching will happen, but both people agreed beforehand that it may happen. It does not include spying on someone who never gave that permission.',
      descriptionEs: 'La persona observada no sabe cuándo ocurrirá, pero ambas lo acordaron previamente. No incluye espiar a alguien que nunca haya dado ese permiso.',
      roleLabels: {
        watch: { en: 'Watch my partner without warning them in that moment', es: 'Observar a mi pareja sin avisarla en ese momento' },
        'be-watched': { en: 'Have my partner watch me without warning me in that moment', es: 'Que mi pareja me observe sin avisarme en ese momento' },
      },
    },
  ],
  'places-settings': [
    place(
      'sex-in-abandoned-place',
      'Sex in an abandoned place',
      'Sexo en un lugar abandonado',
      'An abandoned or disused building, ruin or industrial space where isolation, decay or exploration is part of the atmosphere.',
      'Un edificio, ruina o espacio industrial abandonado o en desuso donde el aislamiento, la decadencia o la exploración forman parte del ambiente.',
    ),
    place(
      'sex-in-office-after-hours',
      'Sex in an office after hours',
      'Sexo en una oficina fuera de horario',
      'An office or workplace setting when it is otherwise empty; the location itself matters without requiring boss/employee roleplay.',
      'Una oficina o lugar de trabajo cuando está vacío; importa el propio entorno sin requerir un roleplay de jefe/empleado.',
    ),
    place(
      'sex-on-secluded-beach',
      'Sex on a secluded beach',
      'Sexo en una playa apartada',
      'A quiet or secluded beach where sand, sea and open-air surroundings are part of the appeal while privacy is still intended.',
      'Una playa tranquila o apartada donde arena, mar y aire libre forman parte del atractivo manteniendo la intención de privacidad.',
    ),
    place(
      'sex-while-camping',
      'Sex while camping',
      'Sexo de camping / en tienda',
      'Sex in a tent, camper or similar camping setting where the small shelter and outdoor context shape the experience.',
      'Sexo en una tienda, camper o entorno similar de camping donde el refugio pequeño y el exterior dan forma a la experiencia.',
    ),
  ],
  power: [
    service(
      'footwear-service',
      'Footwear & foot service',
      'Servicio de calzado y pies',
      'Putting on, removing, caring for or presenting a partner’s boots/shoes, or tending to their feet, because the act of service is itself erotic. This is separate from foot or boot worship.',
      'Poner, quitar, cuidar o presentar botas/calzado, o atender los pies de la pareja, porque el propio servicio resulta erótico. Se separa de la adoración de pies o botas.',
    ),
    service(
      'fetish-gear-service',
      'Fetish gear & scene-preparation service',
      'Servicio de accesorios y preparación de escena',
      'Preparing, presenting or putting away clothing, toys or restraint accessories at a partner’s request as an intentional service role.',
      'Preparar, presentar o recoger ropa, juguetes o accesorios de restricción a petición de la pareja como un rol deliberado de servicio.',
    ),
  ],
  restraint: [
    directed(
      'st-andrews-cross-restraint',
      "St. Andrew's cross restraint",
      'Restricción en cruz de San Andrés',
      'Restraint against a large X-shaped frame, usually with wrists and ankles secured so the furniture defines the body position.',
      'Inmovilización sobre una gran estructura en forma de X, normalmente sujetando muñecas y tobillos para que el propio mueble defina la postura.',
      "Secure my partner on a St. Andrew's cross", 'Inmovilizar a mi pareja en una cruz de San Andrés',
      "Be secured on a St. Andrew's cross", 'Ser inmovilizado/a en una cruz de San Andrés',
    ),
    directed(
      'bondage-bench-restraint',
      'Bondage bench / table restraint',
      'Restricción en banco o mesa de bondage',
      'Restraint on a bench or padded table with attachment points that hold the body in a defined lying, kneeling or bent position.',
      'Inmovilización sobre un banco o mesa acolchada con puntos de sujeción que mantienen el cuerpo en una postura tumbada, arrodillada o inclinada.',
      'Restrain my partner on a bondage bench/table', 'Inmovilizar a mi pareja en un banco o mesa de bondage',
      'Be restrained on a bondage bench/table', 'Ser inmovilizado/a en un banco o mesa de bondage',
    ),
    directed(
      'bondage-chair-restraint',
      'Bondage chair restraint',
      'Restricción en silla de bondage',
      'Restraint while seated in a chair whose straps or attachment points limit movement and keep a deliberate seated posture.',
      'Inmovilización sentado/a en una silla cuyas correas o puntos de sujeción limitan el movimiento y mantienen una postura concreta.',
      'Restrain my partner in a bondage chair', 'Inmovilizar a mi pareja en una silla de bondage',
      'Be restrained in a bondage chair', 'Ser inmovilizado/a en una silla de bondage',
    ),
  ],
  fluids: [
    cleanup(
      'semen-cleanup-oral-external',
      'Oral cleanup after external ejaculation',
      'Limpieza oral tras eyaculación exterior',
      'Using the mouth or tongue to clean semen from a partner’s skin after external ejaculation.',
      'Limpiar con la boca o la lengua semen de la piel de la pareja tras una eyaculación exterior.',
      'Orally clean external semen from my partner', 'Limpiar oralmente semen exterior de mi pareja',
      'Have my partner orally clean external semen from me', 'Que mi pareja limpie oralmente semen exterior de mi cuerpo',
    ),
    cleanup(
      'semen-cleanup-oral-creampie',
      'Oral cleanup after a creampie',
      'Limpieza oral tras creampie',
      'Oral cleanup after internal vaginal or anal ejaculation, where cleaning semen from the penetrated area is the specific erotic interest.',
      'Limpieza oral después de una eyaculación interna vaginal o anal, donde recoger semen de la zona penetrada es el interés erótico concreto.',
      'Perform oral cleanup after my partner receives a creampie', 'Hacer limpieza oral después de que mi pareja reciba un creampie',
      'Have my partner perform oral cleanup after I receive a creampie', 'Que mi pareja haga limpieza oral después de que yo reciba un creampie',
    ),
  ],
};

export function applyCatalogueClosingPass(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices
      .filter((practice) => !CLOSING_PASS_RETIRED_PRACTICE_IDS.has(practice.id))
      .map((practice) => ({ ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) }));
    const existing = new Set(practices.map((practice) => practice.id));
    return {
      ...category,
      practices: [
        ...practices,
        ...(ADDITIONS[category.id] ?? []).filter((practice) => !existing.has(practice.id)),
      ],
    };
  });
}

function place(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
): CataloguePracticeSeed {
  return { id, en, es, descriptionEn, descriptionEs, kind: 'mutual' };
}

function paired(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
  leftId: string, leftEn: string, leftEs: string,
  rightId: string, rightEn: string, rightEs: string,
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'paired', counterpartScoped: true,
    pairedRoles: [
      { id: leftId, en: leftEn, es: leftEs, perspective: 'neutral' },
      { id: rightId, en: rightEn, es: rightEs, perspective: 'neutral' },
    ],
  };
}

function service(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
): CataloguePracticeSeed {
  return {
    ...paired(
      id, en, es, descriptionEn, descriptionEs,
      'provide-service', 'Provide this service to my partner', 'Prestar este servicio a mi pareja',
      'receive-service', 'Receive this service from my partner', 'Recibir este servicio de mi pareja',
    ),
  };
}

function directed(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
  giveEn: string, giveEs: string, receiveEn: string, receiveEs: string,
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'directed', counterpartScoped: true,
    roleLabels: directedRoles(giveEn, giveEs, receiveEn, receiveEs),
  };
}

function cleanup(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
  giveEn: string, giveEs: string, receiveEn: string, receiveEs: string,
): CataloguePracticeSeed {
  return directed(id, en, es, descriptionEn, descriptionEs, giveEn, giveEs, receiveEn, receiveEs);
}

function directedRoles(
  giveEn: string, giveEs: string, receiveEn: string, receiveEs: string,
) {
  return {
    give: { en: giveEn, es: giveEs },
    receive: { en: receiveEn, es: receiveEs },
  } as const;
}
