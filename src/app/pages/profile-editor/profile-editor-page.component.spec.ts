import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfileFactory } from '../../../application/profile/profile-factory';
import { ProfileConcurrencyError, ProfileRepository } from '../../../application/profile/profile-repository';
import { ProfileService } from '../../../application/profile/profile-service';
import { Profile, ProfileId } from '../../../domain/profile/profile';
import { PROFILE_SERVICE } from '../../core/profile-service.token';
import { ProfileStore } from '../../core/profile.store';
import { ProfileEditorPageComponent } from './profile-editor-page.component';

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
  async delete(id: ProfileId): Promise<void> { this.values.delete(id); }
}

describe('ProfileEditorPageComponent', () => {
  it('binds the alias maximum length through Signal Forms instead of truncating on save', async () => {
    const repository = new MemoryProfileRepository();
    const service = new ProfileService(
      repository,
      new ProfileFactory({ generate: () => 'profile-1' }),
      { now: () => '2026-08-17T12:00:00.000Z' },
    );

    await TestBed.configureTestingModule({
      imports: [ProfileEditorPageComponent],
      providers: [
        ProfileStore,
        provideRouter([]),
        { provide: PROFILE_SERVICE, useValue: service },
      ],
    }).compileComponents();

    const store = TestBed.inject(ProfileStore);
    await store.initialize();
    const fixture = TestBed.createComponent(ProfileEditorPageComponent);
    fixture.detectChanges();

    const aliasInput = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(aliasInput.maxLength).toBe(80);

    fixture.componentInstance.model.update((value) => ({ ...value, alias: 'x'.repeat(81) }));
    fixture.detectChanges();
    expect(fixture.componentInstance.profileForm.alias().invalid()).toBe(true);
  });
});
