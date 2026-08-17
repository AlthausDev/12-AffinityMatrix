import { ProfileCodeCodec } from '../../application/profile/profile-codec';
import {
  PORTABLE_PROFILE_FORMAT_VERSION,
  PortableProfile,
  toPortableProfile,
} from '../../application/profile/portable-profile';
import { portableProfileValidator } from '../../application/profile/portable-profile.validator';
import { Profile, PROFILE_SCHEMA_VERSION } from '../../domain/profile/profile';
import { ORIENTATION_VALUES, SEX_VALUES } from '../../domain/profile/profile-metadata';
import { profileValidator } from '../../domain/profile/profile.validator';
import { DomainValidationError } from '../../domain/shared/validator';

const CURRENT_CODE_PREFIX = 'P2';
const LEGACY_CODE_PREFIX = 'P1';
const MAX_CODE_LENGTH = 500_000;

export class ProfileCodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfileCodeError';
  }
}

export class VersionedProfileCodeCodec implements ProfileCodeCodec {
  encode(profile: Profile): string {
    try {
      profileValidator.assert(profile, 'Cannot export an invalid profile.');
    } catch (error: unknown) {
      throw this.wrapValidationError(error, 'The local profile cannot be exported.');
    }

    const json = JSON.stringify(toPortableProfile(profile));
    const payload = encodeBase64Url(json);
    return `${CURRENT_CODE_PREFIX}.${payload}.${checksum(payload)}`;
  }

  decode(code: string): PortableProfile {
    const normalized = code.trim();
    if (!normalized || normalized.length > MAX_CODE_LENGTH) {
      throw new ProfileCodeError('The profile code is empty or exceeds the supported size.');
    }

    const parts = normalized.split('.');
    if (parts.length !== 3) {
      throw new ProfileCodeError('The profile code uses an unsupported format.');
    }

    const prefix = parts[0] ?? '';
    if (prefix !== CURRENT_CODE_PREFIX && prefix !== LEGACY_CODE_PREFIX) {
      throw new ProfileCodeError('The profile code uses an unsupported format.');
    }

    const payload = parts[1] ?? '';
    const expectedChecksum = parts[2] ?? '';
    if (!payload || checksum(payload) !== expectedChecksum.toLowerCase()) {
      throw new ProfileCodeError('The profile code is incomplete or has been corrupted.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(decodeBase64Url(payload));
    } catch (error: unknown) {
      throw new ProfileCodeError('The profile code payload cannot be decoded.', { cause: error });
    }

    try {
      if (prefix === LEGACY_CODE_PREFIX) {
        return portableProfileValidator.assert(
          migrateLegacyPortableProfile(parsed),
          'Legacy portable profile migration failed.',
        );
      }

      return portableProfileValidator.assert(parsed, 'Portable profile validation failed.');
    } catch (error: unknown) {
      throw this.wrapValidationError(error, 'The profile code contains invalid or unsupported profile data.');
    }
  }

  private wrapValidationError(error: unknown, fallback: string): ProfileCodeError {
    if (error instanceof DomainValidationError) {
      const firstIssue = error.issues[0];
      const detail = firstIssue ? `${firstIssue.path || 'profile'}: ${firstIssue.message}` : error.message;
      return new ProfileCodeError(`${fallback} ${detail}`, { cause: error });
    }

    if (error instanceof ProfileCodeError) {
      return error;
    }

    return new ProfileCodeError(fallback, { cause: error });
  }
}

export const profileCodeCodec = new VersionedProfileCodeCodec();

function migrateLegacyPortableProfile(value: unknown): PortableProfile {
  if (!isRecord(value) || value['formatVersion'] !== 1 || value['profileSchemaVersion'] !== 1) {
    throw new ProfileCodeError('The legacy profile code uses an unsupported version.');
  }

  const legacyMetadata = value['metadata'];
  if (!isRecord(legacyMetadata) || typeof legacyMetadata['filterByProfileMetadata'] !== 'boolean') {
    throw new ProfileCodeError('The legacy profile code contains invalid metadata.');
  }

  const sex = legacyMetadata['sex'];
  const orientation = legacyMetadata['orientation'];
  if (sex !== undefined && !SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number])) {
    throw new ProfileCodeError('The legacy profile code contains an unsupported sex value.');
  }
  if (
    orientation !== undefined &&
    !ORIENTATION_VALUES.includes(orientation as (typeof ORIENTATION_VALUES)[number])
  ) {
    throw new ProfileCodeError('The legacy profile code contains an unsupported orientation value.');
  }

  const metadata: Record<string, unknown> = {};
  for (const key of ['alias', 'sex', 'orientation'] as const) {
    if (legacyMetadata[key] !== undefined) {
      metadata[key] = legacyMetadata[key];
    }
  }

  return {
    formatVersion: PORTABLE_PROFILE_FORMAT_VERSION,
    profileSchemaVersion: PROFILE_SCHEMA_VERSION,
    metadata,
    answers: value['answers'] as PortableProfile['answers'],
  } as PortableProfile;
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function decodeBase64Url(value: string): string {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function checksum(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
