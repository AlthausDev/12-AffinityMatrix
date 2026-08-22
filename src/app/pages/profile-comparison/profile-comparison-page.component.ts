import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ComparisonClassification,
  ComparisonContextIssues,
  RoleRelation,
} from '../../../domain/comparison/comparison';
import { Preference } from '../../../domain/profile/preference';
import { CatalogueStore } from '../../core/catalogue.store';
import { COMPARISON_SERVICE } from '../../core/comparison-service.token';
import { ProfileStore } from '../../core/profile.store';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import {
  COMPARISON_CLASSIFICATION_LABEL_KEYS,
  PREFERENCE_LABEL_KEYS,
  ROLE_RELATION_LABEL_KEYS,
} from '../../shared/comparison-presentation';

@Component({
  selector: 'app-profile-comparison-page',
  imports: [RouterLink],
  template: `
    <main class="page comparison-page">
      @if (profile(); as leftProfile) {
        <a class="back-link" [routerLink]="['/profiles', leftProfile.id]">{{ i18n.t('comparison.backProfile') }}</a>

        <header class="page-header dashboard-header">
          <div>
            <p class="eyebrow">{{ i18n.t('comparison.eyebrow') }}</p>
            <h1>{{ i18n.t('comparison.title') }}</h1>
            <p class="muted lead">{{ i18n.t('comparison.description') }}</p>
          </div>
        </header>

        @if (catalogueStore.error()) {
          <p class="alert" role="alert">{{ i18n.t('common.questionnaire.unavailable.description') }}</p>
        }

        @if (otherProfiles().length === 0) {
          <section class="panel empty-state">
            <h2>{{ i18n.t('comparison.noSecond.title') }}</h2>
            <p class="muted">{{ i18n.t('comparison.noSecond.description') }}</p>
            <div class="button-row">
              <a class="button" routerLink="/profiles/new">{{ i18n.t('common.createProfile') }}</a>
              <a class="button secondary" routerLink="/profiles/import">{{ i18n.t('common.importProfile') }}</a>
            </div>
          </section>
        } @else if (selectedProfile(); as rightProfile) {
          <section class="panel comparison-selector" aria-labelledby="comparison-target-title">
            <div>
              <p class="eyebrow">{{ i18n.t('comparison.profiles') }}</p>
              <h2 id="comparison-target-title">{{ leftProfile.metadata.alias || i18n.t('common.untitledProfile') }} + {{ rightProfile.metadata.alias || i18n.t('common.untitledProfile') }}</h2>
            </div>
            <label class="select-field">
              <span>{{ i18n.t('comparison.compareWith') }}</span>
              <select [value]="rightProfile.id" (change)="selectProfile($event)">
                @for (candidate of otherProfiles(); track candidate.id) {
                  <option [value]="candidate.id">{{ candidate.metadata.alias || i18n.t('common.untitledProfile') }}</option>
                }
              </select>
            </label>
          </section>

          @if (comparison(); as result) {
            @if (contextIssueMessage(result.contextIssues); as issueMessage) {
              <p class="alert" role="alert">{{ issueMessage }}</p>
            }

            <section class="comparison-summary" [attr.aria-label]="i18n.t('comparison.summaryAria')">
              <article class="summary-card"><strong>{{ result.answeredInteractionCount }}</strong><span>{{ i18n.t('comparison.summary.answered') }}</span></article>
              <article class="summary-card"><strong>{{ result.commonGroundCount }}</strong><span>{{ i18n.t('comparison.summary.commonGround') }}</span></article>
              <article class="summary-card"><strong>{{ result.classifications['conditioned'] + result.classifications['intensity-mismatch'] + result.classifications['explorable'] }}</strong><span>{{ i18n.t('comparison.summary.discuss') }}</span></article>
              <article class="summary-card"><strong>{{ result.boundaryCount }}</strong><span>{{ i18n.t('comparison.summary.boundaries') }}</span></article>
            </section>

            <section class="comparison-explanation panel">
              <p>{{ i18n.t('comparison.explanation') }}</p>
            </section>

            @if (comparableCategories().length === 0) {
              <section class="panel empty-state">
                <h2>{{ i18n.t('comparison.noComparable.title') }}</h2>
                <p class="muted">{{ i18n.t('comparison.noComparable.description') }}</p>
              </section>
            } @else {
              <section class="category-comparisons" [attr.aria-label]="i18n.t('comparison.categoryAria')">
                @for (category of comparableCategories(); track category.categoryId) {
                  <article class="panel category-comparison">
                    <header class="category-heading">
                      <div>
                        <p class="eyebrow">{{ categoryAnsweredLabel(category.answeredInteractionCount) }}</p>
                        <h2>{{ categoryLabel(category.categoryId) }}</h2>
                      </div>
                      <div class="affinity-value">
                        <strong>{{ category.affinityPercentage === null ? '—' : category.affinityPercentage + '%' }}</strong>
                        <span>{{ i18n.t('comparison.affinity') }}</span>
                      </div>
                    </header>

                    @if (category.affinityPercentage !== null) {
                      <div class="progress-track" aria-hidden="true"><span [style.width.%]="category.affinityPercentage"></span></div>
                      <p class="muted category-note">{{ categoryBasisLabel(category.affinityBasisCount, category.boundaryCount) }}</p>
                    } @else if (category.boundaryCount > 0) {
                      <p class="muted category-note">{{ i18n.t('comparison.categoryOnlyBoundaries') }}</p>
                    }

                    <div class="interaction-list">
                      @for (interaction of category.interactions; track interaction.id) {
                        <article class="interaction-row">
                          <div class="interaction-title">
                            <strong>{{ practiceLabel(interaction.practiceId) }}</strong>
                            <span class="comparison-badge">{{ roleRelationLabel(interaction.roleRelation) }}</span>
                            <span class="comparison-badge">{{ classificationLabel(interaction.compatibility.classification) }}</span>
                          </div>
                          <div class="answer-pair">
                            <div>
                              <span class="profile-name">{{ leftProfile.metadata.alias || i18n.t('common.firstProfile') }}</span>
                              <strong>{{ roleLabel(interaction.practiceId, interaction.left.roleId) }}</strong>
                              <span>{{ preferenceLabel(interaction.left.answer.preference) }}</span>
                            </div>
                            <span class="pair-arrow" aria-hidden="true">↔</span>
                            <div>
                              <span class="profile-name">{{ rightProfile.metadata.alias || i18n.t('common.secondProfile') }}</span>
                              <strong>{{ roleLabel(interaction.practiceId, interaction.right.roleId) }}</strong>
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
                <p class="muted omitted-note">{{ omittedCategoriesLabel(categoriesWithoutComparableAnswers()) }}</p>
              }
            }
          } @else if (catalogueStore.loading()) {
            <section class="panel"><h2>{{ i18n.t('comparison.loading.title') }}</h2><p class="muted">{{ i18n.t('comparison.loading.description') }}</p></section>
          }
        }
      } @else {
        <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1><p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p></section>
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
  readonly i18n = inject(TranslationService);
  private readonly catalogueText = inject(CatalogueTextService);
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

  contextIssueMessage(issues: ComparisonContextIssues): string {
    if (issues.leftSexMissing && issues.rightSexMissing) return this.i18n.t('comparison.missingSex.both');
    if (issues.leftSexMissing) return this.i18n.t('comparison.missingSex.left');
    if (issues.rightSexMissing) return this.i18n.t('comparison.missingSex.right');
    return '';
  }

  categoryAnsweredLabel(count: number): string {
    return this.i18n.plural(count, 'comparison.categoryAnswered.one', 'comparison.categoryAnswered.other');
  }

  categoryBasisLabel(count: number, boundaries: number): string {
    return this.i18n.plural(count, 'comparison.categoryBasis.one', 'comparison.categoryBasis.other', { boundaries });
  }

  omittedCategoriesLabel(count: number): string {
    return this.i18n.plural(count, 'comparison.omitted.one', 'comparison.omitted.other');
  }

  categoryLabel(categoryId: string): string {
    const category = this.catalogueStore.snapshot()?.catalogue.categories.find((candidate) => candidate.id === categoryId);
    return category ? this.catalogueText.categoryLabel(category) : categoryId;
  }

  practiceLabel(practiceId: string): string {
    const practice = this.catalogueStore.snapshot()?.catalogue.practices.find((candidate) => candidate.id === practiceId);
    return practice ? this.catalogueText.practiceLabel(practice) : practiceId;
  }

  roleLabel(practiceId: string, roleId: string): string {
    const practice = this.catalogueStore.snapshot()?.catalogue.practices.find((candidate) => candidate.id === practiceId);
    const role = practice?.roles.find((candidate) => candidate.id === roleId);
    return role ? this.catalogueText.roleLabel(practiceId, role) : roleId;
  }

  preferenceLabel(preference: Preference): string {
    return this.i18n.t(PREFERENCE_LABEL_KEYS[preference]);
  }

  classificationLabel(classification: ComparisonClassification): string {
    return this.i18n.t(COMPARISON_CLASSIFICATION_LABEL_KEYS[classification]);
  }

  roleRelationLabel(relation: RoleRelation): string {
    return this.i18n.t(ROLE_RELATION_LABEL_KEYS[relation]);
  }
}
