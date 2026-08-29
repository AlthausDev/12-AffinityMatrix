import { DEFAULT_PROFILE_STORAGE_KEY } from '../../infrastructure/persistence/local-storage-profile.repository';
import { resolveProfileStorage } from './profile-repository.token';

class TestStorage implements Storage {
  protected readonly values: Map<string, string>;

  constructor(entries: readonly (readonly [string, string])[] = []) {
    this.values = new Map(entries);
  }

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

class WriteBlockedStorage extends TestStorage {
  override setItem(): void {
    throw new DOMException('Storage is blocked.', 'SecurityError');
  }
}

describe('resolveProfileStorage', () => {
  it('prefers persistent browser storage when it is usable', () => {
    const persistent = new TestStorage();
    const session = new TestStorage();

    const resolved = resolveProfileStorage(() => persistent, () => session);

    expect(resolved.mode).toBe('persistent');
    expect(resolved.storage).toBe(persistent);
  });

  it('falls back to session storage when persistent storage is inaccessible', () => {
    const session = new TestStorage();

    const resolved = resolveProfileStorage(
      () => { throw new DOMException('Blocked.', 'SecurityError'); },
      () => session,
    );

    expect(resolved.mode).toBe('session');
    expect(resolved.storage).toBe(session);
  });

  it('falls back to session storage when an empty persistent store cannot be written', () => {
    const session = new TestStorage();

    const resolved = resolveProfileStorage(() => new WriteBlockedStorage(), () => session);

    expect(resolved.mode).toBe('session');
    expect(resolved.storage).toBe(session);
  });

  it('keeps readable persistent storage when profile data already exists', () => {
    const persistent = new WriteBlockedStorage([
      [DEFAULT_PROFILE_STORAGE_KEY, JSON.stringify({ version: 6, profiles: [] })],
    ]);

    const resolved = resolveProfileStorage(() => persistent, () => new TestStorage());

    expect(resolved.mode).toBe('persistent');
    expect(resolved.storage).toBe(persistent);
  });

  it('uses an in-memory store when both browser stores are unavailable', () => {
    const resolved = resolveProfileStorage(
      () => { throw new DOMException('Blocked.', 'SecurityError'); },
      () => { throw new DOMException('Blocked.', 'SecurityError'); },
    );

    expect(resolved.mode).toBe('memory');
    resolved.storage.setItem('profile', 'value');
    expect(resolved.storage.getItem('profile')).toBe('value');
  });
});
