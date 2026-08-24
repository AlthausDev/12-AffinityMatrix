import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, form, maxLength } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PROFILE_ALIAS_MAX_LENGTH,
  ProfileMetadata,
  Sex,
  SexualOrientation,
} from '../../../domain/profile/profile-metadata';
import { ProfileSettings } from '../../../domain/profile/profile-settings';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { CatalogueTextService } from '../../i18n/catalogue-text.service';
import { TranslationService } from '../../i18n/translation.service';
import { ProfileDeleteDialogComponent } from '../../profile/profile-delete-dialog.component';
import { BrandMarkComponent } from '../../shared/brand-mark.component';

interface ProfileFormModel {
  alias: string;
  sex: '' | Sex;
  orientation: '' | SexualOrientation;
  filterQuestionnaireByMetadata: boolean;
}

@Component({
  selector: 'app-profile-editor-page',
  imports: [FormField, RouterLink, BrandMarkComponent, ProfileDeleteDialogComponent],
  template: `
    <main class="page narrow-page profile-entry-page profile-editor-page">
      <a class="back-link profile-entry-back" [routerLink]="backLink">
        {{ isEditing ? i18n.t('export.backProfile') : i18n.t('dashboard.backProfiles') }}
      </a>

      @if (profileId && !existingProfile) {
        <section class="panel profile-entry-panel">
          <h1>{{ i18n.t('common.profileNotFound.title') }}</h1>
          <p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p>
          <a class="button" routerLink="/">{{ i18n.t('common.returnToProfiles') }}</a>
        </section>
      } @else {
        <header class="page-header profile-entry-header">
          <div class="profile-entry-brand-slot"><app-brand-mark /></div>
          <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
          <h1>{{ i18n.t(isEditing ? 'profileEditor.editTitle' : 'profileEditor.createTitle') }}</h1>
          <p class="muted">{{ i18n.t('profileEditor.description') }}</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert profile-entry-alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
        }

        <form class="profile-editor-form" (submit)="save($event)">
          <section class="profile-entry-panel profile-editor-section">
            <header class="profile-editor-section-heading">
              <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
              <h2>{{ i18n.t('dashboard.profileData.eyebrow') }}</h2>
            </header>

            <div class="form-grid">
              <label class="field">
                <span>{{ i18n.t('profileEditor.alias') }}</span>
                <input type="text" autocomplete="off" [placeholder]="i18n.t('common.optional')" [formField]="profileForm.alias" />
                @if (profileForm.alias().touched() && profileForm.alias().invalid()) {
                  <small class="field-error">{{ i18n.t('validation.alias.maxLength', { max: aliasMaxLength }) }}</small>
                }
              </label>

              <div class="profile-editor-field-grid">
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
              </div>
            </div>
          </section>

          <section class="profile-entry-panel profile-editor-section">
            <header class="profile-editor-section-heading">
              <p class="eyebrow">{{ i18n.t('dashboard.questionnaire.eyebrow') }}</p>
              <h2>{{ i18n.t('profileEditor.filter.title') }}</h2>
            </header>

            <label class="check-field">
              <input type="checkbox" [formField]="profileForm.filterQuestionnaireByMetadata" />
              <span>
                <strong>{{ i18n.t('profileEditor.filter.title') }}</strong>
                <small>{{ i18n.t('profileEditor.filter.description') }}</small>
              </span>
            </label>
            <p class="muted form-note">{{ i18n.t('profileEditor.filter.note') }}</p>

            @if (isEditing) {
              <div class="profile-editor-category-section">
                <div class="profile-editor-category-heading">
                  <div>
                    <strong>{{ i18n.t('settings.categories.title') }}</strong>
                    <p class="muted">{{ i18n.t('settings.categories.description') }}</p>
                  </div>
                  @if (hiddenCategoryIds().length > 0) {
                    <button class="button secondary profile-editor-compact-action" type="button" (click)="showAllCategories()">
                      {{ i18n.t('settings.categories.showAll') }}
                    </button>
                  }
                </div>

                @if (categories().length > 0) {
                  <div class="profile-editor-category-list" [attr.aria-label]="i18n.t('settings.categories.aria')">
                    @for (category of categories(); track category.id) {
                      <label class="profile-editor-category-row">
                        <input
                          type="checkbox"
                          [checked]="!preferences.isCategoryHidden(profileId!, category.id)"
                          (change)="toggleCategory(category.id, $event)"
                        />
                        <span>
                          <strong>{{ catalogueText.categoryLabel(category) }}</strong>
                          <small>{{ catalogueText.categoryDescription(category) }}</small>
                        </span>
                      </label>
                    }
                  </div>
                }

                <p class="muted profile-editor-local-note">{{ i18n.t('settings.localOnly') }}</p>
              </div>
            }
          </section>

          <div class="form-actions profile-editor-save-actions">
            <a class="button secondary" [routerLink]="backLink">{{ i18n.t('common.cancel') }}</a>
            <button class="button" type="submit" [disabled]="profileStore.saving()">
              {{ profileStore.saving() ? i18n.t('common.saving') : i18n.t(isEditing ? 'profileEditor.saveChanges' : 'common.createProfile') }}
            </button>
          </div>
        </form>

        @if (isEditing) {
          <section class="panel profile-editor-danger" aria-labelledby="profile-editor-delete-title">
            <div>
              <p class="eyebrow">{{ i18n.t('settings.danger.eyebrow') }}</p>
              <h2 id="profile-editor-delete-title">{{ i18n.t('settings.danger.title') }}</h2>
              <p class="muted">{{ i18n.t('settings.danger.description') }}</p>
            </div>
            <button class="button danger" type="button" (click)="deleteDialogOpen.set(true)">
              {{ i18n.t('settings.danger.action') }}
            </button>
          </section>
        }
      }
    </main>

    @if (isEditing && deleteDialogOpen() && profileId) {
      <app-profile-delete-dialog
        [profileId]="profileId"
        [alias]="existingProfile?.metadata?.alias ?? ''"
        (cancelled)="deleteDialogOpen.set(false)"
        (deleted)="onProfileDeleted()"
      />
    }
  `,
  styles: `
    .profile-editor-form { display: grid; gap: 1rem; }
    .profile-editor-section { display: grid; gap: 1rem; }
    .profile-editor-section-heading { padding-bottom: 0.7rem; border-bottom: 1px solid rgba(105, 130, 183, 0.18); }
    .profile-editor-section-heading .eyebrow { margin-bottom: 0.25rem; }
    .profile-editor-section-heading h2 { margin: 0; font-size: 1.15rem; }
    .profile-editor-field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .profile-editor-category-section { display: grid; gap: 0.8rem; margin-top: 0.15rem; padding-top: 1rem; border-top: 1px solid rgba(105, 130, 183, 0.18); }
    .profile-editor-category-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .profile-editor-category-heading p { margin: 0.25rem 0 0; font-size: 0.78rem; line-height: 1.45; }
    .profile-editor-compact-action { flex: 0 0 auto; min-height: 2.2rem; padding: 0.4rem 0.7rem; font-size: 0.72rem; }
    .profile-editor-category-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
    .profile-editor-category-row { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: flex-start; gap: 0.6rem; padding: 0.7rem; border: 1px solid color-mix(in srgb, var(--border-subtle) 68%, transparent); border-radius: 0.6rem; background: rgba(7, 18, 43, 0.34); cursor: pointer; }
    .profile-editor-category-row input { margin-top: 0.18rem; accent-color: var(--neon-violet); }
    .profile-editor-category-row span { display: grid; gap: 0.18rem; min-width: 0; }
    .profile-editor-category-row strong { font-size: 0.76rem; }
    .profile-editor-category-row small { color: var(--text-secondary); font-size: 0.68rem; line-height: 1.35; }
    .profile-editor-local-note { margin: 0; font-size: 0.72rem; }
    .profile-editor-save-actions { margin-top: 0; padding: 1rem; border: 1px solid color-mix(in srgb, var(--border-subtle) 52%, transparent); border-radius: 0.8rem; background: rgba(9, 18, 41, 0.44); }
    .profile-editor-danger { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; margin-top: 1.25rem; border-color: color-mix(in srgb, var(--preference-boundary) 36%, transparent); }
    .profile-editor-danger p:last-child { margin-bottom: 0; line-height: 1.5; }
    .profile-editor-danger .button { flex: 0 0 auto; }
    @media (max-width: 640px) {
      .profile-editor-field-grid, .profile-editor-category-list { grid-template-columns: 1fr; }
      .profile-editor-category-heading, .profile-editor-danger { align-items: stretch; flex-direction: column; }
      .profile-editor-danger .button { width: 100%; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditorPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);
  readonly preferences = inject(UiPreferencesService);
  readonly catalogueText = inject(CatalogueTextService);
  private readonly catalogueStore = inject(CatalogueStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly aliasMaxLength = PROFILE_ALIAS_MAX_LENGTH;
  readonly profileId = this.route.snapshot.paramMap.get('id');
  readonly existingProfile = this.profileId ? this.profileStore.findById(this.profileId) : undefined;
  readonly isEditing = this.profileId !== null;
  readonly backLink = this.profileId ? ['/profiles', this.profileId] : ['/'];
  readonly deleteDialogOpen = signal(false);
  readonly hiddenCategoryIds = computed(() => this.profileId ? this.preferences.hiddenCategoryIds(this.profileId) : []);
  readonly categories = computed(() =>
    [...(this.catalogueStore.snapshot()?.catalogue.categories ?? [])]
      .sort((left, right) => left.order - right.order),
  );

  readonly model = signal<ProfileFormModel>({
    alias: this.existingProfile?.metadata.alias ?? '',
    sex: this.existingProfile?.metadata.sex ?? '',
    orientation: this.existingProfile?.metadata.orientation ?? '',
    filterQuestionnaireByMetadata:
      this.existingProfile?.settings.filterQuestionnaireByMetadata ?? true,
  });

  readonly profileForm = form(this.model, (schemaPath) => {
    maxLength(schemaPath.alias, PROFILE_ALIAS_MAX_LENGTH, {
      message: 'profile.alias.maxLength',
    });
  });

  constructor() {
    if (this.isEditing) void this.catalogueStore.initialize();
  }

  toggleCategory(categoryId: string, event: Event): void {
    if (!this.profileId) return;
    this.preferences.setCategoryHidden(
      this.profileId,
      categoryId,
      !(event.target as HTMLInputElement).checked,
    );
  }

  showAllCategories(): void {
    if (this.profileId) this.preferences.showAllCategories(this.profileId);
  }

  onProfileDeleted(): void {
    this.deleteDialogOpen.set(false);
    void this.router.navigate(['/']);
  }

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
