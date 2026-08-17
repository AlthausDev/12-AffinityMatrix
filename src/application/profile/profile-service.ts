import { Clock } from '../shared/clock';
import { ProfileRepository } from './profile-repository';
import { ProfileFactory } from './profile-factory';
import { PortableProfile } from './portable-profile';
import { createAnswerKey, PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileMetadata } from '../../domain/profile/profile-metadata';
import { DEFAULT_PROFILE_SETTINGS, ProfileSettings } from '../../domain/profile/profile-settings';

export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly factory: ProfileFactory,
    private readonly clock: Clock,
  ) {}

  findAll(): readonly Profile[] {
    return this.repository.findAll();
  }

  findById(id: ProfileId): Profile | undefined {
    return this.repository.findById(id);
  }

  create(
    metadata: ProfileMetadata,
    settings: Partial<ProfileSettings> = DEFAULT_PROFILE_SETTINGS,
  ): Profile {
    const profile = this.factory.create(metadata, settings, this.clock.now());
    this.repository.save(profile);
    return profile;
  }

  importPortable(portable: PortableProfile): Profile {
    const profile = this.factory.restore(portable, this.clock.now());
    this.repository.save(profile);
    return profile;
  }

  updateProfile(
    id: ProfileId,
    metadata: ProfileMetadata,
    settings: ProfileSettings,
  ): Profile | undefined {
    const current = this.repository.findById(id);
    if (!current) {
      return undefined;
    }

    return this.save({
      ...current,
      metadata: { ...metadata },
      settings: { ...settings },
      updatedAt: this.clock.now(),
    });
  }

  updateMetadata(id: ProfileId, metadata: ProfileMetadata): Profile | undefined {
    const current = this.repository.findById(id);
    return current ? this.updateProfile(id, metadata, current.settings) : undefined;
  }

  updateSettings(id: ProfileId, settings: ProfileSettings): Profile | undefined {
    const current = this.repository.findById(id);
    return current ? this.updateProfile(id, current.metadata, settings) : undefined;
  }

  upsertAnswer(id: ProfileId, answer: PracticeAnswer): Profile | undefined {
    const current = this.repository.findById(id);
    if (!current) {
      return undefined;
    }

    const key = createAnswerKey(answer.practiceId, answer.roleId);
    const safeAnswer: PracticeAnswer = {
      ...answer,
      ...(answer.details ? { details: { ...answer.details } } : {}),
    };

    return this.save({
      ...current,
      answers: {
        ...current.answers,
        [key]: safeAnswer,
      },
      updatedAt: this.clock.now(),
    });
  }

  removeAnswer(id: ProfileId, practiceId: string, roleId: string): Profile | undefined {
    const current = this.repository.findById(id);
    if (!current) {
      return undefined;
    }

    const key = createAnswerKey(practiceId, roleId);
    if (!(key in current.answers)) {
      return current;
    }

    const answers = { ...current.answers };
    delete answers[key];

    return this.save({
      ...current,
      answers,
      updatedAt: this.clock.now(),
    });
  }

  delete(id: ProfileId): void {
    this.repository.delete(id);
  }

  private save(profile: Profile): Profile {
    this.repository.save(profile);
    return profile;
  }
}
