import { CURRENT_CATALOGUE_SNAPSHOT } from '../../infrastructure/catalogue/catalogue-v1';
import { createProfile } from '../../domain/profile/profile';
import { createAnswerKey } from '../../domain/profile/profile-answer';
import { QuestionnaireService } from './questionnaire-service';

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
    const oral = service.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile, 'oral');

    const cunnilingus = oral?.practices.find((item) => item.practice.id === 'cunnilingus');
    const fellatio = oral?.practices.find((item) => item.practice.id === 'fellatio');

    expect(cunnilingus?.roles.map((item) => item.role.id)).toEqual(['give']);
    expect(fellatio?.roles.map((item) => item.role.id)).toEqual(['receive']);
    expect(oral?.filtered).toBe(2);
  });

  it('can include filtered roles without losing their filtered marker', () => {
    const profile = heterosexualMaleProfile();
    const oral = service.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile, 'oral', true);
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

    const oral = service.getCategory(CURRENT_CATALOGUE_SNAPSHOT, answered, 'oral');
    expect(oral?.answered).toBe(1);
    expect(oral?.total).toBeGreaterThan(1);
  });

  it('returns deterministic category navigation and catalogue relationship', () => {
    const profile = heterosexualMaleProfile();
    expect(service.getNeighbours(CURRENT_CATALOGUE_SNAPSHOT, 'oral')).toEqual({
      previousCategoryId: 'general',
      nextCategoryId: 'penetration',
    });
    expect(service.getCatalogueRelationship(CURRENT_CATALOGUE_SNAPSHOT, profile)).toBe('current');
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

    expect(service.countUnknownAnswers(CURRENT_CATALOGUE_SNAPSHOT, candidate)).toBe(1);
  });
});
