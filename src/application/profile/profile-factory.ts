import { CURRENT_CATALOGUE_VERSION, CatalogueVersion } from '../../domain/catalogue/catalogue-version';
import { createProfile, Profile } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { ProfileSettings } from '../../domain/profile/profile-settings';
import { IdGenerator } from '../shared/id-generator';
import { PortableProfile, restorePortableProfile } from './portable-profile';

export class ProfileFactory {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly catalogueVersion: CatalogueVersion = CURRENT_CATALOGUE_VERSION,
  ) {}

  create(metadata: ProfileMetadata, settings: Partial<ProfileSettings>, now: string): Profile {
    return createProfile({
      id: this.idGenerator.generate(),
      now,
      catalogueVersion: this.catalogueVersion,
      metadata,
      settings,
    });
  }

  restore(portable: PortableProfile, now: string): Profile {
    return restorePortableProfile(portable, this.idGenerator.generate(), now);
  }
}
