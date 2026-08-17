import { Preference } from './preference';

export const EXPERIENCE_CONTEXT_VALUES = [
  'fantasy-only',
  'want-to-try',
  'current',
] as const;
export type ExperienceContext = (typeof EXPERIENCE_CONTEXT_VALUES)[number];

export const DESIRED_FREQUENCY_VALUES = [
  'rarely',
  'occasionally',
  'regularly',
  'frequently',
] as const;
export type DesiredFrequency = (typeof DESIRED_FREQUENCY_VALUES)[number];

export const INITIATIVE_PREFERENCE_VALUES = [
  'prefer-partner',
  'either',
  'prefer-initiate',
] as const;
export type InitiativePreference = (typeof INITIATIVE_PREFERENCE_VALUES)[number];

export const DEPENDS_ON_MAX_LENGTH = 500;

export interface AnswerDetails {
  readonly context?: ExperienceContext;
  readonly desiredFrequency?: DesiredFrequency;
  readonly initiative?: InitiativePreference;
  readonly dependsOn?: string;
}

export interface PracticeAnswer {
  readonly practiceId: string;
  readonly roleId: string;
  readonly preference: Preference;
  readonly details?: AnswerDetails;
}

export type AnswerKey = `${string}::${string}`;

export function createAnswerKey(practiceId: string, roleId: string): AnswerKey {
  return `${practiceId}::${roleId}`;
}
