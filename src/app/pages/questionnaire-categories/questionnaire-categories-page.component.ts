import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-questionnaire-categories-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id]">{{ i18n.t('questionnaire.backProfile') }}</a>

        @if (snapshot(); as currentSnapshot) {
          <header class="page-header dashboard-header">
            <div>
              <p class="eyebrow">{{ i18n.t('questionnaire.eyebrow', { version: currentSnapshot.version }) }}</p>
              <h1>{{ i18n.t('questionnaire.categories.title') }}</h1>
              <p class="muted lead">{{ i18n.t('questionnaire.categories.description') }}</p>
            </div>
            <p class="profile-count">{{ i18n.t('questionnaire.progress', { answered: totalAnswered(), total: totalQuestions() }) }}</p>
          </header>

          @if (profileStore.error()) { <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p> }

          @if (catalogueRelationship() === 'profile-older') {
            <p class="alert">{{ i18n.t('questionnaire.profileOlder') }}</p>
          } @else if (catalogueRelationship() === 'profile-newer') {
            <p class="alert">{{ i18n.t('questionnaire.profileNewer') }}</p>
          }

          @if (unknownAnswerCount() > 0) {
            <p class="muted form-note">{{ unknownAnswersLabel(unknownAnswerCount()) }}</p>
          }

          @if (totalFiltered() > 0) {
            <label class="check-field questionnaire-filter-toggle">
              <input type="checkbox" [checked]="includeFiltered()" (change)="toggleFiltered($event)" />
              <span>
                <strong>{{ i18n.t('questionnaire.showFiltered') }}</strong>
                <small>{{ filteredExplanation(totalFiltered()) }}</small>
              </span>
            </label>
          }

          <section class="category-list" [attr.aria-label]="i18n.t('questionnaire.categoriesAria')">
            @for (summary of summaries(); track summary.category.id) {
              <a class="category-card" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', summary.category.id]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">
                <div class="category-card-heading">
                  <div>
                    <p class="eyebrow">{{ i18n.t('questionnaire.categoryProgress', { answered: summary.answered, total: summary.total }) }}</p>
                    <h2>{{ catalogueText.categoryLabel(summary.category) }}</h2>
                  </div>
                  <strong>{{ summary.completionPercentage }}%</strong>
                </div>
                @if (summary.category.description) { <p class="muted">{{ catalogueText.categoryDescription(summary.category) }}</p> }
                <div class="progress-track" aria-hidden="true"><span [style.width.%]="summary.completionPercentage"></span></div>
                @if (summary.filtered > 0 && !includeFiltered()) { <small class="muted">{{ filteredCountLabel(summary.filtered) }}</small> }
              </a>
            }
          </section>
        } @else if (catalogueStore.loading()) {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.loading.title') }}</h1><p class="muted">{{ i18n.t('common.questionnaire.loading.description') }}</p></section>
        } @else {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.unavailable.title') }}</h1><p class="muted">{{ i18n.t('common.questionnaire.unavailable.description') }}</p></section>
        }
      } @else {
        <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1><p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p></section>
      }
    </main>
  `,
  styles: `
    .questionnaire-filter-toggle { margin-bottom: 1.5rem; }
    .category-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .category-card { display: grid; gap: 0.9rem; padding: 1.35rem; border: 1px solid var(--border-subtle); border-radius: 0.75rem; background: var(--surface-panel); text-decoration: none; }
    .category-card:hover { border-color: var(--border-strong); }
    .category-card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .category-card-heading h2, .category-card p, .category-card small { margin: 0; }
    .progress-track { height: 0.35rem; overflow: hidden; border-radius: 999px; background: var(--surface-elevated); }
    .progress-track span { display: block; height: 100%; background: var(--text-primary); }
    @media (max-width: 720px) { .category-list { grid-template-columns: 1fr; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireCategoriesPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  readonly catalogueText = inject(CatalogueTextService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly profileId = computed(() => this.params().get('id') ?? '');
  readonly profile = computed(() => this.profileStore.findById(this.profileId()));
  readonly snapshot = computed(() => this.catalogueStore.snapshot());
  readonly summaries = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategorySummaries(snapshot, profile, this.includeFiltered()) : [];
  });
  readonly totalAnswered = computed(() => this.summaries().reduce((sum, item) => sum + item.answered, 0));
  readonly totalQuestions = computed(() => this.summaries().reduce((sum, item) => sum + item.total, 0));
  readonly totalFiltered = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategorySummaries(snapshot, profile, false).reduce((sum, item) => sum + item.filtered, 0) : 0;
  });
  readonly catalogueRelationship = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCatalogueRelationship(snapshot, profile) : 'current';
  });
  readonly unknownAnswerCount = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.countUnknownAnswers(snapshot, profile) : 0;
  });

  constructor() { void this.catalogueStore.initialize(); }

  toggleFiltered(event: Event): void { this.includeFiltered.set((event.target as HTMLInputElement).checked); }

  unknownAnswersLabel(count: number): string {
    return this.i18n.plural(count, 'questionnaire.unknownAnswers.one', 'questionnaire.unknownAnswers.other');
  }

  filteredExplanation(count: number): string {
    return this.i18n.plural(count, 'questionnaire.filteredExplanation.one', 'questionnaire.filteredExplanation.other');
  }

  filteredCountLabel(count: number): string {
    return this.i18n.plural(count, 'questionnaire.filteredCount.one', 'questionnaire.filteredCount.other');
  }
}
