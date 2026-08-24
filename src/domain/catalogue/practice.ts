import { TargetSite } from '../profile/profile-answer';
import { Sex, SexualOrientation } from '../profile/profile-metadata';

export type PracticeId = string;
export type RoleId = string;
export type SubcategoryId = string;
export type RolePerspective = 'active' | 'receptive' | 'neutral';
export type RoleContextAxis = 'counterpartSex' | 'targetSite';
export type TargetOwner = 'self' | 'partner';

export interface SelfProfileApplicabilityExclusion {
  readonly sex?: Sex;
  readonly orientation?: SexualOrientation;
  /** When present, the exclusion only applies to these scoped target sites. */
  readonly targetSites?: readonly TargetSite[];
}

export interface RoleApplicability {
  readonly selfSex?: readonly Sex[];
  readonly partnerSex?: readonly Sex[];
  /** Exact participant composition for fixed-composition group practices. */
  readonly groupComposition?: readonly Sex[];
  /** At least one participant in the relevant encounter must have one of these sexes. */
  readonly requiresAnyParticipantSex?: readonly Sex[];
  /** Soft metadata exclusions used to suppress irrelevant role/scope variants in the normal questionnaire. */
  readonly selfProfileExclusions?: readonly SelfProfileApplicabilityExclusion[];
}

export interface RoleContextValues {
  readonly targetSite?: readonly TargetSite[];
}

export interface PracticeRole {
  readonly id: RoleId;
  readonly label: string;
  readonly perspective: RolePerspective;
  readonly applicability?: RoleApplicability;
  readonly contextAxes?: readonly RoleContextAxis[];
  readonly contextValues?: RoleContextValues;
  readonly targetOwner?: TargetOwner;
}

export interface RoleCompatibilityPair {
  readonly leftRoleId: RoleId;
  readonly rightRoleId: RoleId;
}

export interface Practice {
  readonly id: PracticeId;
  readonly categoryId: string;
  /** Optional while the 0.2 catalogue taxonomy is migrated category by category. */
  readonly subcategoryId?: SubcategoryId;
  readonly label: string;
  readonly description?: string;
  readonly roles: readonly PracticeRole[];
  readonly compatibleRolePairs: readonly RoleCompatibilityPair[];
}

export interface PracticeCategory {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly order: number;
}

export interface PracticeSubcategory {
  readonly id: SubcategoryId;
  readonly categoryId: string;
  readonly label: string;
  readonly description?: string;
  readonly order: number;
}
