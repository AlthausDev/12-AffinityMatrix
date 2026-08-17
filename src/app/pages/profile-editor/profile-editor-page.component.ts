import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { ProfileMetadata, Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';

interface ProfileFormModel {
  alias: string;
  sex: '' | Sex;
  orientation: '' | SexualOrientation;
  filterByProfileMetadata: boolean;
}

@Component({
  selector: 'app-profile-editor-page',
  imports: [FormField, RouterLink],
  template: `
    <main class="page narrow-page">
      <a class="back-link" [routerLink]="backLink">← Back</a>

      @if (profileId && !existingProfile) {
        <section class="panel">
          <h1>Profile not found</h1>
          <p class="muted">This profile is not available in local storage.</p>
          <a class="button" routerLink="/">Return to profiles</a>
        </section>
      } @else {
        <header class="page-header">
          <p class="eyebrow">Profile</p>
          <h1>{{ isEditing ? 'Edit profile' : 'Create profile' }}</h1>
          <p class="muted">These details are optional. Sex and orientation are only used to hide questions that are unlikely to apply to the profile.</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert" role="alert">{{ profileStore.error() }}</p>
        }

        <form class="panel form-grid" (submit)="save($event)">
          <label class="field">
            <span>Alias</span>
            <input type="text" autocomplete="off" maxlength="80" placeholder="Optional" [formField]="profileForm.alias" />
          </label>

          <label class="field">
            <span>Sex</span>
            <select [formField]="profileForm.sex">
              <option value="">Prefer not to specify</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label class="field">
            <span>Orientation</span>
            <select [formField]="profileForm.orientation">
              <option value="">Prefer not to specify</option>
              <option value="heterosexual">Heterosexual</option>
              <option value="homosexual">Homosexual</option>
              <option value="bisexual">Bisexual</option>
            </select>
          </label>

          <label class="check-field">
            <input type="checkbox" [formField]="profileForm.filterByProfileMetadata" />
            <span>
              <strong>Filter questionnaire</strong>
              <small>Hide roles that do not match the optional profile data above.</small>
            </span>
          </label>

          <p class="muted form-note">Changing these values never removes existing answers. Filtered questions remain part of the profile and can be shown again later.</p>

          <div class="form-actions">
            <a class="button secondary" [routerLink]="backLink">Cancel</a>
            <button class="button" type="submit">{{ isEditing ? 'Save changes' : 'Create profile' }}</button>
          </div>
        </form>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditorPageComponent {
  readonly profileStore = inject(ProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly profileId = this.route.snapshot.paramMap.get('id');
  readonly existingProfile = this.profileId ? this.profileStore.findById(this.profileId) : undefined;
  readonly isEditing = this.profileId !== null;
  readonly backLink = this.profileId ? ['/profiles', this.profileId] : ['/'];

  readonly model = signal<ProfileFormModel>({
    alias: this.existingProfile?.metadata.alias ?? '',
    sex: this.existingProfile?.metadata.sex ?? '',
    orientation: this.existingProfile?.metadata.orientation ?? '',
    filterByProfileMetadata: this.existingProfile?.metadata.filterByProfileMetadata ?? true,
  });

  readonly profileForm = form(this.model);

  save(event: Event): void {
    event.preventDefault();
    this.profileStore.clearError();

    const value = this.model();
    const alias = value.alias.trim();
    const metadata: ProfileMetadata = {
      filterByProfileMetadata: value.filterByProfileMetadata,
      ...(alias ? { alias } : {}),
      ...(value.sex ? { sex: value.sex } : {}),
      ...(value.orientation ? { orientation: value.orientation } : {}),
    };

    const saved = this.profileId
      ? this.profileStore.updateMetadata(this.profileId, metadata)
      : this.profileStore.create(metadata);

    if (saved) {
      void this.router.navigate(['/profiles', saved.id]);
    }
  }
}
