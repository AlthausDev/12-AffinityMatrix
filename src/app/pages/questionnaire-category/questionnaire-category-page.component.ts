import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnswerScope, PracticeAnswer } from '../../../domain/profile/profile-answer';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { QuestionnaireCategoryNavigationComponent } from '../../questionnaire/questionnaire-category-navigation.component';
import { QuestionnaireRoleComponent } from '../../questionnaire/questionnaire-role.component';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { findRouteParam } from '../../shared/route-param';

@Component({
  selector: 'app-questionnaire-category-page',
  imports: [
    RouterLink,
    QuestionnaireCategoryNavigationComponent,
    QuestionnaireRoleComponent,
    CompletionProgressComponent,
  ],
  template: `
    <main class="questionnaire-modal-page questionnaire-page">
      @if (profile()) {
        @if (category(); as currentCategory) {
          <header class="page-header category-header">
            <div>
              <p class="eyebrow">{{ i18n.t('questionnaire.category.eyebrow', { answered: currentCategory.answered, total: currentCategory.total }) }}</p>
              <h1>{{ catalogueText.categoryLabel(currentCategory.category) }}</h1>
              <p class="muted lead">{{ catalogueText.categoryDescription(currentCategory.category) }}</p>
            </div>
            <div class="category-progress-summary">
              <strong>{{ currentCategory.completionPercentage }}%</strong>
              <span class="muted">{{ currentCategory.answered }} / {{ currentCategory.total }}</span>
              <app-completion-progress [value]="currentCategory.completionPercentage" />
            </div>
          </header>

          @if (profileStore.error()) { <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p> }

          <div class="questionnaire-toolbar">
            @if (filteredCount() > 0) {
              <label class="check-field compact-toggle">
                <input type="checkbox" [checked]="includeFiltered()" (change)="toggleFiltered($event)" />
                <span><strong>{{ i18n.t('questionnaire.showFiltered') }}</strong><small>{{ filteredInCategoryLabel(filteredCount()) }}</small></span>
              </label>
            }
            <p class="save-state muted" role="status">{{ i18n.t(profileStore.saving() ? 'questionnaire.category.saving' : 'questionnaire.category.saved') }}</p>
          </div>

          @if (currentCategory.practices.length === 0) {
            <section class="panel"><h2>{{ i18n.t('questionnaire.category.empty.title') }}</h2><p class="muted">{{ i18n.t('questionnaire.category.empty.description') }}</p></section>
          } @else {
            <section class="question-list">
              @for (item of currentCategory.practices; track item.practice.id) {
                <article class="panel question-card">
                  <header class="question-card-header"><h2>{{ catalogueText.practiceLabel(item.practice) }}</h2><p class="muted">{{ catalogueText.practiceDescription(item.practice) }}</p></header>
                  @for (roleView of item.roles; track roleView.answerKey) {
                    <app-questionnaire-role
                      [practiceId]="item.practice.id"
                      [role]="roleView.role"
                      [scope]="roleView.scope"
                      [answer]="roleView.answer"
                      [filtered]="roleView.filtered"
                      (answerChange)="saveAnswer($event)"
                      (answerRemove)="removeAnswer($event)"
                    />
                  }
                </article>
              }
            </section>
          }

          <div class="bottom-navigation">
            <app-questionnaire-category-navigation
              [profileId]="profileId"
              [previousCategoryId]="neighbours().previousCategoryId"
              [nextCategoryId]="neighbours().nextCategoryId"
              [includeFiltered]="includeFiltered()"
            />
          </div>
        } @else if (catalogueStore.loading()) {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.loading.title') }}</h1><p class="muted">{{ i18n.t('common.questionnaire.loading.description') }}</p></section>
        } @else if (!snapshot()) {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.unavailable.title') }}</h1><p class="muted">{{ i18n.t('common.questionnaire.unavailable.description') }}</p></section>
        } @else {
          <section class="panel"><h1>{{ i18n.t('questionnaire.categoryNotFound') }}</h1><a class="button" [routerLink]="['/profiles', profileId, 'questionnaire']">{{ i18n.t('questionnaire.returnCategories') }}</a></section>
        }
      } @else {
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1></section>
      }
    </main>
  `,
  styles: `
    .questionnaire-page { max-width: 72rem; }
    .category-header { display: grid; grid-template-columns: minmax(0, 1fr) minmax(10rem, 14rem); gap: 2rem; align-items: end; }
    .category-progress-summary { display: grid; gap: 0.42rem; text-align: right; }
    .category-progress-summary strong { font-size: 1.55rem; }
    .category-progress-summary span { font-size: 0.8rem; }
    .questionnaire-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
    .compact-toggle { min-width: min(100%, 24rem); padding: 0.75rem; }
    .save-state { margin: 0; font-size: 0.85rem; }
    .question-list { display: grid; gap: 1rem; }
    .question-card-header { margin-bottom: 0.65rem; }
    .question-card-header p { margin-bottom: 0; }
    .bottom-navigation { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); }
    @media (max-width: 720px) {
      .category-header { grid-template-columns: 1fr; align-items: stretch; }
      .category-progress-summary { text-align: left; }
      .questionnaire-toolbar { align-items: stretch; flex-direction: column; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireCategoryPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  readonly catalogueText = inject(CatalogueTextService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly categoryId = computed(() => this.params().get('category') ?? '');
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly snapshot = computed(() => this.catalogueStore.snapshot());
  readonly category = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategory(snapshot, profile, this.categoryId(), this.includeFiltered()) : undefined;
  });
  readonly filteredCount = computed(() => {
    const profile = this.profile(); const snapshot = this.snapshot();
    return profile && snapshot ? this.questionnaireService.getCategory(snapshot, profile, this.categoryId(), false)?.filtered ?? 0 : 0;
  });
  readonly neighbours = computed(() => {
    const snapshot = this.snapshot();
    return snapshot ? this.questionnaireService.getNeighbours(snapshot, this.categoryId()) : {};
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

  filteredInCategoryLabel(count: number): string {
    return this.i18n.plural(count, 'questionnaire.category.filtered.one', 'questionnaire.category.filtered.other');
  }

  saveAnswer(answer: PracticeAnswer): void {
    const snapshot = this.snapshot();
    if (snapshot) void this.profileStore.upsertAnswer(this.profileId, answer, snapshot.version);
  }

  removeAnswer(target: { readonly practiceId: string; readonly roleId: string; readonly scope?: AnswerScope }): void {
    void this.profileStore.removeAnswer(this.profileId, target.practiceId, target.roleId, target.scope);
  }
}
