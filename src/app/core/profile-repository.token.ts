import { inject, InjectionToken } from '@angular/core';
import { ProfileRepository } from '../../application/profile/profile-repository';
import {
  DEFAULT_PROFILE_STORAGE_KEY,
  LEGACY_PROFILE_STORAGE_KEYS,
  LocalStorageProfileRepository,
} from '../../infrastructure/persistence/local-storage-profile.repository';

export type ProfileStorageMode = 'persistent' | 'session' | 'memory';

export interface ProfileStorageContext {
  readonly storage: Storage;
  readonly mode: ProfileStorageMode;
}

const PROFILE_STORAGE_PROBE_KEY = 'desiresync.profile-storage.probe';
const PROFILE_STORAGE_KEYS = [DEFAULT_PROFILE_STORAGE_KEY, ...LEGACY_PROFILE_STORAGE_KEYS] as const;

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

function resolveUsableStorage(factory: () => Storage): Storage | undefined {
  try {
    const storage = factory();

    // If profile data already exists, keep using that storage even when a write probe
    // would fail (for example because the quota is full). Hiding existing profiles by
    // silently switching stores would be worse than surfacing a later write error.
    if (PROFILE_STORAGE_KEYS.some((key) => storage.getItem(key) !== null)) return storage;

    storage.setItem(PROFILE_STORAGE_PROBE_KEY, '1');
    const writable = storage.getItem(PROFILE_STORAGE_PROBE_KEY) === '1';
    try {
      storage.removeItem(PROFILE_STORAGE_PROBE_KEY);
    } catch {
      // A failed cleanup should not make an otherwise usable storage unavailable.
    }
    return writable ? storage : undefined;
  } catch {
    return undefined;
  }
}

export function resolveProfileStorage(
  persistentFactory: () => Storage = () => window.localStorage,
  sessionFactory: () => Storage = () => window.sessionStorage,
): ProfileStorageContext {
  const persistent = resolveUsableStorage(persistentFactory);
  if (persistent) return { storage: persistent, mode: 'persistent' };

  const session = resolveUsableStorage(sessionFactory);
  if (session) return { storage: session, mode: 'session' };

  return { storage: new MemoryStorage(), mode: 'memory' };
}

export const PROFILE_STORAGE_CONTEXT = new InjectionToken<ProfileStorageContext>('PROFILE_STORAGE_CONTEXT', {
  providedIn: 'root',
  factory: () => resolveProfileStorage(),
});

export const PROFILE_REPOSITORY = new InjectionToken<ProfileRepository>('PROFILE_REPOSITORY', {
  providedIn: 'root',
  factory: () => new LocalStorageProfileRepository(inject(PROFILE_STORAGE_CONTEXT).storage),
});
