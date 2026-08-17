import { Clock } from '../shared/clock';
import { IdGenerator } from '../shared/id-generator';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileRepository } from './profile-repository';
import { ProfileFactory } from './profile-factory';
import { ProfileService } from './profile-service';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();
  findAll(): readonly Profile[] { return [...this.values.values()]; }
  findById(id: ProfileId): Profile | undefined { return this.values.get(id); }
  save(profile: Profile): void { this.values.set(profile.id, profile); }
  delete(id: ProfileId): void { this.values.delete(id); }
}

class FixedClock implements Clock {
  constructor(private value = '2026-08-17T12:00:00.000Z') {}
  now(): string { return this.value; }
  set(value: string): void { this.value = value; }
}

class SequentialIds implements IdGenerator {
  private index = 0;
  generate(): string { this.index += 1; return `profile-${this.index}`; }
}

describe('ProfileService', () => {
  let repository: MemoryProfileRepository;
  let clock: FixedClock;
  let service: ProfileService;

  beforeEach(() => {
    repository = new MemoryProfileRepository();
    clock = new FixedClock();
    service = new ProfileService(repository, new ProfileFactory(new SequentialIds()), clock);
  });

  it('coordinates profile creation without depending on browser APIs', () => {
    const profile = service.create(
      { alias: 'Example', sex: 'male', orientation: 'heterosexual' },
      { filterQuestionnaireByMetadata: true },
    );

    expect(profile.id).toBe('profile-1');
    expect(repository.findAll()).toHaveLength(1);
  });

  it('updates metadata and settings atomically while preserving identity', () => {
    const profile = service.create({ alias: 'Original' });
    clock.set('2026-08-17T13:00:00.000Z');

    const updated = service.updateProfile(
      profile.id,
      { alias: 'Updated', orientation: 'bisexual' },
      { filterQuestionnaireByMetadata: false },
    );

    expect(updated?.id).toBe(profile.id);
    expect(updated?.metadata.alias).toBe('Updated');
    expect(updated?.settings.filterQuestionnaireByMetadata).toBe(false);
    expect(updated?.updatedAt).toBe('2026-08-17T13:00:00.000Z');
  });

  it('upserts optional answer detail dimensions behind the application service', () => {
    const profile = service.create({ alias: 'Example' });
    const updated = service.upsertAnswer(profile.id, {
      practiceId: 'bondage',
      roleId: 'receive',
      preference: 'like',
      details: { desiredFrequency: 'regularly', initiative: 'prefer-partner' },
    });

    expect(updated?.answers['bondage::receive']?.details?.desiredFrequency).toBe('regularly');
  });
});
