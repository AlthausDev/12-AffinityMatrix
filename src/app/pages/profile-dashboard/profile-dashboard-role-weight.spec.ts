import { Practice } from '../../../domain/catalogue/practice';
import { createProfile } from '../../../domain/profile/profile';
import { createAnswerKey } from '../../../domain/profile/profile-answer';
import { buildRoleProfile } from './profile-dashboard-insights';

const practices: readonly Practice[] = [
  {
    id: 'paired',
    categoryId: 'test',
    label: 'Paired',
    roles: [
      { id: 'give', label: 'Give', perspective: 'active' },
      { id: 'receive', label: 'Receive', perspective: 'receptive' },
    ],
    compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
  },
  {
    id: 'shared',
    categoryId: 'test',
    label: 'Shared',
    roles: [{ id: 'mutual', label: 'Mutual', perspective: 'neutral' }],
    compatibleRolePairs: [],
  },
];

describe('role profile weight', () => {
  it('separates within-role affinity from each role family share of positive affinity', () => {
    const profile = createProfile({
      id: 'role-weight-profile',
      now: '2026-08-29T20:00:00.000Z',
      answers: {
        [createAnswerKey('paired', 'give')]: {
          practiceId: 'paired', roleId: 'give', preference: 'favorite',
        },
        [createAnswerKey('paired', 'give', { targetSite: 'mouth' })]: {
          practiceId: 'paired', roleId: 'give', scope: { targetSite: 'mouth' }, preference: 'like',
        },
        [createAnswerKey('paired', 'receive')]: {
          practiceId: 'paired', roleId: 'receive', preference: 'curious',
        },
        [createAnswerKey('shared', 'mutual')]: {
          practiceId: 'shared', roleId: 'mutual', preference: 'favorite',
        },
      },
    });

    const result = buildRoleProfile(profile, practices);

    expect(result.map((entry) => entry.profileWeightPercentage)).toEqual([37, 21, 42]);
    expect(result.reduce((sum, entry) => sum + entry.profileWeightPercentage, 0)).toBe(100);
    expect(result[0]).toMatchObject({ answerCount: 1, affinityPercentage: 89 });
  });
});
