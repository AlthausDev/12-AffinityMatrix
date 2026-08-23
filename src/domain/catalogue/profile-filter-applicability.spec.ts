import { PracticeRole } from './practice';
import { MetadataQuestionVisibilityPolicy, ProfileQuestionContext } from './profile-filter';
import { ProfileMetadata } from '../profile/profile-metadata';

const policy = new MetadataQuestionVisibilityPolicy();

function context(
  metadata: ProfileMetadata,
  filterQuestionnaireByMetadata = true,
): ProfileQuestionContext {
  return { metadata, settings: { filterQuestionnaireByMetadata } };
}

describe('profile filtering applicability extensions', () => {
  it('matches fixed group composition after accounting for the profile owner', () => {
    const fff: PracticeRole = {
      id: 'participate',
      label: 'Participate',
      perspective: 'neutral',
      applicability: { groupComposition: ['female', 'female', 'female'] },
    };
    const mff: PracticeRole = {
      id: 'participate',
      label: 'Participate',
      perspective: 'neutral',
      applicability: { groupComposition: ['male', 'female', 'female'] },
    };

    const lesbian = context({ sex: 'female', orientation: 'homosexual' });
    const heterosexualWoman = context({ sex: 'female', orientation: 'heterosexual' });

    expect(policy.isRoleVisible(fff, lesbian)).toBe(true);
    expect(policy.isRoleVisible(mff, lesbian)).toBe(true);
    expect(policy.isRoleVisible(fff, heterosexualWoman)).toBe(false);
    expect(policy.isRoleVisible(mff, heterosexualWoman)).toBe(true);
  });

  it('requires at least one relevant participant of a declared sex when metadata filtering is enabled', () => {
    const semenRelated: PracticeRole = {
      id: 'participate',
      label: 'Participate',
      perspective: 'neutral',
      applicability: { requiresAnyParticipantSex: ['male'] },
    };

    expect(policy.isRoleVisible(
      semenRelated,
      context({ sex: 'female', orientation: 'homosexual' }),
    )).toBe(false);
    expect(policy.isRoleVisible(
      semenRelated,
      context({ sex: 'female', orientation: 'heterosexual' }),
    )).toBe(true);
    expect(policy.isRoleVisible(
      semenRelated,
      context({ sex: 'male', orientation: 'homosexual' }),
    )).toBe(true);
  });

  it('applies self-profile exclusions only while metadata filtering is enabled', () => {
    const penetrativeReceiver: PracticeRole = {
      id: 'receive',
      label: 'Receive penetration',
      perspective: 'receptive',
      applicability: {
        selfProfileExclusions: [{ sex: 'male', orientation: 'heterosexual' }],
      },
    };

    expect(policy.isRoleVisible(
      penetrativeReceiver,
      context({ sex: 'male', orientation: 'heterosexual' }),
    )).toBe(false);
    expect(policy.isRoleVisible(
      penetrativeReceiver,
      context({ sex: 'male', orientation: 'bisexual' }),
    )).toBe(true);
    expect(policy.isRoleVisible(
      penetrativeReceiver,
      context({ sex: 'male', orientation: 'heterosexual' }, false),
    )).toBe(true);
  });

  it('can limit a profile exclusion to selected target sites', () => {
    const toyOnSelf: PracticeRole = {
      id: 'use-on-self',
      label: 'Use on self',
      perspective: 'neutral',
      targetOwner: 'self',
      contextAxes: ['targetSite'],
      contextValues: { targetSite: ['mouth', 'anal', 'penis'] },
      applicability: {
        selfProfileExclusions: [{
          sex: 'male', orientation: 'heterosexual', targetSites: ['mouth', 'anal'],
        }],
      },
    };
    const heterosexualMan = context({ sex: 'male', orientation: 'heterosexual' });

    expect(policy.isRoleVisible(toyOnSelf, heterosexualMan, { targetSite: 'mouth' })).toBe(false);
    expect(policy.isRoleVisible(toyOnSelf, heterosexualMan, { targetSite: 'anal' })).toBe(false);
    expect(policy.isRoleVisible(toyOnSelf, heterosexualMan, { targetSite: 'penis' })).toBe(true);
  });

  it('keeps metadata relevance soft while fixed self-composition remains hard applicability', () => {
    const mff: PracticeRole = {
      id: 'participate',
      label: 'Participate',
      perspective: 'neutral',
      applicability: { groupComposition: ['male', 'female', 'female'] },
    };
    const fff: PracticeRole = {
      id: 'participate',
      label: 'Participate',
      perspective: 'neutral',
      applicability: { groupComposition: ['female', 'female', 'female'] },
    };
    const lesbianWithoutSoftFilter = context(
      { sex: 'female', orientation: 'homosexual' },
      false,
    );

    expect(policy.isRoleVisible(mff, lesbianWithoutSoftFilter)).toBe(true);
    expect(policy.isRoleVisible(fff, context({ sex: 'male', orientation: 'bisexual' }, false))).toBe(false);
  });
});
