import { ProfileCodeCodec } from '../../application/profile/profile-codec';
import {
  PortableProfile,
  ProfileExportOptions,
  toPortableProfile,
} from '../../application/profile/portable-profile';
import { Profile } from '../../domain/profile/profile';
import { profileValidator } from '../../domain/profile/profile.validator';
import { DomainValidationError } from '../../domain/shared/validator';
import {
  CURRENT_PROFILE_CODE_PREFIX,
  ProfilePayloadDecodeError,
  ProfilePayloadDecoderRegistry,
} from './profile-payload-decoder';

export const DEFAULT_MAX_PROFILE_CODE_LENGTH = 500_000;

export class ProfileCodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfileCodeError';
  }
}

export class VersionedProfileCodeCodec implements ProfileCodeCodec {
  constructor(
    private readonly decoders = new ProfilePayloadDecoderRegistry(),
    private readonly maxCodeLength = DEFAULT_MAX_PROFILE_CODE_LENGTH,
  ) {
    if (!Number.isInteger(maxCodeLength) || maxCodeLength < 1) {
      throw new Error('Maximum profile code length must be a positive integer.');
    }
  }

  encode(profile: Profile, options: ProfileExportOptions = {}): string {
    try {
      profileValidator.assert(profile, 'Cannot export an invalid profile.');
    } catch (error: unknown) {
      throw this.wrapError(error, 'The local profile cannot be exported.');
    }

    const json = JSON.stringify(toPortableProfile(profile, options));
    const payload = encodeBase64Url(json);
    const code = `${CURRENT_PROFILE_CODE_PREFIX}.${payload}.${checksum(payload)}`;
    if (code.length > this.maxCodeLength) {
      throw new ProfileCodeError(
        'The profile is too large for the supported portable-code format. Remove optional notes or use a future file export format.',
      );
    }
    return code;
  }

  decode(code: string): PortableProfile {
    const normalized = code.trim();
    if (!normalized || normalized.length > this.maxCodeLength) {
      throw new ProfileCodeError('The profile code is empty or exceeds the supported size.');
    }

    const parts = normalized.split('.');
    if (parts.length !== 3) {
      throw new ProfileCodeError('The profile code uses an unsupported format.');
    }

    const prefix = parts[0] ?? '';
    if (!this.decoders.supports(prefix)) {
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
      return this.decoders.decode(prefix, parsed);
    } catch (error: unknown) {
      throw this.wrapError(error, 'The profile code contains invalid or unsupported profile data.');
    }
  }

  private wrapError(error: unknown, fallback: string): ProfileCodeError {
    if (error instanceof DomainValidationError) {
      const firstIssue = error.issues[0];
      const detail = firstIssue ? `${firstIssue.path || 'profile'}: ${firstIssue.message}` : error.message;
      return new ProfileCodeError(`${fallback} ${detail}`, { cause: error });
    }

    if (error instanceof ProfilePayloadDecodeError) {
      return new ProfileCodeError(`${fallback} ${error.message}`, { cause: error });
    }

    if (error instanceof ProfileCodeError) {
      return error;
    }

    return new ProfileCodeError(fallback, { cause: error });
  }
}

export const profileCodeCodec = new VersionedProfileCodeCodec();

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
