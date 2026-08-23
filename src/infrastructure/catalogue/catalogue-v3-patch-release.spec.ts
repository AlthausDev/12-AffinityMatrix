import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const questionnaire = new QuestionnaireService();

function profile(id: string, sex: 'male' | 'female', orientation: 'heterosexual' | 'homosexual') {
  return createProfile({ id, now: '2026-08-23T00:00:00.000Z', metadata: { sex, orientation } });
}

function roleIds(userProfile: ReturnType<typeof profile>): string[] {
  const toys = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, userProfile, 'toys');
  return [...new Set(
    toys?.practices
      .find((item) => item.practice.id === 'double-ended-dildo')?.roles.map((item) => item.role.id) ?? [],
  )];
}

describe('Catalogue V3 patch-release corrections', () => {
  it('filters shared double-ended dildo use only for heterosexual men', () => {
    expect(roleIds(profile('hetero-man-double-dildo-patch', 'male', 'heterosexual'))).toEqual([]);
    expect(roleIds(profile('hetero-woman-double-dildo-patch', 'female', 'heterosexual'))).toEqual([
      'use-together',
      'use-on-self',
    ]);
    expect(roleIds(profile('gay-man-double-dildo-patch', 'male', 'homosexual'))).toEqual(['use-together']);
    expect(roleIds(profile('lesbian-double-dildo-patch', 'female', 'homosexual'))).toEqual([
      'use-together',
      'use-on-self',
    ]);
  });
});
