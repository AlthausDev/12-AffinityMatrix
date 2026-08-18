import { createAnswerKey } from './profile-answer';
import { createProfile } from './profile';
import { ProfileValidator } from './profile.validator';

const validator = new ProfileValidator();

function validProfile() {
  return createProfile({
    id: 'profile-1',
    now: '2026-08-17T12:00:00.000Z',
    metadata: { alias: 'Example', sex: 'female', orientation: 'bisexual' },
  });
}

describe('ProfileValidator', () => {
  it('accepts valid optional answer details', () => {
    const profile = validProfile();
    const key = createAnswerKey('bondage', 'receive');
    const candidate = {
      ...profile,
      answers: {
        [key]: {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'depends',
          details: {
            context: 'want-to-try',
            desiredFrequency: 'occasionally',
            initiative: 'prefer-partner',
            dependsOn: 'Only in a trusted context',
          },
        },
      },
    };

    expect(validator.validate(candidate)).toEqual([]);
  });

  it('rejects dependency notes attached to non-depends answers', () => {
    const profile = validProfile();
    const key = createAnswerKey('bondage', 'receive');
    const candidate = {
      ...profile,
      answers: {
        [key]: {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'like',
          details: { dependsOn: 'This should not be here' },
        },
      },
    };

    expect(validator.validate(candidate).some((issue) => issue.path.endsWith('dependsOn'))).toBe(true);
  });

  it('rejects answer keys that do not match the answer role', () => {
    const candidate = {
      ...validProfile(),
      answers: {
        'bondage::give': {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'like',
        },
      },
    };

    expect(validator.validate(candidate).some((issue) => issue.message.includes('Answer key'))).toBe(true);
  });

  it('rejects presentation settings with invalid types', () => {
    const candidate = {
      ...validProfile(),
      settings: { filterQuestionnaireByMetadata: 'yes' },
    };
    expect(validator.isValid(candidate)).toBe(false);
  });

  it('rejects invalid revisions and catalogue versions', () => {
    expect(validator.isValid({ ...validProfile(), revision: 0 })).toBe(false);
    expect(validator.isValid({ ...validProfile(), catalogueVersion: 0 })).toBe(false);
  });

  it('rejects unknown properties instead of silently carrying them across boundaries', () => {
    const profile = validProfile();
    const key = createAnswerKey('bondage', 'receive');
    const candidate = {
      ...profile,
      metadata: { ...profile.metadata, unexpected: true },
      answers: {
        [key]: {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'depends',
          details: { dependsOn: 'Context', unexpected: true },
        },
      },
    };

    const issues = validator.validate(candidate);
    expect(issues.some((issue) => issue.path === 'metadata.unexpected')).toBe(true);
    expect(issues.some((issue) => issue.path.endsWith('details.unexpected'))).toBe(true);
  });

  it('rejects an update timestamp earlier than profile creation', () => {
    const candidate = {
      ...validProfile(),
      updatedAt: '2026-08-17T11:59:59.000Z',
    };

    expect(validator.validate(candidate).some((issue) => issue.path === 'updatedAt')).toBe(true);
  });
});
