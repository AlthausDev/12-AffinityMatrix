import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V2 } from '../../domain/catalogue/catalogue-version';
import { CURRENT_CATALOGUE_SNAPSHOT as CATALOGUE_V1 } from './catalogue-v1';

const COUNTERPART_CONTEXT_ROLES = new Set<string>([
  'kissing::mutual',
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
  'vibrator::receive-from-partner',
  'dildo::use-on-partner',
  'dildo::receive-from-partner',
  'roleplay::participate',
  'voyeurism::watch',
  'voyeurism::be-watched',
  'glory-hole::behind',
  'glory-hole::visitor',
]);

/**
 * Catalogue v2 keeps v1's stable practice/role ids and adds a relational counterpart-sex axis
 * only where the same semantic role can reasonably be valued differently by partner sex.
 */
export const CURRENT_CATALOGUE_SNAPSHOT: CatalogueSnapshot = {
  version: CATALOGUE_VERSION_V2,
  catalogue: {
    categories: CATALOGUE_V1.catalogue.categories,
    practices: CATALOGUE_V1.catalogue.practices.map((practice) => ({
      ...practice,
      roles: practice.roles.map((role) =>
        COUNTERPART_CONTEXT_ROLES.has(`${practice.id}::${role.id}`)
          ? { ...role, contextAxes: ['counterpartSex'] as const }
          : role,
      ),
    })),
  },
};
