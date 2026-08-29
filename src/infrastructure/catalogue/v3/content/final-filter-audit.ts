import { RoleApplicability } from '../../../../domain/catalogue/practice';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const PENETRATIVE_RECEIVER_IDS = new Set([
  'fingering-anal',
  'prostate-massage-manual',
]);

const PROFILE_NEUTRAL_ROLE_IDS: Readonly<Record<string, readonly string[]>> = {
  'wand-vibrator': ['use-on-self', 'use-on-partner', 'partner-uses-on-me'],
  'strap-on': ['use-on-partner', 'partner-uses-on-me'],
};

/**
 * Final filtering audit.
 *
 * Anatomy may make a role impossible and orientation may narrow the relevant counterpart sex,
 * but neither should infer which otherwise possible sexual acts a person would or would not enjoy.
 * Older catalogue passes intentionally remain untouched; this pass removes the few preference-like
 * exclusions that survived those migrations.
 */
export function applyFinalFilterAudit(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => auditPractice(category.id, practice)),
  }));
}

function auditPractice(categoryId: string, practice: CataloguePracticeSeed): CataloguePracticeSeed {
  let result = practice;

  if (categoryId === 'penetration' && result.kind === 'directed') {
    result = removeSoftProfileExclusions(result, 'receive');
  }

  if (PENETRATIVE_RECEIVER_IDS.has(result.id)) {
    result = removeSoftProfileExclusions(result, 'receive');
  }

  if (result.kind === 'toy') {
    result = removeSoftProfileExclusions(result, 'use-on-self');
    result = removeSoftProfileExclusions(result, 'partner-uses-on-me');
  }

  if (result.id === 'swallowing') {
    result = removeSoftProfileExclusions(result, 'self-state');
  }

  if (result.id === 'snowballing') {
    result = removeSoftProfileExclusions(result, 'participate');
  }

  if (result.id === 'gangbang') {
    result = removeSoftProfileExclusions(result, 'center');
    result = removeSoftProfileExclusions(result, 'participate');
  }

  for (const roleId of PROFILE_NEUTRAL_ROLE_IDS[result.id] ?? []) {
    result = removeSexRestrictions(result, roleId);
  }

  return result;
}

function removeSoftProfileExclusions(
  practice: CataloguePracticeSeed,
  roleId: string,
): CataloguePracticeSeed {
  return updateRoleApplicability(practice, roleId, (current) => {
    const { selfProfileExclusions: _ignored, ...remaining } = current;
    return remaining;
  });
}

function removeSexRestrictions(
  practice: CataloguePracticeSeed,
  roleId: string,
): CataloguePracticeSeed {
  return updateRoleApplicability(practice, roleId, (current) => {
    const {
      selfSex: _selfSex,
      partnerSex: _partnerSex,
      selfProfileExclusions: _profileExclusions,
      ...remaining
    } = current;
    return remaining;
  });
}

function updateRoleApplicability(
  practice: CataloguePracticeSeed,
  roleId: string,
  update: (current: RoleApplicability) => RoleApplicability,
): CataloguePracticeSeed {
  const current = practice.roleApplicability?.[roleId];
  if (!current) return practice;

  const next = update(current);
  const roleApplicability = { ...(practice.roleApplicability ?? {}) };
  roleApplicability[roleId] = Object.keys(next).length > 0 ? next : undefined;

  return { ...practice, roleApplicability };
}
