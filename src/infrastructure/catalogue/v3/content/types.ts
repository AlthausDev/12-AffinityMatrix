import { RoleApplicability, RolePerspective } from '../../../../domain/catalogue/practice';
import { TargetSite } from '../../../../domain/profile/profile-answer';
import { Sex } from '../../../../domain/profile/profile-metadata';

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

export type CatalogueToyRoleId = 'use-on-self' | 'use-on-partner' | 'partner-uses-on-me';

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

export interface CatalogueRoleLabelsSeed extends Readonly<Record<string, CatalogueRoleLabelSeed | undefined>> {
  readonly participate?: CatalogueRoleLabelSeed;
  readonly give?: CatalogueRoleLabelSeed;
  readonly receive?: CatalogueRoleLabelSeed;
  readonly self?: CatalogueRoleLabelSeed;
  readonly 'self-state'?: CatalogueRoleLabelSeed;
  readonly 'partner-state'?: CatalogueRoleLabelSeed;
  readonly wear?: CatalogueRoleLabelSeed;
  readonly 'partner-wears'?: CatalogueRoleLabelSeed;
  readonly watch?: CatalogueRoleLabelSeed;
  readonly 'be-watched'?: CatalogueRoleLabelSeed;
  readonly lead?: CatalogueRoleLabelSeed;
  readonly follow?: CatalogueRoleLabelSeed;
  readonly center?: CatalogueRoleLabelSeed;
  readonly interest?: CatalogueRoleLabelSeed;
  readonly 'use-on-self'?: CatalogueRoleLabelSeed;
  readonly 'use-on-partner'?: CatalogueRoleLabelSeed;
  readonly 'partner-uses-on-me'?: CatalogueRoleLabelSeed;
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
  readonly roleLabels?: CatalogueRoleLabelsSeed;
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
  /** Fixed participant composition for group variants such as MMF/MFF/MMM/FFF. */
  readonly groupComposition?: readonly Sex[];
  /** Encounter requires at least one participant of one of these sexes. */
  readonly requiresAnyParticipantSex?: readonly Sex[];
  /** Extra applicability constraints for individual semantic roles. */
  readonly roleApplicability?: Readonly<Record<string, RoleApplicability | undefined>>;
  /** Optional subset of the standard toy roles. */
  readonly toyRoles?: readonly CatalogueToyRoleId[];
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
