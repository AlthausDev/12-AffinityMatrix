import { CatalogueSnapshotValidator } from './catalogue-snapshot';

const validator = new CatalogueSnapshotValidator();

function validSnapshot() {
  return {
    version: 1,
    catalogue: {
      categories: [{ id: 'restraint', label: 'Restraint', order: 0 }],
      practices: [
        {
          id: 'bondage',
          categoryId: 'restraint',
          label: 'Bondage',
          roles: [
            { id: 'tie', label: 'Tie partner', perspective: 'active' },
            { id: 'be-tied', label: 'Be tied', perspective: 'receptive' },
          ],
          compatibleRolePairs: [{ leftRoleId: 'tie', rightRoleId: 'be-tied' }],
        },
      ],
    },
  };
}

describe('CatalogueSnapshotValidator', () => {
  it('binds a coherent catalogue to an independent positive version', () => {
    expect(validator.validate(validSnapshot())).toEqual([]);
  });

  it('rejects invalid versions and invalid nested catalogues', () => {
    expect(validator.isValid({ ...validSnapshot(), version: 0 })).toBe(false);
    expect(
      validator.isValid({
        ...validSnapshot(),
        catalogue: { ...validSnapshot().catalogue, categories: [] },
      }),
    ).toBe(false);
  });
});
