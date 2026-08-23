import { CURRENT_CATALOGUE_VERSION, CatalogueVersion } from '../catalogue/catalogue-version';
import { AnswerKey, cloneAnswers, PracticeAnswer } from './profile-answer';
import { ProfileMetadata } from './profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from './profile-settings';

export const PROFILE_SCHEMA_VERSION = 6 as const;
export const INITIAL_PROFILE_REVISION = 1 as const;

export type ProfileId = string;

export interface Profile {
  readonly schemaVersion: typeof PROFILE_SCHEMA_VERSION;
  readonly id: ProfileId;
  readonly revision: number;
  readonly catalogueVersion: CatalogueVersion;
  readonly metadata: ProfileMetadata;
  readonly settings: ProfileSettings;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateProfileInput {
  readonly id: ProfileId;
  readonly now: string;
  readonly catalogueVersion?: CatalogueVersion;
  readonly metadata?: ProfileMetadata;
  readonly settings?: Partial<ProfileSettings>;
  readonly answers?: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export function createProfile(input: CreateProfileInput): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    id: input.id,
    revision: INITIAL_PROFILE_REVISION,
    catalogueVersion: input.catalogueVersion ?? CURRENT_CATALOGUE_VERSION,
    metadata: { ...input.metadata },
    settings: {
      ...DEFAULT_PROFILE_SETTINGS,
      ...input.settings,
    },
    answers: cloneAnswers(input.answers ?? {}),
    createdAt: input.now,
    updatedAt: input.now,
  };
}
