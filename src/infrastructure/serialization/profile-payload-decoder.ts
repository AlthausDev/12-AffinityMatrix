import {
  PORTABLE_PROFILE_V2_FORMAT_VERSION,
  PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION,
  PortableProfile,
} from '../../application/profile/portable-profile';
import { portableProfileValidator } from '../../application/profile/portable-profile.validator';
import { ORIENTATION_VALUES, SEX_VALUES } from '../../domain/profile/profile-metadata';

export const CURRENT_PROFILE_CODE_PREFIX = 'P2';
export const LEGACY_PROFILE_CODE_PREFIX = 'P1';

export class ProfilePayloadDecodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfilePayloadDecodeError';
  }
}

export abstract class ProfilePayloadDecoder {
  abstract readonly prefix: string;
  abstract decode(value: unknown): PortableProfile;
}

export class CurrentProfilePayloadDecoder extends ProfilePayloadDecoder {
  readonly prefix = CURRENT_PROFILE_CODE_PREFIX;

  override decode(value: unknown): PortableProfile {
    return portableProfileValidator.assert(value, 'Portable profile validation failed.');
  }
}

export class LegacyProfilePayloadV1Decoder extends ProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX;

  override decode(value: unknown): PortableProfile {
    if (!isRecord(value)) {
      throw new ProfilePayloadDecodeError('Legacy portable profile must be an object.');
    }

    assertAllowedKeys(value, ['formatVersion', 'profileSchemaVersion', 'metadata', 'answers']);

    if (value['formatVersion'] !== 1 || value['profileSchemaVersion'] !== 1) {
      throw new ProfilePayloadDecodeError('The legacy profile code uses an unsupported version.');
    }

    const legacyMetadata = value['metadata'];
    if (!isRecord(legacyMetadata)) {
      throw new ProfilePayloadDecodeError('The legacy profile code contains invalid metadata.');
    }

    assertAllowedKeys(legacyMetadata, [
      'alias',
      'sex',
      'orientation',
      'filterByProfileMetadata',
    ]);

    if (typeof legacyMetadata['filterByProfileMetadata'] !== 'boolean') {
      throw new ProfilePayloadDecodeError('The legacy profile code contains invalid filter metadata.');
    }

    const alias = legacyMetadata['alias'];
    const sex = legacyMetadata['sex'];
    const orientation = legacyMetadata['orientation'];

    if (alias !== undefined && typeof alias !== 'string') {
      throw new ProfilePayloadDecodeError('The legacy profile code contains an invalid alias.');
    }
    if (sex !== undefined && !SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number])) {
      throw new ProfilePayloadDecodeError('The legacy profile code contains an unsupported sex value.');
    }
    if (
      orientation !== undefined &&
      !ORIENTATION_VALUES.includes(orientation as (typeof ORIENTATION_VALUES)[number])
    ) {
      throw new ProfilePayloadDecodeError('The legacy profile code contains an unsupported orientation value.');
    }

    const metadata: Record<string, unknown> = {};
    for (const key of ['alias', 'sex', 'orientation'] as const) {
      if (legacyMetadata[key] !== undefined) {
        metadata[key] = legacyMetadata[key];
      }
    }

    return portableProfileValidator.assert(
      {
        formatVersion: PORTABLE_PROFILE_V2_FORMAT_VERSION,
        profileSchemaVersion: PORTABLE_PROFILE_V2_PROFILE_SCHEMA_VERSION,
        metadata,
        answers: value['answers'],
      },
      'Legacy portable profile migration failed.',
    );
  }
}

export class ProfilePayloadDecoderRegistry {
  private readonly decodersByPrefix: ReadonlyMap<string, ProfilePayloadDecoder>;

  constructor(
    decoders: readonly ProfilePayloadDecoder[] = [
      new CurrentProfilePayloadDecoder(),
      new LegacyProfilePayloadV1Decoder(),
    ],
  ) {
    const entries = new Map<string, ProfilePayloadDecoder>();
    for (const decoder of decoders) {
      if (entries.has(decoder.prefix)) {
        throw new Error(`Duplicate profile payload decoder for prefix ${decoder.prefix}.`);
      }
      entries.set(decoder.prefix, decoder);
    }
    this.decodersByPrefix = entries;
  }

  supports(prefix: string): boolean {
    return this.decodersByPrefix.has(prefix);
  }

  decode(prefix: string, value: unknown): PortableProfile {
    const decoder = this.decodersByPrefix.get(prefix);
    if (!decoder) {
      throw new ProfilePayloadDecodeError('The profile code uses an unsupported format.');
    }

    return decoder.decode(value);
  }
}

function assertAllowedKeys(value: Record<string, unknown>, allowedKeys: readonly string[]): void {
  const allowed = new Set(allowedKeys);
  const unknownKey = Object.keys(value).find((key) => !allowed.has(key));
  if (unknownKey) {
    throw new ProfilePayloadDecodeError(`Legacy profile contains unsupported property ${unknownKey}.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
