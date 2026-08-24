import { Profile } from '../../../domain/profile/profile';
import { PREFERENCE_VALUES, Preference } from '../../../domain/profile/preference';

export interface PreferenceDistributionEntry {
  readonly preference: Preference;
  readonly count: number;
  readonly percentage: number;
  readonly startPercentage: number;
  readonly endPercentage: number;
}

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
