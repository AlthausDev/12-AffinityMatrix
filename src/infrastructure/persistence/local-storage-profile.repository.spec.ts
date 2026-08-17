import { createProfile } from '../../domain/profile/profile';
import {
  LocalStorageProfileRepository,
  ProfileStorageError,
} from './local-storage-profile.repository';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function profile(id: string, alias: string) {
  return createProfile({
    id,
    now: '2026-08-17T12:00:00.000Z',
    metadata: { alias },
  });
}

describe('LocalStorageProfileRepository', () => {
  it('returns an empty collection when no store exists', () => {
    const repository = new LocalStorageProfileRepository(new MemoryStorage());

    expect(repository.findAll()).toEqual([]);
  });

  it('persists and retrieves multiple profiles', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProfileRepository(storage);

    repository.save(profile('one', 'One'));
    repository.save(profile('two', 'Two'));

    expect(repository.findAll().map((item) => item.id)).toEqual(['one', 'two']);
    expect(repository.findById('two')?.metadata.alias).toBe('Two');
  });

  it('updates an existing profile instead of duplicating it', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProfileRepository(storage);

    repository.save(profile('one', 'Original'));
    repository.save(profile('one', 'Updated'));

    expect(repository.findAll()).toHaveLength(1);
    expect(repository.findById('one')?.metadata.alias).toBe('Updated');
  });

  it('deletes profiles by id', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProfileRepository(storage);

    repository.save(profile('one', 'One'));
    repository.save(profile('two', 'Two'));
    repository.delete('one');

    expect(repository.findAll().map((item) => item.id)).toEqual(['two']);
  });

  it('rejects malformed stored data instead of silently discarding it', () => {
    const storage = new MemoryStorage();
    storage.setItem('profiles.v1', '{broken');
    const repository = new LocalStorageProfileRepository(storage);

    expect(() => repository.findAll()).toThrow(ProfileStorageError);
  });

  it('rejects unknown store versions', () => {
    const storage = new MemoryStorage();
    storage.setItem('profiles.v1', JSON.stringify({ version: 2, profiles: [] }));
    const repository = new LocalStorageProfileRepository(storage);

    expect(() => repository.findAll()).toThrow(ProfileStorageError);
  });
});
