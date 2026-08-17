import { Practice, PracticeRole } from './practice';
import { ProfileMetadata, Sex } from '../profile/profile-metadata';
import { ProfileSettings } from '../profile/profile-settings';

const ALL_SEXES: readonly Sex[] = ['male', 'female'];

export interface ProfileQuestionContext {
  readonly metadata: ProfileMetadata;
  readonly settings: ProfileSettings;
}

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

export abstract class QuestionVisibilityPolicy {
  abstract isRoleVisible(role: PracticeRole, context: ProfileQuestionContext): boolean;

  getVisibleRoles(practice: Practice, context: ProfileQuestionContext): readonly PracticeRole[] {
    return practice.roles.filter((role) => this.isRoleVisible(role, context));
  }

  isPracticeVisible(practice: Practice, context: ProfileQuestionContext): boolean {
    return this.getVisibleRoles(practice, context).length > 0;
  }
}

export class MetadataQuestionVisibilityPolicy extends QuestionVisibilityPolicy {
  override isRoleVisible(role: PracticeRole, context: ProfileQuestionContext): boolean {
    if (!context.settings.filterQuestionnaireByMetadata) {
      return true;
    }

    const applicability = role.applicability;
    if (!applicability) {
      return true;
    }

    if (
      context.metadata.sex &&
      applicability.selfSex &&
      !applicability.selfSex.includes(context.metadata.sex)
    ) {
      return false;
    }

    const relevantPartnerSexes = getRelevantPartnerSexes(context.metadata);
    if (relevantPartnerSexes && applicability.partnerSex) {
      return applicability.partnerSex.some((sex) => relevantPartnerSexes.includes(sex));
    }

    return true;
  }
}

export const defaultQuestionVisibilityPolicy = new MetadataQuestionVisibilityPolicy();
