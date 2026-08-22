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

  it('treats self-anatomy constraints as hard applicability', () => {
    const role: PracticeRole = {
      id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['female'] },
    };
    expect(policy.isRoleApplicable(role, context({ sex: 'male' }))).toBe(false);
    expect(policy.isRoleVisible(role, context({ sex: 'male' }))).toBe(false);
    expect(policy.isRoleApplicable(role, context({ sex: 'female' }))).toBe(true);
  });

  it('uses partner anatomy as soft relevance until a counterpart variant identifies the actual partner', () => {
    const role: PracticeRole = {
      id: 'give', label: 'Give', perspective: 'active', applicability: { partnerSex: ['female'] },
    };
    expect(policy.isRoleApplicable(role, context({ sex: 'male', orientation: 'homosexual' }))).toBe(true);
    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'heterosexual' }))).toBe(true);
    expect(policy.isRoleVisible(role, context({ sex: 'male', orientation: 'homosexual' }))).toBe(false);
  });

  it('filters relevant counterpart variants while rejecting anatomically impossible variants', () => {
    const ordinaryRole: PracticeRole = {
      id: 'restrain', label: 'Restrain partner', perspective: 'active', contextAxes: ['counterpartSex'],
    };
    const heterosexualWoman = context({ sex: 'female', orientation: 'heterosexual' });
    expect(policy.isRoleApplicable(ordinaryRole, heterosexualWoman, { counterpartSex: 'female' })).toBe(true);
    expect(policy.isRoleVisible(ordinaryRole, heterosexualWoman, { counterpartSex: 'male' })).toBe(true);
    expect(policy.isRoleVisible(ordinaryRole, heterosexualWoman, { counterpartSex: 'female' })).toBe(false);

    const femaleAnatomyRole: PracticeRole = {
      id: 'give', label: 'Give', perspective: 'active',
      applicability: { partnerSex: ['female'] }, contextAxes: ['counterpartSex'],
    };
    expect(policy.isRoleApplicable(femaleAnatomyRole, heterosexualWoman, { counterpartSex: 'male' })).toBe(false);
    expect(policy.isRoleApplicable(femaleAnatomyRole, heterosexualWoman, { counterpartSex: 'female' })).toBe(true);
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

    expect(policy.isRoleApplicable(selfRole, context({ sex: 'female' }), { targetSite: 'vaginal' })).toBe(true);
    expect(policy.isRoleApplicable(selfRole, context({ sex: 'female' }), { targetSite: 'penis' })).toBe(false);
    expect(policy.isRoleApplicable(selfRole, context({ sex: 'male' }), { targetSite: 'vaginal' })).toBe(false);
    expect(policy.isRoleApplicable(selfRole, context({ sex: 'male' }), { targetSite: 'penis' })).toBe(true);

    const bisexualWoman = context({ sex: 'female', orientation: 'bisexual' });
    expect(policy.isRoleApplicable(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'vaginal' })).toBe(false);
    expect(policy.isRoleApplicable(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'penis' })).toBe(true);
    expect(policy.isRoleApplicable(partnerRole, bisexualWoman, { counterpartSex: 'female', targetSite: 'vaginal' })).toBe(true);
    expect(policy.isRoleApplicable(partnerRole, bisexualWoman, { counterpartSex: 'female', targetSite: 'penis' })).toBe(false);
    expect(policy.isRoleApplicable(partnerRole, bisexualWoman, { counterpartSex: 'male', targetSite: 'anal' })).toBe(true);
  });

  it('disabling metadata filtering reveals irrelevant variants but never impossible anatomy', () => {
    const ordinaryRole: PracticeRole = {
      id: 'give', label: 'Give', perspective: 'active', contextAxes: ['counterpartSex'],
    };
    expect(policy.isRoleVisible(
      ordinaryRole,
      context({ sex: 'male', orientation: 'heterosexual' }, false),
      { counterpartSex: 'male' },
    )).toBe(true);

    const impossibleRole: PracticeRole = {
      id: 'receive', label: 'Receive', perspective: 'receptive', applicability: { selfSex: ['female'] },
    };
    expect(policy.isRoleVisible(impossibleRole, context({ sex: 'male' }, false))).toBe(false);
  });
});
