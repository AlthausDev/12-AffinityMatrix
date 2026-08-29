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
      const roleLabels = practice.roleLabels
        ? Object.fromEntries(
          Object.entries(practice.roleLabels)
            .filter((entry): entry is [string, NonNullable<CatalogueRoleLabelsSeed[string]>] => entry[1] !== undefined)
            .map(([roleId, label]) => [roleId, {
              en: clean(label.en),
              es: clean(label.es),
            }] as const),
        ) as CatalogueRoleLabelsSeed
        : undefined;

      const pairedRoles = practice.pairedRoles?.map((role) => ({
        ...role,
        en: clean(role.en),
        es: clean(role.es),
      }));

      if (!roleLabels && !pairedRoles) return practice;
      return {
        ...practice,
        ...(roleLabels ? { roleLabels } : {}),
        ...(pairedRoles ? { pairedRoles } : {}),
      };
    }),
  }));
}

function clean(value: string): string {
  return value
    .replace(/\bconsensual\b\s*/gi, '')
    .replace(/\bconsensuad[oa]s?\b\s*/gi, '')
    .replace(/\bconsentid[oa]s?\b\s*/gi, '')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
