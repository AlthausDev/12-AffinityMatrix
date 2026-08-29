import { Practice, RolePerspective } from '../../../domain/catalogue/practice';
import { Profile } from '../../../domain/profile/profile';
import { PREFERENCE_VALUES, Preference } from '../../../domain/profile/preference';

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

export interface PracticeProgressEntry {
  readonly practice: Practice;
  readonly answered: number;
  readonly total: number;
  readonly completionPercentage: number;
}

export interface RoleProfileEntry {
  readonly perspective: RolePerspective;
  readonly answerCount: number;
  readonly affinityCount: number;
  readonly favoriteCount: number;
  readonly affinityPercentage: number;
  readonly favoritePercentage: number;
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

export function buildPracticeProgress(
  practices: readonly DashboardPracticeProgressSource[] | undefined,
): readonly PracticeProgressEntry[] {
  return (practices ?? [])
    .map(({ practice, roles }) => {
      const total = roles.length;
      const answered = roles.filter((role) => role.answer !== undefined).length;
      return {
        practice,
        answered,
        total,
        completionPercentage: total === 0 ? 0 : Math.round((answered / total) * 100),
      };
    })
    .filter((entry) => entry.total > 0);
}

export function buildRoleProfile(
  profile: Pick<Profile, 'answers'> | undefined,
  practices: readonly Practice[] | undefined,
): readonly RoleProfileEntry[] {
  const perspectiveByRole = new Map<string, RolePerspective>();
  for (const practice of practices ?? []) {
    for (const role of practice.roles) {
      perspectiveByRole.set(roleLookupKey(practice.id, role.id), role.perspective);
    }
  }

  const counts = new Map<RolePerspective, { answerCount: number; affinityCount: number; favoriteCount: number }>(
    ROLE_PERSPECTIVES.map((perspective) => [perspective, { answerCount: 0, affinityCount: 0, favoriteCount: 0 }]),
  );

  for (const answer of Object.values(profile?.answers ?? {})) {
    const perspective = perspectiveByRole.get(roleLookupKey(answer.practiceId, answer.roleId));
    if (!perspective) continue;

    const current = counts.get(perspective);
    if (!current) continue;
    current.answerCount += 1;
    if (answer.preference === 'favorite' || answer.preference === 'like') current.affinityCount += 1;
    if (answer.preference === 'favorite') current.favoriteCount += 1;
  }

  return ROLE_PERSPECTIVES.map((perspective) => {
    const current = counts.get(perspective) ?? { answerCount: 0, affinityCount: 0, favoriteCount: 0 };
    return {
      perspective,
      ...current,
      affinityPercentage: percentage(current.affinityCount, current.answerCount),
      favoritePercentage: percentage(current.favoriteCount, current.answerCount),
    };
  });
}

function roleLookupKey(practiceId: string, roleId: string): string {
  return `${practiceId}\u0000${roleId}`;
}

function percentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
