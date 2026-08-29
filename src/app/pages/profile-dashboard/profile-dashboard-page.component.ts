import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { RolePerspective } from '../../../domain/catalogue/practice';
import { Preference } from '../../../domain/profile/preference';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { CatalogueStore } from '../../core/catalogue.store';
import { PROFILE_STORAGE_CONTEXT } from '../../core/profile-repository.token';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { CatalogueTaxonomyService } from '../../i18n/catalogue-taxonomy.service';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { PointerGlowDirective } from '../../shared/pointer-glow.directive';
import {
  buildPreferenceDistribution,
  buildRoleProfile,
  buildSubcategoryProgress,
} from './profile-dashboard-insights';

@Component({
  selector: 'app-profile-dashboard-page',
  imports: [RouterLink, RouterOutlet, CompletionProgressComponent, PointerGlowDirective],
  template: `
    <main class="page profile-dashboard">
      <nav class="dashboard-topbar" [attr.aria-label]="i18n.t('dashboard.actionsLabel')">
        <a class="dashboard-back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>

        @if (profile(); as currentProfile) {
          <a class="dashboard-settings-link" [routerLink]="['/profiles', currentProfile.id, 'settings']">
            {{ i18n.t('dashboard.settings.action') }}
          </a>
        }
      </nav>

      @if (profile(); as currentProfile) {
        <header class="dashboard-hero" appPointerGlow>
          <div class="dashboard-hero-copy">
            <p class="eyebrow">{{ i18n.t('dashboard.localProfile') }}</p>
            <h1 [title]="profileDisplayName()">{{ profileDisplayName() }}</h1>

            <div class="dashboard-profile-chips">
              <span>{{ sexLabel(currentProfile.metadata.sex) }}</span>
              <span>{{ orientationLabel(currentProfile.metadata.orientation) }}</span>
              <span class="dashboard-filter-chip">
                {{ i18n.t('dashboard.status.questionFilter') }} ·
                {{ i18n.t(currentProfile.settings.filterQuestionnaireByMetadata ? 'dashboard.status.enabled' : 'dashboard.status.disabled') }}
              </span>
            </div>

            <p class="dashboard-updated">
              {{ i18n.t('dashboard.header.updated', { date: updatedAtLabel(currentProfile.updatedAt) }) }}
            </p>
          </div>

          <div class="dashboard-progress-visual">
            @if (totalQuestions() > 0) {
              <div
                [class]="completionRingClass()"
                [style.--completion]="completionPercentage() + '%'"
                role="img"
                [attr.aria-label]="i18n.t('dashboard.header.progressAria', { percentage: completionPercentage() })"
              >
                <div class="completion-ring-core">
                  <strong>{{ completionPercentage() }}%</strong>
                  <span>{{ i18n.t('dashboard.header.progress') }}</span>
                </div>
              </div>
              <div class="dashboard-progress-caption">
                <strong>{{ totalAnswered() }} / {{ totalQuestions() }}</strong>
                <span>{{ i18n.t('dashboard.header.visibleAnswered', { answered: totalAnswered(), total: totalQuestions() }) }}</span>
                <span class="dashboard-progress-categories">
                  {{ i18n.t('dashboard.header.categoriesComplete', { completed: completedCategories(), total: totalCategories() }) }}
                </span>
              </div>
            } @else {
              <div class="completion-ring completion-ring-muted" aria-hidden="true">
                <div class="completion-ring-core"><strong>—</strong><span>{{ i18n.t('dashboard.header.progress') }}</span></div>
              </div>
              <p class="dashboard-progress-message">{{ visibleProgressStatus() }}</p>
            }
          </div>
        </header>

        @if (profileStore.error()) {
          <p class="alert dashboard-storage-alert" role="alert">{{ i18n.t('homeHub.storage.error') }}</p>
        } @else if (storageContext.mode !== 'persistent') {
          <p class="dashboard-storage-notice" role="status">
            <span aria-hidden="true">◇</span>
            {{ i18n.t(storageContext.mode === 'session' ? 'homeHub.storage.session' : 'homeHub.storage.memory') }}
          </p>
        }

        <section class="dashboard-actions-section" aria-labelledby="dashboard-actions-title">
          <header class="dashboard-section-heading">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.actions.eyebrow') }}</p>
              <h2 id="dashboard-actions-title">{{ i18n.t('dashboard.actions.title') }}</h2>
            </div>
          </header>

          <div class="dashboard-action-grid">
            <a
              class="dashboard-action dashboard-action-primary"
              appPointerGlow
              [routerLink]="['/profiles', currentProfile.id, 'questionnaire']"
            >
              <span class="dashboard-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z"/><path d="M9 3.5h6v3H9zM8.5 10h7M8.5 14h4.5"/></svg>
              </span>
              <span class="dashboard-action-copy">
                <span class="eyebrow">{{ i18n.t('dashboard.questionnaire.eyebrow') }}</span>
                <strong>{{ i18n.t(savedAnswerCount() > 0 ? 'dashboard.questionnaire.continueTitle' : 'dashboard.questionnaire.startTitle') }}</strong>
                <small>{{ i18n.t('dashboard.questionnaire.description') }}</small>
              </span>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </a>

            <a
              class="dashboard-action dashboard-action-compare"
              appPointerGlow
              [routerLink]="['/profiles', currentProfile.id, 'compare']"
            >
              <span class="dashboard-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 8h12M13 5l3 3-3 3M20 16H8M11 13l-3 3 3 3"/></svg>
              </span>
              <span class="dashboard-action-copy">
                <span class="eyebrow">{{ i18n.t('dashboard.comparison.eyebrow') }}</span>
                <strong>{{ i18n.t('dashboard.comparison.title') }}</strong>
                <small>{{ i18n.t('dashboard.comparison.description') }}</small>
              </span>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </a>

            <a
              class="dashboard-action"
              appPointerGlow
              [routerLink]="['/profiles', currentProfile.id, 'edit']"
            >
              <span class="dashboard-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m5 19 3.8-.8L18 9l-3-3-9.2 9.2L5 19ZM13.5 7.5l3 3"/></svg>
              </span>
              <span class="dashboard-action-copy">
                <span class="eyebrow">{{ i18n.t('dashboard.profileData.eyebrow') }}</span>
                <strong>{{ i18n.t('dashboard.profileData.title') }}</strong>
                <small>{{ i18n.t('dashboard.profileData.description') }}</small>
              </span>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </a>

            <a
              class="dashboard-action"
              appPointerGlow
              [routerLink]="['/profiles', currentProfile.id, 'glossary']"
            >
              <span class="dashboard-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 4.5h5.5A2.5 2.5 0 0 1 13 7v12a3 3 0 0 0-3-3H5V4.5Z"/><path d="M19 4.5h-3.5A2.5 2.5 0 0 0 13 7v12a3 3 0 0 1 3-3h3V4.5Z"/></svg>
              </span>
              <span class="dashboard-action-copy">
                <span class="eyebrow">{{ i18n.t('dashboard.glossary.eyebrow') }}</span>
                <strong>{{ i18n.t('dashboard.glossary.title') }}</strong>
                <small>{{ i18n.t('dashboard.glossary.description') }}</small>
              </span>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </a>

            <a
              class="dashboard-action"
              appPointerGlow
              [routerLink]="['/profiles', currentProfile.id, 'export']"
            >
              <span class="dashboard-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"/></svg>
              </span>
              <span class="dashboard-action-copy">
                <span class="eyebrow">{{ i18n.t('dashboard.portability.eyebrow') }}</span>
                <strong>{{ i18n.t('dashboard.portability.title') }}</strong>
                <small>{{ i18n.t('dashboard.portability.description') }}</small>
              </span>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section class="dashboard-insights-section" aria-labelledby="dashboard-insights-title">
          <header class="dashboard-section-heading dashboard-insights-heading">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.insights.eyebrow') }}</p>
              <h2 id="dashboard-insights-title">{{ i18n.t('dashboard.insights.title') }}</h2>
            </div>
            <p>{{ i18n.t('dashboard.insights.description') }}</p>
          </header>

          <div class="dashboard-insight-grid">
            <article class="dashboard-chart-card dashboard-preference-card">
              <header class="dashboard-chart-heading">
                <div>
                  <h3>{{ i18n.t('dashboard.preference.title') }}</h3>
                  <p>{{ i18n.t('dashboard.preference.description') }}</p>
                </div>
              </header>

              @if (savedAnswerCount() > 0) {
                <div class="dashboard-preference-layout">
                  <div class="preference-donut" [style.background]="preferenceChartGradient()" aria-hidden="true">
                    <div class="preference-donut-core">
                      <strong>{{ savedAnswerCount() }}</strong>
                      <span>{{ preferenceTotalLabel(savedAnswerCount()) }}</span>
                    </div>
                  </div>

                  <div class="preference-legend">
                    @for (entry of preferenceDistribution(); track entry.preference) {
                      <div class="preference-legend-row" [class.preference-legend-zero]="entry.count === 0">
                        <span class="preference-legend-swatch" [attr.data-preference]="entry.preference" aria-hidden="true"></span>
                        <span class="preference-legend-label">{{ preferenceLabel(entry.preference) }}</span>
                        <span class="preference-legend-value">{{ entry.count }} · {{ entry.percentage }}%</span>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="dashboard-chart-empty">
                  <span aria-hidden="true">◇</span>
                  <p>{{ i18n.t('dashboard.preference.empty') }}</p>
                </div>
              }
            </article>

            <article class="dashboard-chart-card dashboard-role-card">
              <header class="dashboard-chart-heading">
                <div>
                  <h3>{{ i18n.t('dashboard.roleProfile.title') }}</h3>
                  <p>{{ i18n.t('dashboard.roleProfile.description') }}</p>
                </div>
              </header>

              @if (roleProfileAnswerCount() > 0) {
                <div class="dashboard-role-legend">
                  <span>
                    <span class="dashboard-role-legend-swatch dashboard-role-legend-swatch-affinity" aria-hidden="true"></span>
                    {{ i18n.t('dashboard.roleProfile.affinity') }} · {{ i18n.t('dashboard.roleProfile.affinityHint') }}
                  </span>
                  <span>
                    <span class="dashboard-role-legend-swatch dashboard-role-legend-swatch-favorite" aria-hidden="true"></span>
                    {{ i18n.t('dashboard.roleProfile.favorites') }}
                  </span>
                </div>

                <div class="dashboard-role-profile">
                  @for (entry of roleProfile(); track entry.perspective) {
                    <div class="dashboard-role-row" [class.dashboard-role-row-empty]="entry.answerCount === 0">
                      <div class="dashboard-role-row-heading">
                        <strong>{{ rolePerspectiveLabel(entry.perspective) }}</strong>
                        <span>{{ roleProfileAnswerLabel(entry.answerCount) }}</span>
                      </div>

                      <div class="dashboard-role-metrics">
                        <div class="dashboard-role-metric">
                          <div class="dashboard-role-metric-label">
                            <span>{{ i18n.t('dashboard.roleProfile.affinity') }}</span>
                            <strong>{{ entry.affinityPercentage }}%</strong>
                          </div>
                          <div
                            class="dashboard-role-track"
                            role="img"
                            [attr.aria-label]="rolePerspectiveLabel(entry.perspective) + ' · ' + i18n.t('dashboard.roleProfile.affinity') + ' ' + entry.affinityPercentage + '%'"
                          >
                            <span class="dashboard-role-fill dashboard-role-fill-affinity" [style.width.%]="entry.affinityPercentage"></span>
                          </div>
                        </div>

                        <div class="dashboard-role-metric">
                          <div class="dashboard-role-metric-label">
                            <span>{{ i18n.t('dashboard.roleProfile.favorites') }}</span>
                            <strong>{{ entry.favoritePercentage }}%</strong>
                          </div>
                          <div
                            class="dashboard-role-track"
                            role="img"
                            [attr.aria-label]="rolePerspectiveLabel(entry.perspective) + ' · ' + i18n.t('dashboard.roleProfile.favorites') + ' ' + entry.favoritePercentage + '%'"
                          >
                            <span class="dashboard-role-fill dashboard-role-fill-favorite" [style.width.%]="entry.favoritePercentage"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="dashboard-chart-empty">
                  <span aria-hidden="true">◇</span>
                  <p>{{ i18n.t('dashboard.roleProfile.empty') }}</p>
                </div>
              }
            </article>
          </div>

          <article class="dashboard-chart-card dashboard-category-card">
            <header class="dashboard-chart-heading dashboard-category-heading">
              <div>
                <h3>{{ i18n.t('dashboard.category.title') }}</h3>
                <p>{{ i18n.t('dashboard.category.description') }}</p>
              </div>
              @if (totalCategories() > 0) {
                <strong>{{ completedCategories() }} / {{ totalCategories() }}</strong>
              }
            </header>

            @if (categorySummaries().length > 0) {
              <div class="dashboard-category-bars">
                @for (summary of categorySummaries(); track summary.category.id) {
                  <div
                    class="dashboard-category-row"
                    [class.dashboard-category-row-expanded]="isCategoryExpanded(summary.category.id)"
                  >
                    <button
                      class="dashboard-category-toggle"
                      type="button"
                      [attr.aria-expanded]="isCategoryExpanded(summary.category.id)"
                      [attr.aria-controls]="'dashboard-category-detail-' + summary.category.id"
                      (click)="toggleCategory(summary.category.id)"
                    >
                      <div class="dashboard-category-copy">
                        <strong [title]="catalogueText.categoryLabel(summary.category)">{{ catalogueText.categoryLabel(summary.category) }}</strong>
                        <span class="dashboard-category-value">{{ i18n.t('dashboard.status.categoryValue', { answered: summary.answered, total: summary.total, percentage: summary.completionPercentage }) }}</span>
                        <span class="dashboard-category-chevron" aria-hidden="true">⌄</span>
                      </div>
                      <app-completion-progress [value]="summary.completionPercentage" />
                    </button>

                    @if (isCategoryExpanded(summary.category.id)) {
                      <div
                        class="dashboard-subcategory-list"
                        [id]="'dashboard-category-detail-' + summary.category.id"
                      >
                        @for (detail of categorySubcategoryProgress(summary.category.id); track detail.id) {
                          <a
                            class="dashboard-subcategory-row"
                            [routerLink]="['/profiles', currentProfile.id, 'questionnaire', summary.category.id]"
                            [queryParams]="{ subcategory: detail.id }"
                          >
                            <div class="dashboard-subcategory-copy">
                              <strong [title]="detail.description">{{ detail.label }}</strong>
                              <span>{{ i18n.t('dashboard.status.categoryValue', { answered: detail.answered, total: detail.total, percentage: detail.completionPercentage }) }}</span>
                            </div>
                            <app-completion-progress [value]="detail.completionPercentage" />
                          </a>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <p class="dashboard-category-message">{{ visibleProgressStatus() }}</p>
            }
          </article>
        </section>

        <section class="dashboard-details" aria-labelledby="dashboard-details-title">
          <h2 id="dashboard-details-title">{{ i18n.t('dashboard.details.title') }}</h2>
          <dl>
            <div><dt>{{ i18n.t('dashboard.details.catalogue') }}</dt><dd>v{{ currentProfile.catalogueVersion }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.details.format') }}</dt><dd>v{{ currentProfile.schemaVersion }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.details.storage') }}</dt><dd>{{ storageLabel() }}</dd></div>
          </dl>
        </section>
      } @else {
        <section class="panel dashboard-not-found">
          <h1>{{ i18n.t('common.profileNotFound.title') }}</h1>
          <p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p>
          <a class="button" routerLink="/">{{ i18n.t('common.returnToProfiles') }}</a>
        </section>
      }
    </main>
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  readonly catalogueText = inject(CatalogueTextService);
  readonly storageContext = inject(PROFILE_STORAGE_CONTEXT);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly taxonomy = inject(CatalogueTaxonomyService);
  private readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly savedAnswerCount = computed(() => Object.keys(this.profile()?.answers ?? {}).length);
  readonly hiddenCategoryIds = computed(() => this.preferences.hiddenCategoryIds(this.profileId));
  readonly expandedCategoryIds = signal<ReadonlySet<string>>(new Set());
  readonly categorySummaries = computed(() => {
    const profile = this.profile();
    const snapshot = this.catalogueStore.snapshot();
    if (!profile || !snapshot) return [];

    return this.questionnaireService
      .getCategorySummaries(snapshot, profile, false, this.hiddenCategoryIds())
      .filter((summary) => summary.total > 0);
  });
  readonly totalAnswered = computed(() => this.categorySummaries().reduce((sum, item) => sum + item.answered, 0));
  readonly totalQuestions = computed(() => this.categorySummaries().reduce((sum, item) => sum + item.total, 0));
  readonly completionPercentage = computed(() => {
    const total = this.totalQuestions();
    return total === 0 ? 0 : Math.round((this.totalAnswered() / total) * 100);
  });
  readonly totalCategories = computed(() => this.categorySummaries().length);
  readonly completedCategories = computed(() =>
    this.categorySummaries().filter((summary) => summary.answered === summary.total).length,
  );
  readonly preferenceDistribution = computed(() => buildPreferenceDistribution(this.profile()));
  readonly roleProfile = computed(() =>
    buildRoleProfile(this.profile(), this.catalogueStore.snapshot()?.catalogue.practices),
  );
  readonly roleProfileAnswerCount = computed(() =>
    this.roleProfile().reduce((sum, entry) => sum + entry.answerCount, 0),
  );
  readonly preferenceChartGradient = computed(() => {
    const active = this.preferenceDistribution().filter((entry) => entry.count > 0);
    if (active.length === 0) return 'conic-gradient(rgba(107, 122, 166, 0.18) 0% 100%)';

    const segments = active.map((entry) =>
      `${this.preferenceColor(entry.preference)} ${entry.startPercentage.toFixed(4)}% ${entry.endPercentage.toFixed(4)}%`,
    );
    return `conic-gradient(${segments.join(', ')})`;
  });

  constructor() {
    void this.catalogueStore.initialize();
  }

  profileDisplayName(): string {
    return this.profile()?.metadata.alias?.trim() || this.i18n.t('common.untitledProfile');
  }

  completionRingClass(): string {
    const value = this.completionPercentage();
    if (value < 20) return 'completion-ring completion-ring-danger';
    if (value < 40) return 'completion-ring completion-ring-low';
    if (value < 60) return 'completion-ring completion-ring-mid';
    if (value < 80) return 'completion-ring completion-ring-high';
    return 'completion-ring completion-ring-complete';
  }

  isCategoryExpanded(categoryId: string): boolean {
    return this.expandedCategoryIds().has(categoryId);
  }

  toggleCategory(categoryId: string): void {
    this.expandedCategoryIds.update((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  categorySubcategoryProgress(categoryId: string) {
    const profile = this.profile();
    const snapshot = this.catalogueStore.snapshot();
    if (!profile || !snapshot) return [];

    const category = this.questionnaireService.getCategory(snapshot, profile, categoryId, false);
    return buildSubcategoryProgress(
      this.taxonomy.subcategoriesFor(categoryId),
      category?.practices,
    );
  }

  rolePerspectiveLabel(perspective: RolePerspective): string {
    if (perspective === 'active') return this.i18n.t('dashboard.roleProfile.active');
    if (perspective === 'receptive') return this.i18n.t('dashboard.roleProfile.receptive');
    return this.i18n.t('dashboard.roleProfile.neutral');
  }

  roleProfileAnswerLabel(count: number): string {
    return this.i18n.plural(
      count,
      'dashboard.roleProfile.answers.one',
      'dashboard.roleProfile.answers.other',
    );
  }

  preferenceLabel(preference: Preference): string {
    if (preference === 'favorite') return this.i18n.t('preference.favorite');
    if (preference === 'like') return this.i18n.t('preference.like');
    if (preference === 'depends') return this.i18n.t('preference.depends');
    if (preference === 'curious') return this.i18n.t('preference.curious');
    if (preference === 'not-interested') return this.i18n.t('preference.notInterested');
    return this.i18n.t('preference.boundary');
  }

  preferenceTotalLabel(count: number): string {
    return this.i18n.plural(count, 'dashboard.preference.total.one', 'dashboard.preference.total.other');
  }

  visibleProgressStatus(): string {
    if (this.catalogueStore.loading()) return this.i18n.t('dashboard.status.catalogueLoading');
    if (this.catalogueStore.error()) return this.i18n.t('dashboard.status.catalogueUnavailable');
    return this.i18n.t('dashboard.status.noVisibleQuestions');
  }

  storageLabel(): string {
    if (this.storageContext.mode === 'persistent') return this.i18n.t('dashboard.details.storagePersistent');
    if (this.storageContext.mode === 'session') return this.i18n.t('dashboard.details.storageSession');
    return this.i18n.t('dashboard.details.storageMemory');
  }

  updatedAtLabel(value: string): string {
    return new Intl.DateTimeFormat(this.i18n.locale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  sexLabel(sex: Sex | undefined): string {
    if (!sex) return this.i18n.t('dashboard.sexNotSpecified');
    return this.i18n.t(sex === 'male' ? 'profileEditor.sex.male' : 'profileEditor.sex.female');
  }

  orientationLabel(orientation: SexualOrientation | undefined): string {
    if (!orientation) return this.i18n.t('dashboard.orientationNotSpecified');
    if (orientation === 'heterosexual') return this.i18n.t('profileEditor.orientation.heterosexual');
    if (orientation === 'homosexual') return this.i18n.t('profileEditor.orientation.homosexual');
    return this.i18n.t('profileEditor.orientation.bisexual');
  }

  private preferenceColor(preference: Preference): string {
    if (preference === 'favorite') return 'var(--preference-favorite)';
    if (preference === 'like') return 'var(--preference-positive)';
    if (preference === 'depends') return 'var(--preference-conditional)';
    if (preference === 'curious') return 'var(--preference-curious)';
    if (preference === 'not-interested') return 'var(--preference-negative)';
    return 'var(--preference-boundary)';
  }
}
