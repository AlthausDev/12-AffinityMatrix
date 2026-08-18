import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PROFILE_ALIAS_MAX_LENGTH,
  ProfileMetadata,
  Sex,
  SexualOrientation,
} from '../../../domain/profile/profile-metadata';
import { ProfileSettings } from '../../../domain/profile/profile-settings';
import { ProfileStore } from '../../core/profile.store';

interface ProfileFormModel {
  alias: string;
  sex: '' | Sex;
  orientation: '' | SexualOrientation;
  filterQuestionnaireByMetadata: boolean;
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
          <p class="muted">These details are optional. Sex and orientation are used locally for questionnaire filtering and are excluded from exports unless you explicitly include them.</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert" role="alert">{{ profileStore.error() }}</p>
        }

        <form class="panel form-grid" (submit)="save($event)">
          <label class="field">
            <span>Alias</span>
            <input type="text" autocomplete="off" placeholder="Optional" [formField]="profileForm.alias" />
            @if (profileForm.alias().touched() && profileForm.alias().invalid()) {
              <small class="field-error">{{ profileForm.alias().errors()[0].message }}</small>
            }
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
            <input type="checkbox" [formField]="profileForm.filterQuestionnaireByMetadata" />
            <span>
              <strong>Filter questionnaire</strong>
              <small>Hide roles that do not match the optional profile data above.</small>
            </span>
          </label>

          <p class="muted form-note">Changing these values never removes existing answers. Filtered questions remain part of the profile and can be shown again later.</p>

          <div class="form-actions">
            <a class="button secondary" [routerLink]="backLink">Cancel</a>
            <button class="button" type="submit" [disabled]="profileStore.saving()">{{ profileStore.saving() ? 'Saving…' : (isEditing ? 'Save changes' : 'Create profile') }}</button>
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
    filterQuestionnaireByMetadata:
      this.existingProfile?.settings.filterQuestionnaireByMetadata ?? true,
  });

  readonly profileForm = form(this.model, (schemaPath) => {
    maxLength(schemaPath.alias, PROFILE_ALIAS_MAX_LENGTH, {
      message: `Alias cannot exceed ${PROFILE_ALIAS_MAX_LENGTH} characters.`,
    });
  });

  async save(event: Event): Promise<void> {
    event.preventDefault();
    this.profileStore.clearError();
    this.profileForm().markAsTouched();

    if (this.profileForm().invalid()) {
      this.profileForm.alias().focusBoundControl();
      return;
    }

    const value = this.model();
    const alias = value.alias.trim();
    const metadata: ProfileMetadata = {
      ...(alias ? { alias } : {}),
      ...(value.sex ? { sex: value.sex } : {}),
      ...(value.orientation ? { orientation: value.orientation } : {}),
    };
    const settings: ProfileSettings = {
      filterQuestionnaireByMetadata: value.filterQuestionnaireByMetadata,
    };

    const saved = this.profileId
      ? await this.profileStore.updateProfile(this.profileId, metadata, settings)
      : await this.profileStore.create(metadata, settings);

    if (saved) {
      await this.router.navigate(['/profiles', saved.id]);
    }
  }
}
