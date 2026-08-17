import { AnswerKey, PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile, PROFILE_SCHEMA_VERSION } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS } from '../../domain/profile/profile-settings';

export const PORTABLE_PROFILE_FORMAT_VERSION = 2 as const;

export interface PortableProfileV2 {
  readonly formatVersion: typeof PORTABLE_PROFILE_FORMAT_VERSION;
  readonly profileSchemaVersion: typeof PROFILE_SCHEMA_VERSION;
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export type PortableProfile = PortableProfileV2;

export function toPortableProfile(profile: Profile): PortableProfile {
  return {
    formatVersion: PORTABLE_PROFILE_FORMAT_VERSION,
    profileSchemaVersion: profile.schemaVersion,
    metadata: { ...profile.metadata },
    answers: { ...profile.answers },
  };
}

export function restorePortableProfile(portable: PortableProfile, id: string, now: string): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    id,
    metadata: { ...portable.metadata },
    settings: { ...DEFAULT_PROFILE_SETTINGS },
    answers: { ...portable.answers },
    createdAt: now,
    updatedAt: now,
  };
}
