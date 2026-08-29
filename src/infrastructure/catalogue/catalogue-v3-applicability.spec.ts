import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';

const questionnaire = new QuestionnaireService();

function profile(id: string, sex: 'male' | 'female', orientation: 'heterosexual' | 'homosexual' | 'bisexual') {
  return createProfile({
    id,
    now: '2026-08-23T00:00:00.000Z',
    metadata: { sex, orientation },
  });
}

function category(id: string, userProfile: ReturnType<typeof profile>) {
  return questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, userProfile, id);
}

function practiceIds(id: string, userProfile: ReturnType<typeof profile>): string[] {
  return category(id, userProfile)?.practices.map((item) => item.practice.id) ?? [];
}

function roleIds(categoryId: string, practiceId: string, userProfile: ReturnType<typeof profile>): string[] {
  const roles = category(categoryId, userProfile)?.practices
    .find((item) => item.practice.id === practiceId)?.roles
    .map((item) => item.role.id) ?? [];
  return [...new Set(roles)];
}

describe('Catalogue V3 final applicability', () => {
  it('keeps threesome compositions containing at least one orientation-compatible other participant', () => {
    const lesbian = profile('lesbian', 'female', 'homosexual');
    const gayMan = profile('gay-man', 'male', 'homosexual');
    const heterosexualWoman = profile('heterosexual-woman', 'female', 'heterosexual');
    const heterosexualMan = profile('heterosexual-man', 'male', 'heterosexual');

    expect(practiceIds('groups', lesbian).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mff', 'threesome-fff']);
    expect(practiceIds('groups', gayMan).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mmf', 'threesome-mmm']);
    expect(practiceIds('groups', heterosexualWoman).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mmf', 'threesome-mff']);
    expect(practiceIds('groups', heterosexualMan).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mmf', 'threesome-mff']);
  });

  it('keeps all compatible fixed threesome compositions for bisexual profiles', () => {
    const bisexualWoman = profile('bisexual-woman', 'female', 'bisexual');
    const bisexualMan = profile('bisexual-man', 'male', 'bisexual');

    expect(practiceIds('groups', bisexualWoman).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mmf', 'threesome-mff', 'threesome-fff']);
    expect(practiceIds('groups', bisexualMan).filter((id) => id.startsWith('threesome-')))
      .toEqual(['threesome-mmf', 'threesome-mff', 'threesome-mmm']);
  });

  it('hides semen practices from a homosexual woman while retaining female-fluid practices', () => {
    const lesbian = profile('lesbian-fluids', 'female', 'homosexual');
    const ids = practiceIds('fluids', lesbian);
    const semenIds = [
      'semen-on-face',
      'semen-on-breasts',
      'semen-on-buttocks',
      'semen-in-mouth',
      'swallowing',
      'spitting-semen',
      'snowballing',
      'creampie-vaginal',
      'creampie-anal',
      'creampie-cleanup',
    ];

    for (const id of semenIds) expect(ids, id).not.toContain(id);
    expect(ids).toContain('female-ejaculation');
  });

  it('uses semen-source anatomy rather than orientation stereotypes', () => {
    const heterosexualMan = profile('heterosexual-man-fluids', 'male', 'heterosexual');

    expect(roleIds('fluids', 'swallowing', heterosexualMan)).toEqual(['partner-state']);
    expect(roleIds('fluids', 'snowballing', heterosexualMan)).toContain('participate');
  });

  it('keeps harness strap-ons sex-neutral while preserving strapless wearer anatomy', () => {
    const lesbian = profile('lesbian-toys', 'female', 'homosexual');
    const heterosexualMan = profile('heterosexual-man-toys', 'male', 'heterosexual');
    const heterosexualWoman = profile('heterosexual-woman-toys', 'female', 'heterosexual');
    const gayMan = profile('gay-man-toys', 'male', 'homosexual');

    for (const current of [lesbian, heterosexualMan, heterosexualWoman, gayMan]) {
      expect(roleIds('toys', 'strap-on', current))
        .toEqual(['use-on-partner', 'partner-uses-on-me']);
    }

    expect(roleIds('toys', 'strapless-strap-on', lesbian))
      .toEqual(['use-on-partner', 'partner-uses-on-me']);
    expect(roleIds('toys', 'strapless-strap-on', heterosexualMan))
      .toEqual(['partner-uses-on-me']);
    expect(roleIds('toys', 'strapless-strap-on', heterosexualWoman))
      .toEqual(['use-on-partner']);
    expect(practiceIds('toys', gayMan)).not.toContain('strapless-strap-on');
  });

  it('does not infer toy preferences from heterosexual male orientation', () => {
    const heterosexualMan = profile('heterosexual-man-orifice-toys', 'male', 'heterosexual');
    const bisexualMan = profile('bisexual-man-orifice-toys', 'male', 'bisexual');

    expect(roleIds('toys', 'dildo', heterosexualMan))
      .toEqual(['use-on-self', 'use-on-partner', 'partner-uses-on-me']);
    expect(roleIds('toys', 'anal-plug', heterosexualMan))
      .toEqual(['use-on-self', 'use-on-partner', 'partner-uses-on-me']);
    expect(roleIds('toys', 'dildo', bisexualMan))
      .toEqual(['use-on-self', 'use-on-partner', 'partner-uses-on-me']);
  });

  it('uses anatomy rather than orientation for penetrative receiver roles', () => {
    const heterosexualMan = profile('heterosexual-man-penetration', 'male', 'heterosexual');

    expect(roleIds('penetration', 'anal-penetration', heterosexualMan))
      .toEqual(['give', 'receive']);
    expect(roleIds('manual-masturbation', 'fingering-anal', heterosexualMan))
      .toEqual(['give', 'receive']);
    expect(roleIds('manual-masturbation', 'prostate-massage-manual', heterosexualMan))
      .toEqual(['receive']);
    expect(roleIds('penetration', 'vaginal-penetration', heterosexualMan))
      .toEqual(['give']);
  });

  it('keeps external wand use available to bodies of either sex', () => {
    const heterosexualMan = profile('heterosexual-man-wand', 'male', 'heterosexual');
    const gayMan = profile('gay-man-wand', 'male', 'homosexual');
    const lesbian = profile('lesbian-wand', 'female', 'homosexual');

    for (const current of [heterosexualMan, gayMan, lesbian]) {
      expect(roleIds('toys', 'wand-vibrator', current))
        .toEqual(['use-on-self', 'use-on-partner', 'partner-uses-on-me']);
    }
  });

  it('does not assign generic gangbang roles from heterosexual stereotypes', () => {
    const heterosexualMan = profile('heterosexual-man-gangbang', 'male', 'heterosexual');
    const heterosexualWoman = profile('heterosexual-woman-gangbang', 'female', 'heterosexual');

    expect(roleIds('groups', 'gangbang', heterosexualMan)).toEqual(['center', 'participate']);
    expect(roleIds('groups', 'gangbang', heterosexualWoman)).toEqual(['center', 'participate']);
  });

  it('limits facial-hair attraction to male counterpart variants', () => {
    const lesbian = profile('lesbian-body', 'female', 'homosexual');
    const gayMan = profile('gay-man-body', 'male', 'homosexual');

    expect(practiceIds('body-fetishes', lesbian)).not.toContain('facial-hair');
    expect(practiceIds('body-fetishes', gayMan)).toContain('facial-hair');
  });

  it('gives glory-hole participants explicit sides and filters them by anatomy and orientation', () => {
    const heterosexualMan = profile('heterosexual-man-glory-hole', 'male', 'heterosexual');
    const heterosexualWoman = profile('heterosexual-woman-glory-hole', 'female', 'heterosexual');
    const gayMan = profile('gay-man-glory-hole', 'male', 'homosexual');
    const lesbian = profile('lesbian-glory-hole', 'female', 'homosexual');

    expect(roleIds('places-settings', 'glory-hole', heterosexualMan)).toEqual(['present-penis']);
    expect(roleIds('places-settings', 'glory-hole', heterosexualWoman)).toEqual(['stimulate-other-side']);
    expect(roleIds('places-settings', 'glory-hole', gayMan))
      .toEqual(['present-penis', 'stimulate-other-side']);
    expect(practiceIds('places-settings', lesbian)).not.toContain('glory-hole');

    const gloryHole = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
      .find((item) => item.id === 'glory-hole');
    expect(gloryHole?.roles.map((role) => [role.id, role.label])).toEqual([
      ['present-penis', 'Put my penis through the glory hole'],
      ['stimulate-other-side', 'Stimulate the penis from the other side'],
    ]);
  });

  it('consolidates medical patient roleplay and keeps doctor/nurse as a separate pairing', () => {
    const finalRoleplay = CATALOGUE_V3_CONTENT.find((item) => item.id === 'roleplay');
    const ids = finalRoleplay?.practices.map((item) => item.id) ?? [];

    expect(RETIRED_V3_PRACTICE_IDS.has('doctor-patient-roleplay')).toBe(true);
    expect(RETIRED_V3_PRACTICE_IDS.has('nurse-patient-roleplay')).toBe(true);
    expect(ids).not.toContain('doctor-patient-roleplay');
    expect(ids).not.toContain('nurse-patient-roleplay');
    expect(ids).toContain('medical-professional-patient-roleplay');
    expect(ids).toContain('doctor-nurse-roleplay');

    const medical = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
      .find((item) => item.id === 'medical-professional-patient-roleplay');
    const doctorNurse = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
      .find((item) => item.id === 'doctor-nurse-roleplay');
    expect(medical?.roles.map((role) => role.id)).toEqual(['medical-professional', 'patient']);
    expect(doctorNurse?.roles.map((role) => role.id)).toEqual(['doctor', 'nurse']);
  });
});
