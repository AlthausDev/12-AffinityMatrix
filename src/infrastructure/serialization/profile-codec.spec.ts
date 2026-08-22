import { createAnswerKey } from '../../domain/profile/profile-answer';
import { createProfile } from '../../domain/profile/profile';
import { ProfileCodeError, VersionedProfileCodeCodec } from './profile-codec';
import { ProfilePayloadDecoderRegistry } from './profile-payload-decoder';

const codec = new VersionedProfileCodeCodec();

function sampleProfile() {
  const profile = createProfile({
    id: 'local-only-id',
    now: '2026-08-17T12:00:00.000Z',
    metadata: { alias: 'Ána ✓', sex: 'female', orientation: 'bisexual' },
    settings: { filterQuestionnaireByMetadata: false },
  });

  const scope = { counterpartSex: 'male' as const };
  const key = createAnswerKey('example-practice', 'receive', scope);
  return {
    ...profile,
    answers: {
      [key]: {
        practiceId: 'example-practice',
        roleId: 'receive',
        scope,
        preference: 'depends' as const,
        details: {
          context: 'want-to-try' as const,
          desiredFrequency: 'occasionally' as const,
          initiative: 'prefer-partner' as const,
          dependsOn: 'Context matters',
        },
      },
    },
  };
}

describe('VersionedProfileCodeCodec', () => {
  it('round-trips scoped portable profile data including unicode and optional details', () => {
    const decoded = codec.decode(codec.encode(sampleProfile()));
    const answer = Object.values(decoded.answers)[0];

    expect(decoded.formatVersion).toBe(5);
    expect(decoded.profileSchemaVersion).toBe(5);
    expect(decoded.metadata.alias).toBe('Ána ✓');
    expect(decoded.catalogueVersion).toBe(2);
    expect(answer?.scope?.counterpartSex).toBe('male');
    expect(answer?.preference).toBe('depends');
    expect(answer?.details?.desiredFrequency).toBe('occasionally');
  });

  it('minimizes sensitive metadata by default and includes it only when explicitly requested', () => {
    const minimized = codec.decode(codec.encode(sampleProfile()));
    const explicit = codec.decode(codec.encode(sampleProfile(), { includeSensitiveMetadata: true }));
    expect(minimized.metadata.sex).toBeUndefined();
    expect(minimized.metadata.orientation).toBeUndefined();
    expect(explicit.metadata.sex).toBe('female');
    expect(explicit.metadata.orientation).toBe('bisexual');
  });

  it('does not expose local identity, revision, timestamps, or presentation settings', () => {
    const decoded = codec.decode(codec.encode(sampleProfile()));
    expect('id' in decoded).toBe(false);
    expect('revision' in decoded).toBe(false);
    expect('createdAt' in decoded).toBe(false);
    expect('updatedAt' in decoded).toBe(false);
    expect('settings' in decoded).toBe(false);
  });

  it('rejects corrupted codes using the checksum', () => {
    const code = codec.encode(sampleProfile());
    const corrupted = `${code.slice(0, -1)}${code.endsWith('0') ? '1' : '0'}`;
    expect(() => codec.decode(corrupted)).toThrow(ProfileCodeError);
  });

  it('never emits a code that its configured decoder would reject for size', () => {
    const tinyCodec = new VersionedProfileCodeCodec(new ProfilePayloadDecoderRegistry(), 64);
    expect(() => tinyCodec.encode(sampleProfile())).toThrow(ProfileCodeError);
  });

  it('migrates P4 Neutral answers to unanswered while preserving explicit choices', () => {
    const v4 = {
      formatVersion: 4,
      profileSchemaVersion: 4,
      catalogueVersion: 2,
      metadata: { alias: 'Legacy V4' },
      answers: {
        'cuddling::mutual': { practiceId: 'cuddling', roleId: 'mutual', preference: 'neutral' },
        'kissing::give': { practiceId: 'kissing', roleId: 'give', preference: 'like' },
      },
    };

    const decoded = codec.decode(legacyCode('P4', v4));

    expect(decoded.formatVersion).toBe(5);
    expect(decoded.profileSchemaVersion).toBe(5);
    expect(decoded.answers['cuddling::mutual']).toBeUndefined();
    expect(decoded.answers['kissing::give']?.preference).toBe('like');
  });

  it('migrates P3 without inventing relational scope and keeps its catalogue version', () => {
    const v3 = {
      formatVersion: 3,
      profileSchemaVersion: 3,
      catalogueVersion: 1,
      metadata: { alias: 'Legacy V3' },
      answers: {
        'kissing::mutual': {
          practiceId: 'kissing', roleId: 'mutual', preference: 'like',
        },
      },
    };
    const decoded = codec.decode(legacyCode('P3', v3));
    expect(decoded.formatVersion).toBe(5);
    expect(decoded.profileSchemaVersion).toBe(5);
    expect(decoded.catalogueVersion).toBe(1);
    expect(decoded.answers['kissing::mutual']?.scope).toBeUndefined();
  });

  it('migrates valid P2 and P1 codes to the current portable model', () => {
    const v2 = {
      formatVersion: 2,
      profileSchemaVersion: 2,
      metadata: { alias: 'Legacy V2', sex: 'female', orientation: 'bisexual' },
      answers: {},
    };
    const v1 = {
      formatVersion: 1,
      profileSchemaVersion: 1,
      metadata: {
        alias: 'Legacy V1', sex: 'female', orientation: 'heterosexual', filterByProfileMetadata: true,
      },
      answers: {},
    };

    const decodedV2 = codec.decode(legacyCode('P2', v2));
    const decodedV1 = codec.decode(legacyCode('P1', v1));

    expect(decodedV2.formatVersion).toBe(5);
    expect(decodedV2.profileSchemaVersion).toBe(5);
    expect(decodedV2.catalogueVersion).toBe(1);
    expect(decodedV2.metadata.alias).toBe('Legacy V2');
    expect(decodedV1.metadata.alias).toBe('Legacy V1');
    expect('filterByProfileMetadata' in decodedV1.metadata).toBe(false);
  });
});

function legacyCode(prefix: 'P1' | 'P2' | 'P3' | 'P4', value: unknown): string {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  const payload = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
  return `${prefix}.${payload}.${checksum(payload)}`;
}

function checksum(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}
