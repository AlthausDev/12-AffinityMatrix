import { PracticeRole } from './practice';
import {
  getRelevantPartnerSexes,
  MetadataQuestionVisibilityPolicy,
  ProfileQuestionContext,
} from './profile-filter';
import { ProfileMetadata } from '../profile/profile-metadata';

const policy = new MetadataQuestionVisibilityPolicy();

function context(
  metadata: ProfileMetadata = {},
  filterQuestionnaireByMetadata = true,
): ProfileQuestionContext {
  return {
    metadata,
    settings: { filterQuestionnaireByMetadata },
  };
}

describe('profile filtering', () => {
  it('does not infer partner sex until both sex and orientation are known', () => {
    expect(getRelevantPartnerSexes({ sex: 'male' })).toBeUndefined();
    expect(getRelevantPartnerSexes({ orientation: 'heterosexual' })).toBeUndefined();
  });

  it('derives partner sex from orientation', () => {
    expect(getRelevantPartnerSexes({ sex: 'male', orientation: 'heterosexual' })).toEqual(['female']);
    expect(getRelevantPartnerSexes({ sex: 'female', orientation: 'homosexual' })).toEqual(['female']);
    expect(getRelevantPartnerSexes({ sex: 'male', orientation: 'bisexual' })).toEqual(['male', 'female']);
  });

  it('filters roles by the profile sex when the role constrains the subject', () => {
    const role: PracticeRole = {
      id: 'receive',
      label: 'Receive',
      perspective: 'receptive',
      applicability: { selfSex: ['female'] },
    };

    expect(policy.isRoleVisible(role, context({ sex: 'male' }))).toBe(false);
    expect(policy.isRoleVisible(role, context({ sex: 'female' }))).toBe(true);
  });

  it('filters roles by relevant partner sex when orientation can be applied', () => {
    const role: PracticeRole = {
      id: 'give',
      label: 'Give',
      perspective: 'active',
      applicability: { partnerSex: ['female'] },
    };

    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'heterosexual' }))).toBe(true);
    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'homosexual' }))).toBe(false);
  });

  it('keeps all roles visible when filtering is disabled', () => {
    const role: PracticeRole = {
      id: 'receive',
      label: 'Receive',
      perspective: 'receptive',
      applicability: { selfSex: ['female'] },
    };

    expect(policy.isRoleVisible(role, context({ sex: 'male' }, false))).toBe(true);
  });
});
