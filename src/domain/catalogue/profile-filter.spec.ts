import { PracticeRole } from './practice';
import { getRelevantPartnerSexes, isRoleVisible } from './profile-filter';
import { ProfileMetadata } from '../profile/profile-metadata';

function metadata(overrides: Partial<ProfileMetadata> = {}): ProfileMetadata {
  return {
    filterByProfileMetadata: true,
    ...overrides,
  };
}

describe('profile filtering', () => {
  it('does not infer partner sex until both sex and orientation are known', () => {
    expect(getRelevantPartnerSexes(metadata({ sex: 'male' }))).toBeUndefined();
    expect(getRelevantPartnerSexes(metadata({ orientation: 'heterosexual' }))).toBeUndefined();
  });

  it('derives the opposite sex for heterosexual profiles', () => {
    expect(getRelevantPartnerSexes(metadata({ sex: 'male', orientation: 'heterosexual' }))).toEqual([
      'female',
    ]);
    expect(getRelevantPartnerSexes(metadata({ sex: 'female', orientation: 'heterosexual' }))).toEqual([
      'male',
    ]);
  });

  it('derives the same sex for homosexual profiles', () => {
    expect(getRelevantPartnerSexes(metadata({ sex: 'female', orientation: 'homosexual' }))).toEqual([
      'female',
    ]);
  });

  it('keeps both partner sexes for bisexual profiles', () => {
    expect(getRelevantPartnerSexes(metadata({ sex: 'male', orientation: 'bisexual' }))).toEqual([
      'male',
      'female',
    ]);
  });

  it('filters roles by the profile sex when the role constrains the subject', () => {
    const role: PracticeRole = {
      id: 'receive',
      label: 'Receive',
      perspective: 'receptive',
      applicability: { selfSex: ['female'] },
    };

    expect(isRoleVisible(role, metadata({ sex: 'male' }))).toBe(false);
    expect(isRoleVisible(role, metadata({ sex: 'female' }))).toBe(true);
  });

  it('filters roles by relevant partner sex when orientation can be applied', () => {
    const role: PracticeRole = {
      id: 'give',
      label: 'Give',
      perspective: 'active',
      applicability: { partnerSex: ['female'] },
    };

    expect(
      isRoleVisible(role, metadata({ sex: 'male', orientation: 'heterosexual' })),
    ).toBe(true);
    expect(
      isRoleVisible(role, metadata({ sex: 'male', orientation: 'homosexual' })),
    ).toBe(false);
  });

  it('keeps roles visible when filtering is disabled', () => {
    const role: PracticeRole = {
      id: 'receive',
      label: 'Receive',
      perspective: 'receptive',
      applicability: { selfSex: ['female'] },
    };

    expect(
      isRoleVisible(role, metadata({ sex: 'male', filterByProfileMetadata: false })),
    ).toBe(true);
  });
});
