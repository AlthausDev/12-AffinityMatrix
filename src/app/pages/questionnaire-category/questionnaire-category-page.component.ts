import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
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
import { CatalogueGlossaryTextComponent } from '../../shared/catalogue-glossary-text.component';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { findRouteParam } from '../../shared/route-param';
import {
  initialSubcategoryId,
  isSubcategoryComplete,
  nextPendingSubcategoryId,
} from './questionnaire-subcategory-flow';

@Component({
  selector: 'app-questionnaire-category-page',
  imports: [RouterLink, QuestionnaireRoleComponent, CatalogueGlossaryTextComponent, CompletionProgressComponent],
  template: `
    <main class="questionnaire-modal-page questionnaire-page">
      @if (profile()) {
        @if (category(); as currentCategory) {
          <header class="page-header category-header">
            <div>
              <p class="eyebrow">{{ i18n.t('questionnaire.category.eyebrow', { answered: currentCategory.answered, total: currentCategory.total }) }}</p>
              <h1><app-catalogue-glossary-text [text]="catalogueText.categoryLabel(currentCategory.category)" /></h1>
              <p class="muted lead"><app-catalogue-glossary-text [text]="catalogueText.categoryDescription(currentCategory.category)" /></p>
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
            <section class="subcategory-list" [attr.aria-label]="i18n.t('questionnaire.subcategoriesAria')">
              @for (section of sections(); track section.id) {
                <section
                  class="subcategory-section"
                  [class.is-open]="isSubcategoryOpen(section.id)"
                  [id]="'subcategory-' + section.id"
                  [attr.aria-labelledby]="'subcategory-label-' + section.id"
                >
                  <h2 class="subcategory-heading">
                    <button
                      type="button"
                      class="subcategory-summary"
                      [id]="'subcategory-summary-' + section.id"
                      [attr.aria-expanded]="isSubcategoryOpen(section.id)"
                      [attr.aria-controls]="'subcategory-content-' + section.id"
                      (click)="toggleSubcategory(section.id)"
                    >
                      <span class="subcategory-summary-copy">
                        <span class="subcategory-title" [id]="'subcategory-label-' + section.id">{{ section.label }}</span>
                        <small>{{ section.answered }} / {{ section.total }}</small>
                      </span>
                      <span class="subcategory-progress">
                        <strong>{{ section.percentage }}%</strong>
                        <app-completion-progress [value]="section.percentage" />
                      </span>
                    </button>
                  </h2>
                  <div
                    class="subcategory-reveal"
                    [id]="'subcategory-content-' + section.id"
                    [attr.aria-hidden]="!isSubcategoryOpen(section.id)"
                    [attr.inert]="isSubcategoryOpen(section.id) ? null : ''"
                  >
                    <div class="subcategory-reveal-inner">
                      <div class="subcategory-content">
                        <p class="subcategory-description"><app-catalogue-glossary-text [text]="section.description" /></p>
                        <div class="question-list">
                          @for (item of section.practices; track item.practice.id) {
                            <article class="panel question-card">
                              <header class="question-card-header">
                                <h3><app-catalogue-glossary-text [text]="catalogueText.practiceLabel(item.practice, profile()?.metadata.sex)" /></h3>
                                @if (catalogueText.practiceDescription(item.practice); as practiceDescription) {
                                  <p class="muted"><app-catalogue-glossary-text [text]="practiceDescription" /></p>
                                }
                              </header>
                              @for (roleView of item.roles; track roleView.answerKey) {
                                <app-questionnaire-role
                                  [practiceId]="item.practice.id"
                                  [role]="roleView.role"
                                  [scope]="roleView.scope"
                                  [answer]="roleView.answer"
                                  [filtered]="roleView.filtered"
                                  [headingLevel]="4"
                                  (answerChange)="saveAnswer($event)"
                                  (answerRemove)="removeAnswer($event)"
                                />
                              }
                            </article>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              }
            </section>
          } @else {
            <section class="question-list">
              @for (item of currentCategory.practices; track item.practice.id) {
                <article class="panel question-card">
                  <header class="question-card-header">
                    <h2><app-catalogue-glossary-text [text]="catalogueText.practiceLabel(item.practice, profile()?.metadata.sex)" /></h2>
                    @if (catalogueText.practiceDescription(item.practice); as practiceDescription) {
                      <p class="muted"><app-catalogue-glossary-text [text]="practiceDescription" /></p>
                    }
                  </header>
                  @for (roleView of item.roles; track roleView.answerKey) {
                    <app-questionnaire-role
                      [practiceId]="item.practice.id"
                      [role]="roleView.role"
                      [scope]="roleView.scope"
                      [answer]="roleView.answer"
                      [filtered]="roleView.filtered"
                      [headingLevel]="3"
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
      scroll-margin-top: calc(var(--questionnaire-top-space, 5.25rem) + 0.75rem);
      border: 1px solid color-mix(in srgb, var(--border-strong) 68%, var(--neon-violet));
      border-radius: 0.9rem;
      background: linear-gradient(145deg, color-mix(in srgb, var(--surface-panel) 94%, #17346a 6%), color-mix(in srgb, var(--surface-panel) 94%, #492561 6%));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.055);
      transition: border-color 220ms ease, box-shadow 220ms ease;
    }
    .subcategory-section.is-open {
      border-color: color-mix(in srgb, var(--border-strong) 52%, var(--neon-violet));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.065), 0 0 1rem rgba(111, 101, 255, 0.035);
    }
    .subcategory-heading { margin: 0; font: inherit; }
    .subcategory-summary {
      position: relative;
      display: grid;
      width: 100%;
      grid-template-columns: minmax(0, 1fr) minmax(8rem, 12rem);
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.1rem;
      border: 0;
      appearance: none;
      cursor: pointer;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
    }
    .subcategory-summary::after {
      content: '⌄';
      position: absolute;
      right: 0.85rem;
      color: var(--text-secondary);
      transition: transform 220ms cubic-bezier(.2,.72,.2,1);
    }
    .subcategory-section.is-open > .subcategory-heading .subcategory-summary::after { transform: rotate(180deg); }
    .subcategory-summary-copy { display: grid; gap: 0.18rem; min-width: 0; }
    .subcategory-title { font-size: 1.08rem; font-weight: 700; letter-spacing: -0.015em; }
    .subcategory-summary-copy small { color: var(--text-secondary); font-size: 0.72rem; }
    .subcategory-progress { display: grid; gap: 0.28rem; padding-right: 1.35rem; text-align: right; }
    .subcategory-progress > strong { font-size: 0.82rem; }
    .subcategory-reveal {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition: grid-template-rows 280ms cubic-bezier(.2,.72,.2,1), opacity 180ms ease;
    }
    .subcategory-section.is-open > .subcategory-reveal {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .subcategory-reveal-inner { min-height: 0; overflow: hidden; }
    .subcategory-content { padding: 0 1rem 1rem; border-top: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent); }
    .subcategory-description { max-width: 48rem; margin: 0.85rem 0 1rem; color: var(--text-secondary); font-size: 0.82rem; line-height: 1.5; }
    .question-list { display: grid; gap: 0.85rem; }
    .question-card { background: color-mix(in srgb, var(--surface-panel) 94%, transparent); }
    .question-card-header { margin-bottom: 0.7rem; }
    .question-card-header :is(h2, h3) { margin-bottom: 0.35rem; font-size: 1.18rem; letter-spacing: -0.015em; }
    .question-card-header p { max-width: 50rem; margin-bottom: 0; font-size: 0.84rem; line-height: 1.5; }
    @media (prefers-reduced-motion: reduce) {
      .subcategory-section,
      .subcategory-summary::after,
      .subcategory-reveal { transition: none; }
    }
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
      .question-card-header :is(h2, h3) { font-size: 1.12rem; }
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  private readonly queryParams = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  private readonly openSubcategoryId = signal<string | null>(null);
  private previousSubcategoryCompletion = new Map<string, boolean>();
  private subcategoryFlowKey = '';
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;

  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly categoryId = computed(() => this.params().get('category') ?? '');
  readonly requestedSubcategoryId = computed(() => this.queryParams().get('subcategory'));
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
        const total = practices.length;
        const answered = practices.filter((item) =>
          item.roles.some((role) => role.answer !== undefined),
        ).length;
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

    this.destroyRef.onDestroy(() => {
      if (this.scrollTimer !== undefined) clearTimeout(this.scrollTimer);
    });

    effect(() => {
      const sections = this.sections();
      const flowKey = `${this.categoryId()}|${this.includeFiltered() ? 'filtered' : 'default'}`;
      const completion = new Map(sections.map((section) => [section.id, isSubcategoryComplete(section)]));
      const needsInitialSelection = flowKey !== this.subcategoryFlowKey
        || (this.previousSubcategoryCompletion.size === 0 && sections.length > 0);

      if (needsInitialSelection) {
        this.subcategoryFlowKey = flowKey;
        this.previousSubcategoryCompletion = completion;
        const requested = this.requestedSubcategoryId();
        const initial = initialSubcategoryId(sections, requested);
        this.openSubcategoryId.set(initial);
        if (requested && initial === requested) this.scheduleSubcategoryScroll(requested);
        return;
      }

      const justCompleted = sections.filter((section) =>
        this.previousSubcategoryCompletion.get(section.id) === false
        && completion.get(section.id) === true,
      );
      this.previousSubcategoryCompletion = completion;

      if (justCompleted.length > 0) {
        const completed = justCompleted.at(-1)!;
        const nextPending = nextPendingSubcategoryId(sections, completed.id);
        this.openSubcategoryId.set(nextPending);
        if (nextPending) this.scheduleSubcategoryScroll(nextPending, true);
        else this.scheduleSubcategorySummaryFocus(completed.id);
        return;
      }

      const currentOpen = this.openSubcategoryId();
      if (currentOpen && !sections.some((section) => section.id === currentOpen)) {
        this.openSubcategoryId.set(initialSubcategoryId(sections, this.requestedSubcategoryId()));
      }
    });
  }

  isSubcategoryOpen(sectionId: string): boolean {
    return this.openSubcategoryId() === sectionId;
  }

  toggleSubcategory(sectionId: string): void {
    if (this.openSubcategoryId() === sectionId) {
      this.openSubcategoryId.set(null);
      return;
    }

    // Manual accordion interaction should stay under the user's finger. Automatic scrolling is
    // reserved for progression after completing a subcategory, avoiding a delayed mobile jump.
    this.clearScrollTimer();
    this.openSubcategoryId.set(sectionId);
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

  private scheduleSubcategoryScroll(sectionId: string, focusSummary = false): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.clearScrollTimer();

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = undefined;
      if (this.openSubcategoryId() !== sectionId) return;
      const section = document.getElementById(`subcategory-${sectionId}`);
      section?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      if (focusSummary) {
        document.getElementById(`subcategory-summary-${sectionId}`)?.focus({ preventScroll: true });
      }
    }, reduceMotion ? 0 : 300);
  }

  private scheduleSubcategorySummaryFocus(sectionId: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.clearScrollTimer();
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = undefined;
      document.getElementById(`subcategory-summary-${sectionId}`)?.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 300);
  }

  private clearScrollTimer(): void {
    if (this.scrollTimer !== undefined) clearTimeout(this.scrollTimer);
    this.scrollTimer = undefined;
  }
}
