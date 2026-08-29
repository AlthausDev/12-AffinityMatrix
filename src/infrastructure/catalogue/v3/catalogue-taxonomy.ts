export type { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';
import { CATALOGUE_V3_SUBCATEGORIES as CATALOGUE_V3_CORE_SUBCATEGORIES } from './catalogue-taxonomy-core';
import { applyCatalogueTaxonomyClosingPass } from './catalogue-taxonomy-closing-pass';
import { applyCatalogueTaxonomyFinalPass } from './catalogue-taxonomy-final-pass';
import { applyManualTaxonomyReview } from './catalogue-taxonomy-manual-review';
import { CATALOGUE_V3_REMAINING_SUBCATEGORIES } from './catalogue-taxonomy-remaining';

/** Complete 0.2 questionnaire taxonomy, preserving stable practice identity across every category. */
const BASE_CATALOGUE_V3_SUBCATEGORIES = [
  ...CATALOGUE_V3_CORE_SUBCATEGORIES,
  ...CATALOGUE_V3_REMAINING_SUBCATEGORIES,
] as const;

const MANUALLY_REVIEWED_SUBCATEGORIES = applyManualTaxonomyReview(BASE_CATALOGUE_V3_SUBCATEGORIES);
const FINAL_PASS_SUBCATEGORIES = applyCatalogueTaxonomyFinalPass(MANUALLY_REVIEWED_SUBCATEGORIES);

export const CATALOGUE_V3_SUBCATEGORIES = applyCatalogueTaxonomyClosingPass(FINAL_PASS_SUBCATEGORIES);
