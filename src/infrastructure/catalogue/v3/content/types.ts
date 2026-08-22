import { TargetSite } from '../../../../domain/profile/profile-answer';
import { RolePerspective } from '../../../../domain/catalogue/practice';

export type CataloguePracticeKind =
  | 'mutual'
  | 'directed'
  | 'self'
  | 'state'
  | 'wear'
  | 'watch'
  | 'power'
  | 'paired'
  | 'group'
  | 'focus'
  | 'toy';

export interface CataloguePairedRoleSeed {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly perspective: RolePerspective;
}

export interface CatalogueRoleLabelSeed {
  readonly en: string;
  readonly es: string;
}

export interface CataloguePracticeSeed {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn?: string;
  readonly descriptionEs?: string;
  readonly kind: CataloguePracticeKind;
  readonly counterpartScoped?: boolean;
  /** Two complementary semantic roles used by `paired` practices. */
  readonly pairedRoles?: readonly [CataloguePairedRoleSeed, CataloguePairedRoleSeed];
  /** Optional human wording for builder-generated roles, keyed by the stable role id. */
  readonly roleLabels?: Readonly<Record<string, CatalogueRoleLabelSeed>>;
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
