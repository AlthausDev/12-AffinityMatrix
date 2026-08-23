import { ValidationIssue, Validator } from '../shared/validator';
import { isStableId } from '../shared/stable-id';
import {
  AnswerScope,
  createAnswerKey,
  DEPENDS_ON_MAX_LENGTH,
  DESIRED_FREQUENCY_VALUES,
  EXPERIENCE_CONTEXT_VALUES,
  INITIATIVE_PREFERENCE_VALUES,
  PracticeAnswer,
  TARGET_SITE_VALUES,
} from './profile-answer';
import {
  ORIENTATION_VALUES,
  PROFILE_ALIAS_MAX_LENGTH,
  ProfileMetadata,
  SEX_VALUES,
} from './profile-metadata';
import { DETAIL_CAPABLE_PREFERENCES, isPreference } from './preference';

const MAX_ANSWER_COUNT = 10_000;
const METADATA_KEYS = ['alias', 'sex', 'orientation'] as const;
const ANSWER_KEYS = ['practiceId', 'roleId', 'scope', 'preference', 'details'] as const;
const SCOPE_KEYS = ['counterpartSex', 'targetSite'] as const;
const DETAIL_KEYS = ['context', 'desiredFrequency', 'initiative', 'dependsOn'] as const;

export interface ProfileDataShape {
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<string, PracticeAnswer>>;
}

export abstract class ProfileDataValidator<T extends ProfileDataShape> extends Validator<T> {
  protected validateProfileData(value: Record<string, unknown>): ValidationIssue[] {
    return [...this.validateMetadata(value['metadata']), ...this.validateAnswers(value['answers'])];
  }

  protected validateMetadata(value: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) return [{ path: 'metadata', message: 'Metadata must be an object.' }];
    const issues: ValidationIssue[] = this.validateAllowedKeys(value, METADATA_KEYS, 'metadata');
    const alias = value['alias'];
    const sex = value['sex'];
    const orientation = value['orientation'];
    if (alias !== undefined) {
      if (typeof alias !== 'string' || alias.trim().length === 0) issues.push({ path: 'metadata.alias', message: 'Alias must be a non-empty string when provided.' });
      else if (alias.length > PROFILE_ALIAS_MAX_LENGTH) issues.push({ path: 'metadata.alias', message: `Alias cannot exceed ${PROFILE_ALIAS_MAX_LENGTH} characters.` });
    }
    if (sex !== undefined && !SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number])) issues.push({ path: 'metadata.sex', message: 'Sex uses an unsupported value.' });
    if (orientation !== undefined && !ORIENTATION_VALUES.includes(orientation as (typeof ORIENTATION_VALUES)[number])) issues.push({ path: 'metadata.orientation', message: 'Orientation uses an unsupported value.' });
    return issues;
  }

  protected validateAnswers(value: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) return [{ path: 'answers', message: 'Answers must be an object.' }];
    const entries = Object.entries(value);
    if (entries.length > MAX_ANSWER_COUNT) return [{ path: 'answers', message: `A profile cannot contain more than ${MAX_ANSWER_COUNT} answers.` }];
    const issues: ValidationIssue[] = [];
    for (const [key, answer] of entries) issues.push(...this.validateAnswer(key, answer));
    return issues;
  }

  private validateAnswer(key: string, value: unknown): ValidationIssue[] {
    const path = `answers.${key}`;
    if (!this.isRecord(value)) return [{ path, message: 'Answer must be an object.' }];
    const issues: ValidationIssue[] = this.validateAllowedKeys(value, ANSWER_KEYS, path);
    const practiceId = value['practiceId'];
    const roleId = value['roleId'];
    const scope = value['scope'];
    const preference = value['preference'];
    const details = value['details'];
    if (!isStableId(practiceId)) issues.push({ path: `${path}.practiceId`, message: 'Practice id must be a stable lowercase identifier.' });
    if (!isStableId(roleId)) issues.push({ path: `${path}.roleId`, message: 'Role id must be a stable lowercase identifier.' });
    if (!isPreference(preference)) issues.push({ path: `${path}.preference`, message: 'Preference uses an unsupported value.' });

    let validatedScope: AnswerScope | undefined;
    if (scope !== undefined) {
      const scopeIssues = this.validateScope(path, scope);
      issues.push(...scopeIssues);
      if (scopeIssues.length === 0) validatedScope = scope as AnswerScope;
    }
    if (typeof practiceId === 'string' && typeof roleId === 'string' && key !== createAnswerKey(practiceId, roleId, validatedScope)) {
      issues.push({ path, message: 'Answer key must match practiceId, roleId, and answer scope.' });
    }
    if (details !== undefined) issues.push(...this.validateDetails(path, details, preference));
    return issues;
  }

  private validateScope(path: string, value: unknown): ValidationIssue[] {
    const scopePath = `${path}.scope`;
    if (!this.isRecord(value)) return [{ path: scopePath, message: 'Answer scope must be an object.' }];
    const issues = this.validateAllowedKeys(value, SCOPE_KEYS, scopePath);
    const counterpartSex = value['counterpartSex'];
    const targetSite = value['targetSite'];
    if (counterpartSex === undefined && targetSite === undefined) issues.push({ path: scopePath, message: 'Answer scope cannot be empty.' });
    if (counterpartSex !== undefined && !SEX_VALUES.includes(counterpartSex as (typeof SEX_VALUES)[number])) {
      issues.push({ path: `${scopePath}.counterpartSex`, message: 'Counterpart sex uses an unsupported value.' });
    }
    if (targetSite !== undefined && !TARGET_SITE_VALUES.includes(targetSite as (typeof TARGET_SITE_VALUES)[number])) {
      issues.push({ path: `${scopePath}.targetSite`, message: 'Target site uses an unsupported value.' });
    }
    return issues;
  }

  private validateDetails(path: string, value: unknown, preference: unknown): ValidationIssue[] {
    if (!this.isRecord(value)) return [{ path: `${path}.details`, message: 'Answer details must be an object.' }];
    const detailsPath = `${path}.details`;
    const issues: ValidationIssue[] = this.validateAllowedKeys(value, DETAIL_KEYS, detailsPath);
    const context = value['context'];
    const desiredFrequency = value['desiredFrequency'];
    const initiative = value['initiative'];
    const dependsOn = value['dependsOn'];
    if (isPreference(preference) && !DETAIL_CAPABLE_PREFERENCES.includes(preference) && Object.keys(value).length > 0) {
      issues.push({ path: detailsPath, message: 'Optional experience details only apply to favorite, like, depends, or curious answers.' });
    }
    if (context !== undefined && !EXPERIENCE_CONTEXT_VALUES.includes(context as (typeof EXPERIENCE_CONTEXT_VALUES)[number])) issues.push({ path: `${detailsPath}.context`, message: 'Experience context uses an unsupported value.' });
    if (desiredFrequency !== undefined && !DESIRED_FREQUENCY_VALUES.includes(desiredFrequency as (typeof DESIRED_FREQUENCY_VALUES)[number])) issues.push({ path: `${detailsPath}.desiredFrequency`, message: 'Desired frequency uses an unsupported value.' });
    if (initiative !== undefined && !INITIATIVE_PREFERENCE_VALUES.includes(initiative as (typeof INITIATIVE_PREFERENCE_VALUES)[number])) issues.push({ path: `${detailsPath}.initiative`, message: 'Initiative preference uses an unsupported value.' });
    if (dependsOn !== undefined) {
      if (preference !== 'depends') issues.push({ path: `${detailsPath}.dependsOn`, message: 'A dependency note only applies to a depends answer.' });
      if (typeof dependsOn !== 'string' || dependsOn.trim().length === 0) issues.push({ path: `${detailsPath}.dependsOn`, message: 'Dependency note must be non-empty when provided.' });
      else if (dependsOn.length > DEPENDS_ON_MAX_LENGTH) issues.push({ path: `${detailsPath}.dependsOn`, message: `Dependency note cannot exceed ${DEPENDS_ON_MAX_LENGTH} characters.` });
    }
    return issues;
  }
}
