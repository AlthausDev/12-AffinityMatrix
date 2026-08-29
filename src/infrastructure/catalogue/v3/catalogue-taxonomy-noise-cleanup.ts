import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

const ORAL_POSITION_IDS = [
  'oral-kneeling-standing-position',
  'oral-lying-between-legs-position',
  'oral-side-lying-position',
  'oral-edge-position',
] as const;

/** Last release-review taxonomy adjustments. Practice identity remains stable; only grouping changes. */
export function applyCatalogueTaxonomyNoiseCleanup(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  return subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'sexual-style-planning-expression':
        return {
          ...subcategory,
          en: 'Planning & expression',
          es: 'Planificación y expresión',
          descriptionEn: 'Whether sex is spontaneous or planned, quiet or vocal, and how focused the encounter feels.',
          descriptionEs: 'Si el sexo surge espontáneamente o se planifica, es silencioso o vocal y cuánto se centra la atención en el encuentro.',
          practiceIds: subcategory.practiceIds.filter((id) => id !== 'energetic-sex'),
        };
      case 'positions-oral':
        return {
          ...subcategory,
          descriptionEn: 'Body arrangements centred on giving or receiving oral stimulation, from mutual 69 to standing, lying, side-lying and edge positions.',
          descriptionEs: 'Colocaciones corporales centradas en dar o recibir estimulación oral, desde el 69 mutuo hasta posturas de pie, tumbadas, laterales o al borde.',
          practiceIds: [...subcategory.practiceIds, ...ORAL_POSITION_IDS],
        };
      case 'toys-anal-prostate':
        return {
          ...subcategory,
          en: 'Anal toys',
          es: 'Juguetes anales',
          descriptionEn: 'Toys designed primarily for anal insertion or graduated anal stimulation, including prostate-focused designs where applicable.',
          descriptionEs: 'Juguetes diseñados principalmente para inserción o estimulación anal progresiva, incluidos diseños orientados a la próstata cuando corresponda.',
        };
      case 'fluids-food-edible':
        return {
          ...subcategory,
          practiceIds: [...subcategory.practiceIds, 'sexual-fluids-in-food-drink'],
        };
      case 'edge-intense-genital-breast-pain':
        return {
          ...subcategory,
          practiceIds: [
            'pussy-torture',
            'vaginal-torture',
            'cock-and-ball-torture',
            'urethral-torture',
            'breast-torture',
            'nipple-torture',
          ],
        };
      default:
        return subcategory;
    }
  });
}
