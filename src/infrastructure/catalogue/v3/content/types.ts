import { TargetSite } from '../../../../domain/profile/profile-answer';

export type CataloguePracticeKind =
  | 'mutual'
  | 'directed'
  | 'self'
  | 'state'
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
  readonly descriptionEn?: string;
  readonly descriptionEs?: string;
  readonly kind: CataloguePracticeKind;
  readonly counterpartScoped?: boolean;
  /**
   * Sex of the person whose anatomy makes the practice meaningful. Builders map this to the
   * correct participant: the receiver for directed practices, the subject for focus/state items.
   */
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
