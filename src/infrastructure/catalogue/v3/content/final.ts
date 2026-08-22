import {
  CATALOGUE_V3_CONTENT as CURATED_CONTENT,
  RETIRED_V3_PRACTICE_IDS as CURATED_RETIRED_V3_PRACTICE_IDS,
} from './curated';
import { applyFinalCategoryCopy } from './category-copy-overrides';
import { polishCatalogue } from './content-polish';
import { materializeContextualDescriptions } from './contextual-description';
import { applyFinalContentReview } from './final-content-review';
import { groupFinalCataloguePractices } from './final-practice-order';
import { FINAL_CONTENT_RETIRED_PRACTICE_IDS } from './final-retirements';
import { PAIRED_PRACTICE_OVERRIDES } from './paired-role-overrides';
import { applyRoleWordingOverrides } from './role-wording-overrides';
import { CatalogueCategorySeed } from './types';

export const RETIRED_V3_PRACTICE_IDS = new Set<string>([
  ...CURATED_RETIRED_V3_PRACTICE_IDS,
  ...FINAL_CONTENT_RETIRED_PRACTICE_IDS,
]);

/** Final Catalogue V3 projection after semantic curation, role refinement and content polish. */
const SEMANTIC_CONTENT: readonly CatalogueCategorySeed[] = CURATED_CONTENT.map((category) => ({
  ...category,
  practices: category.practices.map((practice) => ({
    ...practice,
    ...(PAIRED_PRACTICE_OVERRIDES[practice.id] ?? {}),
  })),
}));

const ROLE_POLISHED_CONTENT = applyRoleWordingOverrides(SEMANTIC_CONTENT);
const DESCRIBED_CONTENT = materializeContextualDescriptions(ROLE_POLISHED_CONTENT);
const POLISHED_CONTENT = polishCatalogue(DESCRIBED_CONTENT);
const ACTIVE_CONTENT = POLISHED_CONTENT.map((category) => ({
  ...category,
  practices: category.practices.filter((practice) => !FINAL_CONTENT_RETIRED_PRACTICE_IDS.has(practice.id)),
}));
const REVIEWED_CONTENT = applyFinalContentReview(ACTIVE_CONTENT);
const GROUPED_CONTENT = groupFinalCataloguePractices(REVIEWED_CONTENT);

export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = applyFinalCategoryCopy(GROUPED_CONTENT);
