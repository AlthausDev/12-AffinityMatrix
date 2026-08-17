import { inject, InjectionToken } from '@angular/core';
import { ProfileFactory } from '../../application/profile/profile-factory';
import { ProfileService } from '../../application/profile/profile-service';
import { CryptoIdGenerator } from '../../infrastructure/identity/crypto-id-generator';
import { SystemClock } from '../../infrastructure/time/system-clock';
import { PROFILE_REPOSITORY } from './profile-repository.token';

export const PROFILE_SERVICE = new InjectionToken<ProfileService>('PROFILE_SERVICE', {
  providedIn: 'root',
  factory: () =>
    new ProfileService(
      inject(PROFILE_REPOSITORY),
      new ProfileFactory(new CryptoIdGenerator()),
      new SystemClock(),
    ),
});
