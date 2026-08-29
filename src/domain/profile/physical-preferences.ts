import { isStableId } from '../shared/stable-id';
import { ValidationIssue } from '../shared/validator';

export const PHYSICAL_ATTRACTION_MIN_SCORE = 0;
export const PHYSICAL_ATTRACTION_MAX_SCORE = 10;
export const PHYSICAL_ATTRACTION_NEUTRAL_SCORE = 5;
export const MAX_PHYSICAL_PREFERENCE_GROUPS = 32;
export const MAX_PHYSICAL_PREFERENCE_VALUES_PER_GROUP = 32;

export type PhysicalAttractionScore = number;
export type PhysicalPreferenceValues = Readonly<Record<string, PhysicalAttractionScore>>;
export type PhysicalPreferences = Readonly<Record<string, PhysicalPreferenceValues>>;

export const EMPTY_PHYSICAL_PREFERENCES: PhysicalPreferences = {};

export function clonePhysicalPreferences(
  preferences: PhysicalPreferences | undefined,
): PhysicalPreferences {
  if (!preferences) return {};
  return Object.fromEntries(
    Object.entries(preferences).map(([traitId, values]) => [traitId, { ...values }]),
  );
}

export function normalizePhysicalPreferences(
  preferences: PhysicalPreferences | undefined,
): PhysicalPreferences {
  if (!preferences) return {};
  return Object.fromEntries(
    Object.entries(preferences)
      .map(([traitId, values]) => [traitId, { ...values }] as const)
      .filter(([, values]) => Object.keys(values).length > 0),
  );
}

export function validatePhysicalPreferences(
  value: unknown,
  path = 'physicalPreferences',
): readonly ValidationIssue[] {
  if (value === undefined) return [];
  if (!isRecord(value)) return [{ path, message: 'Physical preferences must be an object.' }];

  const groups = Object.entries(value);
  if (groups.length > MAX_PHYSICAL_PREFERENCE_GROUPS) {
    return [{ path, message: `Physical preferences cannot contain more than ${MAX_PHYSICAL_PREFERENCE_GROUPS} groups.` }];
  }

  const issues: ValidationIssue[] = [];
  for (const [groupId, rawScores] of groups) {
    const groupPath = `${path}.${groupId}`;
    if (!isStableId(groupId)) {
      issues.push({ path: groupPath, message: 'Physical preference group id must be a stable lowercase identifier.' });
      continue;
    }
    if (!isRecord(rawScores)) {
      issues.push({ path: groupPath, message: 'Physical preference group must be an object.' });
      continue;
    }

    const scores = Object.entries(rawScores);
    if (scores.length === 0) {
      issues.push({ path: groupPath, message: 'Empty physical preference groups must be omitted.' });
      continue;
    }
    if (scores.length > MAX_PHYSICAL_PREFERENCE_VALUES_PER_GROUP) {
      issues.push({ path: groupPath, message: `Physical preference groups cannot contain more than ${MAX_PHYSICAL_PREFERENCE_VALUES_PER_GROUP} values.` });
      continue;
    }

    for (const [optionId, score] of scores) {
      const scorePath = `${groupPath}.${optionId}`;
      if (!isStableId(optionId)) {
        issues.push({ path: scorePath, message: 'Physical preference option id must be a stable lowercase identifier.' });
      }
      if (
        !Number.isInteger(score)
        || (score as number) < PHYSICAL_ATTRACTION_MIN_SCORE
        || (score as number) > PHYSICAL_ATTRACTION_MAX_SCORE
      ) {
        issues.push({ path: scorePath, message: `Physical attraction score must be an integer from ${PHYSICAL_ATTRACTION_MIN_SCORE} to ${PHYSICAL_ATTRACTION_MAX_SCORE}.` });
      }
    }
  }
  return issues;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
