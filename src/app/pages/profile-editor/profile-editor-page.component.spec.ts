import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfileFactory } from '../../../application/profile/profile-factory';
import { ProfileService } from '../../../application/profile/profile-service';
import { Profile, ProfileId } from '../../../domain/profile/profile';
import { ProfileRepository } from '../../../application/profile/profile-repository';
import { PROFILE_SERVICE } from '../../core/profile-service.token';
import { ProfileStore } from '../../core/profile.store';
import { ProfileEditorPageComponent } from './profile-editor-page.component';

class MemoryProfileRepository implements ProfileRepository {
  private readonly values = new Map<ProfileId, Profile>();
  findAll(): readonly Profile[] { return [...this.values.values()]; }
  findById(id: ProfileId): Profile | undefined { return this.values.get(id); }
  save(profile: Profile): void { this.values.set(profile.id, profile); }
  delete(id: ProfileId): void { this.values.delete(id); }
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

    const fixture = TestBed.createComponent(ProfileEditorPageComponent);
    fixture.detectChanges();

    const aliasInput = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(aliasInput.maxLength).toBe(80);

    fixture.componentInstance.model.update((value) => ({ ...value, alias: 'x'.repeat(81) }));
    fixture.detectChanges();
    expect(fixture.componentInstance.profileForm.alias().invalid()).toBe(true);
  });
});
