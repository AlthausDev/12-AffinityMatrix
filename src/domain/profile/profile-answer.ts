import { Preference } from './preference';

export const EXPERIENCE_CONTEXT_VALUES = [
  'fantasy-only',
  'want-to-try',
  'current',
] as const;

export type ExperienceContext = (typeof EXPERIENCE_CONTEXT_VALUES)[number];

export interface AnswerDetails {
  context?: ExperienceContext;
  dependsOn?: string;
}

export interface PracticeAnswer {
  practiceId: string;
  roleId: string;
  preference: Preference;
  details?: AnswerDetails;
}

export type AnswerKey = `${string}::${string}`;

export function createAnswerKey(practiceId: string, roleId: string): AnswerKey {
  return `${practiceId}::${roleId}`;
}
