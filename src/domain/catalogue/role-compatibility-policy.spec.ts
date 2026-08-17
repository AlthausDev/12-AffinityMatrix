import { Practice } from './practice';
import { ExplicitRoleCompatibilityPolicy } from './role-compatibility-policy';

const practice: Practice = {
  id: 'example',
  categoryId: 'example-category',
  label: 'Example',
  roles: [
    { id: 'give', label: 'Give', perspective: 'active' },
    { id: 'receive', label: 'Receive', perspective: 'receptive' },
    { id: 'observe', label: 'Observe', perspective: 'neutral' },
  ],
  compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
};

describe('ExplicitRoleCompatibilityPolicy', () => {
  const policy = new ExplicitRoleCompatibilityPolicy();

  it('matches declared complementary roles in either comparison direction', () => {
    expect(policy.areCompatible(practice, 'give', 'receive')).toBe(true);
    expect(policy.areCompatible(practice, 'receive', 'give')).toBe(true);
  });

  it('does not infer compatibility merely from role perspective', () => {
    expect(policy.areCompatible(practice, 'give', 'observe')).toBe(false);
  });

  it('rejects role ids not declared by the practice', () => {
    expect(policy.areCompatible(practice, 'give', 'missing')).toBe(false);
  });
});
