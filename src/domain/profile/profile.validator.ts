import { ValidationIssue } from '../shared/validator';
import { Profile, PROFILE_SCHEMA_VERSION } from './profile';
import { ProfileDataValidator } from './profile-data.validator';

export class ProfileValidator extends ProfileDataValidator<Profile> {
  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Profile must be an object.' }];
    }

    const issues = this.validateProfileData(value);

    if (value['schemaVersion'] !== PROFILE_SCHEMA_VERSION) {
      issues.push({ path: 'schemaVersion', message: 'Profile schema version is unsupported.' });
    }

    if (typeof value['id'] !== 'string' || value['id'].trim().length === 0 || value['id'].length > 200) {
      issues.push({ path: 'id', message: 'Profile id must be a non-empty string.' });
    }

    const settings = value['settings'];
    if (!this.isRecord(settings) || typeof settings['filterQuestionnaireByMetadata'] !== 'boolean') {
      issues.push({ path: 'settings.filterQuestionnaireByMetadata', message: 'Questionnaire filter setting must be boolean.' });
    }

    if (!this.isIsoTimestamp(value['createdAt'])) {
      issues.push({ path: 'createdAt', message: 'createdAt must be an ISO timestamp.' });
    }

    if (!this.isIsoTimestamp(value['updatedAt'])) {
      issues.push({ path: 'updatedAt', message: 'updatedAt must be an ISO timestamp.' });
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
