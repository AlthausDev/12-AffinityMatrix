import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Removes obsolete fields when a late catalogue review changes the semantic kind of an existing seed.
 * Keeping this explicit prevents an inherited anatomy/target-site constraint from surviving by accident.
 */
export function sanitizeFinalCatalogueSeeds(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => sanitizePractice(practice)),
  }));
}

function sanitizePractice(practice: CataloguePracticeSeed): CataloguePracticeSeed {
  if (practice.id === 'squirting-on-partner') {
    const { anatomySex: _obsoleteAnatomy, roleApplicability: _oldApplicability, ...rest } = practice;
    return {
      ...rest,
      actorSex: 'female',
      roleApplicability: {
        give: { selfSex: ['female'] },
        receive: { partnerSex: ['female'] },
      },
    };
  }

  if (practice.id === 'breast-torture') {
    const { anatomySex: _obsoleteAnatomy, ...rest } = practice;
    return rest;
  }

  if (practice.id === 'double-ended-dildo') {
    const { targetSites: _obsoleteTargetSites, ...rest } = practice;
    return rest;
  }

  return practice;
}
