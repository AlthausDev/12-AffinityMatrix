import {
  ProfileConcurrencyError,
  ProfileRepository,
} from '../../application/profile/profile-repository';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { DomainValidationError } from '../../domain/shared/validator';
import { ProfileStoreMigrator } from './profile-store-migration';
import { PROFILE_STORE_VERSION, StoredProfilesV3 } from './profile-store';
import { StoredProfilesValidator, storedProfilesValidator } from './stored-profiles.validator';

export const DEFAULT_PROFILE_STORAGE_KEY = 'preference-profile-store';
export const LEGACY_PROFILE_STORAGE_KEYS = ['affinity-matrix.profiles', 'profiles.v1'] as const;

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
    private readonly validator: StoredProfilesValidator = storedProfilesValidator,
    private readonly migrator = new ProfileStoreMigrator(),
    private readonly legacyStorageKeys: readonly string[] = LEGACY_PROFILE_STORAGE_KEYS,
  ) {}

  async findAll(): Promise<readonly Profile[]> {
    return this.readStore().profiles;
  }

  async findById(id: ProfileId): Promise<Profile | undefined> {
    return this.readStore().profiles.find((profile) => profile.id === id);
  }

  async save(profile: Profile, expectedRevision?: number): Promise<void> {
    const store = this.readStore();
    const existingIndex = store.profiles.findIndex((candidate) => candidate.id === profile.id);
    const profiles = [...store.profiles];

    if (existingIndex >= 0) {
      const existing = profiles[existingIndex]!;
      if (
        expectedRevision === undefined ||
        existing.revision !== expectedRevision ||
        profile.revision !== expectedRevision + 1
      ) {
        throw new ProfileConcurrencyError();
      }
      profiles[existingIndex] = profile;
    } else {
      if (expectedRevision !== undefined || profile.revision !== 1) {
        throw new ProfileConcurrencyError('A stale operation attempted to create or replace a profile.');
      }
      profiles.push(profile);
    }

    this.writeStore({ version: PROFILE_STORE_VERSION, profiles });
  }

  async delete(id: ProfileId, expectedRevision?: number): Promise<void> {
    const store = this.readStore();
    const existing = store.profiles.find((profile) => profile.id === id);
    if (!existing) {
      return;
    }

    if (expectedRevision === undefined || existing.revision !== expectedRevision) {
      throw new ProfileConcurrencyError();
    }

    this.writeStore({
      version: PROFILE_STORE_VERSION,
      profiles: store.profiles.filter((profile) => profile.id !== id),
    });
  }

  private readStore(): StoredProfilesV3 {
    let source: { readonly key: string; readonly raw: string } | undefined;
    try {
      source = this.findStoredValue();
    } catch (error: unknown) {
      throw new ProfileStorageError('Unable to read profile data from browser storage.', { cause: error });
    }

    if (!source) {
      return { version: PROFILE_STORE_VERSION, profiles: [] };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(source.raw);
    } catch (error: unknown) {
      throw new ProfileStorageError('Stored profile data is not valid JSON.', { cause: error });
    }

    const migrated = this.migrator.migrate(parsed, PROFILE_STORE_VERSION);
    const store = this.assertValidStore(migrated);

    if (source.key !== this.storageKey || migrated !== parsed) {
      this.writeStore(store);
      if (source.key !== this.storageKey) {
        try {
          this.storage.removeItem(source.key);
        } catch (error: unknown) {
          throw new ProfileStorageError('Migrated profile data was saved but the legacy entry could not be removed.', {
            cause: error,
          });
        }
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

  private assertValidStore(value: unknown): StoredProfilesV3 {
    try {
      return this.validator.assert(value, 'Stored profile data failed validation.');
    } catch (error: unknown) {
      if (error instanceof DomainValidationError) {
        const firstIssue = error.issues[0];
        throw new ProfileStorageError(
          firstIssue
            ? `Stored profile data is invalid at ${firstIssue.path || 'store'}: ${firstIssue.message}`
            : error.message,
          { cause: error },
        );
      }
      throw error;
    }
  }

  private writeStore(store: StoredProfilesV3): void {
    this.assertValidStore(store);
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(store));
    } catch (error: unknown) {
      throw new ProfileStorageError('Unable to persist profile data in browser storage.', { cause: error });
    }
  }
}
