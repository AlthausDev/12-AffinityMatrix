import { Injectable, inject, signal } from '@angular/core';
import {
  PortableProfileV1,
  restorePortableProfile,
} from '../../application/profile/portable-profile';
import { Profile, ProfileId, createProfile } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { PROFILE_REPOSITORY } from './profile-repository.token';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private readonly repository = inject(PROFILE_REPOSITORY);
  private readonly profilesState = signal<readonly Profile[]>([]);
  private readonly errorState = signal<string | null>(null);

  readonly profiles = this.profilesState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor() {
    this.reload();
  }

  findById(id: ProfileId): Profile | undefined {
    return this.profilesState().find((profile) => profile.id === id);
  }

  create(metadata: ProfileMetadata): Profile | undefined {
    const now = new Date().toISOString();
    const profile = createProfile({
      id: crypto.randomUUID(),
      now,
      metadata,
    });

    return this.save(profile);
  }

  importPortable(portable: PortableProfileV1): Profile | undefined {
    const now = new Date().toISOString();
    return this.save(restorePortableProfile(portable, crypto.randomUUID(), now));
  }

  updateMetadata(id: ProfileId, metadata: ProfileMetadata): Profile | undefined {
    const current = this.findById(id);
    if (!current) {
      return undefined;
    }

    return this.save({
      ...current,
      metadata,
      updatedAt: new Date().toISOString(),
    });
  }

  delete(id: ProfileId): boolean {
    try {
      this.repository.delete(id);
      this.reload();
      return true;
    } catch (error: unknown) {
      this.captureError(error);
      return false;
    }
  }

  clearError(): void {
    this.errorState.set(null);
  }

  private save(profile: Profile): Profile | undefined {
    try {
      this.repository.save(profile);
      this.reload();
      return profile;
    } catch (error: unknown) {
      this.captureError(error);
      return undefined;
    }
  }

  private reload(): void {
    try {
      this.profilesState.set(this.repository.findAll());
      this.errorState.set(null);
    } catch (error: unknown) {
      this.profilesState.set([]);
      this.captureError(error);
    }
  }

  private captureError(error: unknown): void {
    this.errorState.set(error instanceof Error ? error.message : 'Unable to access local profile storage.');
  }
}
