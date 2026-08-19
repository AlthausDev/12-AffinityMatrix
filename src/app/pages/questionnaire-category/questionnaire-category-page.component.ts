import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PracticeAnswer } from '../../../domain/profile/profile-answer';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { QuestionnaireRoleComponent } from '../../questionnaire/questionnaire-role.component';

@Component({
  selector: 'app-questionnaire-category-page',
  imports: [RouterLink, QuestionnaireRoleComponent],
  template: `
    <main class="page questionnaire-page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">← Categories</a>
        @if (category(); as currentCategory) {
          <header class="page-header dashboard-header">
            <div>
              <p class="eyebrow">Questionnaire · {{ currentCategory.answered }} of {{ currentCategory.total }} answered</p>
              <h1>{{ currentCategory.category.label }}</h1>
              <p class="muted lead">{{ currentCategory.category.description }}</p>
            </div>
            <p class="profile-count">{{ currentCategory.completionPercentage }}%</p>
          </header>

          @if (profileStore.error()) { <p class="alert" role="alert">{{ profileStore.error() }}</p> }

          <div class="questionnaire-toolbar">
            @if (filteredCount() > 0) {
              <label class="check-field compact-toggle">
                <input type="checkbox" [checked]="includeFiltered()" (change)="toggleFiltered($event)" />
                <span><strong>Show filtered roles</strong><small>{{ filteredCount() }} hidden in this category</small></span>
              </label>
            }
            <p class="save-state muted" role="status">{{ profileStore.saving() ? 'Saving locally…' : 'Saved locally' }}</p>
          </div>

          @if (currentCategory.practices.length === 0) {
            <section class="panel"><h2>No visible questions</h2><p class="muted">Show filtered roles above or disable filtering in Profile data.</p></section>
          } @else {
            <section class="question-list">
              @for (item of currentCategory.practices; track item.practice.id) {
                <article class="panel question-card">
                  <header class="question-card-header"><h2>{{ item.practice.label }}</h2><p class="muted">{{ item.practice.description }}</p></header>
                  @for (roleView of item.roles; track roleView.role.id) {
                    <app-questionnaire-role
                      [practiceId]="item.practice.id"
                      [role]="roleView.role"
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

          <nav class="questionnaire-nav" aria-label="Questionnaire navigation">
            <div>@if (neighbours().previousCategoryId; as previousId) { <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', previousId]">← Previous</a> }</div>
            <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">Categories</a>
            <div>@if (neighbours().nextCategoryId; as nextId) { <a class="button secondary" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', nextId]">Next →</a> }</div>
          </nav>
        } @else {
          <section class="panel"><h1>Category not found</h1><a class="button" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">Return to categories</a></section>
        }
      } @else {
        <a class="back-link" routerLink="/">← Profiles</a><section class="panel"><h1>Profile not found</h1></section>
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
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  readonly includeFiltered = signal(false);
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

  toggleFiltered(event: Event): void { this.includeFiltered.set((event.target as HTMLInputElement).checked); }
  saveAnswer(answer: PracticeAnswer): void {
    const snapshot = this.snapshot();
    if (snapshot) void this.profileStore.upsertAnswer(this.profileId(), answer, snapshot.version);
  }
  removeAnswer(target: { readonly practiceId: string; readonly roleId: string }): void {
    void this.profileStore.removeAnswer(this.profileId(), target.practiceId, target.roleId);
  }
}
