import { TestBed } from '@angular/core/testing';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { ProfileRepository } from '../../application/profile/profile-repository';
import { ProfileFactory } from '../../application/profile/profile-factory';
import { ProfileService } from '../../application/profile/profile-service';
import { PROFILE_SERVICE } from './profile-service.token';
import { ProfileStore } from './profile.store';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();
  findAll(): readonly Profile[] { return [...this.values.values()]; }
  findById(id: ProfileId): Profile | undefined { return this.values.get(id); }
  save(profile: Profile): void { this.values.set(profile.id, profile); }
  delete(id: ProfileId): void { this.values.delete(id); }
}

const clock = { now: () => '2026-08-17T12:00:00.000Z' };
let nextId = 0;
const ids = { generate: () => `profile-${++nextId}` };

describe('ProfileStore', () => {
  let store: ProfileStore;

  beforeEach(() => {
    nextId = 0;
    const service = new ProfileService(new MemoryProfileRepository(), new ProfileFactory(ids), clock);
    TestBed.configureTestingModule({
      providers: [ProfileStore, { provide: PROFILE_SERVICE, useValue: service }],
    });
    store = TestBed.inject(ProfileStore);
  });

  it('publishes created profiles through a readonly signal', () => {
    const created = store.create(
      { alias: 'Example', sex: 'male', orientation: 'heterosexual' },
      { filterQuestionnaireByMetadata: true },
    );

    expect(created).toBeDefined();
    expect(store.profiles()).toHaveLength(1);
  });

  it('updates profile metadata and local settings together', () => {
    const created = store.create({ alias: 'Original' });
    const updated = store.updateProfile(
      created!.id,
      { alias: 'Updated', orientation: 'bisexual' },
      { filterQuestionnaireByMetadata: false },
    );

    expect(updated?.id).toBe(created!.id);
    expect(updated?.metadata.alias).toBe('Updated');
    expect(updated?.settings.filterQuestionnaireByMetadata).toBe(false);
  });
});
