import { Practice, RolePerspective } from '../../../domain/catalogue/practice';
import { Profile } from '../../../domain/profile/profile';
import { InitiativePreference, PracticeAnswer } from '../../../domain/profile/profile-answer';
import { PREFERENCE_VALUES, Preference } from '../../../domain/profile/preference';
import { preferenceAffinity } from './profile-preference-affinity';

export interface PreferenceDistributionEntry {
  readonly preference: Preference;
  readonly count: number;
  readonly percentage: number;
  readonly startPercentage: number;
  readonly endPercentage: number;
}

export interface DashboardPracticeProgressSource {
  readonly practice: Practice;
  readonly roles: readonly { readonly answer?: unknown }[];
}

export interface DashboardSubcategorySource {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly practiceIds: readonly string[];
}

export interface SubcategoryProgressEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly answered: number;
  readonly total: number;
  readonly completionPercentage: number;
}

export interface RoleProfileEntry {
  readonly perspective: RolePerspective;
  /** Distinct practice + role combinations, so scoped variants do not dominate the view. */
  readonly answerCount: number;
  readonly affinityCount: number;
  readonly favoriteCount: number;
  /** Weighted affinity across Favorite, Like, Curious and Depends answers. */
  readonly affinityPercentage: number;
  /** Average share of Favorite answers inside each distinct practice + role combination. */
  readonly favoritePercentage: number;
}

export interface RoleProfileCoordinates {
  /** -100 receptive, +100 active. Neutral/mutual answers do not create a direction. */
  readonly roleBalance: number;
  /** -100 partner-led, +100 self-led, based on explicit initiative details only. */
  readonly initiativeBalance: number;
  readonly roleEvidenceCount: number;
  readonly initiativeEvidenceCount: number;
}

interface RoleAnswerGroup {
  readonly perspective: RolePerspective;
  readonly answers: readonly PracticeAnswer[];
}

const ROLE_PERSPECTIVES: readonly RolePerspective[] = ['active', 'receptive', 'neutral'];

export function buildPreferenceDistribution(
  profile: Pick<Profile, 'answers'> | undefined,
): readonly PreferenceDistributionEntry[] {
  const answers = Object.values(profile?.answers ?? {});
  const total = answers.length;
  let cursor = 0;

  return PREFERENCE_VALUES.map((preference) => {
    const count = answers.filter((answer) => answer.preference === preference).length;
    const share = total === 0 ? 0 : (count / total) * 100;
    const startPercentage = cursor;
    const endPercentage = cursor + share;
    cursor = endPercentage;

    return {
      preference,
      count,
      percentage: Math.round(share),
      startPercentage,
      endPercentage,
    };
  });
}

export function buildSubcategoryProgress(
  subcategories: readonly DashboardSubcategorySource[],
  practices: readonly DashboardPracticeProgressSource[] | undefined,
): readonly SubcategoryProgressEntry[] {
  const practiceById = new Map((practices ?? []).map((practice) => [practice.practice.id, practice]));

  return subcategories.flatMap((subcategory): SubcategoryProgressEntry[] => {
    const visiblePractices = subcategory.practiceIds
      .map((practiceId) => practiceById.get(practiceId))
      .filter((practice): practice is DashboardPracticeProgressSource => practice !== undefined);
    const total = visiblePractices.length;
    if (total === 0) return [];

    const answered = visiblePractices.filter((practice) =>
      practice.roles.some((role) => role.answer !== undefined),
    ).length;

    return [{
      id: subcategory.id,
      label: subcategory.label,
      description: subcategory.description,
      answered,
      total,
      completionPercentage: percentage(answered, total),
    }];
  });
}

export function buildRoleProfile(
  profile: Pick<Profile, 'answers'> | undefined,
  practices: readonly Practice[] | undefined,
): readonly RoleProfileEntry[] {
  const groups = buildRoleAnswerGroups(profile, practices);

  return ROLE_PERSPECTIVES.map((perspective) => {
    const perspectiveGroups = groups.filter((group) => group.perspective === perspective);
    const affinityValues = perspectiveGroups.map((group) => average(
      group.answers.map((answer) => preferenceAffinity(answer.preference)),
    ));
    const favoriteShares = perspectiveGroups.map((group) => average(
      group.answers.map((answer) => answer.preference === 'favorite' ? 1 : 0),
    ));

    return {
      perspective,
      answerCount: perspectiveGroups.length,
      affinityCount: perspectiveGroups.filter((group) =>
        group.answers.some((answer) => answer.preference === 'favorite' || answer.preference === 'like'),
      ).length,
      favoriteCount: perspectiveGroups.filter((group) =>
        group.answers.some((answer) => answer.preference === 'favorite'),
      ).length,
      affinityPercentage: Math.round(average(affinityValues) * 100),
      favoritePercentage: Math.round(average(favoriteShares) * 100),
    };
  });
}

export function buildRoleProfileCoordinates(
  profile: Pick<Profile, 'answers'> | undefined,
  practices: readonly Practice[] | undefined,
): RoleProfileCoordinates {
  const roleProfile = buildRoleProfile(profile, practices);
  const active = roleProfile.find((entry) => entry.perspective === 'active');
  const receptive = roleProfile.find((entry) => entry.perspective === 'receptive');
  const activeAffinity = active?.affinityPercentage ?? 0;
  const receptiveAffinity = receptive?.affinityPercentage ?? 0;
  const directionalAffinity = activeAffinity + receptiveAffinity;
  const roleBalance = directionalAffinity <= 0
    ? 0
    : Math.round(((activeAffinity - receptiveAffinity) / directionalAffinity) * 100);

  const groups = buildRoleAnswerGroups(profile, practices);
  const initiativeGroups = groups.flatMap((group) => {
    const directed = group.answers.flatMap((answer) => {
      const initiative = answer.details?.initiative;
      const affinity = preferenceAffinity(answer.preference);
      if (!initiative || affinity <= 0) return [];
      return [{ direction: initiativeDirection(initiative), affinity }];
    });
    const weight = directed.reduce((sum, item) => sum + item.affinity, 0);
    if (weight <= 0) return [];
    return [directed.reduce((sum, item) => sum + item.direction * item.affinity, 0) / weight];
  });

  return {
    roleBalance: clampBalance(roleBalance),
    initiativeBalance: clampBalance(Math.round(average(initiativeGroups) * 100)),
    roleEvidenceCount: roleProfile.reduce((sum, entry) => sum + entry.answerCount, 0),
    initiativeEvidenceCount: initiativeGroups.length,
  };
}

function buildRoleAnswerGroups(
  profile: Pick<Profile, 'answers'> | undefined,
  practices: readonly Practice[] | undefined,
): readonly RoleAnswerGroup[] {
  const perspectiveByRole = new Map<string, RolePerspective>();
  for (const practice of practices ?? []) {
    for (const role of practice.roles) {
      perspectiveByRole.set(roleLookupKey(practice.id, role.id), role.perspective);
    }
  }

  const answersByRole = new Map<string, PracticeAnswer[]>();
  for (const answer of Object.values(profile?.answers ?? {})) {
    const key = roleLookupKey(answer.practiceId, answer.roleId);
    if (!perspectiveByRole.has(key)) continue;
    const current = answersByRole.get(key) ?? [];
    current.push(answer);
    answersByRole.set(key, current);
  }

  return [...answersByRole.entries()].flatMap(([key, answers]): RoleAnswerGroup[] => {
    const perspective = perspectiveByRole.get(key);
    return perspective ? [{ perspective, answers }] : [];
  });
}

function roleLookupKey(practiceId: string, roleId: string): string {
  return `${practiceId}\u0000${roleId}`;
}

function initiativeDirection(initiative: InitiativePreference): number {
  if (initiative === 'prefer-partner') return -1;
  if (initiative === 'prefer-initiate') return 1;
  return 0;
}

function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampBalance(value: number): number {
  return Math.max(-100, Math.min(100, value));
}

function percentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
