import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { findRouteParam } from '../../shared/route-param';

@Component({
  selector: 'app-questionnaire-categories-page',
  imports: [RouterLink, CompletionProgressComponent],
  template: `
    <main class="questionnaire-modal-page">
      @if (profile()) {
        @if (snapshot(); as currentSnapshot) {
          <header class="page-header categories-header">
            <div>
              <p class="eyebrow">{{ i18n.t('questionnaire.eyebrow', { version: currentSnapshot.version }) }}</p>
              <h1>{{ i18n.t('questionnaire.categories.title') }}</h1>
              <p class="muted lead">{{ i18n.t('questionnaire.categories.description') }}</p>
            </div>
            <div class="overall-progress">
              <strong>{{ totalCompletionPercentage() }}%</strong>
              <span class="muted">{{ i18n.t('questionnaire.progress', { answered: totalAnswered(), total: totalQuestions() }) }}</span>
              <app-completion-progress [value]="totalCompletionPercentage()" />
            </div>
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
              <a
                class="category-card"
                [routerLink]="['/profiles', profileId, 'questionnaire', summary.category.id]"
                [queryParams]="includeFiltered() ? { filtered: '1' } : null"
              >
                <div class="category-card-heading">
                  <div>
                    <p class="eyebrow">{{ i18n.t('questionnaire.categoryProgress', { answered: summary.answered, total: summary.total }) }}</p>
                    <h2>{{ catalogueText.categoryLabel(summary.category) }}</h2>
                  </div>
                  <strong>{{ summary.completionPercentage }}%</strong>
                </div>
                @if (summary.category.description) { <p class="muted">{{ catalogueText.categoryDescription(summary.category) }}</p> }
                <app-completion-progress [value]="summary.completionPercentage" />
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
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1><p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p></section>
      }
    </main>
  `,
  styles: `
    .categories-header { display: grid; grid-template-columns: minmax(0, 1fr) minmax(12rem, 17rem); gap: 2rem; align-items: end; }
    .overall-progress { display: grid; gap: 0.45rem; text-align: right; }
    .overall-progress strong { font-size: 1.65rem; }
    .overall-progress span { font-size: 0.82rem; }
    .questionnaire-filter-toggle { margin-bottom: 1.5rem; }
    .category-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .category-card {
      display: grid;
      gap: 0.9rem;
      padding: 1.35rem;
      border: 1px solid transparent;
      border-radius: 10px;
      background:
        linear-gradient(color-mix(in srgb, var(--surface-panel) 92%, transparent), color-mix(in srgb, var(--surface-panel) 92%, transparent)) padding-box,
        var(--window-border-gradient-soft) border-box;
      text-decoration: none;
      backdrop-filter: blur(10px);
      transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }
    .category-card:hover {
      background: linear-gradient(var(--surface-elevated), var(--surface-elevated)) padding-box, var(--window-border-gradient) border-box;
      box-shadow: 0 0.8rem 2rem rgba(5, 10, 28, 0.2);
      transform: translateY(-1px);
    }
    .category-card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .category-card-heading h2, .category-card p, .category-card small { margin: 0; }
    @media (max-width: 720px) {
      .categories-header { grid-template-columns: 1fr; }
      .overall-progress { text-align: left; }
      .category-list { grid-template-columns: 1fr; }
    }
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
  private readonly router = inject(Router);

  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly snapshot = computed(() => this.catalogueStore.snapshot());
  readonly summaries = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategorySummaries(snapshot, profile, this.includeFiltered()) : [];
  });
  readonly totalAnswered = computed(() => this.summaries().reduce((sum, item) => sum + item.answered, 0));
  readonly totalQuestions = computed(() => this.summaries().reduce((sum, item) => sum + item.total, 0));
  readonly totalCompletionPercentage = computed(() => {
    const total = this.totalQuestions();
    return total === 0 ? 0 : Math.round((this.totalAnswered() / total) * 100);
  });
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

  toggleFiltered(event: Event): void {
    const include = (event.target as HTMLInputElement).checked;
    this.includeFiltered.set(include);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filtered: include ? '1' : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

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
