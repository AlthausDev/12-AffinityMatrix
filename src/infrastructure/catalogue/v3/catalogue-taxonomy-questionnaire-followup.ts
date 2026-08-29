import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';
import {
  QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID,
  QUESTIONNAIRE_FOLLOWUP_POSITION_IDS,
} from './content/final-questionnaire-followup';

/** Taxonomy additions for the final questionnaire follow-up without rewriting earlier release passes. */
export function applyCatalogueTaxonomyQuestionnaireFollowup(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  const reviewed = subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'positions-face-to-face-close':
        return {
          ...subcategory,
          practiceIds: appendUnique(
            subcategory.practiceIds,
            QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[0],
            QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[2],
          ),
        };
      case 'positions-on-top-rear':
        return {
          ...subcategory,
          practiceIds: appendUnique(
            subcategory.practiceIds,
            QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[1],
          ),
        };
      case 'positions-support-angles-physical':
        return {
          ...subcategory,
          practiceIds: appendUnique(
            subcategory.practiceIds,
            QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[3],
          ),
        };
      case 'toys-everyday-objects':
        return { ...subcategory, order: 4 };
      default:
        return subcategory;
    }
  });

  if (reviewed.some((subcategory) => subcategory.id === 'sexual-accessories-chastity')) return reviewed;

  return [
    ...reviewed,
    {
      id: 'sexual-accessories-chastity',
      categoryId: 'sexual-accessories',
      en: 'Chastity devices',
      es: 'Dispositivos de castidad',
      descriptionEn: 'Wearable belts, cages and related devices used for erotic access control, denial or keyholder dynamics.',
      descriptionEs: 'Cinturones, jaulas y dispositivos llevables usados para control erótico del acceso, negación o dinámicas de keyholder.',
      order: 3,
      practiceIds: [QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID],
    },
  ];
}

function appendUnique(
  ids: readonly string[],
  ...additions: readonly string[]
): readonly string[] {
  const existing = new Set(ids);
  return [...ids, ...additions.filter((id) => !existing.has(id))];
}
