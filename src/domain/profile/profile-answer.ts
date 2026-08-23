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

export const TARGET_SITE_VALUES = [
  'mouth',
  'vaginal',
  'anal',
  'external-genitals',
  'penis',
  'nipples',
  'body',
] as const;
export type TargetSite = (typeof TARGET_SITE_VALUES)[number];

export const DEPENDS_ON_MAX_LENGTH = 500;

export interface AnswerDetails {
  readonly context?: ExperienceContext;
  readonly desiredFrequency?: DesiredFrequency;
  readonly initiative?: InitiativePreference;
  readonly dependsOn?: string;
}

/** Relational and semantic dimensions that qualify an answer without changing its role. */
export interface AnswerScope {
  readonly counterpartSex?: Sex;
  readonly targetSite?: TargetSite;
}

export interface PracticeAnswer {
  readonly practiceId: string;
  readonly roleId: string;
  readonly scope?: AnswerScope;
  readonly preference: Preference;
  readonly details?: AnswerDetails;
}

export type UnscopedAnswerKey = `${string}::${string}`;
export type CounterpartSexAnswerKey = `${string}::${string}::counterpart-sex=${Sex}`;
export type TargetSiteAnswerKey = `${string}::${string}::target-site=${TargetSite}`;
export type CounterpartTargetSiteAnswerKey = `${string}::${string}::counterpart-sex=${Sex}::target-site=${TargetSite}`;
export type AnswerKey =
  | UnscopedAnswerKey
  | CounterpartSexAnswerKey
  | TargetSiteAnswerKey
  | CounterpartTargetSiteAnswerKey;

/** Canonical answer identity. Scope fields are serialized in a stable order here only. */
export function createAnswerKey(
  practiceId: string,
  roleId: string,
  scope?: AnswerScope,
): AnswerKey {
  const base = `${practiceId}::${roleId}`;
  const counterpart = scope?.counterpartSex ? `::counterpart-sex=${scope.counterpartSex}` : '';
  const target = scope?.targetSite ? `::target-site=${scope.targetSite}` : '';
  return `${base}${counterpart}${target}` as AnswerKey;
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
