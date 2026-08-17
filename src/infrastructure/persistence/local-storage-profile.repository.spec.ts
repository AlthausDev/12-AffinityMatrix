import { createProfile } from '../../domain/profile/profile';
import {
  DEFAULT_PROFILE_STORAGE_KEY,
  LocalStorageProfileRepository,
  ProfileStorageError,
} from './local-storage-profile.repository';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

function profile(id: string, alias: string) {
  return createProfile({ id, now: '2026-08-17T12:00:00.000Z', metadata: { alias } });
}

describe('LocalStorageProfileRepository', () => {
  it('returns an empty collection when no store exists', () => {
    expect(new LocalStorageProfileRepository(new MemoryStorage()).findAll()).toEqual([]);
  });

  it('persists, updates, and deletes profiles by stable local id', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProfileRepository(storage);
    repository.save(profile('one', 'Original'));
    repository.save(profile('two', 'Two'));
    repository.save(profile('one', 'Updated'));

    expect(repository.findAll()).toHaveLength(2);
    expect(repository.findById('one')?.metadata.alias).toBe('Updated');

    repository.delete('one');
    expect(repository.findAll().map((item) => item.id)).toEqual(['two']);
  });

  it('migrates the legacy v1 store and moves it to the stable storage key', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      'profiles.v1',
      JSON.stringify({
        version: 1,
        profiles: [
          {
            schemaVersion: 1,
            id: 'legacy',
            metadata: {
              alias: 'Legacy',
              sex: 'female',
              orientation: 'bisexual',
              filterByProfileMetadata: false,
            },
            answers: {},
            createdAt: '2026-08-17T12:00:00.000Z',
            updatedAt: '2026-08-17T12:00:00.000Z',
          },
        ],
      }),
    );

    const repository = new LocalStorageProfileRepository(storage);
    const migrated = repository.findById('legacy');

    expect(migrated?.schemaVersion).toBe(2);
    expect(migrated?.metadata.alias).toBe('Legacy');
    expect(migrated?.settings.filterQuestionnaireByMetadata).toBe(false);
    expect(storage.getItem('profiles.v1')).toBeNull();
    expect(storage.getItem(DEFAULT_PROFILE_STORAGE_KEY)).not.toBeNull();
  });

  it('rejects malformed stored JSON and unsupported future store versions', () => {
    const malformed = new MemoryStorage();
    malformed.setItem(DEFAULT_PROFILE_STORAGE_KEY, '{broken');
    expect(() => new LocalStorageProfileRepository(malformed).findAll()).toThrow(ProfileStorageError);

    const future = new MemoryStorage();
    future.setItem(DEFAULT_PROFILE_STORAGE_KEY, JSON.stringify({ version: 99, profiles: [] }));
    expect(() => new LocalStorageProfileRepository(future).findAll()).toThrow(ProfileStorageError);
  });

  it('runs full domain validation before accepting locally stored profiles', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_PROFILE_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        profiles: [{ ...profile('one', 'Valid'), settings: { filterQuestionnaireByMetadata: 'yes' } }],
      }),
    );

    expect(() => new LocalStorageProfileRepository(storage).findAll()).toThrow(ProfileStorageError);
  });
});
