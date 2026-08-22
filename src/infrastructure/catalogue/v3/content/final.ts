import {
  CATALOGUE_V3_CONTENT as CURATED_CONTENT,
  RETIRED_V3_PRACTICE_IDS,
} from './curated';
import { PAIRED_PRACTICE_OVERRIDES } from './paired-role-overrides';
import { CatalogueCategorySeed } from './types';

export { RETIRED_V3_PRACTICE_IDS };

/** Final Catalogue V3 projection after content curation and semantic-role refinement. */
export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = CURATED_CONTENT.map((category) => ({
  ...category,
  practices: category.practices.map((practice) => ({
    ...practice,
    ...(PAIRED_PRACTICE_OVERRIDES[practice.id] ?? {}),
  })),
}));
