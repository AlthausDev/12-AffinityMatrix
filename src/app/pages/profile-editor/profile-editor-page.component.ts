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
import { TranslationService } from '../../i18n/translation.service';

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
      <a class="back-link" [routerLink]="backLink">{{ isEditing ? i18n.t('export.backProfile') : i18n.t('dashboard.backProfiles') }}</a>

      @if (profileId && !existingProfile) {
        <section class="panel">
          <h1>{{ i18n.t('common.profileNotFound.title') }}</h1>
          <p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p>
          <a class="button" routerLink="/">{{ i18n.t('common.returnToProfiles') }}</a>
        </section>
      } @else {
        <header class="page-header">
          <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
          <h1>{{ i18n.t(isEditing ? 'profileEditor.editTitle' : 'profileEditor.createTitle') }}</h1>
          <p class="muted">{{ i18n.t('profileEditor.description') }}</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
        }

        <form class="panel form-grid" (submit)="save($event)">
          <label class="field">
            <span>{{ i18n.t('profileEditor.alias') }}</span>
            <input type="text" autocomplete="off" [placeholder]="i18n.t('common.optional')" [formField]="profileForm.alias" />
            @if (profileForm.alias().touched() && profileForm.alias().invalid()) {
              <small class="field-error">{{ profileForm.alias().errors()[0].message }}</small>
            }
          </label>

          <label class="field">
            <span>{{ i18n.t('profileEditor.sex') }}</span>
            <select [formField]="profileForm.sex">
              <option value="">{{ i18n.t('profileEditor.preferNotSpecify') }}</option>
              <option value="male">{{ i18n.t('profileEditor.sex.male') }}</option>
              <option value="female">{{ i18n.t('profileEditor.sex.female') }}</option>
            </select>
          </label>

          <label class="field">
            <span>{{ i18n.t('profileEditor.orientation') }}</span>
            <select [formField]="profileForm.orientation">
              <option value="">{{ i18n.t('profileEditor.preferNotSpecify') }}</option>
              <option value="heterosexual">{{ i18n.t('profileEditor.orientation.heterosexual') }}</option>
              <option value="homosexual">{{ i18n.t('profileEditor.orientation.homosexual') }}</option>
              <option value="bisexual">{{ i18n.t('profileEditor.orientation.bisexual') }}</option>
            </select>
          </label>

          <label class="check-field">
            <input type="checkbox" [formField]="profileForm.filterQuestionnaireByMetadata" />
            <span>
              <strong>{{ i18n.t('profileEditor.filter.title') }}</strong>
              <small>{{ i18n.t('profileEditor.filter.description') }}</small>
            </span>
          </label>

          <p class="muted form-note">{{ i18n.t('profileEditor.filter.note') }}</p>

          <div class="form-actions">
            <a class="button secondary" [routerLink]="backLink">{{ i18n.t('common.cancel') }}</a>
            <button class="button" type="submit" [disabled]="profileStore.saving()">
              {{ profileStore.saving() ? i18n.t('common.saving') : i18n.t(isEditing ? 'profileEditor.saveChanges' : 'common.createProfile') }}
            </button>
          </div>
        </form>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditorPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);
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
      message: this.i18n.t('validation.alias.maxLength', { max: PROFILE_ALIAS_MAX_LENGTH }),
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
