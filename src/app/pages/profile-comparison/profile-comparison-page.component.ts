import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComparisonClassification, RoleRelation } from '../../../domain/comparison/comparison';
import { Preference } from '../../../domain/profile/preference';
import { CatalogueStore } from '../../core/catalogue.store';
import { COMPARISON_SERVICE } from '../../core/comparison-service.token';
import { ProfileStore } from '../../core/profile.store';
import {
  COMPARISON_CLASSIFICATION_LABELS,
  PREFERENCE_LABELS,
  ROLE_RELATION_LABELS,
} from '../../shared/comparison-presentation';

@Component({
  selector: 'app-profile-comparison-page',
  imports: [RouterLink],
  template: `
    <main class="page comparison-page">
      @if (profile(); as leftProfile) {
        <a class="back-link" [routerLink]="['/profiles', leftProfile.id]">← Profile</a>

        <header class="page-header dashboard-header">
          <div>
            <p class="eyebrow">Comparison</p>
            <h1>Compare profiles</h1>
            <p class="muted lead">Comparison is calculated from the current catalogue, explicit role pairs, and answered preferences. Unanswered questions are never treated as Neutral.</p>
          </div>
        </header>

        @if (catalogueStore.error()) {
          <p class="alert" role="alert">{{ catalogueStore.error() }}</p>
        }

        @if (otherProfiles().length === 0) {
          <section class="panel empty-state">
            <h2>No second local profile yet</h2>
            <p class="muted">Create or import another profile first. The comparison engine is already independent of local persistence, so a future compare-without-saving flow can reuse the same calculation.</p>
            <div class="button-row">
              <a class="button" routerLink="/profiles/new">Create profile</a>
              <a class="button secondary" routerLink="/profiles/import">Import profile</a>
            </div>
          </section>
        } @else {
          <section class="panel comparison-selector" aria-labelledby="comparison-target-title">
            <div>
              <p class="eyebrow">Profiles</p>
              <h2 id="comparison-target-title">{{ leftProfile.metadata.alias || 'Untitled profile' }} + {{ selectedProfile()?.metadata?.alias || 'Untitled profile' }}</h2>
            </div>
            <label class="select-field">
              <span>Compare with</span>
              <select [value]="selectedProfile()?.id ?? ''" (change)="selectProfile($event)">
                @for (candidate of otherProfiles(); track candidate.id) {
                  <option [value]="candidate.id">{{ candidate.metadata.alias || 'Untitled profile' }}</option>
                }
              </select>
            </label>
          </section>

          @if (comparison(); as result) {
            @if (result.contextIssues.leftSexMissing || result.contextIssues.rightSexMissing) {
              <p class="alert" role="alert">
                Some counterpart-scoped answers cannot be matched because
                @if (result.contextIssues.leftSexMissing) { the first profile has no sex specified }
                @if (result.contextIssues.leftSexMissing && result.contextIssues.rightSexMissing) { and }
                @if (result.contextIssues.rightSexMissing) { the second profile has no sex specified }.
                Unscoped answers are still compared normally.
              </p>
            }

            <section class="comparison-summary" aria-label="Comparison summary">
              <article class="summary-card"><strong>{{ result.answeredInteractionCount }}</strong><span>answered interactions</span></article>
              <article class="summary-card"><strong>{{ result.commonGroundCount }}</strong><span>with common ground</span></article>
              <article class="summary-card"><strong>{{ result.classifications['conditioned'] + result.classifications['intensity-mismatch'] + result.classifications['explorable'] }}</strong><span>worth discussing</span></article>
              <article class="summary-card"><strong>{{ result.boundaryCount }}</strong><span>boundaries shown separately</span></article>
            </section>

            <section class="comparison-explanation panel">
              <p><strong>Category affinity</strong> is the average preference-alignment score for explicitly answered, catalogue-compatible interactions in that category. Unanswered questions are excluded. Hard boundaries are displayed but deliberately excluded from the percentage rather than being treated as a compatibility penalty.</p>
            </section>

            @if (comparableCategories().length === 0) {
              <section class="panel empty-state">
                <h2>No comparable answered interactions yet</h2>
                <p class="muted">The profiles may need more questionnaire answers, or counterpart metadata may be missing for scoped answers.</p>
              </section>
            } @else {
              <section class="category-comparisons" aria-label="Category comparison">
                @for (category of comparableCategories(); track category.categoryId) {
                  <article class="panel category-comparison">
                    <header class="category-heading">
                      <div>
                        <p class="eyebrow">{{ category.answeredInteractionCount }} answered interaction{{ category.answeredInteractionCount === 1 ? '' : 's' }}</p>
                        <h2>{{ category.categoryLabel }}</h2>
                      </div>
                      <div class="affinity-value">
                        <strong>{{ category.affinityPercentage === null ? '—' : category.affinityPercentage + '%' }}</strong>
                        <span>affinity</span>
                      </div>
                    </header>

                    @if (category.affinityPercentage !== null) {
                      <div class="progress-track" aria-hidden="true"><span [style.width.%]="category.affinityPercentage"></span></div>
                      <p class="muted category-note">Based on {{ category.affinityBasisCount }} scored interaction{{ category.affinityBasisCount === 1 ? '' : 's' }}. {{ category.boundaryCount }} boundar{{ category.boundaryCount === 1 ? 'y' : 'ies' }} outside the score.</p>
                    } @else if (category.boundaryCount > 0) {
                      <p class="muted category-note">Only hard boundaries are present among the comparable answered interactions, so no affinity percentage is calculated.</p>
                    }

                    <div class="interaction-list">
                      @for (interaction of category.interactions; track interaction.id) {
                        <article class="interaction-row">
                          <div class="interaction-title">
                            <strong>{{ interaction.practiceLabel }}</strong>
                            <span class="comparison-badge">{{ roleRelationLabel(interaction.roleRelation) }}</span>
                            <span class="comparison-badge">{{ classificationLabel(interaction.compatibility.classification) }}</span>
                          </div>
                          <div class="answer-pair">
                            <div>
                              <span class="profile-name">{{ leftProfile.metadata.alias || 'First profile' }}</span>
                              <strong>{{ interaction.left.roleLabel }}</strong>
                              <span>{{ preferenceLabel(interaction.left.answer.preference) }}</span>
                            </div>
                            <span class="pair-arrow" aria-hidden="true">↔</span>
                            <div>
                              <span class="profile-name">{{ selectedProfile()?.metadata?.alias || 'Second profile' }}</span>
                              <strong>{{ interaction.right.roleLabel }}</strong>
                              <span>{{ preferenceLabel(interaction.right.answer.preference) }}</span>
                            </div>
                          </div>
                        </article>
                      }
                    </div>
                  </article>
                }
              </section>

              @if (categoriesWithoutComparableAnswers() > 0) {
                <p class="muted omitted-note">{{ categoriesWithoutComparableAnswers() }} catalogue categor{{ categoriesWithoutComparableAnswers() === 1 ? 'y has' : 'ies have' }} no comparable answered interactions and {{ categoriesWithoutComparableAnswers() === 1 ? 'is' : 'are' }} omitted from the detailed view.</p>
              }
            }
          } @else if (catalogueStore.loading()) {
            <section class="panel"><h2>Loading comparison…</h2><p class="muted">Loading the current local catalogue.</p></section>
          }
        }
      } @else {
        <a class="back-link" routerLink="/">← Profiles</a>
        <section class="panel"><h1>Profile not found</h1><p class="muted">The requested profile is not available in local storage.</p></section>
      }
    </main>
  `,
  styles: `
    .comparison-page { max-width: 68rem; }
    .comparison-selector { display: flex; justify-content: space-between; align-items: end; gap: 1.5rem; margin-bottom: 1rem; }
    .comparison-selector h2 { margin-bottom: 0; }
    .select-field { display: grid; gap: 0.4rem; min-width: min(100%, 19rem); color: var(--text-secondary); font-size: 0.85rem; }
    .select-field select { width: 100%; padding: 0.7rem 0.8rem; border: 1px solid var(--border-strong); border-radius: 0.5rem; background: var(--surface-elevated); color: var(--text-primary); }
    .comparison-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0; }
    .summary-card { display: grid; gap: 0.25rem; padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 0.65rem; background: var(--surface-panel); }
    .summary-card strong { font-size: 1.55rem; }
    .summary-card span { color: var(--text-secondary); font-size: 0.82rem; }
    .comparison-explanation { margin-bottom: 1rem; }
    .comparison-explanation p { margin: 0; color: var(--text-secondary); }
    .category-comparisons { display: grid; gap: 1rem; }
    .category-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; }
    .category-heading h2 { margin-bottom: 0; }
    .affinity-value { display: grid; text-align: right; }
    .affinity-value strong { font-size: 1.7rem; }
    .affinity-value span { color: var(--text-secondary); font-size: 0.78rem; }
    .progress-track { height: 0.4rem; margin-top: 1rem; overflow: hidden; border-radius: 999px; background: var(--surface-elevated); }
    .progress-track span { display: block; height: 100%; background: var(--text-primary); }
    .category-note { margin: 0.6rem 0 0; font-size: 0.82rem; }
    .interaction-list { display: grid; gap: 0.7rem; margin-top: 1rem; }
    .interaction-row { padding-top: 0.8rem; border-top: 1px solid var(--border-subtle); }
    .interaction-title { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; margin-bottom: 0.65rem; }
    .comparison-badge { padding: 0.2rem 0.45rem; border: 1px solid var(--border-subtle); border-radius: 999px; color: var(--text-secondary); font-size: 0.72rem; }
    .answer-pair { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.8rem; align-items: center; }
    .answer-pair > div { display: grid; gap: 0.2rem; }
    .answer-pair > div:last-child { text-align: right; }
    .answer-pair span:not(.pair-arrow) { color: var(--text-secondary); font-size: 0.82rem; }
    .profile-name { font-size: 0.72rem !important; text-transform: uppercase; letter-spacing: 0.04em; }
    .pair-arrow { color: var(--text-secondary); }
    .omitted-note { margin-top: 1rem; text-align: center; font-size: 0.82rem; }
    .empty-state { display: grid; gap: 0.8rem; }
    .empty-state h2, .empty-state p { margin: 0; }
    .button-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    @media (max-width: 760px) {
      .comparison-selector { align-items: stretch; flex-direction: column; }
      .select-field { min-width: 0; }
      .comparison-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .answer-pair { grid-template-columns: 1fr; }
      .pair-arrow { display: none; }
      .answer-pair > div:last-child { text-align: left; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComparisonPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  private readonly comparisonService = inject(COMPARISON_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly selectedProfileId = signal('');
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly otherProfiles = computed(() => this.profileStore.profiles().filter((profile) => profile.id !== this.profileId));
  readonly selectedProfile = computed(() => {
    const profiles = this.otherProfiles();
    const requested = this.selectedProfileId();
    return profiles.find((profile) => profile.id === requested) ?? profiles[0];
  });
  readonly comparison = computed(() => {
    const snapshot = this.catalogueStore.snapshot();
    const left = this.profile();
    const right = this.selectedProfile();
    return snapshot && left && right ? this.comparisonService.compare(snapshot, left, right) : undefined;
  });
  readonly comparableCategories = computed(() =>
    this.comparison()?.categories.filter((category) => category.answeredInteractionCount > 0) ?? [],
  );
  readonly categoriesWithoutComparableAnswers = computed(() =>
    (this.comparison()?.categories.length ?? 0) - this.comparableCategories().length,
  );

  constructor() {
    void this.catalogueStore.initialize();
  }

  selectProfile(event: Event): void {
    this.selectedProfileId.set((event.target as HTMLSelectElement).value);
  }

  preferenceLabel(preference: Preference): string {
    return PREFERENCE_LABELS[preference];
  }

  classificationLabel(classification: ComparisonClassification): string {
    return COMPARISON_CLASSIFICATION_LABELS[classification];
  }

  roleRelationLabel(relation: RoleRelation): string {
    return ROLE_RELATION_LABELS[relation];
  }
}
