import { isCatalogueVersion } from '../catalogue/catalogue-version';
import { ValidationIssue } from '../shared/validator';
import { Profile, PROFILE_SCHEMA_VERSION } from './profile';
import { ProfileDataValidator } from './profile-data.validator';

const PROFILE_KEYS = [
  'schemaVersion',
  'id',
  'revision',
  'catalogueVersion',
  'metadata',
  'settings',
  'answers',
  'createdAt',
  'updatedAt',
] as const;
const SETTINGS_KEYS = ['filterQuestionnaireByMetadata'] as const;

export class ProfileValidator extends ProfileDataValidator<Profile> {
  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Profile must be an object.' }];
    }

    const issues = [
      ...this.validateAllowedKeys(value, PROFILE_KEYS),
      ...this.validateProfileData(value),
    ];

    if (value['schemaVersion'] !== PROFILE_SCHEMA_VERSION) {
      issues.push({ path: 'schemaVersion', message: 'Profile schema version is unsupported.' });
    }

    if (typeof value['id'] !== 'string' || value['id'].trim().length === 0 || value['id'].length > 200) {
      issues.push({ path: 'id', message: 'Profile id must be a non-empty string.' });
    }

    if (!Number.isInteger(value['revision']) || (value['revision'] as number) < 1) {
      issues.push({ path: 'revision', message: 'Profile revision must be a positive integer.' });
    }

    if (!isCatalogueVersion(value['catalogueVersion'])) {
      issues.push({ path: 'catalogueVersion', message: 'Catalogue version must be a positive integer.' });
    }

    const settings = value['settings'];
    if (!this.isRecord(settings)) {
      issues.push({ path: 'settings', message: 'Profile settings must be an object.' });
    } else {
      issues.push(...this.validateAllowedKeys(settings, SETTINGS_KEYS, 'settings'));
      if (typeof settings['filterQuestionnaireByMetadata'] !== 'boolean') {
        issues.push({
          path: 'settings.filterQuestionnaireByMetadata',
          message: 'Questionnaire filter setting must be boolean.',
        });
      }
    }

    if (!this.isIsoTimestamp(value['createdAt'])) {
      issues.push({ path: 'createdAt', message: 'createdAt must be an ISO timestamp.' });
    }

    if (!this.isIsoTimestamp(value['updatedAt'])) {
      issues.push({ path: 'updatedAt', message: 'updatedAt must be an ISO timestamp.' });
    }

    if (
      this.isIsoTimestamp(value['createdAt']) &&
      this.isIsoTimestamp(value['updatedAt']) &&
      value['updatedAt'] < value['createdAt']
    ) {
      issues.push({ path: 'updatedAt', message: 'updatedAt cannot be earlier than createdAt.' });
    }

    return issues;
  }

  private isIsoTimestamp(value: unknown): value is string {
    if (typeof value !== 'string') {
      return false;
    }

    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
  }
}

export const profileValidator = new ProfileValidator();
