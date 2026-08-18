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

    expect(minimized.metadata).toEqual({ alias: 'Example' });
    expect(explicit.metadata.sex).toBe('female');
    expect(explicit.metadata.orientation).toBe('bisexual');
    expect(minimized.catalogueVersion).toBe(profile.catalogueVersion);
  });

  it('does not share nested answer detail objects with the local profile', () => {
    const profile = createProfile({ id: 'local-id', now: '2026-08-17T12:00:00.000Z' });
    const key = createAnswerKey('bondage', 'receive');
    const local = {
      ...profile,
      answers: {
        [key]: {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'depends' as const,
          details: { dependsOn: 'Trusted context' },
        },
      },
    };

    const portable = toPortableProfile(local);
    expect(portable.answers[key]).not.toBe(local.answers[key]);
    expect(portable.answers[key]?.details).not.toBe(local.answers[key].details);
  });

  it('restores imported data with new local identity, revision, settings, and ownership', () => {
    const source = createProfile({ id: 'source-id', now: '2026-08-17T12:00:00.000Z' });
    const key = createAnswerKey('bondage', 'receive');
    const portable = toPortableProfile({
      ...source,
      answers: {
        [key]: {
          practiceId: 'bondage',
          roleId: 'receive',
          preference: 'like' as const,
          details: { desiredFrequency: 'occasionally' as const },
        },
      },
    });

    const restored = restorePortableProfile(portable, 'restored-id', '2026-08-17T13:00:00.000Z');

    expect(restored.id).toBe('restored-id');
    expect(restored.revision).toBe(1);
    expect(restored.catalogueVersion).toBe(portable.catalogueVersion);
    expect(restored.answers[key]).not.toBe(portable.answers[key]);
    expect(restored.answers[key]?.details).not.toBe(portable.answers[key]?.details);
    expect(restored.settings.filterQuestionnaireByMetadata).toBe(true);
  });
});
