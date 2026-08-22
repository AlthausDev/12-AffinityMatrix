import {
  CATALOGUE_V3_CONTENT as CURATED_CONTENT,
  RETIRED_V3_PRACTICE_IDS,
} from './curated';
import { polishCatalogue } from './content-polish';
import { materializeContextualDescriptions } from './contextual-description';
import { PAIRED_PRACTICE_OVERRIDES } from './paired-role-overrides';
import { CatalogueCategorySeed } from './types';

export { RETIRED_V3_PRACTICE_IDS };

/** Final Catalogue V3 projection after semantic curation, role refinement and content polish. */
const SEMANTIC_CONTENT: readonly CatalogueCategorySeed[] = CURATED_CONTENT.map((category) => ({
  ...category,
  practices: category.practices.map((practice) => ({
    ...practice,
    ...(PAIRED_PRACTICE_OVERRIDES[practice.id] ?? {}),
  })),
}));

const DESCRIBED_CONTENT = materializeContextualDescriptions(SEMANTIC_CONTENT);

export const CATALOGUE_V3_CONTENT: readonly CatalogueCategorySeed[] = polishCatalogue(DESCRIBED_CONTENT);
