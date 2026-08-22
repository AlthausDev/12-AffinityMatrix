const PROFILE_SCHEMA_VERSION_V2 = 2 as const;
const PROFILE_SCHEMA_VERSION_V3 = 3 as const;
const PROFILE_SCHEMA_VERSION_V4 = 4 as const;
const PROFILE_SCHEMA_VERSION_V5 = 5 as const;
const PROFILE_SCHEMA_VERSION_V6 = 6 as const;
const CATALOGUE_VERSION_V1 = 1 as const;
const CATALOGUE_VERSION_V3 = 3 as const;

export abstract class ProfileStoreMigration {
  constructor(
    readonly fromVersion: number,
    readonly toVersion: number,
  ) {
    if (!Number.isInteger(fromVersion) || !Number.isInteger(toVersion) || toVersion <= fromVersion) {
      throw new Error('Store migrations must move between increasing integer versions.');
    }
  }

  canApply(value: unknown): boolean {
    return this.isRecord(value) && value['version'] === this.fromVersion;
  }

  abstract migrate(value: unknown): unknown;

  protected isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export class ProfilesV1ToV2Migration extends ProfileStoreMigration {
  constructor() { super(1, 2); }

  override migrate(value: unknown): unknown {
    if (!this.isRecord(value) || !Array.isArray(value['profiles'])) return value;
    return {
      version: this.toVersion,
      profiles: value['profiles'].map((profile) => this.migrateProfile(profile)),
    };
  }

  private migrateProfile(value: unknown): unknown {
    if (!this.isRecord(value) || !this.isRecord(value['metadata'])) return value;

    const legacyMetadata = value['metadata'];
    const filterValue = legacyMetadata['filterByProfileMetadata'];
    const metadata: Record<string, unknown> = {};
    for (const key of ['alias', 'sex', 'orientation'] as const) {
      if (legacyMetadata[key] !== undefined) metadata[key] = legacyMetadata[key];
    }

    return {
      ...value,
      schemaVersion: PROFILE_SCHEMA_VERSION_V2,
      metadata,
      settings: {
        filterQuestionnaireByMetadata: filterValue === undefined ? true : filterValue,
      },
    };
  }
}

export class ProfilesV2ToV3Migration extends ProfileStoreMigration {
  constructor() { super(2, 3); }

  override migrate(value: unknown): unknown {
    if (!this.isRecord(value) || !Array.isArray(value['profiles'])) return value;
    return {
      version: this.toVersion,
      profiles: value['profiles'].map((profile) => this.migrateProfile(profile)),
    };
  }

  private migrateProfile(value: unknown): unknown {
    if (!this.isRecord(value)) return value;
    return {
      ...value,
      schemaVersion: PROFILE_SCHEMA_VERSION_V3,
      revision: 1,
      catalogueVersion: CATALOGUE_VERSION_V1,
    };
  }
}

/**
 * V4 introduces relational answer scopes. Existing V3 answers remain intentionally unscoped:
 * the old payload did not contain enough information to infer whether a preference applied to
 * men, women, or both. Preserving the answer is safer than duplicating an assumption.
 */
export class ProfilesV3ToV4Migration extends ProfileStoreMigration {
  constructor() { super(3, 4); }

  override migrate(value: unknown): unknown {
    if (!this.isRecord(value) || !Array.isArray(value['profiles'])) return value;
    return {
      version: this.toVersion,
      profiles: value['profiles'].map((profile) =>
        this.isRecord(profile)
          ? { ...profile, schemaVersion: PROFILE_SCHEMA_VERSION_V4 }
          : profile,
      ),
    };
  }
}

/**
 * V5 removes Neutral from the active preference scale. A legacy Neutral answer cannot be safely
 * interpreted as Depends, Curious, Not interested, or a boundary, so it becomes unanswered.
 */
export class ProfilesV4ToV5Migration extends ProfileStoreMigration {
  constructor() { super(4, 5); }

  override migrate(value: unknown): unknown {
    if (!this.isRecord(value) || !Array.isArray(value['profiles'])) return value;
    return {
      version: this.toVersion,
      profiles: value['profiles'].map((profile) => this.migrateProfile(profile)),
    };
  }

  private migrateProfile(value: unknown): unknown {
    if (!this.isRecord(value)) return value;
    return {
      ...value,
      schemaVersion: PROFILE_SCHEMA_VERSION_V5,
      answers: this.removeLegacyNeutralAnswers(value['answers']),
    };
  }

  private removeLegacyNeutralAnswers(value: unknown): unknown {
    if (!this.isRecord(value)) return value;
    return Object.fromEntries(
      Object.entries(value).filter(([, answer]) =>
        !(this.isRecord(answer) && answer['preference'] === 'neutral'),
      ),
    );
  }
}

/**
 * V6 introduces Catalogue V3 and generalized answer scopes such as targetSite. During the private
 * development phase, V5 answers are test data only. Clearing them avoids inventing mappings from
 * the old coarse catalogue into the new taxonomy while preserving profiles and metadata.
 */
export class ProfilesV5ToV6Migration extends ProfileStoreMigration {
  constructor() { super(5, 6); }

  override migrate(value: unknown): unknown {
    if (!this.isRecord(value) || !Array.isArray(value['profiles'])) return value;
    return {
      version: this.toVersion,
      profiles: value['profiles'].map((profile) =>
        this.isRecord(profile)
          ? {
              ...profile,
              schemaVersion: PROFILE_SCHEMA_VERSION_V6,
              catalogueVersion: CATALOGUE_VERSION_V3,
              answers: {},
            }
          : profile,
      ),
    };
  }
}

export class ProfileStoreMigrator {
  constructor(
    private readonly migrations: readonly ProfileStoreMigration[] = [
      new ProfilesV1ToV2Migration(),
      new ProfilesV2ToV3Migration(),
      new ProfilesV3ToV4Migration(),
      new ProfilesV4ToV5Migration(),
      new ProfilesV5ToV6Migration(),
    ],
  ) {}

  migrate(value: unknown, targetVersion: number): unknown {
    let current = value;
    const visitedVersions = new Set<number>();

    while (this.getVersion(current) !== targetVersion) {
      const currentVersion = this.getVersion(current);
      if (currentVersion === undefined || visitedVersions.has(currentVersion)) return current;
      visitedVersions.add(currentVersion);

      const migration = this.migrations.find((candidate) => candidate.canApply(current));
      if (!migration) return current;
      current = migration.migrate(current);
    }

    return current;
  }

  private getVersion(value: unknown): number | undefined {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
    const version = (value as Record<string, unknown>)['version'];
    return typeof version === 'number' ? version : undefined;
  }
}
