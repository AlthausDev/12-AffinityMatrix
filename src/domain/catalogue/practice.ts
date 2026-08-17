import { Sex } from '../profile/profile-metadata';

export type RolePerspective = 'active' | 'receptive' | 'neutral';

export interface RoleApplicability {
  selfSex?: readonly Sex[];
  partnerSex?: readonly Sex[];
}

export interface PracticeRole {
  id: string;
  label: string;
  perspective: RolePerspective;
  applicability?: RoleApplicability;
}

export interface Practice {
  id: string;
  categoryId: string;
  label: string;
  description?: string;
  roles: readonly PracticeRole[];
}

export interface PracticeCategory {
  id: string;
  label: string;
  description?: string;
  order: number;
}
