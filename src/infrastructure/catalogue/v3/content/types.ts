import { TargetSite } from '../../../../domain/profile/profile-answer';

export type CataloguePracticeKind =
  | 'mutual'
  | 'directed'
  | 'wear'
  | 'watch'
  | 'power'
  | 'group'
  | 'focus'
  | 'toy';

export interface CataloguePracticeSeed {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly kind: CataloguePracticeKind;
  readonly counterpartScoped?: boolean;
  readonly anatomySex?: 'male' | 'female';
  readonly targetSites?: readonly TargetSite[];
}

export interface CatalogueCategorySeed {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
  readonly order: number;
  readonly practices: readonly CataloguePracticeSeed[];
}
