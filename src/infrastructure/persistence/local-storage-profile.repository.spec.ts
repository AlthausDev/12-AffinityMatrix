import { ProfileConcurrencyError } from '../../application/profile/profile-repository';
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
  it('returns an empty collection when no store exists', async () => {
    await expect(new LocalStorageProfileRepository(new MemoryStorage()).findAll()).resolves.toEqual([]);
  });

  it('persists, updates, and deletes profiles by stable local id and expected revision', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProfileRepository(storage);
    await repository.save(profile('one', 'Original'));
    await repository.save(profile('two', 'Two'));

    const original = await repository.findById('one');
    const updated = { ...original!, revision: 2, metadata: { alias: 'Updated' } };
    await repository.save(updated, 1);

    expect(await repository.findAll()).toHaveLength(2);
    expect((await repository.findById('one'))?.metadata.alias).toBe('Updated');

    await repository.delete('one', 2);
    expect((await repository.findAll()).map((item) => item.id)).toEqual(['two']);
  });

  it('rejects stale writes instead of silently overwriting newer profile state', async () => {
    const repository = new LocalStorageProfileRepository(new MemoryStorage());
    await repository.save(profile('one', 'Original'));
    await repository.save({ ...profile('one', 'First update'), revision: 2 }, 1);

    await expect(
      repository.save({ ...profile('one', 'Stale update'), revision: 2 }, 1),
    ).rejects.toBeInstanceOf(ProfileConcurrencyError);
  });

  it('migrates the legacy v1 store through v2 to v3 and moves it to the stable storage key', async () => {
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
    const migrated = await repository.findById('legacy');

    expect(migrated?.schemaVersion).toBe(3);
    expect(migrated?.revision).toBe(1);
    expect(migrated?.catalogueVersion).toBe(1);
    expect(migrated?.metadata.alias).toBe('Legacy');
    expect(migrated?.settings.filterQuestionnaireByMetadata).toBe(false);
    expect(storage.getItem('profiles.v1')).toBeNull();
    expect(storage.getItem(DEFAULT_PROFILE_STORAGE_KEY)).not.toBeNull();
  });

  it('rejects malformed JSON, future versions, unknown envelope fields, and duplicate ids', async () => {
    const malformed = new MemoryStorage();
    malformed.setItem(DEFAULT_PROFILE_STORAGE_KEY, '{broken');
    await expect(new LocalStorageProfileRepository(malformed).findAll()).rejects.toBeInstanceOf(ProfileStorageError);

    const future = new MemoryStorage();
    future.setItem(DEFAULT_PROFILE_STORAGE_KEY, JSON.stringify({ version: 99, profiles: [] }));
    await expect(new LocalStorageProfileRepository(future).findAll()).rejects.toBeInstanceOf(ProfileStorageError);

    const unknown = new MemoryStorage();
    unknown.setItem(DEFAULT_PROFILE_STORAGE_KEY, JSON.stringify({ version: 3, profiles: [], extra: true }));
    await expect(new LocalStorageProfileRepository(unknown).findAll()).rejects.toBeInstanceOf(ProfileStorageError);

    const duplicate = new MemoryStorage();
    duplicate.setItem(
      DEFAULT_PROFILE_STORAGE_KEY,
      JSON.stringify({ version: 3, profiles: [profile('same', 'One'), profile('same', 'Two')] }),
    );
    await expect(new LocalStorageProfileRepository(duplicate).findAll()).rejects.toBeInstanceOf(ProfileStorageError);
  });

  it('runs full domain validation before accepting locally stored profiles', async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_PROFILE_STORAGE_KEY,
      JSON.stringify({
        version: 3,
        profiles: [{ ...profile('one', 'Valid'), settings: { filterQuestionnaireByMetadata: 'yes' } }],
      }),
    );

    await expect(new LocalStorageProfileRepository(storage).findAll()).rejects.toBeInstanceOf(ProfileStorageError);
  });
});
