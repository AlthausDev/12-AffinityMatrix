import { CatalogueSnapshot } from '../catalogue/catalogue-snapshot';
import { createProfile, Profile } from '../profile/profile';
import { AnswerScope, createAnswerKey, PracticeAnswer } from '../profile/profile-answer';
import { ProfileComparator } from './profile-comparator';

const snapshot: CatalogueSnapshot = {
  version: 2,
  catalogue: {
    categories: [
      { id: 'restraint', label: 'Restraint', order: 0 },
      { id: 'general', label: 'General', order: 1 },
    ],
    practices: [
      {
        id: 'bondage',
        categoryId: 'restraint',
        label: 'Bondage',
        roles: [
          { id: 'restrain', label: 'Restrain partner', perspective: 'active', contextAxes: ['counterpartSex'] },
          { id: 'be-restrained', label: 'Be restrained', perspective: 'receptive', contextAxes: ['counterpartSex'] },
        ],
        compatibleRolePairs: [{ leftRoleId: 'restrain', rightRoleId: 'be-restrained' }],
      },
      {
        id: 'cuddling',
        categoryId: 'general',
        label: 'Cuddling',
        roles: [{ id: 'mutual', label: 'Participate', perspective: 'neutral' }],
        compatibleRolePairs: [{ leftRoleId: 'mutual', rightRoleId: 'mutual' }],
      },
    ],
  },
};

const toySnapshot: CatalogueSnapshot = {
  version: 3,
  catalogue: {
    categories: [{ id: 'toys', label: 'Toys', order: 0 }],
    practices: [{
      id: 'dildo',
      categoryId: 'toys',
      label: 'Dildo',
      roles: [
        {
          id: 'use-on-partner',
          label: 'Use on partner',
          perspective: 'active',
          contextAxes: ['counterpartSex', 'targetSite'],
          contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
          targetOwner: 'partner',
        },
        {
          id: 'partner-uses-on-me',
          label: 'Partner uses on me',
          perspective: 'receptive',
          contextAxes: ['counterpartSex', 'targetSite'],
          contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
          targetOwner: 'self',
        },
      ],
      compatibleRolePairs: [{ leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' }],
    }],
  },
};

const comparator = new ProfileComparator();

function profile(id: string, sex?: 'male' | 'female'): Profile {
  return createProfile({
    id,
    now: '2026-08-21T18:00:00.000Z',
    metadata: sex ? { alias: id, sex } : { alias: id },
  });
}

function answer(
  source: Profile,
  practiceId: string,
  roleId: string,
  preference: PracticeAnswer['preference'],
  scope?: AnswerScope,
): Profile {
  const value: PracticeAnswer = {
    practiceId,
    roleId,
    ...(scope ? { scope } : {}),
    preference,
  };
  const key = createAnswerKey(practiceId, roleId, scope);
  return { ...source, answers: { ...source.answers, [key]: value } };
}

describe('ProfileComparator', () => {
  it('matches complementary scoped answers against the other profile sex', () => {
    const woman = answer(profile('woman', 'female'), 'bondage', 'be-restrained', 'favorite', { counterpartSex: 'male' });
    const man = answer(profile('man', 'male'), 'bondage', 'restrain', 'like', { counterpartSex: 'female' });

    const result = comparator.compare(snapshot, woman, man);
    const interaction = result.interactions[0];

    expect(result.interactions).toHaveLength(1);
    expect(interaction?.roleRelation).toBe('complementary');
    expect(interaction?.left.answer.scope?.counterpartSex).toBe('male');
    expect(interaction?.right.answer.scope?.counterpartSex).toBe('female');
    expect(interaction?.compatibility.classification).toBe('strong-match');
    expect(interaction?.compatibility.score).toBe(90);
  });

  it('does not cross bisexual counterpart variants that target another sex', () => {
    let woman = profile('woman', 'female');
    woman = answer(woman, 'bondage', 'be-restrained', 'like', { counterpartSex: 'male' });
    woman = answer(woman, 'bondage', 'be-restrained', 'boundary', { counterpartSex: 'female' });
    const man = answer(profile('man', 'male'), 'bondage', 'restrain', 'like', { counterpartSex: 'female' });

    const result = comparator.compare(snapshot, woman, man);

    expect(result.interactions).toHaveLength(1);
    expect(result.interactions[0]?.left.answer.preference).toBe('like');
    expect(result.boundaryCount).toBe(0);
  });

  it('matches toy roles only when counterpart and target site describe the same interaction', () => {
    let woman = profile('woman', 'female');
    woman = answer(woman, 'dildo', 'partner-uses-on-me', 'favorite', {
      counterpartSex: 'male',
      targetSite: 'vaginal',
    });
    woman = answer(woman, 'dildo', 'partner-uses-on-me', 'boundary', {
      counterpartSex: 'male',
      targetSite: 'anal',
    });
    const man = answer(profile('man', 'male'), 'dildo', 'use-on-partner', 'like', {
      counterpartSex: 'female',
      targetSite: 'vaginal',
    });

    const result = comparator.compare(toySnapshot, woman, man);

    expect(result.interactions).toHaveLength(1);
    expect(result.interactions[0]?.left.answer.scope?.targetSite).toBe('vaginal');
    expect(result.interactions[0]?.right.answer.scope?.targetSite).toBe('vaginal');
    expect(result.interactions[0]?.compatibility.classification).toBe('strong-match');
    expect(result.boundaryCount).toBe(0);
  });

  it('excludes unanswered interactions from the category affinity denominator', () => {
    const left = answer(profile('left'), 'cuddling', 'mutual', 'like');
    const right = answer(profile('right'), 'cuddling', 'mutual', 'like');

    const result = comparator.compare(snapshot, left, right);
    const general = result.categories.find((category) => category.categoryId === 'general');
    const restraint = result.categories.find((category) => category.categoryId === 'restraint');

    expect(general?.answeredInteractionCount).toBe(1);
    expect(general?.affinityPercentage).toBe(100);
    expect(restraint?.answeredInteractionCount).toBe(0);
    expect(restraint?.affinityPercentage).toBeNull();
  });

  it('reports boundaries separately instead of using them as an affinity penalty', () => {
    const woman = answer(profile('woman', 'female'), 'bondage', 'be-restrained', 'boundary', { counterpartSex: 'male' });
    const man = answer(profile('man', 'male'), 'bondage', 'restrain', 'favorite', { counterpartSex: 'female' });

    const result = comparator.compare(snapshot, woman, man);
    const restraint = result.categories.find((category) => category.categoryId === 'restraint');

    expect(restraint?.answeredInteractionCount).toBe(1);
    expect(restraint?.boundaryCount).toBe(1);
    expect(restraint?.affinityBasisCount).toBe(0);
    expect(restraint?.affinityPercentage).toBeNull();
  });

  it('compares a mutual role once rather than duplicating both orientations', () => {
    const left = answer(profile('left'), 'cuddling', 'mutual', 'curious');
    const right = answer(profile('right'), 'cuddling', 'mutual', 'curious');

    const result = comparator.compare(snapshot, left, right);

    expect(result.interactions).toHaveLength(1);
    expect(result.interactions[0]?.roleRelation).toBe('mutual');
    expect(result.interactions[0]?.compatibility.classification).toBe('explorable');
  });

  it('signals missing sex only when it prevents matching existing scoped answers', () => {
    const woman = answer(profile('woman', 'female'), 'bondage', 'be-restrained', 'like', { counterpartSex: 'male' });
    const unknownSex = answer(profile('unknown'), 'bondage', 'restrain', 'like', { counterpartSex: 'female' });

    const result = comparator.compare(snapshot, woman, unknownSex);

    expect(result.interactions).toHaveLength(0);
    expect(result.contextIssues.rightSexMissing).toBe(true);
    expect(result.contextIssues.leftSexMissing).toBe(false);
  });

  it('picks up new catalogue categories and practices without comparator changes', () => {
    const extended: CatalogueSnapshot = {
      ...snapshot,
      catalogue: {
        categories: [...snapshot.catalogue.categories, { id: 'future', label: 'Future', order: 2 }],
        practices: [
          ...snapshot.catalogue.practices,
          {
            id: 'future-practice',
            categoryId: 'future',
            label: 'Future practice',
            roles: [{ id: 'participate', label: 'Participate', perspective: 'neutral' }],
            compatibleRolePairs: [{ leftRoleId: 'participate', rightRoleId: 'participate' }],
          },
        ],
      },
    };
    const left = answer(profile('left'), 'future-practice', 'participate', 'favorite');
    const right = answer(profile('right'), 'future-practice', 'participate', 'like');

    const result = comparator.compare(extended, left, right);
    const future = result.categories.find((category) => category.categoryId === 'future');

    expect(future?.answeredInteractionCount).toBe(1);
    expect(future?.affinityPercentage).toBe(90);
  });
});
