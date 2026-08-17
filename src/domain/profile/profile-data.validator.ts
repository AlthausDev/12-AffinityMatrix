import { ValidationIssue, Validator } from '../shared/validator';
import {
  DEPENDS_ON_MAX_LENGTH,
  DESIRED_FREQUENCY_VALUES,
  EXPERIENCE_CONTEXT_VALUES,
  INITIATIVE_PREFERENCE_VALUES,
  PracticeAnswer,
} from './profile-answer';
import {
  ORIENTATION_VALUES,
  PROFILE_ALIAS_MAX_LENGTH,
  ProfileMetadata,
  SEX_VALUES,
} from './profile-metadata';
import { DETAIL_CAPABLE_PREFERENCES, isPreference } from './preference';

const STABLE_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,119})$/u;
const MAX_ANSWER_COUNT = 10_000;

export interface ProfileDataShape {
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<string, PracticeAnswer>>;
}

export abstract class ProfileDataValidator<T extends ProfileDataShape> extends Validator<T> {
  protected validateProfileData(value: Record<string, unknown>): ValidationIssue[] {
    return [
      ...this.validateMetadata(value['metadata']),
      ...this.validateAnswers(value['answers']),
    ];
  }

  protected validateMetadata(value: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: 'metadata', message: 'Metadata must be an object.' }];
    }

    const issues: ValidationIssue[] = [];
    const alias = value['alias'];
    const sex = value['sex'];
    const orientation = value['orientation'];

    if (alias !== undefined) {
      if (typeof alias !== 'string' || alias.trim().length === 0) {
        issues.push({ path: 'metadata.alias', message: 'Alias must be a non-empty string when provided.' });
      } else if (alias.length > PROFILE_ALIAS_MAX_LENGTH) {
        issues.push({ path: 'metadata.alias', message: `Alias cannot exceed ${PROFILE_ALIAS_MAX_LENGTH} characters.` });
      }
    }

    if (sex !== undefined && !SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number])) {
      issues.push({ path: 'metadata.sex', message: 'Sex uses an unsupported value.' });
    }

    if (
      orientation !== undefined &&
      !ORIENTATION_VALUES.includes(orientation as (typeof ORIENTATION_VALUES)[number])
    ) {
      issues.push({ path: 'metadata.orientation', message: 'Orientation uses an unsupported value.' });
    }

    return issues;
  }

  protected validateAnswers(value: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: 'answers', message: 'Answers must be an object.' }];
    }

    const entries = Object.entries(value);
    if (entries.length > MAX_ANSWER_COUNT) {
      return [{ path: 'answers', message: `A profile cannot contain more than ${MAX_ANSWER_COUNT} answers.` }];
    }

    const issues: ValidationIssue[] = [];
    for (const [key, answer] of entries) {
      issues.push(...this.validateAnswer(key, answer));
    }

    return issues;
  }

  protected isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private validateAnswer(key: string, value: unknown): ValidationIssue[] {
    const path = `answers.${key}`;
    if (!this.isRecord(value)) {
      return [{ path, message: 'Answer must be an object.' }];
    }

    const issues: ValidationIssue[] = [];
    const practiceId = value['practiceId'];
    const roleId = value['roleId'];
    const preference = value['preference'];
    const details = value['details'];

    if (typeof practiceId !== 'string' || !STABLE_ID_PATTERN.test(practiceId)) {
      issues.push({ path: `${path}.practiceId`, message: 'Practice id must be a stable lowercase identifier.' });
    }

    if (typeof roleId !== 'string' || !STABLE_ID_PATTERN.test(roleId)) {
      issues.push({ path: `${path}.roleId`, message: 'Role id must be a stable lowercase identifier.' });
    }

    if (!isPreference(preference)) {
      issues.push({ path: `${path}.preference`, message: 'Preference uses an unsupported value.' });
    }

    if (
      typeof practiceId === 'string' &&
      typeof roleId === 'string' &&
      key !== `${practiceId}::${roleId}`
    ) {
      issues.push({ path, message: 'Answer key must match practiceId and roleId.' });
    }

    if (details !== undefined) {
      issues.push(...this.validateDetails(path, details, preference));
    }

    return issues;
  }

  private validateDetails(path: string, value: unknown, preference: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: `${path}.details`, message: 'Answer details must be an object.' }];
    }

    const issues: ValidationIssue[] = [];
    const context = value['context'];
    const desiredFrequency = value['desiredFrequency'];
    const initiative = value['initiative'];
    const dependsOn = value['dependsOn'];

    if (
      isPreference(preference) &&
      !DETAIL_CAPABLE_PREFERENCES.includes(preference) &&
      Object.keys(value).length > 0
    ) {
      issues.push({
        path: `${path}.details`,
        message: 'Optional experience details only apply to favorite, like, depends, or curious answers.',
      });
    }

    if (
      context !== undefined &&
      !EXPERIENCE_CONTEXT_VALUES.includes(context as (typeof EXPERIENCE_CONTEXT_VALUES)[number])
    ) {
      issues.push({ path: `${path}.details.context`, message: 'Experience context uses an unsupported value.' });
    }

    if (
      desiredFrequency !== undefined &&
      !DESIRED_FREQUENCY_VALUES.includes(desiredFrequency as (typeof DESIRED_FREQUENCY_VALUES)[number])
    ) {
      issues.push({ path: `${path}.details.desiredFrequency`, message: 'Desired frequency uses an unsupported value.' });
    }

    if (
      initiative !== undefined &&
      !INITIATIVE_PREFERENCE_VALUES.includes(initiative as (typeof INITIATIVE_PREFERENCE_VALUES)[number])
    ) {
      issues.push({ path: `${path}.details.initiative`, message: 'Initiative preference uses an unsupported value.' });
    }

    if (dependsOn !== undefined) {
      if (preference !== 'depends') {
        issues.push({ path: `${path}.details.dependsOn`, message: 'A dependency note only applies to a depends answer.' });
      }

      if (typeof dependsOn !== 'string' || dependsOn.trim().length === 0) {
        issues.push({ path: `${path}.details.dependsOn`, message: 'Dependency note must be non-empty when provided.' });
      } else if (dependsOn.length > DEPENDS_ON_MAX_LENGTH) {
        issues.push({
          path: `${path}.details.dependsOn`,
          message: `Dependency note cannot exceed ${DEPENDS_ON_MAX_LENGTH} characters.`,
        });
      }
    }

    return issues;
  }
}
