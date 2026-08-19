import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { createProfile } from '../../domain/profile/profile';
import { createAnswerKey } from '../../domain/profile/profile-answer';
import { QuestionnaireService } from './questionnaire-service';

const snapshot: CatalogueSnapshot = {
  version: 1,
  catalogue: {
    categories: [
      { id: 'general', label: 'General', order: 0 },
      { id: 'oral', label: 'Oral', order: 1 },
      { id: 'penetration', label: 'Penetration', order: 2 },
    ],
    practices: [
      {
        id: 'cunnilingus',
        categoryId: 'oral',
        label: 'Cunnilingus',
        roles: [
          { id: 'give', label: 'Give', perspective: 'active', applicability: { partnerSex: ['female'] } },
          { id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['female'] } },
        ],
        compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
      },
      {
        id: 'fellatio',
        categoryId: 'oral',
        label: 'Fellatio',
        roles: [
          { id: 'give', label: 'Give', perspective: 'active', applicability: { partnerSex: ['male'] } },
          { id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['male'] } },
        ],
        compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
      },
    ],
  },
};

const service = new QuestionnaireService();

function heterosexualMaleProfile() {
  return createProfile({
    id: 'profile-1',
    now: '2026-08-19T08:00:00.000Z',
    metadata: { sex: 'male', orientation: 'heterosexual' },
  });
}

describe('QuestionnaireService', () => {
  it('projects only applicable role questions by default', () => {
    const profile = heterosexualMaleProfile();
    const oral = service.getCategory(snapshot, profile, 'oral');

    const cunnilingus = oral?.practices.find((item) => item.practice.id === 'cunnilingus');
    const fellatio = oral?.practices.find((item) => item.practice.id === 'fellatio');

    expect(cunnilingus?.roles.map((item) => item.role.id)).toEqual(['give']);
    expect(fellatio?.roles.map((item) => item.role.id)).toEqual(['receive']);
    expect(oral?.filtered).toBe(2);
  });

  it('can include filtered roles without losing their filtered marker', () => {
    const profile = heterosexualMaleProfile();
    const oral = service.getCategory(snapshot, profile, 'oral', true);
    const cunnilingus = oral?.practices.find((item) => item.practice.id === 'cunnilingus');

    expect(cunnilingus?.roles).toHaveLength(2);
    expect(cunnilingus?.roles.find((item) => item.role.id === 'receive')?.filtered).toBe(true);
  });

  it('keeps unanswered distinct from neutral when calculating progress', () => {
    const profile = heterosexualMaleProfile();
    const key = createAnswerKey('cunnilingus', 'give');
    const answered = {
      ...profile,
      answers: {
        [key]: {
          practiceId: 'cunnilingus',
          roleId: 'give',
          preference: 'neutral' as const,
        },
      },
    };

    const oral = service.getCategory(snapshot, answered, 'oral');
    expect(oral?.answered).toBe(1);
    expect(oral?.total).toBe(2);
    expect(oral?.completionPercentage).toBe(50);
  });

  it('returns deterministic category navigation and catalogue relationship', () => {
    const profile = heterosexualMaleProfile();
    expect(service.getNeighbours(snapshot, 'oral')).toEqual({
      previousCategoryId: 'general',
      nextCategoryId: 'penetration',
    });
    expect(service.getCatalogueRelationship(snapshot, profile)).toBe('current');
  });

  it('detects answers whose practice or role is not present in the current catalogue', () => {
    const profile = heterosexualMaleProfile();
    const candidate = {
      ...profile,
      answers: {
        'legacy-practice::legacy-role': {
          practiceId: 'legacy-practice',
          roleId: 'legacy-role',
          preference: 'like' as const,
        },
      },
    };

    expect(service.countUnknownAnswers(snapshot, candidate)).toBe(1);
  });
});
