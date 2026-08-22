import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../domain/profile/profile';
import { ProfileStore } from '../../core/profile.store';
import { TranslationService } from '../../i18n/translation.service';
import { ProfileDeleteDialogComponent } from '../../profile/profile-delete-dialog.component';
import { APP_VERSION } from '../../shared/app-version';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProfileDeleteDialogComponent],
  template: `
    <main class="page">
      <header class="page-header home-header">
        <div>
          <p class="eyebrow">MVP · {{ appVersion }}</p>
          <h1>Affinity Matrix</h1>
          <p class="muted lead">{{ i18n.t('home.lead') }}</p>
        </div>
        <div class="header-actions">
          <a class="button" routerLink="/profiles/new">{{ i18n.t('common.createProfile') }}</a>
          <a class="button secondary" routerLink="/profiles/import">{{ i18n.t('common.importProfile') }}</a>
        </div>
      </header>

      @if (profileStore.error()) {
        <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
      }

      <section aria-labelledby="local-profiles-title">
        <div class="section-heading">
          <div><p class="eyebrow">{{ i18n.t('home.thisBrowser') }}</p><h2 id="local-profiles-title">{{ i18n.t('home.localProfiles') }}</h2></div>
          <span class="count-badge">{{ profileStore.profiles().length }}</span>
        </div>

        @if (profileStore.profiles().length === 0) {
          <div class="panel empty-state">
            <h3>{{ i18n.t('home.empty.title') }}</h3>
            <p class="muted">{{ i18n.t('home.empty.description') }}</p>
            <a class="button" routerLink="/profiles/new">{{ i18n.t('common.createProfile') }}</a>
          </div>
        } @else {
          <div class="profile-list">
            @for (profile of profileStore.profiles(); track profile.id) {
              <div class="profile-row">
                <a class="profile-row-main" [routerLink]="['/profiles', profile.id]">
                  <div>
                    <strong>{{ profile.metadata.alias || i18n.t('common.untitledProfile') }}</strong>
                    <span class="muted">{{ profileSummary(answerCount(profile.answers), profile.settings.filterQuestionnaireByMetadata) }}</span>
                  </div>
                  <span class="profile-arrow" aria-hidden="true">→</span>
                </a>
                <button
                  class="profile-delete-button"
                  type="button"
                  [attr.aria-label]="i18n.t('profileDeletion.homeAria', { alias: profile.metadata.alias || i18n.t('common.untitledProfile') })"
                  (click)="requestDeletion(profile)"
                >
                  ×
                </button>
              </div>
            }
          </div>
        }
      </section>

      <footer class="privacy-note">
        <strong>{{ i18n.t('home.privacy.title') }}</strong>
        <span class="muted">{{ i18n.t('home.privacy.description') }}</span>
      </footer>
    </main>

    @if (pendingDeletion(); as profile) {
      <app-profile-delete-dialog
        [profileId]="profile.id"
        [alias]="profile.metadata.alias ?? ''"
        (cancelled)="pendingDeletion.set(null)"
        (deleted)="pendingDeletion.set(null)"
      />
    }
  `,
  styles: `
    .profile-row { padding: 0; gap: 0; overflow: hidden; }
    .profile-row-main {
      display: flex;
      min-width: 0;
      flex: 1 1 auto;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      text-decoration: none;
    }
    .profile-arrow { flex: 0 0 auto; }
    .profile-delete-button {
      align-self: stretch;
      width: 3.35rem;
      flex: 0 0 3.35rem;
      border: 0;
      border-left: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      font-size: 1.45rem;
      cursor: pointer;
      transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease;
    }
    .profile-delete-button:hover {
      background: color-mix(in srgb, var(--preference-boundary) 16%, transparent);
      color: #ffe5e8;
      box-shadow: inset 0 0 1rem color-mix(in srgb, var(--preference-boundary) 12%, transparent);
    }
    @media (max-width: 520px) {
      .profile-row-main { padding-inline: 1rem; }
      .profile-delete-button { width: 3rem; flex-basis: 3rem; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);
  readonly appVersion = APP_VERSION;
  readonly pendingDeletion = signal<Profile | null>(null);

  answerCount(answers: object): number {
    return Object.keys(answers).length;
  }

  profileSummary(count: number, filtered: boolean): string {
    return this.i18n.t(filtered ? 'home.profileSummary.filtered' : 'home.profileSummary.full', { count });
  }

  requestDeletion(profile: Profile): void {
    this.pendingDeletion.set(profile);
  }
}
