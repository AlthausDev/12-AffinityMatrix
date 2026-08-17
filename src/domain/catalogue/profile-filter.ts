import { Practice, PracticeRole } from './practice';
import { ProfileMetadata, Sex } from '../profile/profile-metadata';

const ALL_SEXES: readonly Sex[] = ['male', 'female'];

export function getRelevantPartnerSexes(metadata: ProfileMetadata): readonly Sex[] | undefined {
  const { sex, orientation } = metadata;

  if (!sex || !orientation) {
    return undefined;
  }

  if (orientation === 'bisexual') {
    return ALL_SEXES;
  }

  if (orientation === 'homosexual') {
    return [sex];
  }

  return [sex === 'male' ? 'female' : 'male'];
}

export function isRoleVisible(role: PracticeRole, metadata: ProfileMetadata): boolean {
  if (!metadata.filterByProfileMetadata) {
    return true;
  }

  const applicability = role.applicability;
  if (!applicability) {
    return true;
  }

  if (metadata.sex && applicability.selfSex && !applicability.selfSex.includes(metadata.sex)) {
    return false;
  }

  const relevantPartnerSexes = getRelevantPartnerSexes(metadata);
  if (relevantPartnerSexes && applicability.partnerSex) {
    return applicability.partnerSex.some((sex) => relevantPartnerSexes.includes(sex));
  }

  return true;
}

export function getVisibleRoles(practice: Practice, metadata: ProfileMetadata): readonly PracticeRole[] {
  return practice.roles.filter((role) => isRoleVisible(role, metadata));
}

export function isPracticeVisible(practice: Practice, metadata: ProfileMetadata): boolean {
  return getVisibleRoles(practice, metadata).length > 0;
}
