import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2 } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT as CATALOGUE_V2_SNAPSHOT } from './catalogue-v2';

const questionnaire = new QuestionnaireService();

describe('catalogue v2 legacy snapshot', () => {
  it('remains a valid version-2 snapshot for historical semantics', () => {
    expect(CATALOGUE_V2_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V2);
    expect(catalogueSnapshotValidator.validate(CATALOGUE_V2_SNAPSHOT)).toEqual([]);
  });

  it('splits kissing into directional counterpart-scoped roles', () => {
    const kissing = CATALOGUE_V2_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'kissing');
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
    const general = questionnaire.getCategory(CATALOGUE_V2_SNAPSHOT, profile, 'general');
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
      .getCategory(CATALOGUE_V2_SNAPSHOT, heterosexual, 'general')
      ?.practices.find((practice) => practice.practice.id === 'kissing');
    const homoKissing = questionnaire
      .getCategory(CATALOGUE_V2_SNAPSHOT, homosexual, 'general')
      ?.practices.find((practice) => practice.practice.id === 'kissing');

    expect(heteroKissing?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'give:male', 'receive:male',
    ]);
    expect(homoKissing?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual([
      'give:female', 'receive:female',
    ]);
  });

  it('preserves the v2 toy role semantics as historical catalogue data', () => {
    const vibrator = CATALOGUE_V2_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'vibrator');
    expect(vibrator?.roles.map((role) => role.id)).toEqual(['use-on-partner', 'use-on-self']);
  });
});
