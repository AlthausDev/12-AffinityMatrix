import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v1';

describe('current catalogue snapshot', () => {
  it('satisfies catalogue invariants before it can be shipped', () => {
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
  });
});
