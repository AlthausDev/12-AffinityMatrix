import { Sex } from '../profile/profile-metadata';

export type PracticeId = string;
export type RoleId = string;
export type RolePerspective = 'active' | 'receptive' | 'neutral';
export type RoleContextAxis = 'counterpartSex';

export interface RoleApplicability {
  readonly selfSex?: readonly Sex[];
  readonly partnerSex?: readonly Sex[];
}

export interface PracticeRole {
  readonly id: RoleId;
  readonly label: string;
  readonly perspective: RolePerspective;
  readonly applicability?: RoleApplicability;
  readonly contextAxes?: readonly RoleContextAxis[];
}

export interface RoleCompatibilityPair {
  readonly leftRoleId: RoleId;
  readonly rightRoleId: RoleId;
}

export interface Practice {
  readonly id: PracticeId;
  readonly categoryId: string;
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
