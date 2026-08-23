import {
  CATALOGUE_V3_CONTENT as CURATED_CONTENT,
  RETIRED_V3_PRACTICE_IDS as CURATED_RETIRED_V3_PRACTICE_IDS,
} from './curated';
import { applyFinalCategoryCopy } from './category-copy-overrides';
import { polishCatalogue } from './content-polish';
import { materializeContextualDescriptions } from './contextual-description';
import { applyFinalApplicabilityReview, FINAL_APPLICABILITY_RETIRED_PRACTICE_IDS } from './final-applicability-review';
import { applyFinalClarityReview, FINAL_CLARITY_RETIRED_PRACTICE_IDS } from './final-clarity-review';
import { applyFinalContentReview } from './final-content-review';
import { applyFinalLastMileReview, FINAL_LAST_MILE_RETIRED_PRACTICE_IDS } from './final-last-mile-review';
import { groupFinalCataloguePractices } from './final-practice-order';
import { applyFinalReleaseCopy } from './final-release-copy';
import { applyFinalReleaseTaxonomy, FINAL_RELEASE_RETIRED_PRACTICE_IDS } from './final-release-taxonomy';
import { addFinalRolePractices, REACTIVATED_V3_PRACTICE_IDS } from './final-role-additions';
import { applyConciseCategoryCopy, applyFinalRolePolish, FINAL_ROLE_POLISH_RETIRED_PRACTICE_IDS } from './final-role-polish';
import { sanitizeFinalCatalogueSeeds } from './final-seed-sanitization';
import { FINAL_CONTENT_RETIRED_PRACTICE_IDS } from './final-retirements';
import { PAIRED_PRACTICE_OVERRIDES } from './paired-role-overrides';
import { applyPatchReleaseCorrections } from './patch-release-corrections';
import { applyRoleWordingOverrides } from './role-wording-overrides';
import { CatalogueCategorySeed } from './types';

const ALL_RETIRED_V3_PRACTICE_IDS = [
  ...CURATED_RETIRED_V3_PRACTICE_IDS,
  ...FINAL_CONTENT_RETIRED_PRACTICE_IDS,
  ...FINAL_CLARITY_RETIRED_PRACTICE_IDS,
  ...FINAL_LAST_MILE_RETIRED_PRACTICE_IDS,
  ...FINAL_RELEASE_RETIRED_PRACTICE_IDS,
  ...FINAL_APPLICABILITY_RETIRED_PRACTICE_IDS,
  ...FINAL_ROLE_POLISH_RETIRED_PRACTICE_IDS,
];

export const RETIRED_V3_PRACTICE_IDS = new Set<string>(
  ALL_RETIRED_V3_PRACTICE_IDS.filter((id) => !REACTIVATED_V3_PRACTICE_IDS.has(id)),
);

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
const CLARIFIED_CONTENT = applyFinalClarityReview(REVIEWED_CONTENT);
const LAST_MILE_CONTENT = applyFinalLastMileReview(CLARIFIED_CONTENT);
const RELEASE_TAXONOMY_CONTENT = applyFinalReleaseTaxonomy(LAST_MILE_CONTENT);
const RELEASE_COPY_CONTENT = applyFinalReleaseCopy(RELEASE_TAXONOMY_CONTENT);
const APPLICABILITY_REVIEWED_CONTENT = applyFinalApplicabilityReview(RELEASE_COPY_CONTENT);
const FINAL_ROLE_CONTENT = applyFinalRolePolish(APPLICABILITY_REVIEWED_CONTENT);
const ROLE_ADDED_CONTENT = addFinalRolePractices(FINAL_ROLE_CONTENT);
const SANITIZED_CONTENT = sanitizeFinalCatalogueSeeds(ROLE_ADDED_CONTENT);
const PATCH_CORRECTED_CONTENT = applyPatchReleaseCorrections(SANITIZED_CONTENT);
const GROUPED_CONTENT = groupFinalCataloguePractices(PATCH_CORRECTED_CONTENT);
const CATEGORY_COPY_CONTENT = applyFinalCategoryCopy(GROUPED_CONTENT);

export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = applyConciseCategoryCopy(CATEGORY_COPY_CONTENT);
