import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2 } from '../../domain/catalogue/catalogue-version';
import { Practice } from '../../domain/catalogue/practice';
import { CURRENT_CATALOGUE_SNAPSHOT as CATALOGUE_V1 } from './catalogue-v1';

const COUNTERPART_CONTEXT_ROLES = new Set<string>([
  'cuddling::mutual',
  'mutual-masturbation::mutual',
  'cunnilingus::receive',
  'fellatio::receive',
  'face-sitting::sit-on-partner',
  'face-sitting::partner-sits-on-me',
  'vaginal-penetration::receive',
  'anal-penetration::penetrate',
  'anal-penetration::receive',
  'fingering::give',
  'fingering::receive',
  'bondage::restrain',
  'bondage::be-restrained',
  'handcuffs::restrain',
  'handcuffs::be-restrained',
  'blindfold::blindfold-partner',
  'blindfold::be-blindfolded',
  'domination::dominant',
  'domination::submissive',
  'commands::give-orders',
  'commands::follow-orders',
  'humiliation::humiliate',
  'humiliation::be-humiliated',
  'spanking::give',
  'spanking::receive',
  'biting::give',
  'biting::receive',
  'scratching::give',
  'scratching::receive',
  'vibrator::use-on-partner',
  'vibrator::use-on-self',
  'dildo::use-on-partner',
  'dildo::use-on-self',
  'roleplay::participate',
  'voyeurism::watch',
  'voyeurism::be-watched',
  'glory-hole::behind',
  'glory-hole::visitor',
]);

function migratePractice(practice: Practice): Practice {
  if (practice.id === 'kissing') {
    return {
      ...practice,
      description: 'Kissing, represented directionally so giving and receiving can vary by counterpart.',
      roles: [
        { id: 'give', label: 'Give kisses', perspective: 'active', contextAxes: ['counterpartSex'] },
        { id: 'receive', label: 'Receive kisses', perspective: 'receptive', contextAxes: ['counterpartSex'] },
      ],
      compatibleRolePairs: [{ leftRoleId: 'give', rightRoleId: 'receive' }],
    };
  }

  return {
    ...practice,
    roles: practice.roles.map((role) =>
      COUNTERPART_CONTEXT_ROLES.has(`${practice.id}::${role.id}`)
        ? { ...role, contextAxes: ['counterpartSex'] as const }
        : role,
    ),
  };
}

/**
 * V2 introduces counterpart-sex context for roles whose preference can vary by the other
 * participant. Existing semantic role ids are preserved unless the old role was too coarse:
 * kissing::mutual is intentionally retired and split into directional give/receive roles.
 * Old answers remain preserved as historical unknown answers rather than being guessed into
 * either new role or either counterpart sex.
 */
export const CURRENT_CATALOGUE_SNAPSHOT: CatalogueSnapshot = {
  version: CATALOGUE_VERSION_V2,
  catalogue: {
    categories: CATALOGUE_V1.catalogue.categories,
    practices: CATALOGUE_V1.catalogue.practices.map(migratePractice),
  },
};
