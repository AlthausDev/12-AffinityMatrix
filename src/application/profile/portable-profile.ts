import { AnswerKey, PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile, PROFILE_SCHEMA_VERSION } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';

export const PORTABLE_PROFILE_FORMAT_VERSION = 1 as const;

export interface PortableProfileV1 {
  formatVersion: typeof PORTABLE_PROFILE_FORMAT_VERSION;
  profileSchemaVersion: typeof PROFILE_SCHEMA_VERSION;
  metadata: ProfileMetadata;
  answers: Record<AnswerKey, PracticeAnswer>;
}

export function toPortableProfile(profile: Profile): PortableProfileV1 {
  return {
    formatVersion: PORTABLE_PROFILE_FORMAT_VERSION,
    profileSchemaVersion: profile.schemaVersion,
    metadata: profile.metadata,
    answers: profile.answers,
  };
}

export function restorePortableProfile(
  portable: PortableProfileV1,
  id: string,
  now: string,
): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    id,
    metadata: portable.metadata,
    answers: portable.answers,
    createdAt: now,
    updatedAt: now,
  };
}
