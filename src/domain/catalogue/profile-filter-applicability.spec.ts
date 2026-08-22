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
    expect(policy.isRoleVisible(mff, lesbian)).toBe(false);
    expect(policy.isRoleVisible(fff, heterosexualWoman)).toBe(false);
    expect(policy.isRoleVisible(mff, heterosexualWoman)).toBe(false);
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
