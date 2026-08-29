import { Injectable, inject, signal } from '@angular/core';
import { PortableProfile } from '../../application/profile/portable-profile';
import { AnswerScope, PracticeAnswer } from '../../domain/profile/profile-answer';
import { PhysicalPreferences } from '../../domain/profile/physical-preferences';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from '../../domain/profile/profile-settings';
import { CatalogueVersion } from '../../domain/catalogue/catalogue-version';
import { PROFILE_SERVICE } from './profile-service.token';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private readonly service = inject(PROFILE_SERVICE);
  private readonly profilesState = signal<readonly Profile[]>([]);
  private readonly errorState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private initialization?: Promise<void>;
  private mutationTail: Promise<void> = Promise.resolve();
  private pendingMutations = 0;

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
    physicalPreferences: PhysicalPreferences = {},
  ): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.create(metadata, settings, physicalPreferences));
  }

  duplicate(id: ProfileId, metadata?: ProfileMetadata): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.duplicate(id, metadata));
  }

  importPortable(portable: PortableProfile): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.importPortable(portable));
  }

  updateProfile(
    id: ProfileId,
    metadata: ProfileMetadata,
    settings: ProfileSettings,
    physicalPreferences?: PhysicalPreferences,
  ): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.updateProfile(id, metadata, settings, physicalPreferences));
  }

  upsertAnswer(
    id: ProfileId,
    answer: PracticeAnswer,
    catalogueVersion?: CatalogueVersion,
  ): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.upsertAnswer(id, answer, catalogueVersion));
  }

  removeAnswer(
    id: ProfileId,
    practiceId: string,
    roleId: string,
    scope?: AnswerScope,
  ): Promise<Profile | undefined> {
    return this.enqueueProfileMutation(() => this.service.removeAnswer(id, practiceId, roleId, scope));
  }

  delete(id: ProfileId): Promise<boolean> {
    this.markMutationQueued();
    const task = this.mutationTail.then(async () => {
      try {
        await this.service.delete(id);
        await this.reload();
        return true;
      } catch (error: unknown) {
        this.captureError(error);
        return false;
      } finally {
        this.markMutationFinished();
      }
    });
    this.mutationTail = task.then(() => undefined, () => undefined);
    return task;
  }

  clearError(): void {
    this.errorState.set(null);
  }

  private enqueueProfileMutation(
    operation: () => Promise<Profile | undefined>,
  ): Promise<Profile | undefined> {
    this.markMutationQueued();
    const task = this.mutationTail.then(async () => {
      try {
        const profile = await operation();
        await this.reload();
        return profile;
      } catch (error: unknown) {
        this.captureError(error);
        return undefined;
      } finally {
        this.markMutationFinished();
      }
    });
    this.mutationTail = task.then(() => undefined, () => undefined);
    return task;
  }

  private markMutationQueued(): void {
    this.pendingMutations += 1;
    this.savingState.set(true);
  }

  private markMutationFinished(): void {
    this.pendingMutations = Math.max(0, this.pendingMutations - 1);
    this.savingState.set(this.pendingMutations > 0);
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
