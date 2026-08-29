export type { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';
import { CATALOGUE_V3_SUBCATEGORIES as CATALOGUE_V3_CORE_SUBCATEGORIES } from './catalogue-taxonomy-core';
import { applyManualTaxonomyReview } from './catalogue-taxonomy-manual-review';
import { CATALOGUE_V3_REMAINING_SUBCATEGORIES } from './catalogue-taxonomy-remaining';

/** Complete 0.2 questionnaire taxonomy, preserving stable practice identity across every category. */
const BASE_CATALOGUE_V3_SUBCATEGORIES = [
  ...CATALOGUE_V3_CORE_SUBCATEGORIES,
  ...CATALOGUE_V3_REMAINING_SUBCATEGORIES,
] as const;

export const CATALOGUE_V3_SUBCATEGORIES = applyManualTaxonomyReview(BASE_CATALOGUE_V3_SUBCATEGORIES);
