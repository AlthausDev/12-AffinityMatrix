import { ProfileRepository } from '../../application/profile/profile-repository';
import {
  Profile,
  ProfileId,
  PROFILE_SCHEMA_VERSION,
} from '../../domain/profile/profile';

const STORE_VERSION = 1 as const;
export const DEFAULT_PROFILE_STORAGE_KEY = 'profiles.v1';

interface StoredProfilesV1 {
  version: typeof STORE_VERSION;
  profiles: Profile[];
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
  ) {}

  findAll(): readonly Profile[] {
    return this.readStore().profiles;
  }

  findById(id: ProfileId): Profile | undefined {
    return this.readStore().profiles.find((profile) => profile.id === id);
  }

  save(profile: Profile): void {
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

    if (profiles.length === store.profiles.length) {
      return;
    }

    this.writeStore({ version: STORE_VERSION, profiles });
  }

  private readStore(): StoredProfilesV1 {
    const raw = this.storage.getItem(this.storageKey);
    if (raw === null) {
      return { version: STORE_VERSION, profiles: [] };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error: unknown) {
      throw new ProfileStorageError('Stored profile data is not valid JSON.', { cause: error });
    }

    if (!this.isStoredProfilesV1(parsed)) {
      throw new ProfileStorageError('Stored profile data uses an unsupported or invalid format.');
    }

    return parsed;
  }

  private writeStore(store: StoredProfilesV1): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(store));
    } catch (error: unknown) {
      throw new ProfileStorageError('Unable to persist profile data in browser storage.', {
        cause: error,
      });
    }
  }

  private isStoredProfilesV1(value: unknown): value is StoredProfilesV1 {
    if (!this.isRecord(value) || value['version'] !== STORE_VERSION || !Array.isArray(value['profiles'])) {
      return false;
    }

    return value['profiles'].every((profile) => this.isProfile(profile));
  }

  private isProfile(value: unknown): value is Profile {
    return (
      this.isRecord(value) &&
      value['schemaVersion'] === PROFILE_SCHEMA_VERSION &&
      typeof value['id'] === 'string' &&
      this.isRecord(value['metadata']) &&
      this.isRecord(value['answers']) &&
      typeof value['createdAt'] === 'string' &&
      typeof value['updatedAt'] === 'string'
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
