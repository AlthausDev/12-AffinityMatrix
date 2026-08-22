import { InjectionToken } from '@angular/core';
import { ProfileCodeCodec } from '../../application/profile/profile-codec';
import { VersionedProfileCodeCodec } from '../../infrastructure/serialization/profile-codec';

export const PROFILE_CODE_CODEC = new InjectionToken<ProfileCodeCodec>('PROFILE_CODE_CODEC', {
  providedIn: 'root',
  factory: () => new VersionedProfileCodeCodec(),
});
