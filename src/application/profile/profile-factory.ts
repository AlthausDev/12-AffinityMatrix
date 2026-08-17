import { IdGenerator } from '../shared/id-generator';
import { PortableProfile, restorePortableProfile } from './portable-profile';
import { createProfile, Profile } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { ProfileSettings } from '../../domain/profile/profile-settings';

export class ProfileFactory {
  constructor(private readonly idGenerator: IdGenerator) {}

  create(metadata: ProfileMetadata, settings: Partial<ProfileSettings>, now: string): Profile {
    return createProfile({
      id: this.idGenerator.generate(),
      now,
      metadata,
      settings,
    });
  }

  restore(portable: PortableProfile, now: string): Profile {
    return restorePortableProfile(portable, this.idGenerator.generate(), now);
  }
}
