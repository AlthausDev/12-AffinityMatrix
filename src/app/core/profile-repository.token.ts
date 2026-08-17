import { InjectionToken } from '@angular/core';
import { ProfileRepository } from '../../application/profile/profile-repository';
import { LocalStorageProfileRepository } from '../../infrastructure/persistence/local-storage-profile.repository';

export const PROFILE_REPOSITORY = new InjectionToken<ProfileRepository>('PROFILE_REPOSITORY', {
  providedIn: 'root',
  factory: () => new LocalStorageProfileRepository(window.localStorage),
});
