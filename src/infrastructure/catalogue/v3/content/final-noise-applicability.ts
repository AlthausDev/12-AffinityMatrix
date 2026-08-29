import { CatalogueCategorySeed } from './types';

const SEMEN_SELF_CLEANUP_IDS = new Set([
  'semen-cleanup-manual',
  'semen-cleanup-oral-external',
  'semen-cleanup-other',
]);

/** Last-mile applicability/copy rules discovered during the final manual walkthrough. */
export function applyFinalNoiseApplicability(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => {
      if (SEMEN_SELF_CLEANUP_IDS.has(practice.id)) {
        return {
          ...practice,
          roleApplicability: {
            ...(practice.roleApplicability ?? {}),
            self: {
              ...(practice.roleApplicability?.self ?? {}),
              partnerSex: ['male'] as const,
            },
          },
        };
      }

      if (practice.id === 'family-role-taboo-fantasy') {
        return {
          ...practice,
          descriptionEn: 'A fictional incest-themed roleplay between adults. The family relationship belongs to the imagined characters; it does not involve minors and does not require a real family relationship.',
          descriptionEs: 'Roleplay ficticio de temática incestuosa entre adultos. La relación familiar pertenece a los personajes imaginados; no implica a menores ni requiere una relación familiar real.',
        };
      }

      return practice;
    }),
  }));
}
