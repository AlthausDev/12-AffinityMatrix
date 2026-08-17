import {
  PORTABLE_PROFILE_FORMAT_VERSION,
  PortableProfileV1,
  toPortableProfile,
} from '../../application/profile/portable-profile';
import { PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile, PROFILE_SCHEMA_VERSION } from '../../domain/profile/profile';
import {
  ORIENTATION_VALUES,
  ProfileMetadata,
  SEX_VALUES,
} from '../../domain/profile/profile-metadata';
import { EXPERIENCE_CONTEXT_VALUES } from '../../domain/profile/profile-answer';
import { isPreference } from '../../domain/profile/preference';

const CODE_PREFIX = 'P1';
const MAX_CODE_LENGTH = 500_000;

export class ProfileCodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfileCodeError';
  }
}

export function encodeProfileCode(profile: Profile): string {
  const json = JSON.stringify(toPortableProfile(profile));
  const payload = encodeBase64Url(json);
  return `${CODE_PREFIX}.${payload}.${checksum(payload)}`;
}

export function decodeProfileCode(code: string): PortableProfileV1 {
  const normalized = code.trim();
  if (!normalized || normalized.length > MAX_CODE_LENGTH) {
    throw new ProfileCodeError('The profile code is empty or exceeds the supported size.');
  }

  const parts = normalized.split('.');
  if (parts.length !== 3 || parts[0] !== CODE_PREFIX) {
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

  if (!isPortableProfileV1(parsed)) {
    throw new ProfileCodeError('The profile code contains invalid or unsupported profile data.');
  }

  return parsed;
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

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

function isPortableProfileV1(value: unknown): value is PortableProfileV1 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value['formatVersion'] === PORTABLE_PROFILE_FORMAT_VERSION &&
    value['profileSchemaVersion'] === PROFILE_SCHEMA_VERSION &&
    isProfileMetadata(value['metadata']) &&
    isAnswers(value['answers'])
  );
}

function isProfileMetadata(value: unknown): value is ProfileMetadata {
  if (!isRecord(value) || typeof value['filterByProfileMetadata'] !== 'boolean') {
    return false;
  }

  const alias = value['alias'];
  const sex = value['sex'];
  const orientation = value['orientation'];

  return (
    (alias === undefined || typeof alias === 'string') &&
    (sex === undefined || SEX_VALUES.includes(sex as never)) &&
    (orientation === undefined || ORIENTATION_VALUES.includes(orientation as never))
  );
}

function isAnswers(value: unknown): value is PortableProfileV1['answers'] {
  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).every(([key, answer]) => {
    if (!isPracticeAnswer(answer)) {
      return false;
    }

    return key === `${answer.practiceId}::${answer.roleId}`;
  });
}

function isPracticeAnswer(value: unknown): value is PracticeAnswer {
  if (!isRecord(value)) {
    return false;
  }

  const details = value['details'];
  return (
    typeof value['practiceId'] === 'string' &&
    typeof value['roleId'] === 'string' &&
    isPreference(value['preference']) &&
    (details === undefined || isAnswerDetails(details))
  );
}

function isAnswerDetails(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const context = value['context'];
  const dependsOn = value['dependsOn'];
  return (
    (context === undefined || EXPERIENCE_CONTEXT_VALUES.includes(context as never)) &&
    (dependsOn === undefined || typeof dependsOn === 'string')
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
