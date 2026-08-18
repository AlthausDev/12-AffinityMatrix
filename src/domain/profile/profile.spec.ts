import { CURRENT_CATALOGUE_VERSION } from '../catalogue/catalogue-version';
import { createAnswerKey } from './profile-answer';
import { createProfile, INITIAL_PROFILE_REVISION, PROFILE_SCHEMA_VERSION } from './profile';

describe('profile domain', () => {
  it('creates a versioned profile with local questionnaire filtering enabled by default', () => {
    const profile = createProfile({
      id: 'profile-1',
      now: '2026-08-17T12:00:00.000Z',
      metadata: { alias: 'Example' },
    });

    expect(profile.schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
    expect(profile.revision).toBe(INITIAL_PROFILE_REVISION);
    expect(profile.catalogueVersion).toBe(CURRENT_CATALOGUE_VERSION);
    expect(profile.metadata.alias).toBe('Example');
    expect(profile.settings.filterQuestionnaireByMetadata).toBe(true);
    expect(profile.answers).toEqual({});
  });

  it('builds stable answer keys from practice and role ids', () => {
    expect(createAnswerKey('cunnilingus', 'give')).toBe('cunnilingus::give');
  });

  it('takes ownership of nested answer objects on creation', () => {
    const key = createAnswerKey('bondage', 'receive');
    const answer = {
      practiceId: 'bondage',
      roleId: 'receive',
      preference: 'depends' as const,
      details: { dependsOn: 'Trusted context' },
    };
    const profile = createProfile({
      id: 'profile-1',
      now: '2026-08-17T12:00:00.000Z',
      answers: { [key]: answer },
    });

    expect(profile.answers[key]).not.toBe(answer);
    expect(profile.answers[key]?.details).not.toBe(answer.details);
  });
});
