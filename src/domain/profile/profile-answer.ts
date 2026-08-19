import { Sex } from './profile-metadata';
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

/**
 * Relational dimensions that qualify an answer without changing the semantic role itself.
 * Keep this object small and extend it only when a real questionnaire axis requires it.
 */
export interface AnswerScope {
  readonly counterpartSex?: Sex;
}

export interface PracticeAnswer {
  readonly practiceId: string;
  readonly roleId: string;
  readonly scope?: AnswerScope;
  readonly preference: Preference;
  readonly details?: AnswerDetails;
}

export type AnswerKey = string;

/**
 * Canonical answer identity. Scope fields are serialized here in a stable order so callers
 * never construct persistence keys themselves.
 */
export function createAnswerKey(
  practiceId: string,
  roleId: string,
  scope?: AnswerScope,
): AnswerKey {
  const parts = [practiceId, roleId];
  if (scope?.counterpartSex) {
    parts.push(`counterpart-sex=${scope.counterpartSex}`);
  }
  return parts.join('::');
}

export function cloneAnswerScope(scope: AnswerScope | undefined): AnswerScope | undefined {
  return scope ? { ...scope } : undefined;
}

export function clonePracticeAnswer(answer: PracticeAnswer): PracticeAnswer {
  return {
    ...answer,
    ...(answer.scope ? { scope: { ...answer.scope } } : {}),
    ...(answer.details ? { details: { ...answer.details } } : {}),
  };
}

export function cloneAnswers(
  answers: Readonly<Record<AnswerKey, PracticeAnswer>>,
): Readonly<Record<AnswerKey, PracticeAnswer>> {
  return Object.fromEntries(
    Object.entries(answers).map(([key, answer]) => [key, clonePracticeAnswer(answer)]),
  ) as Record<AnswerKey, PracticeAnswer>;
}
