import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V1 } from '../../domain/catalogue/catalogue-version';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v1';

describe('catalogue v1 snapshot', () => {
  it('remains a valid immutable historical snapshot', () => {
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V1);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
  });
});
