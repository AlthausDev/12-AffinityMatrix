import { Profile } from '../../domain/profile/profile';

export const PROFILE_STORE_VERSION = 3 as const;
export const MAX_STORED_PROFILES = 1_000;

export interface StoredProfilesV3 {
  readonly version: typeof PROFILE_STORE_VERSION;
  readonly profiles: readonly Profile[];
}
