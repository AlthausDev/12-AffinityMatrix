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
   * Sex of the person whose body is acted on or whose anatomy is the subject of the preference.
   * Builders map this to the receiver/target for directed practices and to the subject for
   * focus/state/toy items.
   */
  readonly anatomySex?: 'male' | 'female';
  /**
   * Sex required of the person performing a directed practice. This is intentionally separate
   * from anatomySex: e.g. ejaculation has a male actor while the receiving body may be either sex.
   */
  readonly actorSex?: 'male' | 'female';
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
