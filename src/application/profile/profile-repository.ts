import { Profile, ProfileId } from '../../domain/profile/profile';

export class ProfileConcurrencyError extends Error {
  constructor(message = 'The profile changed in another operation. Reload it and try again.') {
    super(message);
    this.name = 'ProfileConcurrencyError';
  }
}

export interface ProfileRepository {
  findAll(): Promise<readonly Profile[]>;
  findById(id: ProfileId): Promise<Profile | undefined>;
  save(profile: Profile, expectedRevision?: number): Promise<void>;
  delete(id: ProfileId, expectedRevision?: number): Promise<void>;
}
