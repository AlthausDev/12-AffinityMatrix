import { PracticeAnswer, AnswerKey } from './profile-answer';
import { ProfileMetadata } from './profile-metadata';

export const PROFILE_SCHEMA_VERSION = 1 as const;

export type ProfileId = string;

export interface Profile {
  schemaVersion: typeof PROFILE_SCHEMA_VERSION;
  id: ProfileId;
  metadata: ProfileMetadata;
  answers: Record<AnswerKey, PracticeAnswer>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileInput {
  id: ProfileId;
  now: string;
  metadata?: Partial<ProfileMetadata>;
}

export function createProfile(input: CreateProfileInput): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    id: input.id,
    metadata: {
      filterByProfileMetadata: true,
      ...input.metadata,
    },
    answers: {},
    createdAt: input.now,
    updatedAt: input.now,
  };
}
