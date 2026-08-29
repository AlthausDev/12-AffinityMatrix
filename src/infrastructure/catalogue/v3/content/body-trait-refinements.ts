import { Sex } from '../../../../domain/profile/profile-metadata';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export interface BodyTraitRefinementOption {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly partnerSex?: Sex;
}

export interface BodyTraitRefinementGroup {
  readonly practiceId: string;
  readonly promptEn: string;
  readonly promptEs: string;
  readonly hintEn: string;
  readonly hintEs: string;
  readonly options: readonly BodyTraitRefinementOption[];
}

const group = (
  practiceId: string,
  promptEn: string,
  promptEs: string,
  options: readonly BodyTraitRefinementOption[],
): BodyTraitRefinementGroup => ({
  practiceId,
  promptEn,
  promptEs,
  hintEn: 'Choose as many as apply.',
  hintEs: 'Puedes elegir varias opciones.',
  options,
});

/**
 * Physical-trait variants that are useful nuance but too repetitive as full questionnaire cards.
 * The option ids deliberately reuse the former practice ids so the semantic vocabulary remains
 * stable even though the variants are now stored as refinements of a broader preference.
 */
export const BODY_TRAIT_REFINEMENTS: readonly BodyTraitRefinementGroup[] = [
  group('hair', 'What kinds of hair attract you?', '¿Qué tipos de pelo te atraen?', [
    { id: 'shaved-bald-head', en: 'Shaved / bald', es: 'Rapado / calvo' },
    { id: 'hair-length-short', en: 'Short', es: 'Corto' },
    { id: 'hair-length-medium', en: 'Medium', es: 'Medio' },
    { id: 'hair-length-long', en: 'Long', es: 'Largo' },
  ]),
  group('chest-general', 'Which breast sizes attract you?', '¿Qué tamaños de pecho te atraen?', [
    { id: 'breast-size-small', en: 'Small', es: 'Pequeño', partnerSex: 'female' },
    { id: 'breast-size-average', en: 'Medium', es: 'Medio', partnerSex: 'female' },
    { id: 'breast-size-large', en: 'Large', es: 'Grande', partnerSex: 'female' },
  ]),
  group('buttocks', 'Which sizes attract you?', '¿Qué tamaños te atraen?', [
    { id: 'buttocks-size-small', en: 'Small', es: 'Pequeños' },
    { id: 'buttocks-size-average', en: 'Medium', es: 'Medios' },
    { id: 'buttocks-size-large', en: 'Large', es: 'Grandes' },
  ]),
  group('penis', 'Which penis sizes attract you?', '¿Qué tamaños de pene te atraen?', [
    { id: 'penis-size-small', en: 'Small', es: 'Pequeño', partnerSex: 'male' },
    { id: 'penis-size-average', en: 'Medium', es: 'Medio', partnerSex: 'male' },
    { id: 'penis-size-large', en: 'Large', es: 'Grande', partnerSex: 'male' },
  ]),
  group('piercings', 'Where do piercings especially attract you?', '¿Dónde te atraen especialmente los piercings?', [
    { id: 'facial-piercings', en: 'Face', es: 'Cara' },
    { id: 'body-piercings', en: 'Body', es: 'Cuerpo' },
    { id: 'nipple-piercings', en: 'Nipples', es: 'Pezones' },
    { id: 'genital-piercings', en: 'Genitals', es: 'Genitales' },
  ]),
] as const;

const RETIRED_REFINEMENT_PRACTICE_IDS = BODY_TRAIT_REFINEMENTS.flatMap((entry) =>
  entry.options.map((option) => option.id),
);

export const BODY_TRAIT_REFINEMENT_RETIRED_PRACTICE_IDS = new Set<string>(
  RETIRED_REFINEMENT_PRACTICE_IDS,
);

const PARENT_DESCRIPTION_OVERRIDES: Readonly<Record<string, Pick<CataloguePracticeSeed, 'descriptionEn' | 'descriptionEs'>>> = {
  hair: {
    descriptionEn: 'Attraction to a partner’s hair as a visible physical trait. If hair is appealing, you can optionally mark the lengths or shaved/bald look that especially attract you.',
    descriptionEs: 'Atracción por el pelo de la pareja como rasgo físico visible. Si te atrae, puedes marcar opcionalmente las longitudes o el aspecto rapado/calvo que te gustan especialmente.',
  },
  'chest-general': {
    descriptionEn: 'Attraction to a partner’s chest as a body area, including breasts when present. When relevant, breast-size preferences can be refined inside this same question.',
    descriptionEs: 'Atracción por el pecho de la pareja como zona corporal, incluidos los senos cuando los haya. Cuando corresponda, las preferencias de tamaño se pueden concretar dentro de esta misma pregunta.',
  },
  buttocks: {
    descriptionEn: 'Attraction to a partner’s buttocks as a body feature. If they are appealing, you can optionally mark the sizes that especially attract you.',
    descriptionEs: 'Atracción por los glúteos de la pareja como rasgo corporal. Si te atraen, puedes marcar opcionalmente los tamaños que te gustan especialmente.',
  },
  penis: {
    descriptionEn: 'Attraction to a partner’s penis as a physical trait. If it is appealing, you can optionally mark the sizes that especially attract you.',
    descriptionEs: 'Atracción por el pene de la pareja como rasgo físico. Si te atrae, puedes marcar opcionalmente los tamaños que te gustan especialmente.',
  },
  piercings: {
    descriptionEn: 'Attraction to piercings as a physical or aesthetic trait. If they are appealing, you can optionally mark the placements that especially attract you.',
    descriptionEs: 'Atracción por los piercings como rasgo físico o estético. Si te atraen, puedes marcar opcionalmente las ubicaciones que te gustan especialmente.',
  },
};

/** Collapse repetitive physical-trait variants into optional refinements of their parent practice. */
export function applyBodyTraitRefinementCompaction(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    if (category.id !== 'body-fetishes') return category;
    return {
      ...category,
      practices: category.practices
        .filter((practice) => !BODY_TRAIT_REFINEMENT_RETIRED_PRACTICE_IDS.has(practice.id))
        .map((practice) => ({
          ...practice,
          ...(PARENT_DESCRIPTION_OVERRIDES[practice.id] ?? {}),
        })),
    };
  });
}

export function bodyTraitRefinementGroup(practiceId: string): BodyTraitRefinementGroup | undefined {
  return BODY_TRAIT_REFINEMENTS.find((entry) => entry.practiceId === practiceId);
}
