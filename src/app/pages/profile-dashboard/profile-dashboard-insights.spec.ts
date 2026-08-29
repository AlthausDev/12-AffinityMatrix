import { Practice } from '../../../domain/catalogue/practice';
import { createProfile } from '../../../domain/profile/profile';
import { createAnswerKey } from '../../../domain/profile/profile-answer';
import {
  buildPreferenceDistribution,
  buildRoleProfile,
  buildSubcategoryProgress,
} from './profile-dashboard-insights';

describe('buildPreferenceDistribution', () => {
  it('summarizes saved preferences without treating unanswered questions as neutral', () => {
    const profile = createProfile({
      id: 'profile-1',
      now: '2026-08-24T09:00:00.000Z',
      answers: {
        [createAnswerKey('kissing', 'mutual')]: {
          practiceId: 'kissing', roleId: 'mutual', preference: 'favorite',
        },
        [createAnswerKey('bondage', 'receive')]: {
          practiceId: 'bondage', roleId: 'receive', preference: 'favorite',
        },
        [createAnswerKey('roleplay', 'mutual')]: {
          practiceId: 'roleplay', roleId: 'mutual', preference: 'curious',
        },
        [createAnswerKey('edge', 'receive')]: {
          practiceId: 'edge', roleId: 'receive', preference: 'boundary',
        },
      },
    });

    const distribution = buildPreferenceDistribution(profile);

    expect(distribution.find((item) => item.preference === 'favorite')).toMatchObject({
      count: 2,
      percentage: 50,
    });
    expect(distribution.find((item) => item.preference === 'curious')).toMatchObject({
      count: 1,
      percentage: 25,
    });
    expect(distribution.find((item) => item.preference === 'boundary')).toMatchObject({
      count: 1,
      percentage: 25,
    });
    expect(distribution.find((item) => item.preference === 'like')?.count).toBe(0);
    expect(distribution.at(-1)?.endPercentage).toBeCloseTo(100);
  });

  it('returns a stable empty distribution before the questionnaire has answers', () => {
    const distribution = buildPreferenceDistribution(undefined);

    expect(distribution).toHaveLength(6);
    expect(distribution.every((item) => item.count === 0 && item.percentage === 0)).toBe(true);
    expect(distribution.at(-1)?.endPercentage).toBe(0);
  });
});

describe('buildSubcategoryProgress', () => {
  const practice = (id: string): Practice => ({
    id,
    categoryId: 'category-1',
    label: id,
    roles: [],
    compatibleRolePairs: [],
  });

  it('counts questionnaire questions at practice level inside each subcategory', () => {
    const progress = buildSubcategoryProgress([
      {
        id: 'subcategory-a',
        label: 'Subcategory A',
        description: 'A',
        practiceIds: ['practice-a', 'practice-b'],
      },
    ], [
      {
        practice: practice('practice-a'),
        roles: [{ answer: {} }, {}, {}],
      },
      {
        practice: practice('practice-b'),
        roles: [{}, {}],
      },
    ]);

    expect(progress).toEqual([
      expect.objectContaining({
        id: 'subcategory-a',
        answered: 1,
        total: 2,
        completionPercentage: 50,
      }),
    ]);
  });

  it('omits taxonomy groups with no visible practices', () => {
    const progress = buildSubcategoryProgress([
      { id: 'hidden', label: 'Hidden', description: '', practiceIds: ['hidden-practice'] },
      { id: 'visible', label: 'Visible', description: '', practiceIds: ['visible-practice'] },
    ], [
      { practice: practice('visible-practice'), roles: [{}] },
    ]);

    expect(progress).toHaveLength(1);
    expect(progress[0]?.id).toBe('visible');
  });
});

describe('buildRoleProfile', () => {
  const practices: readonly Practice[] = [
    {
      id: 'paired',
      categoryId: 'category-1',
      label: 'Paired',
      roles: [
        { id: 'give', label: 'Give', perspective: 'active' },
        { id: 'receive', label: 'Receive', perspective: 'receptive' },
      ],
      compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
    },
    {
      id: 'shared',
      categoryId: 'category-1',
      label: 'Shared',
      roles: [{ id: 'participate', label: 'Participate', perspective: 'neutral' }],
      compatibleRolePairs: [],
    },
  ];

  it('groups saved answers by role perspective and separates affinity from favorites', () => {
    const profile = createProfile({
      id: 'profile-role',
      now: '2026-08-24T09:00:00.000Z',
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
        [createAnswerKey('shared', 'participate')]: {
          practiceId: 'shared', roleId: 'participate', preference: 'favorite',
        },
      },
    });

    const profileByRole = buildRoleProfile(profile, practices);

    expect(profileByRole).toEqual([
      expect.objectContaining({
        perspective: 'active',
        answerCount: 2,
        affinityCount: 2,
        favoriteCount: 1,
        affinityPercentage: 100,
        favoritePercentage: 50,
      }),
      expect.objectContaining({
        perspective: 'receptive',
        answerCount: 1,
        affinityCount: 0,
        favoriteCount: 0,
        affinityPercentage: 0,
        favoritePercentage: 0,
      }),
      expect.objectContaining({
        perspective: 'neutral',
        answerCount: 1,
        affinityCount: 1,
        favoriteCount: 1,
        affinityPercentage: 100,
        favoritePercentage: 100,
      }),
    ]);
  });

  it('ignores saved answers that can no longer be mapped to the current catalogue', () => {
    const profile = createProfile({
      id: 'profile-legacy',
      now: '2026-08-24T09:00:00.000Z',
      answers: {
        [createAnswerKey('removed-practice', 'old-role')]: {
          practiceId: 'removed-practice', roleId: 'old-role', preference: 'favorite',
        },
      },
    });

    const profileByRole = buildRoleProfile(profile, practices);

    expect(profileByRole.every((entry) => entry.answerCount === 0)).toBe(true);
  });
});
