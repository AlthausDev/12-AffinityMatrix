import { CatalogueCategorySeed, CatalogueRoleLabelsSeed } from './types';

/**
 * Consent is a catalogue-wide premise shown before the questions. Answer labels should describe
 * the role itself; practice-specific agreement details remain in descriptions where they matter.
 */
export function stripRedundantConsentFromRoleLabels(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => {
      if (!practice.roleLabels) return practice;
      const entries = Object.entries(practice.roleLabels)
        .filter((entry): entry is [string, NonNullable<CatalogueRoleLabelsSeed[string]>] => entry[1] !== undefined)
        .map(([roleId, label]) => [roleId, {
          en: clean(label.en),
          es: clean(label.es),
        }] as const);
      return { ...practice, roleLabels: Object.fromEntries(entries) as CatalogueRoleLabelsSeed };
    }),
  }));
}

function clean(value: string): string {
  return value
    .replace(/\bconsensual\s+/gi, '')
    .replace(/\bconsensuad[oa]s?\s+/gi, '')
    .replace(/\bconsentid[oa]s?\s+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
