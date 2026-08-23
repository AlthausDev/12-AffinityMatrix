import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../domain/profile/profile';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { TranslationService } from '../../i18n/translation.service';
import { ProfileDeleteDialogComponent } from '../../profile/profile-delete-dialog.component';
import { APP_VERSION } from '../../shared/app-version';
import { BrandMarkComponent } from '../../shared/brand-mark.component';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';

interface ProfileCardView {
  readonly profile: Profile;
  readonly answerCount: number;
  readonly completionPercentage?: number;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProfileDeleteDialogComponent, BrandMarkComponent, CompletionProgressComponent],
  template: `
    <main class="page profile-hub">
      <div class="ambient-glow ambient-blue" aria-hidden="true"></div>
      <div class="ambient-glow ambient-purple" aria-hidden="true"></div>

      <header class="hub-hero">
        <div class="brand-cluster">
          <app-brand-mark />
          <div class="brand-copy">
            <div class="brand-meta">
              <span class="version-pill">v{{ appVersion }}</span>
            </div>
            <h1>Affinity Matrix</h1>
            <p class="lead">{{ i18n.t('homeHub.tagline') }}</p>
          </div>
        </div>
      </header>

      @if (profileStore.error()) {
        <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
      }

      <section class="entry-actions" [attr.aria-label]="i18n.t('homeHub.actionsLabel')">
        <a class="entry-card entry-card-primary" routerLink="/profiles/new">
          <span class="entry-icon" aria-hidden="true">+</span>
          <span class="entry-content">
            <span class="eyebrow">{{ i18n.t('homeHub.create.eyebrow') }}</span>
            <strong>{{ i18n.t('common.createProfile') }}</strong>
            <span class="entry-description">{{ i18n.t('homeHub.create.description') }}</span>
          </span>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>

        <a class="entry-card" routerLink="/profiles/import">
          <span class="entry-icon import-icon" aria-hidden="true">↓</span>
          <span class="entry-content">
            <span class="eyebrow">{{ i18n.t('homeHub.import.eyebrow') }}</span>
            <strong>{{ i18n.t('common.importProfile') }}</strong>
            <span class="entry-description">{{ i18n.t('homeHub.import.description') }}</span>
          </span>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>
      </section>

      <section class="profiles-section" aria-labelledby="local-profiles-title">
        <div class="profiles-heading">
          <div>
            <p class="eyebrow">{{ i18n.t('homeHub.profiles.eyebrow') }}</p>
            <h2 id="local-profiles-title">{{ i18n.t('homeHub.profiles.title') }}</h2>
          </div>
          <span class="profile-count-pill">{{ profileCards().length }}</span>
        </div>

        @if (profileCards().length === 0) {
          <div class="empty-hub-state">
            <div class="empty-orb" aria-hidden="true">AM</div>
            <div>
              <h3>{{ i18n.t('homeHub.empty.title') }}</h3>
              <p>{{ i18n.t('homeHub.empty.description') }}</p>
            </div>
          </div>
        } @else {
          <div class="profile-card-grid">
            @for (card of profileCards(); track card.profile.id) {
              <article class="profile-card">
                <a class="profile-card-main" [routerLink]="['/profiles', card.profile.id]">
                  <header class="profile-card-header">
                    <div class="profile-title-copy">
                      <h3>{{ card.profile.metadata.alias || i18n.t('common.untitledProfile') }}</h3>
                      <p>{{ metadataLabel(card.profile) }}</p>
                    </div>
                  </header>

                  @if (card.completionPercentage !== undefined) {
                    <div class="profile-progress-block">
                      <div class="profile-progress-copy">
                        <span>{{ i18n.t('homeHub.profile.progress', { percentage: card.completionPercentage }) }}</span>
                        <strong>{{ card.completionPercentage }}%</strong>
                      </div>
                      <app-completion-progress [value]="card.completionPercentage" />
                    </div>
                  }

                  <div class="profile-facts">
                    <span>{{ answersLabel(card.answerCount) }}</span>
                    <span>{{ i18n.t('homeHub.profile.updated', { date: updatedAtLabel(card.profile.updatedAt) }) }}</span>
                  </div>

                  <div class="profile-open">
                    <span>{{ i18n.t('homeHub.profile.open') }}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </a>

                <div class="profile-card-actions">
                  <button
                    class="profile-menu-button"
                    type="button"
                    [attr.aria-label]="i18n.t('homeHub.profile.menu', { alias: card.profile.metadata.alias || i18n.t('common.untitledProfile') })"
                    [attr.aria-expanded]="activeMenuProfileId() === card.profile.id"
                    (click)="toggleProfileMenu(card.profile.id)"
                  >⋯</button>

                  @if (activeMenuProfileId() === card.profile.id) {
                    <div class="profile-menu">
                      <button class="profile-delete-action" type="button" (click)="requestDeletion(card.profile)">
                        {{ i18n.t('profileDeletion.homeAction') }}
                      </button>
                    </div>
                  }
                </div>
              </article>
            }
          </div>
        }
      </section>

      <footer class="privacy-capsule">
        <span class="privacy-lock" aria-hidden="true">◇</span>
        <span>
          <strong>{{ i18n.t('homeHub.privacy.title') }}</strong>
          <small>{{ i18n.t('homeHub.privacy.description') }}</small>
        </span>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);

  readonly appVersion = APP_VERSION;
  readonly pendingDeletion = signal<Profile | null>(null);
  readonly activeMenuProfileId = signal<string | null>(null);
  readonly profileCards = computed<readonly ProfileCardView[]>(() => {
    const snapshot = this.catalogueStore.snapshot();

    return [...this.profileStore.profiles()]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .map((profile) => {
        const answerCount = Object.keys(profile.answers).length;
        if (!snapshot) return { profile, answerCount };

        const summaries = this.questionnaireService.getCategorySummaries(
          snapshot,
          profile,
          false,
          this.preferences.hiddenCategoryIds(profile.id),
        );
        const answered = summaries.reduce((total, item) => total + item.answered, 0);
        const questions = summaries.reduce((total, item) => total + item.total, 0);
        const completionPercentage = questions === 0 ? 0 : Math.round((answered / questions) * 100);
        return { profile, answerCount, completionPercentage };
      });
  });

  constructor() {
    void this.catalogueStore.initialize();
  }

  answersLabel(count: number): string {
    return this.i18n.plural(count, 'homeHub.profile.answers.one', 'homeHub.profile.answers.other');
  }

  metadataLabel(profile: Profile): string {
    const labels = [
      this.sexLabel(profile.metadata.sex),
      this.orientationLabel(profile.metadata.orientation),
    ].filter((label): label is string => Boolean(label));
    return labels.length > 0 ? labels.join(' · ') : this.i18n.t('common.notSpecified');
  }

  updatedAtLabel(value: string): string {
    return new Intl.DateTimeFormat(this.i18n.locale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  toggleProfileMenu(profileId: string): void {
    this.activeMenuProfileId.update((current) => current === profileId ? null : profileId);
  }

  requestDeletion(profile: Profile): void {
    this.activeMenuProfileId.set(null);
    this.pendingDeletion.set(profile);
  }

  private sexLabel(sex: Sex | undefined): string | undefined {
    if (!sex) return undefined;
    return this.i18n.t(sex === 'male' ? 'profileEditor.sex.male' : 'profileEditor.sex.female');
  }

  private orientationLabel(orientation: SexualOrientation | undefined): string | undefined {
    if (!orientation) return undefined;
    if (orientation === 'heterosexual') return this.i18n.t('profileEditor.orientation.heterosexual');
    if (orientation === 'homosexual') return this.i18n.t('profileEditor.orientation.homosexual');
    return this.i18n.t('profileEditor.orientation.bisexual');
  }
}
