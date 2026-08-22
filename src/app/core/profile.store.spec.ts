import { TestBed } from '@angular/core/testing';
import { ProfileFactory } from '../../application/profile/profile-factory';
import { ProfileConcurrencyError, ProfileRepository } from '../../application/profile/profile-repository';
import { ProfileService } from '../../application/profile/profile-service';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { PROFILE_SERVICE } from './profile-service.token';
import { ProfileStore } from './profile.store';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();
  async findAll(): Promise<readonly Profile[]> { return [...this.values.values()]; }
  async findById(id: ProfileId): Promise<Profile | undefined> { return this.values.get(id); }
  async save(profile: Profile, expectedRevision?: number): Promise<void> {
    const current = this.values.get(profile.id);
    if (current && (expectedRevision === undefined || current.revision !== expectedRevision)) {
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

const clock = { now: () => '2026-08-17T12:00:00.000Z' };
let nextId = 0;
const ids = { generate: () => `profile-${++nextId}` };

describe('ProfileStore', () => {
  let store: ProfileStore;

  beforeEach(async () => {
    nextId = 0;
    const service = new ProfileService(new MemoryProfileRepository(), new ProfileFactory(ids), clock);
    TestBed.configureTestingModule({
      providers: [ProfileStore, { provide: PROFILE_SERVICE, useValue: service }],
    });
    store = TestBed.inject(ProfileStore);
    await store.initialize();
  });

  it('publishes asynchronously created profiles through a readonly signal', async () => {
    const created = await store.create(
      { alias: 'Example', sex: 'male', orientation: 'heterosexual' },
      { filterQuestionnaireByMetadata: true },
    );

    expect(created).toBeDefined();
    expect(store.profiles()).toHaveLength(1);
    expect(store.saving()).toBe(false);
  });

  it('updates profile metadata and local settings together', async () => {
    const created = await store.create({ alias: 'Original' });
    const updated = await store.updateProfile(
      created!.id,
      { alias: 'Updated', orientation: 'bisexual' },
      { filterQuestionnaireByMetadata: false },
    );

    expect(updated?.id).toBe(created!.id);
    expect(updated?.revision).toBe(2);
    expect(updated?.metadata.alias).toBe('Updated');
    expect(updated?.settings.filterQuestionnaireByMetadata).toBe(false);
  });

  it('removes a deleted profile from the published local state', async () => {
    const first = await store.create({ alias: 'First' });
    const second = await store.create({ alias: 'Second' });

    expect(await store.delete(first!.id)).toBe(true);

    expect(store.findById(first!.id)).toBeUndefined();
    expect(store.findById(second!.id)).toBeDefined();
    expect(store.profiles()).toHaveLength(1);
    expect(store.error()).toBeNull();
    expect(store.saving()).toBe(false);
  });

  it('serializes rapid questionnaire writes so one browser interaction cannot create a stale revision', async () => {
    const created = await store.create({ alias: 'Example' });

    const first = store.upsertAnswer(
      created!.id,
      { practiceId: 'kissing', roleId: 'mutual', preference: 'like' },
      1,
    );
    const second = store.upsertAnswer(
      created!.id,
      { practiceId: 'kissing', roleId: 'mutual', preference: 'favorite' },
      1,
    );

    await Promise.all([first, second]);

    const current = store.findById(created!.id);
    expect(current?.revision).toBe(3);
    expect(current?.answers['kissing::mutual']?.preference).toBe('favorite');
    expect(store.error()).toBeNull();
    expect(store.saving()).toBe(false);
  });
});
