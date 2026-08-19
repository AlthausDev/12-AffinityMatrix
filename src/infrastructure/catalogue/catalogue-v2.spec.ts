import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v2';

describe('catalogue v2 snapshot', () => {
  it('is the validated current questionnaire catalogue', () => {
    expect(CURRENT_CATALOGUE_VERSION).toBe(CATALOGUE_VERSION_V2);
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V2);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
  });

  it('adds counterpart context without changing stable practice or role ids', () => {
    const kissing = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'kissing');
    const bondage = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'bondage');
    const soloToy = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
      .find((practice) => practice.id === 'vibrator')
      ?.roles.find((role) => role.id === 'use-solo');

    expect(kissing?.roles[0]?.contextAxes).toEqual(['counterpartSex']);
    expect(bondage?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(soloToy?.contextAxes).toBeUndefined();
  });
});
