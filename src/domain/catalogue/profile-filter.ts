import { AnswerScope, TargetSite } from '../profile/profile-answer';
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
  if (!sex || !orientation) return undefined;
  if (orientation === 'bisexual') return ALL_SEXES;
  if (orientation === 'homosexual') return [sex];
  return [sex === 'male' ? 'female' : 'male'];
}

export abstract class QuestionVisibilityPolicy {
  abstract isRoleVisible(
    role: PracticeRole,
    context: ProfileQuestionContext,
    scope?: AnswerScope,
  ): boolean;

  getVisibleRoles(practice: Practice, context: ProfileQuestionContext): readonly PracticeRole[] {
    return practice.roles.filter((role) => this.isRoleVisible(role, context));
  }

  isPracticeVisible(practice: Practice, context: ProfileQuestionContext): boolean {
    return this.getVisibleRoles(practice, context).length > 0;
  }
}

export class MetadataQuestionVisibilityPolicy extends QuestionVisibilityPolicy {
  override isRoleVisible(
    role: PracticeRole,
    context: ProfileQuestionContext,
    scope?: AnswerScope,
  ): boolean {
    if (!context.settings.filterQuestionnaireByMetadata) return true;

    const applicability = role.applicability;
    if (
      context.metadata.sex &&
      applicability?.selfSex &&
      !applicability.selfSex.includes(context.metadata.sex)
    ) return false;

    const counterpartSex = scope?.counterpartSex;
    if (counterpartSex) {
      if (applicability?.partnerSex && !applicability.partnerSex.includes(counterpartSex)) return false;
      const relevantPartnerSexes = getRelevantPartnerSexes(context.metadata);
      if (relevantPartnerSexes && !relevantPartnerSexes.includes(counterpartSex)) return false;
    } else {
      const relevantPartnerSexes = getRelevantPartnerSexes(context.metadata);
      if (relevantPartnerSexes && applicability?.partnerSex) {
        if (!applicability.partnerSex.some((sex) => relevantPartnerSexes.includes(sex))) return false;
      }
    }

    return this.isTargetSiteVisible(role, context.metadata, scope);
  }

  private isTargetSiteVisible(
    role: PracticeRole,
    metadata: ProfileMetadata,
    scope?: AnswerScope,
  ): boolean {
    const targetSite = scope?.targetSite;
    if (!targetSite || !role.targetOwner) return true;

    const targetSex = role.targetOwner === 'self' ? metadata.sex : scope?.counterpartSex;
    if (!targetSex) return true;

    return this.targetSiteSupportsSex(targetSite, targetSex);
  }

  private targetSiteSupportsSex(targetSite: TargetSite, sex: Sex): boolean {
    if (targetSite === 'vaginal') return sex === 'female';
    if (targetSite === 'penis') return sex === 'male';
    return true;
  }
}

export const defaultQuestionVisibilityPolicy = new MetadataQuestionVisibilityPolicy();
