import { CatalogueVersion } from '../../domain/catalogue/catalogue-version';
import { AnswerKey, cloneAnswers, PracticeAnswer } from '../../domain/profile/profile-answer';
import { createProfile, Profile } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';

export const PORTABLE_PROFILE_V4_FORMAT_VERSION = 4 as const;
export const PORTABLE_PROFILE_V4_PROFILE_SCHEMA_VERSION = 4 as const;

export const PORTABLE_PROFILE_FORMAT_VERSION = PORTABLE_PROFILE_V4_FORMAT_VERSION;
export const PORTABLE_PROFILE_PROFILE_SCHEMA_VERSION = PORTABLE_PROFILE_V4_PROFILE_SCHEMA_VERSION;

export interface ProfileExportOptions {
  readonly includeSensitiveMetadata?: boolean;
}

export interface PortableProfileV4 {
  readonly formatVersion: typeof PORTABLE_PROFILE_V4_FORMAT_VERSION;
  readonly profileSchemaVersion: typeof PORTABLE_PROFILE_V4_PROFILE_SCHEMA_VERSION;
  readonly catalogueVersion: CatalogueVersion;
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export type PortableProfile = PortableProfileV4;

export function toPortableProfile(
  profile: Profile,
  options: ProfileExportOptions = {},
): PortableProfile {
  const metadata: ProfileMetadata = {
    ...(profile.metadata.alias ? { alias: profile.metadata.alias } : {}),
    ...(options.includeSensitiveMetadata && profile.metadata.sex ? { sex: profile.metadata.sex } : {}),
    ...(options.includeSensitiveMetadata && profile.metadata.orientation
      ? { orientation: profile.metadata.orientation }
      : {}),
  };

  return {
    formatVersion: PORTABLE_PROFILE_V4_FORMAT_VERSION,
    profileSchemaVersion: PORTABLE_PROFILE_V4_PROFILE_SCHEMA_VERSION,
    catalogueVersion: profile.catalogueVersion,
    metadata,
    answers: cloneAnswers(profile.answers),
  };
}

export function restorePortableProfile(portable: PortableProfile, id: string, now: string): Profile {
  return createProfile({
    id,
    now,
    catalogueVersion: portable.catalogueVersion,
    metadata: { ...portable.metadata },
    answers: cloneAnswers(portable.answers),
  });
}
