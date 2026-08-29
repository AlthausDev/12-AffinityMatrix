import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const QUESTIONNAIRE_FOLLOWUP_POSITION_IDS = [
  'coital-alignment-position',
  'standing-rear-entry-position',
  'mating-press-position',
  'piledriver-position',
] as const;

export const QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID = 'chastity-device';

const POSITION_ADDITIONS: readonly CataloguePracticeSeed[] = [
  {
    id: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[0],
    en: 'Coital alignment position (CAT)',
    es: 'Postura de alineación coital (CAT)',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A close face-to-face position related to missionary where body alignment and sustained pelvic contact are the defining features rather than a different sexual act.',
    descriptionEs: 'Postura cercana cara a cara relacionada con el misionero en la que la alineación corporal y el contacto pélvico sostenido son los elementos definitorios, no una práctica sexual distinta.',
  },
  {
    id: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[1],
    en: 'Standing rear-entry position',
    es: 'Postura de pie desde atrás',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'Both partners remain standing while one is positioned behind the other, making the upright rear-entry arrangement itself part of the preference.',
    descriptionEs: 'Ambas personas permanecen de pie mientras una se coloca detrás de la otra, haciendo de la disposición erguida desde atrás la característica principal de la postura.',
  },
  {
    id: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[2],
    en: 'Mating press position',
    es: 'Postura mating press',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A compact face-to-face position where the receiving partner lies back with the legs drawn high and the bodies remain closely folded together, creating a more compressed angle.',
    descriptionEs: 'Postura compacta cara a cara en la que quien recibe permanece tumbado/a con las piernas elevadas y los cuerpos quedan muy recogidos, creando un ángulo más cerrado.',
  },
  {
    id: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[3],
    en: 'Piledriver position',
    es: 'Postura piledriver',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'A physically demanding folded or partly inverted position where the receiving partner’s hips are raised high, making the unusual body angle and support the defining preference.',
    descriptionEs: 'Postura físicamente exigente, muy plegada o parcialmente invertida, en la que la cadera de quien recibe queda elevada; el ángulo corporal y el apoyo inusuales son lo que define la preferencia.',
  },
] as const;

const CHASTITY_DEVICE: CataloguePracticeSeed = {
  id: QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID,
  en: 'Chastity belt / device',
  es: 'Cinturón / dispositivo de castidad',
  kind: 'paired',
  counterpartScoped: true,
  descriptionEn: 'A wearable chastity belt, cage or similar device used as part of erotic access control, denial or anticipation. The roles distinguish wearing the device from controlling a partner’s device or key.',
  descriptionEs: 'Cinturón, jaula u otro dispositivo de castidad llevado como parte del control erótico del acceso, la negación o la anticipación. Los roles distinguen entre llevarlo y controlar el dispositivo o la llave de la pareja.',
  pairedRoles: [
    {
      id: 'wear-chastity',
      en: 'Wear a chastity belt / device',
      es: 'Llevar un cinturón / dispositivo de castidad',
      perspective: 'receptive',
    },
    {
      id: 'control-chastity',
      en: "Control my partner's chastity device / key",
      es: 'Controlar el dispositivo de castidad / llave de mi pareja',
      perspective: 'active',
    },
  ],
};

const TITLE_OVERRIDES: Readonly<Record<string, Pick<CataloguePracticeSeed, 'en' | 'es'>>> = {
  'adult-ageplay-roleplay': {
    en: 'Ageplay',
    es: 'Ageplay',
  },
  'caregiver-little-adult-roleplay': {
    en: 'Caregiver / Little dynamic',
    es: 'Dinámica Caregiver / Little',
  },
};

/** Small final follow-up kept separate from the historical catalogue review passes. */
export function applyFinalQuestionnaireFollowup(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices.map((practice) => ({
      ...practice,
      ...(TITLE_OVERRIDES[practice.id] ?? {}),
    }));
    const existingIds = new Set(practices.map((practice) => practice.id));

    if (category.id === 'sexual-positions') {
      return {
        ...category,
        practices: [
          ...practices,
          ...POSITION_ADDITIONS.filter((practice) => !existingIds.has(practice.id)),
        ],
      };
    }

    if (category.id === 'sexual-accessories' && !existingIds.has(CHASTITY_DEVICE.id)) {
      return { ...category, practices: [...practices, CHASTITY_DEVICE] };
    }

    return { ...category, practices };
  });
}
