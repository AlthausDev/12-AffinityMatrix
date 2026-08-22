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
  return { metadata, settings: { filterQuestionnaireByMetadata } };
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
      id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['female'] },
    };
    expect(policy.isRoleVisible(role, context({ sex: 'male' }))).toBe(false);
    expect(policy.isRoleVisible(role, context({ sex: 'female' }))).toBe(true);
  });

  it('filters roles by relevant partner sex when orientation can be applied', () => {
    const role: PracticeRole = {
      id: 'give', label: 'Give', perspective: 'active', applicability: { partnerSex: ['female'] },
    };
    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'heterosexual' }))).toBe(true);
    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'homosexual' }))).toBe(false);
  });

  it('filters counterpart-scoped variants independently', () => {
    const role: PracticeRole = {
      id: 'restrain', label: 'Restrain partner', perspective: 'active', contextAxes: ['counterpartSex'],
    };
    const heterosexualWoman = context({ sex: 'female', orientation: 'heterosexual' });
    expect(policy.isRoleVisible(role, heterosexualWoman, { counterpartSex: 'male' })).toBe(true);
    expect(policy.isRoleVisible(role, heterosexualWoman, { counterpartSex: 'female' })).toBe(false);

    const bisexualWoman = context({ sex: 'female', orientation: 'bisexual' });
    expect(policy.isRoleVisible(role, bisexualWoman, { counterpartSex: 'male' })).toBe(true);
    expect(policy.isRoleVisible(role, bisexualWoman, { counterpartSex: 'female' })).toBe(true);
  });

  it('applies target-site anatomy to the role target rather than always to the profile owner', () => {
    const selfRole: PracticeRole = {
      id: 'use-on-self',
      label: 'Use on self',
      perspective: 'neutral',
      contextAxes: ['targetSite'],
      contextValues: { targetSite: ['vaginal', 'penis', 'anal'] },
      targetOwner: 'self',
    };
    const partnerRole: PracticeRole = {
      id: 'use-on-partner',
      label: 'Use on partner',
      perspective: 'active',
      contextAxes: ['counterpartSex', 'targetSite'],
      contextValues: { targetSite: ['vaginal', 'penis', 'anal'] },
      targetOwner: 'partner',
    };

    expect(policy.isRoleVisible(selfRole, context({ sex: 'female' }), { targetSite: 'vaginal' })).toBe(true);
    expect(policy.isRoleVisible(selfRole, context({ sex: 'female' }), { targetSite: 'penis' })).toBe(false);
    expect(policy.isRoleVisible(selfRole, context({ sex: 'male' }), { targetSite: 'vaginal' })).toBe(false);
    expect(policy.isRoleVisible(selfRole, context({ sex: 'male' }), { targetSite: 'penis' })).toBe(true);

    const bisexualWoman = context({ sex: 'female', orientation: 'bisexual' });
    expect(policy.isRoleVisible(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'vaginal' })).toBe(false);
    expect(policy.isRoleVisible(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'penis' })).toBe(true);
    expect(policy.isRoleVisible(partnerRole, bisexualWoman, { counterpartSex: 'female', targetSite: 'vaginal' })).toBe(true);
    expect(policy.isRoleVisible(partnerRole, bisexualWoman, { counterpartSex: 'female', targetSite: 'penis' })).toBe(false);
    expect(policy.isRoleVisible(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'anal' })).toBe(true);
  });

  it('keeps all roles, counterpart variants, and anatomy variants visible when filtering is disabled', () => {
    const role: PracticeRole = {
      id: 'use-on-self', label: 'Use on self', perspective: 'neutral',
      applicability: { selfSex: ['female'] }, contextAxes: ['targetSite'],
      contextValues: { targetSite: ['vaginal'] }, targetOwner: 'self',
    };
    expect(policy.isRoleVisible(role, context({ sex: 'male' }, false), { targetSite: 'vaginal' })).toBe(true);
  });
});
