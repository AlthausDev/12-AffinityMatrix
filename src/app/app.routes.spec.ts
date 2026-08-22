import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ProfileFactory } from '../application/profile/profile-factory';
import { ProfileConcurrencyError, ProfileRepository } from '../application/profile/profile-repository';
import { ProfileService } from '../application/profile/profile-service';
import { Profile, ProfileId } from '../domain/profile/profile';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { PROFILE_SERVICE } from './core/profile-service.token';
import { ProfileStore } from './core/profile.store';

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

function createProfileService(): ProfileService {
  return new ProfileService(
    new MemoryProfileRepository(),
    new ProfileFactory({ generate: () => 'profile-route-test' }),
    { now: () => '2026-08-22T12:00:00.000Z' },
  );
}

describe('application routes', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        { provide: PROFILE_SERVICE, useFactory: createProfileService },
      ],
    }).compileComponents();
  });

  it('renders the questionnaire shell for a profile questionnaire route', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    expect(await router.navigateByUrl('/profiles/test-profile/questionnaire')).toBe(true);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-questionnaire-shell')).not.toBeNull();
  });

  it('opens the questionnaire when Continue is clicked from the profile dashboard', async () => {
    const store = TestBed.inject(ProfileStore);
    await store.initialize();
    const profile = await store.create({ alias: 'Route test' });
    expect(profile).toBeDefined();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    expect(await router.navigateByUrl(`/profiles/${profile!.id}`)).toBe(true);
    await fixture.whenStable();
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      `a[href="/profiles/${profile!.id}/questionnaire"]`,
    ) as HTMLAnchorElement | null;
    expect(link).not.toBeNull();

    link!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe(`/profiles/${profile!.id}/questionnaire`);
    expect(fixture.nativeElement.querySelector('app-questionnaire-shell')).not.toBeNull();
  });
});
