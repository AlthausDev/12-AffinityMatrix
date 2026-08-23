import { AnswerScope, TargetSite } from '../profile/profile-answer';
import { Practice, PracticeRole, SelfProfileApplicabilityExclusion } from './practice';
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
  /** Hard applicability: impossible anatomy/context variants must never become questionnaire items. */
  abstract isRoleApplicable(
    role: PracticeRole,
    context: ProfileQuestionContext,
    scope?: AnswerScope,
  ): boolean;

  /** Soft visibility: applicable variants can still be hidden by the user's metadata filters. */
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
  override isRoleApplicable(
    role: PracticeRole,
    context: ProfileQuestionContext,
    scope?: AnswerScope,
  ): boolean {
    const applicability = role.applicability;
    if (
      context.metadata.sex &&
      applicability?.selfSex &&
      !applicability.selfSex.includes(context.metadata.sex)
    ) return false;

    const counterpartSex = scope?.counterpartSex;
    if (
      counterpartSex &&
      applicability?.partnerSex &&
      !applicability.partnerSex.includes(counterpartSex)
    ) return false;

    if (
      context.metadata.sex &&
      applicability?.groupComposition &&
      !applicability.groupComposition.includes(context.metadata.sex)
    ) return false;

    return this.isTargetSiteApplicable(role, context.metadata, scope);
  }

  override isRoleVisible(
    role: PracticeRole,
    context: ProfileQuestionContext,
    scope?: AnswerScope,
  ): boolean {
    if (!this.isRoleApplicable(role, context, scope)) return false;
    if (!context.settings.filterQuestionnaireByMetadata) return true;

    const relevantPartnerSexes = getRelevantPartnerSexes(context.metadata);
    const counterpartSex = scope?.counterpartSex;
    if (counterpartSex && relevantPartnerSexes && !relevantPartnerSexes.includes(counterpartSex)) {
      return false;
    }

    if (!counterpartSex && relevantPartnerSexes && role.applicability?.partnerSex) {
      if (!role.applicability.partnerSex.some((sex) => relevantPartnerSexes.includes(sex))) return false;
    }

    if (
      relevantPartnerSexes &&
      context.metadata.sex &&
      role.applicability?.groupComposition &&
      !this.isGroupCompositionRelevant(
        role.applicability.groupComposition,
        context.metadata.sex,
        relevantPartnerSexes,
      )
    ) return false;

    if (
      relevantPartnerSexes &&
      context.metadata.sex &&
      role.applicability?.requiresAnyParticipantSex &&
      !this.hasRelevantRequiredParticipant(
        role.applicability.requiresAnyParticipantSex,
        context.metadata.sex,
        relevantPartnerSexes,
      )
    ) return false;

    if (
      role.applicability?.selfProfileExclusions?.some((exclusion) =>
        this.matchesSelfProfileExclusion(exclusion, context.metadata, scope)
      )
    ) return false;

    return true;
  }

  private isGroupCompositionRelevant(
    composition: readonly Sex[],
    selfSex: Sex,
    relevantPartnerSexes: readonly Sex[],
  ): boolean {
    const remaining = [...composition];
    const selfIndex = remaining.indexOf(selfSex);
    if (selfIndex < 0) return false;
    remaining.splice(selfIndex, 1);
    return remaining.some((sex) => relevantPartnerSexes.includes(sex));
  }

  private hasRelevantRequiredParticipant(
    requiredSexes: readonly Sex[],
    selfSex: Sex,
    relevantPartnerSexes: readonly Sex[],
  ): boolean {
    return requiredSexes.includes(selfSex)
      || requiredSexes.some((sex) => relevantPartnerSexes.includes(sex));
  }

  private matchesSelfProfileExclusion(
    exclusion: SelfProfileApplicabilityExclusion,
    metadata: ProfileMetadata,
    scope?: AnswerScope,
  ): boolean {
    if (exclusion.sex !== undefined && metadata.sex !== exclusion.sex) return false;
    if (exclusion.orientation !== undefined && metadata.orientation !== exclusion.orientation) return false;
    if (exclusion.targetSites !== undefined) {
      const targetSite = scope?.targetSite;
      if (!targetSite || !exclusion.targetSites.includes(targetSite)) return false;
    }
    return true;
  }

  private isTargetSiteApplicable(
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
