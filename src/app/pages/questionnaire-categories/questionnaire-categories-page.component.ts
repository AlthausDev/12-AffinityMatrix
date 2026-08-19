import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';

@Component({
  selector: 'app-questionnaire-categories-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id]">← Profile</a>

        @if (snapshot(); as currentSnapshot) {
          <header class="page-header dashboard-header">
            <div>
              <p class="eyebrow">Questionnaire · catalogue v{{ currentSnapshot.version }}</p>
              <h1>Categories</h1>
              <p class="muted lead">Answer at your own pace. Unanswered questions stay distinct from Neutral, and every saved answer is stored immediately.</p>
            </div>
            <p class="profile-count">{{ totalAnswered() }} / {{ totalQuestions() }} answered</p>
          </header>

          @if (profileStore.error()) { <p class="alert" role="alert">{{ profileStore.error() }}</p> }

          @if (catalogueRelationship() === 'profile-older') {
            <p class="alert">This profile was created against an older catalogue. New or refined questions remain explicitly unanswered until you choose a response. Historical answers are preserved.</p>
          } @else if (catalogueRelationship() === 'profile-newer') {
            <p class="alert">This profile came from a newer catalogue. Answers for unknown questions are preserved even when this version cannot display them.</p>
          }

          @if (unknownAnswerCount() > 0) {
            <p class="muted form-note">{{ unknownAnswerCount() }} saved answer{{ unknownAnswerCount() === 1 ? '' : 's' }} belong to historical or unavailable catalogue questions and remain preserved.</p>
          }

          @if (totalFiltered() > 0) {
            <label class="check-field questionnaire-filter-toggle">
              <input type="checkbox" [checked]="includeFiltered()" (change)="toggleFiltered($event)" />
              <span>
                <strong>Show filtered questions</strong>
                <small>{{ totalFiltered() }} question{{ totalFiltered() === 1 ? '' : 's' }} hidden by the optional profile filter. Showing them does not change the profile settings.</small>
              </span>
            </label>
          }

          <section class="category-list" aria-label="Questionnaire categories">
            @for (summary of summaries(); track summary.category.id) {
              <a class="category-card" [routerLink]="['/profiles', currentProfile.id, 'questionnaire', summary.category.id]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">
                <div class="category-card-heading">
                  <div><p class="eyebrow">{{ summary.answered }} of {{ summary.total }} answered</p><h2>{{ summary.category.label }}</h2></div>
                  <strong>{{ summary.completionPercentage }}%</strong>
                </div>
                @if (summary.category.description) { <p class="muted">{{ summary.category.description }}</p> }
                <div class="progress-track" aria-hidden="true"><span [style.width.%]="summary.completionPercentage"></span></div>
                @if (summary.filtered > 0 && !includeFiltered()) { <small class="muted">{{ summary.filtered }} filtered question{{ summary.filtered === 1 ? '' : 's' }}</small> }
              </a>
            }
          </section>
        } @else if (catalogueStore.loading()) {
          <section class="panel"><h1>Loading questionnaire…</h1><p class="muted">Loading the local catalogue.</p></section>
        } @else {
          <section class="panel"><h1>Questionnaire unavailable</h1><p class="muted">{{ catalogueStore.error() || 'The questionnaire catalogue could not be loaded.' }}</p></section>
        }
      } @else {
        <a class="back-link" routerLink="/">← Profiles</a><section class="panel"><h1>Profile not found</h1><p class="muted">The requested profile is not available in local storage.</p></section>
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
}
