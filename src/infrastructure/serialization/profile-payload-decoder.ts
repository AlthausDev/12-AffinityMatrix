import {
  PORTABLE_PROFILE_V6_FORMAT_VERSION,
  PORTABLE_PROFILE_V6_PROFILE_SCHEMA_VERSION,
  PortableProfile,
} from '../../application/profile/portable-profile';
import { portableProfileValidator } from '../../application/profile/portable-profile.validator';
import { CATALOGUE_VERSION_V3 } from '../../domain/catalogue/catalogue-version';
import { ORIENTATION_VALUES, SEX_VALUES } from '../../domain/profile/profile-metadata';

export const CURRENT_PROFILE_CODE_PREFIX = 'P6';
export const LEGACY_PROFILE_CODE_PREFIX_V5 = 'P5';
export const LEGACY_PROFILE_CODE_PREFIX_V4 = 'P4';
export const LEGACY_PROFILE_CODE_PREFIX_V3 = 'P3';
export const LEGACY_PROFILE_CODE_PREFIX_V2 = 'P2';
export const LEGACY_PROFILE_CODE_PREFIX_V1 = 'P1';

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

abstract class DiscardingLegacyProfilePayloadDecoder extends ProfilePayloadDecoder {
  abstract readonly formatVersion: number;
  abstract readonly profileSchemaVersion: number;

  override decode(value: unknown): PortableProfile {
    if (!isRecord(value)) {
      throw new ProfilePayloadDecodeError(`Legacy ${this.prefix} portable profile must be an object.`);
    }
    assertAllowedKeys(value, ['formatVersion', 'profileSchemaVersion', 'catalogueVersion', 'metadata', 'answers']);
    if (
      value['formatVersion'] !== this.formatVersion ||
      value['profileSchemaVersion'] !== this.profileSchemaVersion
    ) {
      throw new ProfilePayloadDecodeError(`The legacy ${this.prefix} profile code uses an unsupported version.`);
    }

    return migrateLegacyMetadata(value['metadata'], `Legacy ${this.prefix}`);
  }
}

export class LegacyProfilePayloadV5Decoder extends DiscardingLegacyProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX_V5;
  readonly formatVersion = 5;
  readonly profileSchemaVersion = 5;
}

export class LegacyProfilePayloadV4Decoder extends DiscardingLegacyProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX_V4;
  readonly formatVersion = 4;
  readonly profileSchemaVersion = 4;
}

export class LegacyProfilePayloadV3Decoder extends DiscardingLegacyProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX_V3;
  readonly formatVersion = 3;
  readonly profileSchemaVersion = 3;
}

export class LegacyProfilePayloadV2Decoder extends ProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX_V2;

  override decode(value: unknown): PortableProfile {
    if (!isRecord(value)) throw new ProfilePayloadDecodeError('Legacy P2 portable profile must be an object.');
    assertAllowedKeys(value, ['formatVersion', 'profileSchemaVersion', 'metadata', 'answers']);
    if (value['formatVersion'] !== 2 || value['profileSchemaVersion'] !== 2) {
      throw new ProfilePayloadDecodeError('The legacy P2 profile code uses an unsupported version.');
    }
    return migrateLegacyMetadata(value['metadata'], 'Legacy P2');
  }
}

export class LegacyProfilePayloadV1Decoder extends ProfilePayloadDecoder {
  readonly prefix = LEGACY_PROFILE_CODE_PREFIX_V1;

  override decode(value: unknown): PortableProfile {
    if (!isRecord(value)) throw new ProfilePayloadDecodeError('Legacy P1 portable profile must be an object.');
    assertAllowedKeys(value, ['formatVersion', 'profileSchemaVersion', 'metadata', 'answers']);
    if (value['formatVersion'] !== 1 || value['profileSchemaVersion'] !== 1) {
      throw new ProfilePayloadDecodeError('The legacy P1 profile code uses an unsupported version.');
    }

    const legacyMetadata = value['metadata'];
    if (!isRecord(legacyMetadata)) {
      throw new ProfilePayloadDecodeError('The legacy P1 profile code contains invalid metadata.');
    }
    assertAllowedKeys(legacyMetadata, ['alias', 'sex', 'orientation', 'filterByProfileMetadata']);
    if (typeof legacyMetadata['filterByProfileMetadata'] !== 'boolean') {
      throw new ProfilePayloadDecodeError('The legacy P1 profile code contains invalid filter metadata.');
    }

    const metadata: Record<string, unknown> = {};
    for (const key of ['alias', 'sex', 'orientation'] as const) {
      if (legacyMetadata[key] !== undefined) metadata[key] = legacyMetadata[key];
    }
    return migrateLegacyMetadata(metadata, 'Legacy P1');
  }
}

export class ProfilePayloadDecoderRegistry {
  private readonly decodersByPrefix: ReadonlyMap<string, ProfilePayloadDecoder>;

  constructor(
    decoders: readonly ProfilePayloadDecoder[] = [
      new CurrentProfilePayloadDecoder(),
      new LegacyProfilePayloadV5Decoder(),
      new LegacyProfilePayloadV4Decoder(),
      new LegacyProfilePayloadV3Decoder(),
      new LegacyProfilePayloadV2Decoder(),
      new LegacyProfilePayloadV1Decoder(),
    ],
  ) {
    const entries = new Map<string, ProfilePayloadDecoder>();
    for (const decoder of decoders) {
      if (entries.has(decoder.prefix)) throw new Error(`Duplicate profile payload decoder for prefix ${decoder.prefix}.`);
      entries.set(decoder.prefix, decoder);
    }
    this.decodersByPrefix = entries;
  }

  supports(prefix: string): boolean {
    return this.decodersByPrefix.has(prefix);
  }

  decode(prefix: string, value: unknown): PortableProfile {
    const decoder = this.decodersByPrefix.get(prefix);
    if (!decoder) throw new ProfilePayloadDecodeError('The profile code uses an unsupported format.');
    return decoder.decode(value);
  }
}

/**
 * Pre-V6 codes belong to the development catalogue. Their metadata remains useful but their
 * answers are intentionally discarded instead of guessing mappings into Catalogue V3.
 */
function migrateLegacyMetadata(metadata: unknown, sourceName: string): PortableProfile {
  if (!isRecord(metadata)) {
    throw new ProfilePayloadDecodeError(`${sourceName} profile code contains invalid metadata.`);
  }

  const alias = metadata['alias'];
  const sex = metadata['sex'];
  const orientation = metadata['orientation'];
  if (alias !== undefined && typeof alias !== 'string') {
    throw new ProfilePayloadDecodeError(`${sourceName} profile code contains an invalid alias.`);
  }
  if (sex !== undefined && !SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number])) {
    throw new ProfilePayloadDecodeError(`${sourceName} profile code contains an unsupported sex value.`);
  }
  if (orientation !== undefined && !ORIENTATION_VALUES.includes(orientation as (typeof ORIENTATION_VALUES)[number])) {
    throw new ProfilePayloadDecodeError(`${sourceName} profile code contains an unsupported orientation value.`);
  }

  const cleanMetadata = {
    ...(typeof alias === 'string' ? { alias } : {}),
    ...(typeof sex === 'string' ? { sex } : {}),
    ...(typeof orientation === 'string' ? { orientation } : {}),
  };

  return portableProfileValidator.assert(
    {
      formatVersion: PORTABLE_PROFILE_V6_FORMAT_VERSION,
      profileSchemaVersion: PORTABLE_PROFILE_V6_PROFILE_SCHEMA_VERSION,
      catalogueVersion: CATALOGUE_VERSION_V3,
      metadata: cleanMetadata,
      answers: {},
    },
    `${sourceName} portable profile migration failed.`,
  );
}

function assertAllowedKeys(value: Record<string, unknown>, allowedKeys: readonly string[]): void {
  const allowed = new Set(allowedKeys);
  const unknownKey = Object.keys(value).find((key) => !allowed.has(key));
  if (unknownKey) throw new ProfilePayloadDecodeError(`Legacy profile contains unsupported property ${unknownKey}.`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
