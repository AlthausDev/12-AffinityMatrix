import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v2';

const questionnaire = new QuestionnaireService();

describe('catalogue v2 snapshot', () => {
  it('is the validated current questionnaire catalogue', () => {
    expect(CURRENT_CATALOGUE_VERSION).toBe(CATALOGUE_VERSION_V2);
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V2);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
  });

  it('splits kissing into directional counterpart-scoped roles', () => {
    const kissing = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'kissing');
    expect(kissing?.roles.map((role) => role.id)).toEqual(['give', 'receive']);
    expect(kissing?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(kissing?.compatibleRolePairs).toEqual([{ leftRoleId: 'give', rightRoleId: 'receive' }]);
  });

  it('projects the four independent kissing cases for a bisexual woman', () => {
    const profile = createProfile({
      id: 'bisexual-woman',
      now: '2026-08-19T10:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });
    const general = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile, 'general');
    const kissing = general?.practices.find((practice) => practice.practice.id === 'kissing');

    expect(kissing?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'give:male',
      'give:female',
      'receive:male',
      'receive:female',
    ]);
  });

  it('projects only the relevant kissing counterpart for heterosexual and homosexual women', () => {
    const heterosexual = createProfile({
      id: 'heterosexual-woman',
      now: '2026-08-19T10:00:00.000Z',
      metadata: { sex: 'female', orientation: 'heterosexual' },
    });
    const homosexual = createProfile({
      id: 'homosexual-woman',
      now: '2026-08-19T10:00:00.000Z',
      metadata: { sex: 'female', orientation: 'homosexual' },
    });

    const heteroKissing = questionnaire
      .getCategory(CURRENT_CATALOGUE_SNAPSHOT, heterosexual, 'general')
      ?.practices.find((practice) => practice.practice.id === 'kissing');
    const homoKissing = questionnaire
      .getCategory(CURRENT_CATALOGUE_SNAPSHOT, homosexual, 'general')
      ?.practices.find((practice) => practice.practice.id === 'kissing');

    expect(heteroKissing?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'give:male', 'receive:male',
    ]);
    expect(homoKissing?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'give:female', 'receive:female',
    ]);
  });

  it('adds counterpart context while preserving existing semantic role ids where they remain valid', () => {
    const bondage = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'bondage');
    const vibrator = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'vibrator');

    expect(bondage?.roles.map((role) => role.id)).toEqual(['restrain', 'be-restrained']);
    expect(bondage?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(vibrator?.roles.map((role) => role.id)).toEqual(['use-on-partner', 'use-on-self']);
    expect(vibrator?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
  });
});
