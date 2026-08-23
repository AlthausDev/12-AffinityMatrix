import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';

@Component({
  selector: 'app-profile-dashboard-page',
  imports: [RouterLink, RouterOutlet, CompletionProgressComponent],
  template: `
    <main class="page">
      <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>

      @if (profile(); as currentProfile) {
        <header class="page-header dashboard-header">
          <div>
            <p class="eyebrow">{{ i18n.t('dashboard.localProfile') }}</p>
            <h1>{{ currentProfile.metadata.alias || i18n.t('common.untitledProfile') }}</h1>
            <p class="muted profile-meta">{{ sexLabel(currentProfile.metadata.sex) }} · {{ orientationLabel(currentProfile.metadata.orientation) }}</p>
          </div>
          <div class="dashboard-header-actions">
            <span class="profile-count">{{ answeredLabel(savedAnswerCount()) }}</span>
            <a class="button secondary settings-button" [routerLink]="['/profiles', currentProfile.id, 'settings']">{{ i18n.t('dashboard.settings.action') }}</a>
          </div>
        </header>

        @if (profileStore.error()) { <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p> }

        <section class="action-grid" [attr.aria-label]="i18n.t('dashboard.actionsLabel')">
          <article class="action-card"><div><p class="eyebrow">{{ i18n.t('dashboard.questionnaire.eyebrow') }}</p><h2>{{ i18n.t(savedAnswerCount() > 0 ? 'dashboard.questionnaire.continueTitle' : 'dashboard.questionnaire.startTitle') }}</h2><p class="muted">{{ i18n.t('dashboard.questionnaire.description') }}</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">{{ i18n.t(savedAnswerCount() > 0 ? 'dashboard.questionnaire.continue' : 'dashboard.questionnaire.start') }}</a></article>
          <article class="action-card"><div><p class="eyebrow">{{ i18n.t('dashboard.comparison.eyebrow') }}</p><h2>{{ i18n.t('dashboard.comparison.title') }}</h2><p class="muted">{{ i18n.t('dashboard.comparison.description') }}</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'compare']">{{ i18n.t('dashboard.comparison.action') }}</a></article>
          <article class="action-card"><div><p class="eyebrow">{{ i18n.t('dashboard.profileData.eyebrow') }}</p><h2>{{ i18n.t('dashboard.profileData.title') }}</h2><p class="muted">{{ i18n.t('dashboard.profileData.description') }}</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'edit']">{{ i18n.t('dashboard.profileData.action') }}</a></article>
          <article class="action-card"><div><p class="eyebrow">{{ i18n.t('dashboard.portability.eyebrow') }}</p><h2>{{ i18n.t('dashboard.portability.title') }}</h2><p class="muted">{{ i18n.t('dashboard.portability.description') }}</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'export']">{{ i18n.t('dashboard.portability.action') }}</a></article>
        </section>

        <section class="panel profile-status" aria-labelledby="profile-status-title">
          <header class="status-heading">
            <div><p class="eyebrow">{{ i18n.t('dashboard.status.eyebrow') }}</p><h2 id="profile-status-title">{{ i18n.t('dashboard.status.title') }}</h2></div>
            @if (totalQuestions() > 0) { <div class="overall-percentage"><strong>{{ completionPercentage() }}%</strong><span>{{ i18n.t('dashboard.status.overallProgress') }}</span></div> }
          </header>

          @if (totalQuestions() > 0) {
            <div class="overall-progress-block"><div class="progress-copy"><strong>{{ i18n.t('dashboard.status.overallProgress') }}</strong><span class="muted">{{ i18n.t('dashboard.status.visibleAnswered', { answered: totalAnswered(), total: totalQuestions() }) }}</span></div><app-completion-progress [value]="completionPercentage()" /></div>
          } @else if (catalogueStore.loading()) { <p class="muted status-message">{{ i18n.t('dashboard.status.catalogueLoading') }}</p> }
          @else if (catalogueStore.error()) { <p class="muted status-message">{{ i18n.t('dashboard.status.catalogueUnavailable') }}</p> }

          <dl class="status-list">
            <div><dt>{{ i18n.t('dashboard.status.categoriesComplete') }}</dt><dd>{{ completedCategories() }} / {{ totalCategories() }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.hiddenCategories') }}</dt><dd>{{ hiddenCategoryIds().length }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.savedAnswers') }}</dt><dd>{{ savedAnswerCount() }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.lastUpdated') }}</dt><dd>{{ updatedAtLabel(currentProfile.updatedAt) }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.questionFilter') }}</dt><dd>{{ i18n.t(currentProfile.settings.filterQuestionnaireByMetadata ? 'dashboard.status.enabled' : 'dashboard.status.disabled') }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.catalogue') }}</dt><dd>v{{ currentProfile.catalogueVersion }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.internalVersion') }}</dt><dd>v{{ currentProfile.schemaVersion }}</dd></div>
            <div class="storage-status"><dt>{{ i18n.t('dashboard.status.storage') }}</dt><dd>{{ i18n.t('dashboard.status.localNotEncrypted') }}</dd></div>
          </dl>

          @if (categorySummaries().length > 0) {
            <section class="category-progress-section" [attr.aria-label]="i18n.t('dashboard.status.categoryProgress')">
              <h3>{{ i18n.t('dashboard.status.categoryProgress') }}</h3>
              <div class="category-progress-list">
                @for (summary of categorySummaries(); track summary.category.id) {
                  <div class="category-progress-row"><div class="category-progress-copy"><strong>{{ catalogueText.categoryLabel(summary.category) }}</strong><span class="muted">{{ i18n.t('dashboard.status.categoryValue', { answered: summary.answered, total: summary.total, percentage: summary.completionPercentage }) }}</span></div><app-completion-progress [value]="summary.completionPercentage" /></div>
                }
              </div>
            </section>
          }
        </section>
      } @else {
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1><p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p><a class="button" routerLink="/">{{ i18n.t('common.returnToProfiles') }}</a></section>
      }
    </main>
    <router-outlet />
  `,
  styles: `
    .dashboard-header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.8rem; }
    .settings-button { min-height: 2.35rem; padding: 0.45rem 0.8rem; font-size: 0.82rem; }
    .status-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .status-heading h2 { margin-bottom: 0; }
    .overall-percentage { display: grid; text-align: right; }
    .overall-percentage strong { font-size: 2rem; line-height: 1; }
    .overall-percentage span { margin-top: 0.3rem; color: var(--text-secondary); font-size: 0.75rem; }
    .overall-progress-block { display: grid; gap: 0.7rem; margin-top: 1.35rem; padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 0.7rem; background: color-mix(in srgb, var(--surface-elevated) 58%, transparent); }
    .progress-copy { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
    .progress-copy span { font-size: 0.82rem; text-align: right; }
    .status-message { margin: 1.25rem 0 0; }
    .storage-status { grid-column: span 2; }
    .category-progress-section { margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); }
    .category-progress-section h3 { margin-bottom: 1rem; }
    .category-progress-list { column-count: 2; column-gap: 1rem; }
    .category-progress-row { display: grid; break-inside: avoid; gap: 0.48rem; margin-bottom: 0.8rem; padding: 0.8rem; border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent); border-radius: 0.6rem; background: color-mix(in srgb, var(--surface-elevated) 42%, transparent); }
    .category-progress-copy { display: flex; align-items: baseline; justify-content: space-between; gap: 0.8rem; }
    .category-progress-copy span { font-size: 0.75rem; white-space: nowrap; }
    @media (max-width: 720px) { .dashboard-header-actions, .status-heading, .progress-copy, .category-progress-copy { align-items: flex-start; flex-direction: column; } .dashboard-header-actions { width: 100%; } .settings-button { width: 100%; } .overall-percentage { text-align: left; } .category-progress-list { column-count: 1; } .storage-status { grid-column: auto; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  readonly catalogueText = inject(CatalogueTextService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly savedAnswerCount = computed(() => Object.keys(this.profile()?.answers ?? {}).length);
  readonly hiddenCategoryIds = computed(() => this.preferences.hiddenCategoryIds(this.profileId));
  readonly categorySummaries = computed(() => {
    const profile = this.profile(); const snapshot = this.catalogueStore.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategorySummaries(snapshot, profile, false, this.hiddenCategoryIds()) : [];
  });
  readonly totalAnswered = computed(() => this.categorySummaries().reduce((sum, item) => sum + item.answered, 0));
  readonly totalQuestions = computed(() => this.categorySummaries().reduce((sum, item) => sum + item.total, 0));
  readonly completionPercentage = computed(() => { const total = this.totalQuestions(); return total === 0 ? 0 : Math.round((this.totalAnswered() / total) * 100); });
  readonly totalCategories = computed(() => this.categorySummaries().filter((summary) => summary.total > 0).length);
  readonly completedCategories = computed(() => this.categorySummaries().filter((summary) => summary.total > 0 && summary.answered === summary.total).length);

  constructor() { void this.catalogueStore.initialize(); }

  answeredLabel(count: number): string { return this.i18n.plural(count, 'dashboard.answered.one', 'dashboard.answered.other'); }
  updatedAtLabel(value: string): string { return new Intl.DateTimeFormat(this.i18n.locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
  sexLabel(sex: Sex | undefined): string { if (!sex) return this.i18n.t('dashboard.sexNotSpecified'); return this.i18n.t(sex === 'male' ? 'profileEditor.sex.male' : 'profileEditor.sex.female'); }
  orientationLabel(orientation: SexualOrientation | undefined): string { if (!orientation) return this.i18n.t('dashboard.orientationNotSpecified'); if (orientation === 'heterosexual') return this.i18n.t('profileEditor.orientation.heterosexual'); if (orientation === 'homosexual') return this.i18n.t('profileEditor.orientation.homosexual'); return this.i18n.t('profileEditor.orientation.bisexual'); }
}
