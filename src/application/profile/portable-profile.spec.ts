import { createAnswerKey } from '../../domain/profile/profile-answer';
import { createProfile } from '../../domain/profile/profile';
import { restorePortableProfile, toPortableProfile } from './portable-profile';

describe('portable profile mapping', () => {
  it('does not share nested answer detail objects with the local profile', () => {
    const profile = createProfile({
      id: 'local-id',
      now: '2026-08-17T12:00:00.000Z',
      metadata: { alias: 'Example' },
    });
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
    const localAnswer = local.answers[key];
    const portableAnswer = portable.answers[key];

    expect(portableAnswer).not.toBe(localAnswer);
    expect(portableAnswer?.details).not.toBe(localAnswer.details);
    expect(portableAnswer?.details?.dependsOn).toBe('Trusted context');
  });

  it('restores imported answers into independently owned objects', () => {
    const source = createProfile({
      id: 'source-id',
      now: '2026-08-17T12:00:00.000Z',
      metadata: { alias: 'Example' },
    });
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

    const restored = restorePortableProfile(
      portable,
      'restored-id',
      '2026-08-17T13:00:00.000Z',
    );

    expect(restored.answers[key]).not.toBe(portable.answers[key]);
    expect(restored.answers[key]?.details).not.toBe(portable.answers[key]?.details);
    expect(restored.settings.filterQuestionnaireByMetadata).toBe(true);
  });
});
