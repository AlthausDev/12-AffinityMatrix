import { AnswerKey, PracticeAnswer } from './profile-answer';
import { ProfileMetadata } from './profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from './profile-settings';

export const PROFILE_SCHEMA_VERSION = 2 as const;

export type ProfileId = string;

export interface Profile {
  readonly schemaVersion: typeof PROFILE_SCHEMA_VERSION;
  readonly id: ProfileId;
  readonly metadata: ProfileMetadata;
  readonly settings: ProfileSettings;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateProfileInput {
  readonly id: ProfileId;
  readonly now: string;
  readonly metadata?: ProfileMetadata;
  readonly settings?: Partial<ProfileSettings>;
  readonly answers?: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export function createProfile(input: CreateProfileInput): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    id: input.id,
    metadata: { ...input.metadata },
    settings: {
      ...DEFAULT_PROFILE_SETTINGS,
      ...input.settings,
    },
    answers: { ...input.answers },
    createdAt: input.now,
    updatedAt: input.now,
  };
}
