import { createAnswerKey } from '../../domain/profile/profile-answer';
import { createProfile } from '../../domain/profile/profile';
import { restorePortableProfile, toPortableProfile } from './portable-profile';

describe('portable profile mapping', () => {
  it('minimizes sensitive metadata unless explicitly requested', () => {
    const profile = createProfile({
      id: 'local-id',
      now: '2026-08-17T12:00:00.000Z',
      metadata: { alias: 'Example', sex: 'female', orientation: 'bisexual' },
    });

    const minimized = toPortableProfile(profile);
    const explicit = toPortableProfile(profile, { includeSensitiveMetadata: true });

    expect(minimized.formatVersion).toBe(6);
    expect(minimized.profileSchemaVersion).toBe(6);
    expect(minimized.metadata).toEqual({ alias: 'Example' });
    expect(explicit.metadata.sex).toBe('female');
    expect(explicit.metadata.orientation).toBe('bisexual');
    expect(minimized.catalogueVersion).toBe(profile.catalogueVersion);
  });

  it('does not share nested answer scope or detail objects with the local profile', () => {
    const profile = createProfile({ id: 'local-id', now: '2026-08-17T12:00:00.000Z' });
    const scope = { counterpartSex: 'female' as const, targetSite: 'vaginal' as const };
    const key = createAnswerKey('dildo', 'partner-uses-on-me', scope);
    const local = {
      ...profile,
      answers: {
        [key]: {
          practiceId: 'dildo', roleId: 'partner-uses-on-me', scope, preference: 'depends' as const,
          details: { dependsOn: 'Trusted context' },
        },
      },
    };

    const portable = toPortableProfile(local);
    expect(portable.answers[key]).not.toBe(local.answers[key]);
    expect(portable.answers[key]?.scope).not.toBe(local.answers[key].scope);
    expect(portable.answers[key]?.details).not.toBe(local.answers[key].details);
  });

  it('restores imported scoped data with new local identity, revision, settings, and ownership', () => {
    const source = createProfile({ id: 'source-id', now: '2026-08-17T12:00:00.000Z' });
    const scope = { counterpartSex: 'male' as const, targetSite: 'anal' as const };
    const key = createAnswerKey('dildo', 'use-on-partner', scope);
    const portable = toPortableProfile({
      ...source,
      answers: {
        [key]: {
          practiceId: 'dildo', roleId: 'use-on-partner', scope, preference: 'like' as const,
          details: { desiredFrequency: 'occasionally' as const },
        },
      },
    });

    const restored = restorePortableProfile(portable, 'restored-id', '2026-08-17T13:00:00.000Z');

    expect(restored.id).toBe('restored-id');
    expect(restored.revision).toBe(1);
    expect(restored.catalogueVersion).toBe(portable.catalogueVersion);
    expect(restored.answers[key]).not.toBe(portable.answers[key]);
    expect(restored.answers[key]?.scope).not.toBe(portable.answers[key]?.scope);
    expect(restored.answers[key]?.details).not.toBe(portable.answers[key]?.details);
    expect(restored.settings.filterQuestionnaireByMetadata).toBe(true);
  });
});
