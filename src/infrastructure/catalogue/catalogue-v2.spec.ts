import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v2';

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

  it('adds counterpart context while preserving existing semantic role ids where they remain valid', () => {
    const bondage = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'bondage');
    const vibrator = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'vibrator');

    expect(bondage?.roles.map((role) => role.id)).toEqual(['restrain', 'be-restrained']);
    expect(bondage?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(vibrator?.roles.map((role) => role.id)).toEqual(['use-on-partner', 'use-on-self']);
    expect(vibrator?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
  });
});
