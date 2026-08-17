import { ProfileRepository } from '../../application/profile/profile-repository';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { DomainValidationError } from '../../domain/shared/validator';
import { ProfileValidator, profileValidator } from '../../domain/profile/profile.validator';
import { ProfileStoreMigrator } from './profile-store-migration';

const STORE_VERSION = 2 as const;
export const DEFAULT_PROFILE_STORAGE_KEY = 'preference-profile-store';
export const LEGACY_PROFILE_STORAGE_KEYS = ['affinity-matrix.profiles', 'profiles.v1'] as const;

interface StoredProfilesV2 {
  readonly version: typeof STORE_VERSION;
  readonly profiles: readonly Profile[];
}

export class ProfileStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfileStorageError';
  }
}

export class LocalStorageProfileRepository implements ProfileRepository {
  constructor(
    private readonly storage: Storage,
    private readonly storageKey = DEFAULT_PROFILE_STORAGE_KEY,
    private readonly validator: ProfileValidator = profileValidator,
    private readonly migrator = new ProfileStoreMigrator(),
    private readonly legacyStorageKeys: readonly string[] = LEGACY_PROFILE_STORAGE_KEYS,
  ) {}

  findAll(): readonly Profile[] {
    return this.readStore().profiles;
  }

  findById(id: ProfileId): Profile | undefined {
    return this.readStore().profiles.find((profile) => profile.id === id);
  }

  save(profile: Profile): void {
    this.assertValidProfile(profile);

    const store = this.readStore();
    const existingIndex = store.profiles.findIndex((candidate) => candidate.id === profile.id);
    const profiles = [...store.profiles];

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    this.writeStore({ version: STORE_VERSION, profiles });
  }

  delete(id: ProfileId): void {
    const store = this.readStore();
    const profiles = store.profiles.filter((profile) => profile.id !== id);

    if (profiles.length !== store.profiles.length) {
      this.writeStore({ version: STORE_VERSION, profiles });
    }
  }

  private readStore(): StoredProfilesV2 {
    const source = this.findStoredValue();
    if (!source) {
      return { version: STORE_VERSION, profiles: [] };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(source.raw);
    } catch (error: unknown) {
      throw new ProfileStorageError('Stored profile data is not valid JSON.', { cause: error });
    }

    const migrated = this.migrator.migrate(parsed, STORE_VERSION);
    const store = this.parseStore(migrated);

    if (source.key !== this.storageKey || migrated !== parsed) {
      this.writeStore(store);
      if (source.key !== this.storageKey) {
        this.storage.removeItem(source.key);
      }
    }

    return store;
  }

  private findStoredValue(): { readonly key: string; readonly raw: string } | undefined {
    const current = this.storage.getItem(this.storageKey);
    if (current !== null) {
      return { key: this.storageKey, raw: current };
    }

    for (const key of this.legacyStorageKeys) {
      const raw = this.storage.getItem(key);
      if (raw !== null) {
        return { key, raw };
      }
    }

    return undefined;
  }

  private parseStore(value: unknown): StoredProfilesV2 {
    if (!this.isRecord(value) || value['version'] !== STORE_VERSION || !Array.isArray(value['profiles'])) {
      throw new ProfileStorageError('Stored profile data uses an unsupported or invalid format.');
    }

    const profiles = value['profiles'].map((profile) => this.assertValidProfile(profile));
    return { version: STORE_VERSION, profiles };
  }

  private assertValidProfile(value: unknown): Profile {
    try {
      return this.validator.assert(value, 'Stored profile failed domain validation.');
    } catch (error: unknown) {
      if (error instanceof DomainValidationError) {
        const firstIssue = error.issues[0];
        throw new ProfileStorageError(
          firstIssue ? `Stored profile data is invalid at ${firstIssue.path || 'profile'}: ${firstIssue.message}` : error.message,
          { cause: error },
        );
      }

      throw error;
    }
  }

  private writeStore(store: StoredProfilesV2): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(store));
    } catch (error: unknown) {
      throw new ProfileStorageError('Unable to persist profile data in browser storage.', {
        cause: error,
      });
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
