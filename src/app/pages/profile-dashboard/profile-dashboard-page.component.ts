import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { ProfileStore } from '../../core/profile.store';

const SEX_LABELS: Record<Sex, string> = { male: 'Male', female: 'Female' };
const ORIENTATION_LABELS: Record<SexualOrientation, string> = {
  heterosexual: 'Heterosexual',
  homosexual: 'Homosexual',
  bisexual: 'Bisexual',
};

@Component({
  selector: 'app-profile-dashboard-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a class="back-link" routerLink="/">← Profiles</a>

      @if (profile(); as currentProfile) {
        <header class="page-header dashboard-header">
          <div>
            <p class="eyebrow">Local profile</p>
            <h1>{{ currentProfile.metadata.alias || 'Untitled profile' }}</h1>
            <p class="muted profile-meta">{{ sexLabel(currentProfile.metadata.sex) }} · {{ orientationLabel(currentProfile.metadata.orientation) }}</p>
          </div>
          <p class="profile-count">{{ answeredCount() }} answered</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert" role="alert">{{ profileStore.error() }}</p>
        }

        <section class="action-grid" aria-label="Profile actions">
          <article class="action-card">
            <div><p class="eyebrow">Questionnaire</p><h2>{{ answeredCount() > 0 ? 'Continue or modify' : 'Start questionnaire' }}</h2><p class="muted">Work category by category. Answers are saved locally as you go.</p></div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'questionnaire']">{{ answeredCount() > 0 ? 'Continue' : 'Start' }}</a>
          </article>
          <article class="action-card">
            <div><p class="eyebrow">Comparison</p><h2>Compare profiles</h2><p class="muted">Find complementary answered interactions and category-level affinity using the current catalogue.</p></div>
            <a class="button" [routerLink]="['/profiles', currentProfile.id, 'compare']">Compare</a>
          </article>
          <article class="action-card"><div><p class="eyebrow">Profile data</p><h2>Edit profile</h2><p class="muted">Change alias, optional filtering data, or filter behavior.</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'edit']">Edit</a></article>
          <article class="action-card"><div><p class="eyebrow">Portability</p><h2>Export or share</h2><p class="muted">Generate a versioned code that can be copied to another device.</p></div><a class="button" [routerLink]="['/profiles', currentProfile.id, 'export']">Export</a></article>
        </section>

        <section class="panel profile-status" aria-labelledby="profile-status-title">
          <div><p class="eyebrow">MVP status</p><h2 id="profile-status-title">Profile data</h2></div>
          <dl class="status-list">
            <div><dt>Question filter</dt><dd>{{ currentProfile.settings.filterQuestionnaireByMetadata ? 'Enabled' : 'Disabled' }}</dd></div>
            <div><dt>Answered questions</dt><dd>{{ answeredCount() }}</dd></div>
            <div><dt>Revision</dt><dd>{{ currentProfile.revision }}</dd></div>
            <div><dt>Catalogue</dt><dd>v{{ currentProfile.catalogueVersion }}</dd></div>
            <div><dt>Storage</dt><dd>Local browser · not encrypted</dd></div>
          </dl>
        </section>
      } @else {
        <section class="panel"><h1>Profile not found</h1><p class="muted">The requested profile is not available in local storage.</p><a class="button" routerLink="/">Return to profiles</a></section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardPageComponent {
  readonly profileStore = inject(ProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly answeredCount = computed(() => Object.keys(this.profile()?.answers ?? {}).length);

  sexLabel(sex: Sex | undefined): string { return sex ? SEX_LABELS[sex] : 'Sex not specified'; }
  orientationLabel(orientation: SexualOrientation | undefined): string { return orientation ? ORIENTATION_LABELS[orientation] : 'Orientation not specified'; }
}
