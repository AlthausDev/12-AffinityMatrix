import { Practice } from '../../../domain/catalogue/practice';
import { createProfile } from '../../../domain/profile/profile';
import { createAnswerKey } from '../../../domain/profile/profile-answer';
import { buildPracticeProgress, buildPreferenceDistribution } from './profile-dashboard-insights';

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

describe('buildPracticeProgress', () => {
  const practice = (id: string): Practice => ({
    id,
    categoryId: 'category-1',
    label: id,
    roles: [],
    compatibleRolePairs: [],
  });

  it('calculates completion from visible projected roles only', () => {
    const progress = buildPracticeProgress([
      {
        practice: practice('practice-a'),
        roles: [{ answer: {} }, {}, {}],
      },
      {
        practice: practice('practice-b'),
        roles: [{ answer: {} }, { answer: {} }],
      },
    ]);

    expect(progress).toEqual([
      expect.objectContaining({ answered: 1, total: 3, completionPercentage: 33 }),
      expect.objectContaining({ answered: 2, total: 2, completionPercentage: 100 }),
    ]);
  });

  it('omits practices without visible roles', () => {
    const progress = buildPracticeProgress([
      { practice: practice('hidden'), roles: [] },
      { practice: practice('visible'), roles: [{}] },
    ]);

    expect(progress).toHaveLength(1);
    expect(progress[0]?.practice.id).toBe('visible');
  });
});
