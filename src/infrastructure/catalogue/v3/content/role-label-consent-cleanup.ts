import { CatalogueCategorySeed, CatalogueRoleLabelsSeed } from './types';

/**
 * Consent is a catalogue-wide premise shown before the questions. Titles and answer labels should
 * describe the practice or role itself; practice-specific agreement details remain in descriptions
 * where they actually change the meaning.
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

      const pairedRoles = practice.pairedRoles
        ? [
          {
            ...practice.pairedRoles[0],
            en: clean(practice.pairedRoles[0].en),
            es: clean(practice.pairedRoles[0].es),
          },
          {
            ...practice.pairedRoles[1],
            en: clean(practice.pairedRoles[1].en),
            es: clean(practice.pairedRoles[1].es),
          },
        ] as const
        : undefined;

      return {
        ...practice,
        en: clean(practice.en),
        es: clean(practice.es),
        ...(roleLabels ? { roleLabels } : {}),
        ...(pairedRoles ? { pairedRoles } : {}),
      };
    }),
  }));
}

function clean(value: string): string {
  return value
    .replace(/\s*\(\s*(?:pre[- ]?agreed|preacordad[oa]s?|consensual|consensuad[oa]s?)\s*\)/gi, '')
    .replace(/\bconsensually\b\s*/gi, '')
    .replace(/\bconsensual\b\s*/gi, '')
    .replace(/\bde forma consensuada\b\s*/gi, '')
    .replace(/\bconsensuadamente\b\s*/gi, '')
    .replace(/\bconsensuad[oa]s?\b\s*/gi, '')
    .replace(/\bconsentid[oa]s?\b\s*/gi, '')
    .replace(/\bpre[- ]?agreed\b\s*/gi, '')
    .replace(/\bpreacordad[oa]s?\b\s*/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
