import { AnswerKey, PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS } from '../../domain/profile/profile-settings';

export const PORTABLE_PROFILE_V2_FORMAT_VERSION = 2 as const;
export const PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION = 2 as const;

// Current aliases. When a new portable format is introduced, add a new immutable
// versioned contract rather than mutating PortableProfileV2.
export const PORTABLE_PROFILE_FORMAT_VERSION = PORTABLE_PROFILE_V2_FORMAT_VERSION;
export const PORTABLE_PROFILE_PROFILE_SCHEMA_VERSION = PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION;

export interface PortableProfileV2 {
  readonly formatVersion: typeof PORTABLE_PROFILE_V2_FORMAT_VERSION;
  readonly profileSchemaVersion: typeof PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION;
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export type PortableProfile = PortableProfileV2;

export function toPortableProfile(profile: Profile): PortableProfile {
  return {
    formatVersion: PORTABLE_PROFILE_V2_FORMAT_VERSION,
    profileSchemaVersion: profile.schemaVersion,
    metadata: { ...profile.metadata },
    answers: { ...profile.answers },
  };
}

export function restorePortableProfile(portable: PortableProfile, id: string, now: string): Profile {
  return {
    schemaVersion: PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION,
    id,
    metadata: { ...portable.metadata },
    settings: { ...DEFAULT_PROFILE_SETTINGS },
    answers: { ...portable.answers },
    createdAt: now,
    updatedAt: now,
  };
}
