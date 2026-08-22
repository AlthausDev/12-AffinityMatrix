import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnswerScope, PracticeAnswer } from '../../../domain/profile/profile-answer';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { QuestionnaireRoleComponent } from '../../questionnaire/questionnaire-role.component';

@Component({
  selector: 'app-questionnaire-category-page',
  imports: [RouterLink, QuestionnaireRoleComponent],
  template: `
    <main class="page questionnaire-page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('questionnaire.backCategories') }}</a>
        @if (category(); as currentCategory) {
          <header class="page-header dashboard-header">
            <div>
              <p class="eyebrow">{{ i18n.t('questionnaire.category.eyebrow', { answered: currentCategory.answered, total: currentCategory.total }) }}</p>
              <h1>{{ catalogueText.categoryLabel(currentCategory.category) }}</h1>
              <p class="muted lead">{{ catalogueText.categoryDescription(currentCategory.category) }}</p>
            </div>
            <p class="profile-count">{{ currentCategory.completionPercentage }}%</p>
          </header>

          @if (profileStore.error()) { <p class="alert" role="alert">{{ profileStore.error() }}</p> }

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

          <nav class="questionnaire-nav" [attr.aria-label]="i18n.t('questionnaire.navigationAria')">
            <div>@if (neighbours().previousCategoryId; as previousId) { <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', previousId]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('questionnaire.previous') }}</a> }</div>
            <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('common.categories') }}</a>
            <div>@if (neighbours().nextCategoryId; as nextId) { <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', nextId]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('questionnaire.next') }}</a> }</div>
          </nav>
        } @else if (catalogueStore.loading()) {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.loading.title') }}</h1><p class="muted">{{ i18n.t('common.questionnaire.loading.description') }}</p></section>
        } @else if (!snapshot()) {
          <section class="panel"><h1>{{ i18n.t('common.questionnaire.unavailable.title') }}</h1><p class="muted">{{ catalogueStore.error() || i18n.t('common.questionnaire.unavailable.description') }}</p></section>
        } @else {
          <section class="panel"><h1>{{ i18n.t('questionnaire.categoryNotFound') }}</h1><a class="button" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">{{ i18n.t('questionnaire.returnCategories') }}</a></section>
        }
      } @else {
        <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a><section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1></section>
      }
    </main>
  `,
  styles: `
    .questionnaire-page { max-width: 64rem; }
    .questionnaire-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
    .compact-toggle { min-width: min(100%, 24rem); padding: 0.75rem; }
    .save-state { margin: 0; font-size: 0.85rem; }
    .question-list { display: grid; gap: 1rem; }
    .question-card-header { margin-bottom: 1rem; }
    .question-card-header p { margin-bottom: 0; }
    .questionnaire-nav { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0.75rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); }
    .questionnaire-nav > div:last-child { text-align: right; }
    @media (max-width: 720px) { .questionnaire-toolbar { align-items: stretch; flex-direction: column; } .questionnaire-nav { grid-template-columns: 1fr; } .questionnaire-nav .button { width: 100%; } }
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
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  readonly includeFiltered = signal(this.route.snapshot.queryParamMap.get('filtered') === '1');
  readonly profileId = computed(() => this.params().get('id') ?? '');
  readonly categoryId = computed(() => this.params().get('category') ?? '');
  readonly profile = computed(() => this.profileStore.findById(this.profileId()));
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

  toggleFiltered(event: Event): void { this.includeFiltered.set((event.target as HTMLInputElement).checked); }

  filteredInCategoryLabel(count: number): string {
    return this.i18n.plural(count, 'questionnaire.category.filtered.one', 'questionnaire.category.filtered.other');
  }

  saveAnswer(answer: PracticeAnswer): void {
    const snapshot = this.snapshot();
    if (snapshot) void this.profileStore.upsertAnswer(this.profileId(), answer, snapshot.version);
  }

  removeAnswer(target: { readonly practiceId: string; readonly roleId: string; readonly scope?: AnswerScope }): void {
    void this.profileStore.removeAnswer(this.profileId(), target.practiceId, target.roleId, target.scope);
  }
}
