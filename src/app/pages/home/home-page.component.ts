import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <header class="page-header home-header">
        <div>
          <p class="eyebrow">MVP · 0.1.0.0</p>
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
              <a class="profile-row" [routerLink]="['/profiles', profile.id]">
                <div>
                  <strong>{{ profile.metadata.alias || i18n.t('common.untitledProfile') }}</strong>
                  <span class="muted">{{ profileSummary(answerCount(profile.answers), profile.settings.filterQuestionnaireByMetadata) }}</span>
                </div>
                <span aria-hidden="true">→</span>
              </a>
            }
          </div>
        }
      </section>

      <footer class="privacy-note">
        <strong>{{ i18n.t('home.privacy.title') }}</strong>
        <span class="muted">{{ i18n.t('home.privacy.description') }}</span>
      </footer>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);

  answerCount(answers: object): number {
    return Object.keys(answers).length;
  }

  profileSummary(count: number, filtered: boolean): string {
    return this.i18n.t(filtered ? 'home.profileSummary.filtered' : 'home.profileSummary.full', { count });
  }
}
