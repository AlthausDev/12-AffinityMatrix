import { createAnswerKey } from './profile-answer';
import { createProfile, PROFILE_SCHEMA_VERSION } from './profile';

describe('profile domain', () => {
  it('creates a profile with filtering enabled by default', () => {
    const profile = createProfile({
      id: 'profile-1',
      now: '2026-08-17T12:00:00.000Z',
      metadata: { alias: 'Example' },
    });

    expect(profile.schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
    expect(profile.metadata.alias).toBe('Example');
    expect(profile.metadata.filterByProfileMetadata).toBe(true);
    expect(profile.answers).toEqual({});
  });

  it('builds stable answer keys from practice and role ids', () => {
    expect(createAnswerKey('cunnilingus', 'give')).toBe('cunnilingus::give');
  });
});
