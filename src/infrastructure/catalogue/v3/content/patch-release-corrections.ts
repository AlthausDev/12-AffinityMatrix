import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const HETEROSEXUAL_MALE_SHARED_DOUBLE_DILDO_EXCLUSION = {
  sex: 'male' as const,
  orientation: 'heterosexual' as const,
};

/** Small post-0.1.2.0 corrections that do not redefine practice or role identities. */
export function applyPatchReleaseCorrections(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    if (category.id !== 'toys') return category;

    return {
      ...category,
      practices: category.practices.map((practice) =>
        practice.id === 'double-ended-dildo' ? correctDoubleEndedDildo(practice) : practice,
      ),
    };
  });
}

function correctDoubleEndedDildo(practice: CataloguePracticeSeed): CataloguePracticeSeed {
  const sharedApplicability = practice.roleApplicability?.['use-together'];

  return {
    ...practice,
    descriptionEn: 'A double-ended dildo used either jointly by two partners, with each person using one end, or by one woman using both ends on herself at the same time.',
    descriptionEs: 'Dildo de dos extremos que puede usarse conjuntamente entre dos personas, usando cada una un extremo, o por una mujer usando ambos extremos sobre sí misma al mismo tiempo.',
    roleApplicability: {
      ...(practice.roleApplicability ?? {}),
      'use-together': {
        ...(sharedApplicability ?? {}),
        selfProfileExclusions: [
          ...(sharedApplicability?.selfProfileExclusions ?? []),
          HETEROSEXUAL_MALE_SHARED_DOUBLE_DILDO_EXCLUSION,
        ],
      },
    },
  };
}
