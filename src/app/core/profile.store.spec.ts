import { TestBed } from '@angular/core/testing';
import { ProfileRepository } from '../../application/profile/profile-repository';
import { Profile, ProfileId } from '../../domain/profile/profile';
import { PROFILE_REPOSITORY } from './profile-repository.token';
import { ProfileStore } from './profile.store';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();

  findAll(): readonly Profile[] {
    return [...this.values.values()];
  }

  findById(id: ProfileId): Profile | undefined {
    return this.values.get(id);
  }

  save(profile: Profile): void {
    this.values.set(profile.id, profile);
  }

  delete(id: ProfileId): void {
    this.values.delete(id);
  }
}

describe('ProfileStore', () => {
  let store: ProfileStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileStore,
        { provide: PROFILE_REPOSITORY, useValue: new MemoryProfileRepository() },
      ],
    });

    store = TestBed.inject(ProfileStore);
  });

  it('creates a profile and publishes it through the profiles signal', () => {
    const created = store.create({
      alias: 'Example',
      sex: 'male',
      orientation: 'heterosexual',
      filterByProfileMetadata: true,
    });

    expect(created).toBeDefined();
    expect(store.profiles()).toHaveLength(1);
    expect(store.profiles()[0]?.metadata.alias).toBe('Example');
  });

  it('updates profile metadata without replacing the profile identity', () => {
    const created = store.create({ filterByProfileMetadata: true });
    expect(created).toBeDefined();

    const updated = store.updateMetadata(created!.id, {
      alias: 'Updated',
      orientation: 'bisexual',
      filterByProfileMetadata: false,
    });

    expect(updated?.id).toBe(created!.id);
    expect(updated?.metadata.alias).toBe('Updated');
    expect(updated?.metadata.filterByProfileMetadata).toBe(false);
  });
});
