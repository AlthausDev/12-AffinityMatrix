import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnswerScope, PracticeAnswer } from '../../../domain/profile/profile-answer';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { CatalogueTaxonomyService } from '../../i18n/catalogue-taxonomy.service';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { QuestionnaireRoleComponent } from '../../questionnaire/questionnaire-role.component';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { findRouteParam } from '../../shared/route-param';
import {
  firstPendingSubcategoryId,
  isSubcategoryComplete,
  nextPendingSubcategoryId,
} from './questionnaire-subcategory-flow';

@Component({
  selector: 'app-questionnaire-category-page',
  imports: [RouterLink, QuestionnaireRoleComponent, CompletionProgressComponent],
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
              <span class="category-progress-label">{{ i18n.t('questionnaire.category.progressLabel') }}</span>
              <div class="category-progress-metrics">
                <strong class="category-progress-count">
                  {{ i18n.t('questionnaire.categoryProgress', { answered: currentCategory.answered, total: currentCategory.total }) }}
                </strong>
                <span class="category-progress-percentage">{{ currentCategory.completionPercentage }}%</span>
              </div>
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
          } @else if (sections().length > 0) {
            <section class="subcategory-list" aria-label="Subcategorías">
              @for (section of sections(); track section.id) {
                <details class="subcategory-section" [open]="isSubcategoryOpen(section.id)">
                  <summary class="subcategory-summary" (click)="toggleSubcategory(section.id, $event)">
                    <span class="subcategory-summary-copy">
                      <strong>{{ section.label }}</strong>
                      <small>{{ section.answered }} / {{ section.total }}</small>
                    </span>
                    <span class="subcategory-progress">
                      <strong>{{ section.percentage }}%</strong>
                      <app-completion-progress [value]="section.percentage" />
                    </span>
                  </summary>
                  <div class="subcategory-content">
                    <p class="subcategory-description">{{ section.description }}</p>
                    <div class="question-list">
                      @for (item of section.practices; track item.practice.id) {
                        <article class="panel question-card">
                          <header class="question-card-header">
                            <h2>{{ catalogueText.practiceLabel(item.practice) }}</h2>
                            @if (catalogueText.practiceDescription(item.practice)) {
                              <p class="muted">{{ catalogueText.practiceDescription(item.practice) }}</p>
                            }
                          </header>
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
                    </div>
                  </div>
                </details>
              }
            </section>
          } @else {
            <section class="question-list">
              @for (item of currentCategory.practices; track item.practice.id) {
                <article class="panel question-card">
                  <header class="question-card-header">
                    <h2>{{ catalogueText.practiceLabel(item.practice) }}</h2>
                    @if (catalogueText.practiceDescription(item.practice)) {
                      <p class="muted">{{ catalogueText.practiceDescription(item.practice) }}</p>
                    }
                  </header>
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
    .questionnaire-page { max-width: 66rem; }
    .category-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(15rem, 18rem);
      gap: clamp(1.4rem, 3vw, 2.4rem);
      align-items: center;
    }
    .category-progress-summary {
      display: grid;
      align-self: center;
      gap: 0.48rem;
      padding: 0.72rem 0.82rem 0.68rem;
      border: 1px solid color-mix(in srgb, var(--border-strong) 54%, var(--neon-violet));
      border-radius: 0.76rem;
      background: linear-gradient(145deg, rgba(18, 46, 91, 0.36), rgba(74, 38, 104, 0.32));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.045);
      font-variant-numeric: tabular-nums;
    }
    .category-progress-label {
      color: color-mix(in srgb, var(--text-secondary) 84%, #eef7ff);
      font-size: 0.62rem;
      font-weight: 720;
      letter-spacing: 0.065em;
      line-height: 1.2;
      text-transform: uppercase;
    }
    .category-progress-metrics {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.9rem;
      min-width: 0;
    }
    .category-progress-count {
      min-width: 0;
      color: var(--text-primary);
      font-size: 0.79rem;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.008em;
    }
    .category-progress-percentage {
      flex: 0 0 auto;
      color: color-mix(in srgb, var(--text-primary) 92%, var(--neon-cyan));
      font-size: 1.3rem;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .category-progress-summary app-completion-progress { display: block; margin-top: 0.02rem; }
    .questionnaire-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
    .compact-toggle { min-width: min(100%, 24rem); padding: 0.75rem; }
    .save-state { margin: 0; font-size: 0.85rem; }
    .subcategory-list { display: grid; gap: 0.9rem; }
    .subcategory-section {
      overflow: clip;
      border: 1px solid color-mix(in srgb, var(--border-strong) 68%, var(--neon-violet));
      border-radius: 0.9rem;
      background: linear-gradient(145deg, color-mix(in srgb, var(--surface-panel) 94%, #17346a 6%), color-mix(in srgb, var(--surface-panel) 94%, #492561 6%));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.055);
    }
    .subcategory-summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(8rem, 12rem);
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.1rem;
      cursor: pointer;
      list-style: none;
    }
    .subcategory-summary::-webkit-details-marker { display: none; }
    .subcategory-summary::after {
      content: '⌄';
      position: absolute;
      right: 0.85rem;
      color: var(--text-secondary);
      transition: transform 140ms ease;
    }
    .subcategory-section[open] > .subcategory-summary::after { transform: rotate(180deg); }
    .subcategory-summary-copy { display: grid; gap: 0.18rem; min-width: 0; }
    .subcategory-summary-copy > strong { font-size: 1.08rem; letter-spacing: -0.015em; }
    .subcategory-summary-copy small { color: var(--text-secondary); font-size: 0.72rem; }
    .subcategory-progress { display: grid; gap: 0.28rem; padding-right: 1.35rem; text-align: right; }
    .subcategory-progress > strong { font-size: 0.82rem; }
    .subcategory-content { padding: 0 1rem 1rem; border-top: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent); }
    .subcategory-description { max-width: 48rem; margin: 0.85rem 0 1rem; color: var(--text-secondary); font-size: 0.82rem; line-height: 1.5; }
    .question-list { display: grid; gap: 0.85rem; }
    .question-card { background: color-mix(in srgb, var(--surface-panel) 94%, transparent); }
    .question-card-header { margin-bottom: 0.7rem; }
    .question-card-header h2 { margin-bottom: 0.35rem; font-size: 1.18rem; letter-spacing: -0.015em; }
    .question-card-header p { max-width: 50rem; margin-bottom: 0; font-size: 0.84rem; line-height: 1.5; }
    @media (max-width: 720px) {
      .questionnaire-page { width: min(100% - 1rem, 66rem); }
      .category-header { grid-template-columns: 1fr; gap: 0.72rem; align-items: stretch; }
      .category-header .lead { font-size: 0.88rem; line-height: 1.5; }
      .category-progress-summary {
        gap: 0.42rem;
        padding: 0.68rem 0.72rem 0.64rem;
        border-color: color-mix(in srgb, var(--border-strong) 46%, var(--neon-violet));
        border-radius: 0.72rem;
        background: linear-gradient(145deg, rgba(18, 46, 91, 0.26), rgba(74, 38, 104, 0.24));
      }
      .category-progress-label { font-size: 0.64rem; letter-spacing: 0.06em; }
      .category-progress-count { font-size: 0.84rem; }
      .category-progress-percentage { font-size: 1.36rem; }
      .questionnaire-toolbar { align-items: stretch; flex-direction: column; gap: 0.55rem; }
      .subcategory-summary { grid-template-columns: minmax(0, 1fr) 7rem; padding: 0.9rem 0.85rem; gap: 0.65rem; }
      .subcategory-summary::after { right: 0.55rem; }
      .subcategory-progress { padding-right: 1rem; }
      .subcategory-content { padding: 0 0.55rem 0.65rem; }
      .subcategory-description { margin: 0.75rem 0.35rem 0.85rem; }
      .question-list { gap: 0.65rem; }
      .question-card { padding: 0.9rem; border-radius: 0.72rem; }
      .question-card-header h2 { font-size: 1.12rem; }
      .question-card-header p { font-size: 0.8rem; line-height: 1.45; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireCategoryPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  readonly catalogueText = inject(CatalogueTextService);
  private readonly taxonomy = inject(CatalogueTaxonomyService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  private readonly openSubcategoryIds = signal<ReadonlySet<string>>(new Set());
  private previousSubcategoryCompletion = new Map<string, boolean>();
  private subcategoryFlowKey = '';

  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly categoryId = computed(() => this.params().get('category') ?? '');
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly snapshot = computed(() => this.catalogueStore.snapshot());
  readonly category = computed(() => {
    const profile = this.profile();
    const snapshot = this.snapshot();
    return profile && snapshot
      ? this.questionnaireService.getCategory(snapshot, profile, this.categoryId(), this.includeFiltered())
      : undefined;
  });
  readonly sections = computed(() => {
    const category = this.category();
    if (!category) return [];
    const subcategories = this.taxonomy.subcategoriesFor(category.category.id);
    if (subcategories.length === 0) return [];

    const visiblePracticeIds = new Set(category.practices.map((item) => item.practice.id));
    return subcategories
      .map((subcategory) => {
        const practiceIds = new Set(subcategory.practiceIds);
        const practices = category.practices.filter((item) => practiceIds.has(item.practice.id));
        const total = practices.reduce((sum, item) => sum + item.roles.length, 0);
        const answered = practices.reduce(
          (sum, item) => sum + item.roles.filter((role) => role.answer !== undefined).length,
          0,
        );
        return {
          ...subcategory,
          practices,
          total,
          answered,
          percentage: total === 0 ? 0 : Math.round((answered / total) * 100),
          hasVisiblePractices: subcategory.practiceIds.some((id) => visiblePracticeIds.has(id)),
        };
      })
      .filter((section) => section.hasVisiblePractices);
  });
  readonly filteredCount = computed(() => {
    const profile = this.profile();
    const snapshot = this.snapshot();
    return profile && snapshot
      ? this.questionnaireService.getCategory(snapshot, profile, this.categoryId(), false)?.filtered ?? 0
      : 0;
  });

  constructor() {
    void this.catalogueStore.initialize();

    effect(() => {
      const sections = this.sections();
      const flowKey = `${this.categoryId()}|${this.includeFiltered() ? 'filtered' : 'default'}`;
      const completion = new Map(sections.map((section) => [section.id, isSubcategoryComplete(section)]));
      const needsInitialSelection = flowKey !== this.subcategoryFlowKey
        || (this.previousSubcategoryCompletion.size === 0 && sections.length > 0);

      if (needsInitialSelection) {
        this.subcategoryFlowKey = flowKey;
        this.previousSubcategoryCompletion = completion;
        const firstPending = firstPendingSubcategoryId(sections);
        this.openSubcategoryIds.set(firstPending ? new Set([firstPending]) : new Set());
        return;
      }

      const justCompleted = sections.filter((section) =>
        this.previousSubcategoryCompletion.get(section.id) === false
        && completion.get(section.id) === true,
      );
      this.previousSubcategoryCompletion = completion;

      if (justCompleted.length > 0) {
        const open = new Set(this.openSubcategoryIds());
        for (const section of justCompleted) open.delete(section.id);

        const completed = justCompleted.at(-1)!;
        const nextPending = nextPendingSubcategoryId(sections, completed.id);
        if (nextPending) open.add(nextPending);
        this.openSubcategoryIds.set(open);
        return;
      }

      const visibleIds = new Set(sections.map((section) => section.id));
      const currentOpen = this.openSubcategoryIds();
      if ([...currentOpen].some((id) => !visibleIds.has(id))) {
        this.openSubcategoryIds.set(new Set([...currentOpen].filter((id) => visibleIds.has(id))));
      }
    });
  }

  isSubcategoryOpen(sectionId: string): boolean {
    return this.openSubcategoryIds().has(sectionId);
  }

  toggleSubcategory(sectionId: string, event: Event): void {
    event.preventDefault();
    const open = new Set(this.openSubcategoryIds());
    if (open.has(sectionId)) open.delete(sectionId);
    else open.add(sectionId);
    this.openSubcategoryIds.set(open);
  }

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
