import { Profile, ProfileId } from '../../domain/profile/profile';
import { createAnswerKey } from '../../domain/profile/profile-answer';
import { Clock } from '../shared/clock';
import { IdGenerator } from '../shared/id-generator';
import { ProfileFactory } from './profile-factory';
import { ProfileConcurrencyError, ProfileRepository } from './profile-repository';
import { ProfileService } from './profile-service';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();
  async findAll(): Promise<readonly Profile[]> { return [...this.values.values()]; }
  async findById(id: ProfileId): Promise<Profile | undefined> { return this.values.get(id); }
  async save(profile: Profile, expectedRevision?: number): Promise<void> {
    const current = this.values.get(profile.id);
    if (current) {
      if (expectedRevision === undefined || current.revision !== expectedRevision) throw new ProfileConcurrencyError();
    } else if (expectedRevision !== undefined) {
      throw new ProfileConcurrencyError();
    }
    this.values.set(profile.id, profile);
  }
  async delete(id: ProfileId, expectedRevision?: number): Promise<void> {
    const current = this.values.get(id);
    if (current && (expectedRevision === undefined || current.revision !== expectedRevision)) {
      throw new ProfileConcurrencyError();
    }
    this.values.delete(id);
  }
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

  it('coordinates asynchronous profile creation without depending on browser APIs', async () => {
    const profile = await service.create(
      { alias: 'Example', sex: 'male', orientation: 'heterosexual' },
      { filterQuestionnaireByMetadata: true },
    );
    expect(profile.id).toBe('profile-1');
    expect(profile.catalogueVersion).toBe(3);
    expect(await repository.findAll()).toHaveLength(1);
  });

  it('updates metadata and settings atomically while incrementing the revision', async () => {
    const profile = await service.create({ alias: 'Original' });
    clock.set('2026-08-17T13:00:00.000Z');
    const updated = await service.updateProfile(
      profile.id,
      { alias: 'Updated', orientation: 'bisexual' },
      { filterQuestionnaireByMetadata: false },
    );
    expect(updated?.id).toBe(profile.id);
    expect(updated?.revision).toBe(profile.revision + 1);
    expect(updated?.metadata.alias).toBe('Updated');
    expect(updated?.settings.filterQuestionnaireByMetadata).toBe(false);
    expect(updated?.updatedAt).toBe('2026-08-17T13:00:00.000Z');
  });

  it('stores the same semantic role independently for different counterpart sexes', async () => {
    const profile = await service.create({ alias: 'Example' });
    await service.upsertAnswer(profile.id, {
      practiceId: 'bondage', roleId: 'receive', scope: { counterpartSex: 'female' }, preference: 'favorite',
    }, 3);
    const updated = await service.upsertAnswer(profile.id, {
      practiceId: 'bondage', roleId: 'receive', scope: { counterpartSex: 'male' }, preference: 'curious',
    }, 3);

    expect(updated?.answers[createAnswerKey('bondage', 'receive', { counterpartSex: 'female' })]?.preference).toBe('favorite');
    expect(updated?.answers[createAnswerKey('bondage', 'receive', { counterpartSex: 'male' })]?.preference).toBe('curious');
    expect(updated?.revision).toBe(3);
  });

  it('stores target-site variants independently for the same toy role', async () => {
    const profile = await service.create({ alias: 'Example' });
    await service.upsertAnswer(profile.id, {
      practiceId: 'dildo', roleId: 'use-on-self', scope: { targetSite: 'vaginal' }, preference: 'favorite',
    }, 3);
    const updated = await service.upsertAnswer(profile.id, {
      practiceId: 'dildo', roleId: 'use-on-self', scope: { targetSite: 'anal' }, preference: 'curious',
    }, 3);

    expect(updated?.answers[createAnswerKey('dildo', 'use-on-self', { targetSite: 'vaginal' })]?.preference).toBe('favorite');
    expect(updated?.answers[createAnswerKey('dildo', 'use-on-self', { targetSite: 'anal' })]?.preference).toBe('curious');
  });

  it('removes only the selected scoped answer', async () => {
    const profile = await service.create({ alias: 'Example' });
    await service.upsertAnswer(profile.id, {
      practiceId: 'bondage', roleId: 'receive', scope: { counterpartSex: 'female' }, preference: 'like',
    }, 3);
    await service.upsertAnswer(profile.id, {
      practiceId: 'bondage', roleId: 'receive', scope: { counterpartSex: 'male' }, preference: 'like',
    }, 3);

    const updated = await service.removeAnswer(profile.id, 'bondage', 'receive', { counterpartSex: 'female' });
    expect(updated?.answers[createAnswerKey('bondage', 'receive', { counterpartSex: 'female' })]).toBeUndefined();
    expect(updated?.answers[createAnswerKey('bondage', 'receive', { counterpartSex: 'male' })]).toBeDefined();
  });

  it('upserts optional answer details and records the catalogue version used for the answer', async () => {
    const profile = await service.create({ alias: 'Example' });
    const updated = await service.upsertAnswer(profile.id, {
      practiceId: 'bondage', roleId: 'receive', preference: 'like',
      details: { desiredFrequency: 'regularly', initiative: 'prefer-partner' },
    }, 3);
    expect(updated?.answers['bondage::receive']?.details?.desiredFrequency).toBe('regularly');
    expect(updated?.revision).toBe(2);
    expect(updated?.catalogueVersion).toBe(3);
  });

  it('never downgrades a profile catalogue version when editing through an older catalogue', async () => {
    const profile = await service.create({ alias: 'Example' });
    const future = { ...profile, catalogueVersion: 4 };
    await repository.save(future, profile.revision);
    const updated = await service.upsertAnswer(
      profile.id,
      { practiceId: 'bondage', roleId: 'receive', preference: 'like' },
      1,
    );
    expect(updated?.catalogueVersion).toBe(4);
  });
});
