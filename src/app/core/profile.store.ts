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
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private initialization?: Promise<void>;

  readonly profiles = this.profilesState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly saving = this.savingState.asReadonly();

  initialize(): Promise<void> {
    this.initialization ??= this.reload();
    return this.initialization;
  }

  findById(id: ProfileId): Profile | undefined {
    return this.profilesState().find((profile) => profile.id === id);
  }

  create(
    metadata: ProfileMetadata,
    settings: Partial<ProfileSettings> = DEFAULT_PROFILE_SETTINGS,
  ): Promise<Profile | undefined> {
    return this.execute(() => this.service.create(metadata, settings));
  }

  importPortable(portable: PortableProfile): Promise<Profile | undefined> {
    return this.execute(() => this.service.importPortable(portable));
  }

  updateProfile(
    id: ProfileId,
    metadata: ProfileMetadata,
    settings: ProfileSettings,
  ): Promise<Profile | undefined> {
    return this.execute(() => this.service.updateProfile(id, metadata, settings));
  }

  upsertAnswer(id: ProfileId, answer: PracticeAnswer): Promise<Profile | undefined> {
    return this.execute(() => this.service.upsertAnswer(id, answer));
  }

  removeAnswer(id: ProfileId, practiceId: string, roleId: string): Promise<Profile | undefined> {
    return this.execute(() => this.service.removeAnswer(id, practiceId, roleId));
  }

  async delete(id: ProfileId): Promise<boolean> {
    this.savingState.set(true);
    try {
      await this.service.delete(id);
      await this.reload();
      return true;
    } catch (error: unknown) {
      this.captureError(error);
      return false;
    } finally {
      this.savingState.set(false);
    }
  }

  clearError(): void {
    this.errorState.set(null);
  }

  private async execute(operation: () => Promise<Profile | undefined>): Promise<Profile | undefined> {
    this.savingState.set(true);
    try {
      const profile = await operation();
      await this.reload();
      return profile;
    } catch (error: unknown) {
      this.captureError(error);
      return undefined;
    } finally {
      this.savingState.set(false);
    }
  }

  private async reload(): Promise<void> {
    this.loadingState.set(true);
    try {
      this.profilesState.set(await this.service.findAll());
      this.errorState.set(null);
    } catch (error: unknown) {
      this.profilesState.set([]);
      this.captureError(error);
    } finally {
      this.loadingState.set(false);
    }
  }

  private captureError(error: unknown): void {
    this.errorState.set(error instanceof Error ? error.message : 'Unable to access local profile storage.');
  }
}
