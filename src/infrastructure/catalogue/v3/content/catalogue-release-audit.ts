import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'pussy-torture': {
    en: 'Vulvar torture',
    es: 'Tortura vulvar',
    descriptionEn: 'High-intensity edge play focused on pain or vulnerability of the vulva and external female genitals. It is separate from vaginal torture, which focuses on the internal canal.',
    descriptionEs: 'Juego edge de alta intensidad centrado en dolor o vulnerabilidad de la vulva y los genitales externos femeninos. Se separa de la tortura vaginal, centrada en el canal interno.',
    roleLabels: {
      give: { en: 'Apply vulvar torture to my partner', es: 'Aplicar tortura vulvar a mi pareja' },
      receive: { en: 'Receive vulvar torture', es: 'Recibir tortura vulvar' },
    },
  },
  'preagreed-unannounced-watching': {
    en: 'Unannounced watching',
    es: 'Observación sin aviso',
    descriptionEn: 'Watching a partner without warning them at that moment, within an explicit prior agreement that allows this possibility. It does not include watching someone who never agreed to that framework.',
    descriptionEs: 'Observar a la pareja sin avisarla en ese momento, dentro de un acuerdo previo explícito que permite esa posibilidad. No incluye observar a alguien que nunca haya aceptado ese marco.',
  },
  'food-body-play': {
    en: 'Food on the body',
    es: 'Alimentos sobre el cuerpo',
    descriptionEn: 'Using food on the skin or body for texture, messiness or sensual presentation, without making eating it or penetration the main focus.',
    descriptionEs: 'Usar alimentos sobre la piel o el cuerpo por su textura, por ensuciarse o como presentación sensual, sin que comerlos o la penetración sean el foco principal.',
  },
};

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  edge: [
    directed(
      'vaginal-torture',
      'Vaginal torture',
      'Tortura vaginal',
      'High-intensity edge play focused on pain, pressure or vulnerability inside the vaginal canal. It is separate from vulvar torture, which focuses on external genitals.',
      'Juego edge de alta intensidad centrado en dolor, presión o vulnerabilidad dentro del canal vaginal. Se separa de la tortura vulvar, centrada en los genitales externos.',
      'Apply vaginal torture to my partner', 'Aplicar tortura vaginal a mi pareja',
      'Receive vaginal torture', 'Recibir tortura vaginal',
      'female',
    ),
    directed(
      'urethral-torture',
      'Urethral torture',
      'Tortura uretral',
      'High-intensity edge play where pain, control or vulnerability of the urethra is the specific erotic focus, rather than general genital pain.',
      'Juego edge de alta intensidad donde el dolor, el control o la vulnerabilidad de la uretra son el foco erótico específico, en lugar del dolor genital general.',
      'Apply urethral torture to my partner', 'Aplicar tortura uretral a mi pareja',
      'Receive urethral torture', 'Recibir tortura uretral',
    ),
  ],
  fluids: [
    directed(
      'erotic-feeding',
      'Erotic feeding',
      'Alimentación erótica',
      'Feeding a partner or being fed when the act of offering and consuming food is itself part of the erotic interaction.',
      'Dar de comer a la pareja o recibir comida cuando el propio acto de ofrecer y consumir el alimento forma parte de la interacción erótica.',
      'Feed my partner erotically', 'Dar de comer eróticamente a mi pareja',
      'Be fed erotically by my partner', 'Que mi pareja me dé de comer de forma erótica',
    ),
    directed(
      'food-from-body',
      'Eating food from a partner’s body',
      'Comer alimentos del cuerpo de la pareja',
      'Eating or licking food from a partner’s body, or having a partner do so from yours, where the body-to-mouth aspect is the main appeal.',
      'Comer o lamer alimentos del cuerpo de la pareja, o que la pareja lo haga del tuyo, cuando el paso del cuerpo a la boca es el atractivo principal.',
      'Eat food from my partner’s body', 'Comer alimentos del cuerpo de mi pareja',
      'Have my partner eat food from my body', 'Que mi pareja coma alimentos de mi cuerpo',
    ),
    directedSelf(
      'food-vaginal-penetration',
      'Vaginal penetration with food',
      'Penetración vaginal con alimentos',
      'Using food as the penetrative element vaginally, rated separately from food on the body or eating food during erotic play.',
      'Usar un alimento como elemento de penetración vaginal, separado de poner comida sobre el cuerpo o consumirla durante el juego erótico.',
      'Use food vaginally on my partner', 'Usar un alimento vaginalmente con mi pareja',
      'Have my partner use food vaginally on me', 'Que mi pareja use un alimento vaginalmente conmigo',
      'Use food vaginally on myself', 'Usar un alimento vaginalmente conmigo',
      'female',
    ),
    directedSelf(
      'food-anal-penetration',
      'Anal penetration with food',
      'Penetración anal con alimentos',
      'Using food as the penetrative element anally, rated separately from food on the body or eating food during erotic play.',
      'Usar un alimento como elemento de penetración anal, separado de poner comida sobre el cuerpo o consumirla durante el juego erótico.',
      'Use food anally on my partner', 'Usar un alimento analmente con mi pareja',
      'Have my partner use food anally on me', 'Que mi pareja use un alimento analmente conmigo',
      'Use food anally on myself', 'Usar un alimento analmente conmigo',
    ),
  ],
  toys: [
    directedSelf(
      'everyday-object-play',
      'Everyday objects in erotic play',
      'Objetos cotidianos en el juego erótico',
      'Using ordinary objects not designed as sex toys because their shape, texture, symbolism or improvised character is part of the appeal. Penetration, impact and restraint are rated separately.',
      'Usar objetos cotidianos no diseñados como juguetes sexuales porque su forma, textura, simbolismo o carácter improvisado forman parte del atractivo. Penetración, impacto y restricción se valoran aparte.',
      'Use an everyday object with my partner', 'Usar un objeto cotidiano con mi pareja',
      'Have my partner use an everyday object with me', 'Que mi pareja use un objeto cotidiano conmigo',
      'Use an everyday object on myself', 'Usar un objeto cotidiano conmigo',
    ),
    directedSelf(
      'everyday-object-vaginal-penetration',
      'Vaginal penetration with everyday objects',
      'Penetración vaginal con objetos cotidianos',
      'Vaginal penetration where the penetrative element is an ordinary object rather than a purpose-made sex toy. This records the preference, not that every object is suitable for use.',
      'Penetración vaginal donde el elemento penetrativo es un objeto cotidiano y no un juguete sexual diseñado para ello. La entrada registra la preferencia, no que cualquier objeto sea adecuado.',
      'Use an everyday object vaginally on my partner', 'Usar un objeto cotidiano vaginalmente con mi pareja',
      'Have my partner use an everyday object vaginally on me', 'Que mi pareja use un objeto cotidiano vaginalmente conmigo',
      'Use an everyday object vaginally on myself', 'Usar un objeto cotidiano vaginalmente conmigo',
      'female',
    ),
    directedSelf(
      'everyday-object-anal-penetration',
      'Anal penetration with everyday objects',
      'Penetración anal con objetos cotidianos',
      'Anal penetration where the penetrative element is an ordinary object rather than a purpose-made sex toy. This records the preference, not that every object is suitable for use.',
      'Penetración anal donde el elemento penetrativo es un objeto cotidiano y no un juguete sexual diseñado para ello. La entrada registra la preferencia, no que cualquier objeto sea adecuado.',
      'Use an everyday object anally on my partner', 'Usar un objeto cotidiano analmente con mi pareja',
      'Have my partner use an everyday object anally on me', 'Que mi pareja use un objeto cotidiano analmente conmigo',
      'Use an everyday object anally on myself', 'Usar un objeto cotidiano analmente conmigo',
    ),
  ],
};

const CATEGORY_COPY: Readonly<Record<string, Partial<CatalogueCategorySeed>>> = {
  toys: {
    en: 'Toys, objects & equipment',
    es: 'Juguetes, objetos y equipamiento',
    descriptionEn: 'Sex toys, everyday objects and equipment, separated by how and where they are used.',
    descriptionEs: 'Juguetes sexuales, objetos cotidianos y equipamiento, separados según cómo y dónde se utilizan.',
  },
  fluids: {
    en: 'Fluids, food & substances',
    es: 'Fluidos, alimentos y sustancias',
    descriptionEn: 'Saliva, sexual fluids, food, oils and other substances used as part of erotic play.',
    descriptionEs: 'Saliva, fluidos sexuales, alimentos, aceites y otras sustancias utilizadas como parte del juego erótico.',
  },
};

export function applyCatalogueReleaseAudit(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices.map((practice) => ({
      ...practice,
      ...(PRACTICE_OVERRIDES[practice.id] ?? {}),
    }));
    const existingIds = new Set(practices.map((practice) => practice.id));
    return {
      ...category,
      practices: [
        ...practices,
        ...(ADDITIONS[category.id] ?? []).filter((practice) => !existingIds.has(practice.id)),
      ],
    };
  });
}

export function applyCatalogueReleaseAuditCategoryCopy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    ...(CATEGORY_COPY[category.id] ?? {}),
  }));
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
  anatomySex?: 'male' | 'female',
): CataloguePracticeSeed {
  return {
    id,
    en,
    es,
    descriptionEn,
    descriptionEs,
    kind: 'directed',
    counterpartScoped: true,
    ...(anatomySex ? { anatomySex } : {}),
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
    },
  };
}

function directedSelf(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
  selfEn: string,
  selfEs: string,
  anatomySex?: 'male' | 'female',
): CataloguePracticeSeed {
  return {
    id,
    en,
    es,
    descriptionEn,
    descriptionEs,
    kind: 'directed-self',
    counterpartScoped: true,
    ...(anatomySex ? { anatomySex } : {}),
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
      self: { en: selfEn, es: selfEs },
    },
  };
}
