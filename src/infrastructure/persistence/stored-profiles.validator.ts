import { ProfileValidator, profileValidator } from '../../domain/profile/profile.validator';
import { ValidationIssue, Validator } from '../../domain/shared/validator';
import { MAX_STORED_PROFILES, PROFILE_STORE_VERSION, StoredProfilesV4 } from './profile-store';

const STORE_KEYS = ['version', 'profiles'] as const;

export class StoredProfilesValidator extends Validator<StoredProfilesV4> {
  constructor(private readonly profileValidatorInstance: ProfileValidator = profileValidator) {
    super();
  }

  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Profile store must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, STORE_KEYS);
    if (value['version'] !== PROFILE_STORE_VERSION) {
      issues.push({ path: 'version', message: 'Profile store version is unsupported.' });
    }

    const profiles = value['profiles'];
    if (!Array.isArray(profiles)) {
      issues.push({ path: 'profiles', message: 'Stored profiles must be an array.' });
      return issues;
    }

    if (profiles.length > MAX_STORED_PROFILES) {
      issues.push({
        path: 'profiles',
        message: `Profile store cannot contain more than ${MAX_STORED_PROFILES} profiles.`,
      });
      return issues;
    }

    const ids = new Set<string>();
    profiles.forEach((profile, index) => {
      for (const issue of this.profileValidatorInstance.validate(profile)) {
        issues.push({ ...issue, path: issue.path ? `profiles.${index}.${issue.path}` : `profiles.${index}` });
      }

      if (this.isRecord(profile) && typeof profile['id'] === 'string') {
        if (ids.has(profile['id'])) {
          issues.push({ path: `profiles.${index}.id`, message: 'Stored profile ids must be unique.' });
        }
        ids.add(profile['id']);
      }
    });

    return issues;
  }
}

export const storedProfilesValidator = new StoredProfilesValidator();
