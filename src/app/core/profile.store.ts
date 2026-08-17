import { Injectable, inject, signal } from '@angular/core';
import { PortableProfile } from '../../application/profile/portable-profile';
import { PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from '../../domain/profile/profile-settings';
import { PROFILE_SERVICE } from './profile-service.token';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private readonly service = inject(PROFILE_SERVICE);
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

  create(
    metadata: ProfileMetadata,
    settings: Partial<ProfileSettings> = DEFAULT_PROFILE_SETTINGS,
  ): Profile | undefined {
    return this.execute(() => this.service.create(metadata, settings));
  }

  importPortable(portable: PortableProfile): Profile | undefined {
    return this.execute(() => this.service.importPortable(portable));
  }

  updateProfile(
    id: ProfileId,
    metadata: ProfileMetadata,
    settings: ProfileSettings,
  ): Profile | undefined {
    return this.execute(() => this.service.updateProfile(id, metadata, settings));
  }

  upsertAnswer(id: ProfileId, answer: PracticeAnswer): Profile | undefined {
    return this.execute(() => this.service.upsertAnswer(id, answer));
  }

  removeAnswer(id: ProfileId, practiceId: string, roleId: string): Profile | undefined {
    return this.execute(() => this.service.removeAnswer(id, practiceId, roleId));
  }

  delete(id: ProfileId): boolean {
    try {
      this.service.delete(id);
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

  private execute(operation: () => Profile | undefined): Profile | undefined {
    try {
      const profile = operation();
      this.reload();
      return profile;
    } catch (error: unknown) {
      this.captureError(error);
      return undefined;
    }
  }

  private reload(): void {
    try {
      this.profilesState.set(this.service.findAll());
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
