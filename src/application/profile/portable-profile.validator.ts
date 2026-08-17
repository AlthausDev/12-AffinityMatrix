import { ValidationIssue } from '../../domain/shared/validator';
import { PROFILE_SCHEMA_VERSION } from '../../domain/profile/profile';
import { ProfileDataValidator } from '../../domain/profile/profile-data.validator';
import {
  PORTABLE_PROFILE_FORMAT_VERSION,
  PortableProfile,
} from './portable-profile';

const PORTABLE_PROFILE_KEYS = [
  'formatVersion',
  'profileSchemaVersion',
  'metadata',
  'answers',
] as const;

export class PortableProfileValidator extends ProfileDataValidator<PortableProfile> {
  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Portable profile must be an object.' }];
    }

    const issues = [
      ...this.validateAllowedKeys(value, PORTABLE_PROFILE_KEYS),
      ...this.validateProfileData(value),
    ];

    if (value['formatVersion'] !== PORTABLE_PROFILE_FORMAT_VERSION) {
      issues.push({ path: 'formatVersion', message: 'Portable profile format version is unsupported.' });
    }

    if (value['profileSchemaVersion'] !== PROFILE_SCHEMA_VERSION) {
      issues.push({ path: 'profileSchemaVersion', message: 'Profile schema version is unsupported.' });
    }

    return issues;
  }
}

export const portableProfileValidator = new PortableProfileValidator();
