import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { createProfile } from '../../domain/profile/profile';
import { createAnswerKey } from '../../domain/profile/profile-answer';
import { QuestionnaireService } from './questionnaire-service';

const snapshot: CatalogueSnapshot = {
  version: 3,
  catalogue: {
    categories: [
      { id: 'general', label: 'General', order: 0 },
      { id: 'oral', label: 'Oral', order: 1 },
      { id: 'restraint', label: 'Restraint', order: 2 },
      { id: 'toys', label: 'Toys', order: 3 },
    ],
    practices: [
      {
        id: 'kissing',
        categoryId: 'general',
        label: 'Kissing',
        roles: [{ id: 'mutual', label: 'Participate', perspective: 'neutral', contextAxes: ['counterpartSex'] }],
        compatibleRolePairs: [{ leftRoleId: 'mutual', rightRoleId: 'mutual' }],
      },
      {
        id: 'cunnilingus',
        categoryId: 'oral',
        label: 'Cunnilingus',
        roles: [
          { id: 'give', label: 'Give', perspective: 'active', applicability: { partnerSex: ['female'] } },
          { id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['female'] }, contextAxes: ['counterpartSex'] },
        ],
        compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
      },
      {
        id: 'bondage',
        categoryId: 'restraint',
        label: 'Bondage',
        roles: [
          { id: 'restrain', label: 'Restrain', perspective: 'active', contextAxes: ['counterpartSex'] },
          { id: 'be-restrained', label: 'Be restrained', perspective: 'receptive', contextAxes: ['counterpartSex'] },
        ],
        compatibleRolePairs: [{ leftRoleId: 'restrain', rightRoleId: 'be-restrained' }],
      },
      {
        id: 'dildo',
        categoryId: 'toys',
        label: 'Dildo',
        roles: [
          {
            id: 'use-on-self', label: 'Use on myself', perspective: 'neutral',
            contextAxes: ['targetSite'],
            contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
            targetOwner: 'self',
          },
          {
            id: 'use-on-partner', label: 'Use on partner', perspective: 'active',
            contextAxes: ['counterpartSex', 'targetSite'],
            contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
            targetOwner: 'partner',
          },
          {
            id: 'partner-uses-on-me', label: 'Partner uses on me', perspective: 'receptive',
            contextAxes: ['counterpartSex', 'targetSite'],
            contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
            targetOwner: 'self',
          },
        ],
        compatibleRolePairs: [
          { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
          { leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' },
        ],
      },
    ],
  },
};

const service = new QuestionnaireService();

function profile(
  sex: 'male' | 'female',
  orientation: 'heterosexual' | 'homosexual' | 'bisexual',
) {
  return createProfile({
    id: 'profile-1',
    now: '2026-08-19T08:00:00.000Z',
    metadata: { sex, orientation },
  });
}

describe('QuestionnaireService', () => {
  it('expands a bisexual role into independently answerable counterpart-sex variants', () => {
    const current = profile('female', 'bisexual');
    const general = service.getCategory(snapshot, current, 'general');
    const roles = general?.practices[0]?.roles ?? [];

    expect(roles.map((item) => item.counterpartSex)).toEqual(['male', 'female']);
    expect(roles.map((item) => item.answerKey)).toEqual([
      createAnswerKey('kissing', 'mutual', { counterpartSex: 'male' }),
      createAnswerKey('kissing', 'mutual', { counterpartSex: 'female' }),
    ]);
    expect(general?.total).toBe(2);
    expect(general?.filtered).toBe(0);
  });

  it('shows only the relevant counterpart variant for heterosexual and homosexual profiles by default', () => {
    const heterosexualWoman = service.getCategory(snapshot, profile('female', 'heterosexual'), 'restraint');
    expect(heterosexualWoman?.practices[0]?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'restrain:male',
      'be-restrained:male',
    ]);
    expect(heterosexualWoman?.filtered).toBe(2);

    const homosexualWoman = service.getCategory(snapshot, profile('female', 'homosexual'), 'restraint');
    expect(homosexualWoman?.practices[0]?.roles.map((item) => item.counterpartSex)).toEqual(['female', 'female']);
  });

  it('can reveal filtered counterpart variants without merging their identities', () => {
    const current = profile('female', 'heterosexual');
    const restraint = service.getCategory(snapshot, current, 'restraint', true);
    const roles = restraint?.practices[0]?.roles ?? [];

    expect(roles).toHaveLength(4);
    expect(roles.filter((item) => item.filtered).map((item) => item.counterpartSex)).toEqual(['female', 'female']);
    expect(new Set(roles.map((item) => item.answerKey)).size).toBe(4);
  });

  it('keeps preferences for men and women independent in progress calculation', () => {
    const current = profile('female', 'bisexual');
    const maleKey = createAnswerKey('kissing', 'mutual', { counterpartSex: 'male' });
    const answered = {
      ...current,
      answers: {
        [maleKey]: {
          practiceId: 'kissing',
          roleId: 'mutual',
          scope: { counterpartSex: 'male' as const },
          preference: 'curious' as const,
        },
      },
    };

    const general = service.getCategory(snapshot, answered, 'general');
    expect(general?.answered).toBe(1);
    expect(general?.total).toBe(2);
    expect(general?.completionPercentage).toBe(50);
    expect(general?.practices[0]?.roles.find((item) => item.counterpartSex === 'female')?.answer).toBeUndefined();
  });

  it('expands target-site scopes and applies anatomy to the actual target owner', () => {
    const woman = profile('female', 'bisexual');
    const toys = service.getCategory(snapshot, woman, 'toys');
    const dildo = toys?.practices.find((item) => item.practice.id === 'dildo');

    expect(dildo?.roles
      .filter((item) => item.role.id === 'use-on-self')
      .map((item) => item.scope?.targetSite))
      .toEqual(['mouth', 'vaginal', 'anal']);

    expect(dildo?.roles
      .filter((item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'male')
      .map((item) => item.scope?.targetSite))
      .toEqual(['mouth', 'anal']);

    expect(dildo?.roles
      .filter((item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'female')
      .map((item) => item.scope?.targetSite))
      .toEqual(['mouth', 'vaginal', 'anal']);
  });

  it('excludes hidden categories only from summaries and neighbours, not direct category lookup', () => {
    const current = profile('female', 'bisexual');
    const summaries = service.getCategorySummaries(snapshot, current, false, ['oral', 'restraint']);

    expect(summaries.map((item) => item.category.id)).toEqual(['general', 'toys']);
    expect(service.getNeighbours(snapshot, 'general', ['oral', 'restraint'])).toEqual({ nextCategoryId: 'toys' });
    expect(service.getCategory(snapshot, current, 'oral')).toBeDefined();
  });

  it('still applies anatomy-related role applicability before counterpart context', () => {
    const oral = service.getCategory(snapshot, profile('male', 'heterosexual'), 'oral');
    expect(oral?.practices[0]?.roles.map((item) => item.role.id)).toEqual(['give']);
    expect(oral?.filtered).toBe(2);
  });

  it('treats a legacy unscoped answer to a newly scoped role as preserved unknown data', () => {
    const current = profile('female', 'bisexual');
    const legacyKey = createAnswerKey('kissing', 'mutual');
    const candidate = {
      ...current,
      catalogueVersion: 1,
      answers: {
        [legacyKey]: {
          practiceId: 'kissing', roleId: 'mutual', preference: 'like' as const,
        },
      },
    };

    expect(service.countUnknownAnswers(snapshot, candidate)).toBe(1);
    expect(service.getCatalogueRelationship(snapshot, candidate)).toBe('profile-older');
  });
});
