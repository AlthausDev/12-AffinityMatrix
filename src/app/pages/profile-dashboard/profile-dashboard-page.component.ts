import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { ProfileStore } from '../../core/profile.store';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-profile-dashboard-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>

      @if (profile(); as currentProfile) {
        <header class="page-header dashboard-header">
          <div>
            <p class="eyebrow">{{ i18n.t('dashboard.localProfile') }}</p>
            <h1>{{ currentProfile.metadata.alias || i18n.t('common.untitledProfile') }}</h1>
            <p class="muted profile-meta">{{ sexLabel(currentProfile.metadata.sex) }} · {{ orientationLabel(currentProfile.metadata.orientation) }}</p>
          </div>
          <p class="profile-count">{{ answeredLabel(answeredCount()) }}</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert" role="alert">{{ profileStore.error() }}</p>
        }

        <section class="action-grid" [attr.aria-label]="i18n.t('dashboard.actionsLabel')">
          <article class="action-card">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.questionnaire.eyebrow') }}</p>
              <h2>{{ i18n.t(answeredCount() > 0 ? 'dashboard.questionnaire.continueTitle' : 'dashboard.questionnaire.startTitle') }}</h2>
              <p class="muted">{{ i18n.t('dashboard.questionnaire.description') }}</p>
            </div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">{{ i18n.t(answeredCount() > 0 ? 'dashboard.questionnaire.continue' : 'dashboard.questionnaire.start') }}</a>
          </article>
          <article class="action-card">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.comparison.eyebrow') }}</p>
              <h2>{{ i18n.t('dashboard.comparison.title') }}</h2>
              <p class="muted">{{ i18n.t('dashboard.comparison.description') }}</p>
            </div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'compare']">{{ i18n.t('dashboard.comparison.action') }}</a>
          </article>
          <article class="action-card">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.profileData.eyebrow') }}</p>
              <h2>{{ i18n.t('dashboard.profileData.title') }}</h2>
              <p class="muted">{{ i18n.t('dashboard.profileData.description') }}</p>
            </div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'edit']">{{ i18n.t('dashboard.profileData.action') }}</a>
          </article>
          <article class="action-card">
            <div>
              <p class="eyebrow">{{ i18n.t('dashboard.portability.eyebrow') }}</p>
              <h2>{{ i18n.t('dashboard.portability.title') }}</h2>
              <p class="muted">{{ i18n.t('dashboard.portability.description') }}</p>
            </div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'export']">{{ i18n.t('dashboard.portability.action') }}</a>
          </article>
        </section>

        <section class="panel profile-status" aria-labelledby="profile-status-title">
          <div><p class="eyebrow">{{ i18n.t('dashboard.status.eyebrow') }}</p><h2 id="profile-status-title">{{ i18n.t('dashboard.status.title') }}</h2></div>
          <dl class="status-list">
            <div><dt>{{ i18n.t('dashboard.status.questionFilter') }}</dt><dd>{{ i18n.t(currentProfile.settings.filterQuestionnaireByMetadata ? 'dashboard.status.enabled' : 'dashboard.status.disabled') }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.answeredQuestions') }}</dt><dd>{{ answeredCount() }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.revision') }}</dt><dd>{{ currentProfile.revision }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.catalogue') }}</dt><dd>v{{ currentProfile.catalogueVersion }}</dd></div>
            <div><dt>{{ i18n.t('dashboard.status.storage') }}</dt><dd>{{ i18n.t('dashboard.status.localNotEncrypted') }}</dd></div>
          </dl>
        </section>
      } @else {
        <section class="panel">
          <h1>{{ i18n.t('common.profileNotFound.title') }}</h1>
          <p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p>
          <a class="button" routerLink="/">{{ i18n.t('common.returnToProfiles') }}</a>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly answeredCount = computed(() => Object.keys(this.profile()?.answers ?? {}).length);

  answeredLabel(count: number): string {
    return this.i18n.plural(count, 'dashboard.answered.one', 'dashboard.answered.other');
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
}
