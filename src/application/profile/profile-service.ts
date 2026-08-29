import { CatalogueVersion } from '../../domain/catalogue/catalogue-version';
import {
  AnswerScope,
  cloneAnswers,
  clonePracticeAnswer,
  createAnswerKey,
  PracticeAnswer,
} from '../../domain/profile/profile-answer';
import { clonePhysicalPreferences, PhysicalPreferences } from '../../domain/profile/physical-preferences';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from '../../domain/profile/profile-settings';
import { Clock } from '../shared/clock';
import { PortableProfile } from './portable-profile';
import { ProfileFactory } from './profile-factory';
import { ProfileRepository } from './profile-repository';

export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly factory: ProfileFactory,
    private readonly clock: Clock,
  ) {}

  findAll(): Promise<readonly Profile[]> {
    return this.repository.findAll();
  }

  findById(id: ProfileId): Promise<Profile | undefined> {
    return this.repository.findById(id);
  }

  async create(
    metadata: ProfileMetadata,
    settings: Partial<ProfileSettings> = DEFAULT_PROFILE_SETTINGS,
    physicalPreferences: PhysicalPreferences = {},
  ): Promise<Profile> {
    const profile = this.factory.create(metadata, settings, this.clock.now(), physicalPreferences);
    await this.repository.save(profile);
    return profile;
  }

  async duplicate(id: ProfileId, metadata?: ProfileMetadata): Promise<Profile | undefined> {
    const current = await this.repository.findById(id);
    if (!current) return undefined;

    const duplicate = this.factory.create(
      metadata ?? current.metadata,
      current.settings,
      this.clock.now(),
      clonePhysicalPreferences(current.physicalPreferences),
    );
    const restoredCopy: Profile = {
      ...duplicate,
      catalogueVersion: current.catalogueVersion,
      answers: cloneAnswers(current.answers),
    };
    await this.repository.save(restoredCopy);
    return restoredCopy;
  }

  async importPortable(portable: PortableProfile): Promise<Profile> {
    const profile = this.factory.restore(portable, this.clock.now());
    await this.repository.save(profile);
    return profile;
  }

  async updateProfile(
    id: ProfileId,
    metadata: ProfileMetadata,
    settings: ProfileSettings,
    physicalPreferences?: PhysicalPreferences,
  ): Promise<Profile | undefined> {
    const current = await this.repository.findById(id);
    if (!current) return undefined;

    const nextPhysicalPreferences = clonePhysicalPreferences(
      physicalPreferences ?? current.physicalPreferences,
    );
    const { physicalPreferences: _currentPhysicalPreferences, ...profileWithoutPhysicalPreferences } = current;

    return this.saveNextRevision(current, {
      ...profileWithoutPhysicalPreferences,
      metadata: { ...metadata },
      settings: { ...settings },
      ...(Object.keys(nextPhysicalPreferences).length > 0
        ? { physicalPreferences: nextPhysicalPreferences }
        : {}),
      updatedAt: this.clock.now(),
    });
  }

  async upsertAnswer(
    id: ProfileId,
    answer: PracticeAnswer,
    catalogueVersion?: CatalogueVersion,
  ): Promise<Profile | undefined> {
    const current = await this.repository.findById(id);
    if (!current) return undefined;

    const key = createAnswerKey(answer.practiceId, answer.roleId, answer.scope);
    return this.saveNextRevision(current, {
      ...current,
      catalogueVersion: Math.max(current.catalogueVersion, catalogueVersion ?? current.catalogueVersion),
      answers: {
        ...current.answers,
        [key]: clonePracticeAnswer(answer),
      },
      updatedAt: this.clock.now(),
    });
  }

  async removeAnswer(
    id: ProfileId,
    practiceId: string,
    roleId: string,
    scope?: AnswerScope,
  ): Promise<Profile | undefined> {
    const current = await this.repository.findById(id);
    if (!current) return undefined;

    const key = createAnswerKey(practiceId, roleId, scope);
    if (!(key in current.answers)) return current;

    const answers = { ...current.answers };
    delete answers[key];

    return this.saveNextRevision(current, {
      ...current,
      answers,
      updatedAt: this.clock.now(),
    });
  }

  async delete(id: ProfileId): Promise<void> {
    const current = await this.repository.findById(id);
    if (!current) return;
    await this.repository.delete(id, current.revision);
  }

  private async saveNextRevision(current: Profile, candidate: Profile): Promise<Profile> {
    const next: Profile = { ...candidate, revision: current.revision + 1 };
    await this.repository.save(next, current.revision);
    return next;
  }
}
