import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_LAST_MILE_RETIRED_PRACTICE_IDS = new Set<string>(['chest']);

const UNIFIED_CHEST: CataloguePracticeSeed = {
  id: 'chest-general',
  en: 'Chest / breasts',
  es: 'Pecho',
  kind: 'focus',
  descriptionEn: 'Attraction to a partner’s chest as a body area, including breasts when present. Size preferences are asked separately, so this entry means liking the chest itself regardless of size.',
  descriptionEs: 'Atracción por el pecho de la pareja como zona corporal, incluidos los senos cuando los haya. El tamaño se pregunta aparte, así que aquí se valora el pecho en sí independientemente de su tamaño.',
};

/**
 * Final semantic replacement where an existing stable id would otherwise change meaning.
 * `chest` historically meant male chest, so the new all-partners concept receives a new id.
 */
export function applyFinalLastMileReview(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: [
      ...category.practices.filter((practice) => !FINAL_LAST_MILE_RETIRED_PRACTICE_IDS.has(practice.id)),
      ...(category.id === 'body-fetishes' ? [UNIFIED_CHEST] : []),
    ],
  }));
}
