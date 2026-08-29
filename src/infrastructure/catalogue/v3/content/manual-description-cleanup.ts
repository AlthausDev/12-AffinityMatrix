import { describeCataloguePractice } from './practice-description';
import { CatalogueCategorySeed } from './types';

/**
 * Materializes the same cleaned copy the UI will render after late manual additions.
 * This keeps stored bilingual descriptions and rendered descriptions identical.
 */
export function normalizeManualDescriptions(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => ({
      ...practice,
      descriptionEn: describeCataloguePractice(practice, 'en'),
      descriptionEs: describeCataloguePractice(practice, 'es'),
    })),
  }));
}
