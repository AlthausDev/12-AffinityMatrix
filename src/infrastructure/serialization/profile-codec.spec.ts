import { createAnswerKey } from '../../domain/profile/profile-answer';
import { createProfile } from '../../domain/profile/profile';
import { decodeProfileCode, encodeProfileCode, ProfileCodeError } from './profile-codec';

function sampleProfile() {
  const profile = createProfile({
    id: 'local-only-id',
    now: '2026-08-17T12:00:00.000Z',
    metadata: {
      alias: 'Ána ✓',
      sex: 'female',
      orientation: 'bisexual',
      filterByProfileMetadata: true,
    },
  });

  const key = createAnswerKey('example-practice', 'receive');
  profile.answers[key] = {
    practiceId: 'example-practice',
    roleId: 'receive',
    preference: 'depends',
    details: { context: 'want-to-try', dependsOn: 'Context matters' },
  };

  return profile;
}

describe('profile code serialization', () => {
  it('round-trips portable profile data including unicode', () => {
    const decoded = decodeProfileCode(encodeProfileCode(sampleProfile()));

    expect(decoded.metadata.alias).toBe('Ána ✓');
    expect(Object.values(decoded.answers)[0]?.preference).toBe('depends');
    expect(Object.values(decoded.answers)[0]?.details?.dependsOn).toBe('Context matters');
  });

  it('does not expose local identity or timestamps in the portable model', () => {
    const decoded = decodeProfileCode(encodeProfileCode(sampleProfile()));

    expect('id' in decoded).toBe(false);
    expect('createdAt' in decoded).toBe(false);
    expect('updatedAt' in decoded).toBe(false);
  });

  it('rejects a corrupted code using the checksum', () => {
    const code = encodeProfileCode(sampleProfile());
    const corrupted = `${code.slice(0, -1)}${code.endsWith('0') ? '1' : '0'}`;

    expect(() => decodeProfileCode(corrupted)).toThrow(ProfileCodeError);
  });

  it('rejects an unknown code prefix', () => {
    const code = encodeProfileCode(sampleProfile()).replace(/^P1\./u, 'P2.');

    expect(() => decodeProfileCode(code)).toThrow(ProfileCodeError);
  });
});
