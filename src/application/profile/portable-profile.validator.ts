import { ValidationIssue } from '../../domain/shared/validator';
import { ProfileDataValidator } from '../../domain/profile/profile-data.validator';
import {
  PORTABLE_PROFILE_V2_FORMAT_VERSION,
  PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION,
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

    if (value['formatVersion'] !== PORTABLE_PROFILE_V2_FORMAT_VERSION) {
      issues.push({ path: 'formatVersion', message: 'Portable profile format version is unsupported.' });
    }

    if (value['profileSchemaVersion'] !== PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION) {
      issues.push({ path: 'profileSchemaVersion', message: 'Profile schema version is unsupported.' });
    }

    return issues;
  }
}

export const portableProfileValidator = new PortableProfileValidator();
