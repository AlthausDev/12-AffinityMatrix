import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, form, maxLength } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PhysicalPreferences } from '../../../domain/profile/physical-preferences';
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
import { PhysicalPreferencesEditorComponent } from '../../profile/physical-preferences-editor.component';
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
  imports: [
    FormField,
    RouterLink,
    BrandMarkComponent,
    PhysicalPreferencesEditorComponent,
    ProfileDeleteDialogComponent,
  ],
  template: `
    <main
      class="page narrow-page profile-entry-page profile-editor-page"
      [class.profile-editor-page-editing]="isEditing"
    >
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
          <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
          <div class="subpage-title-row">
            <app-brand-mark />
            <h1>{{ i18n.t(isEditing ? 'profileEditor.editTitle' : 'profileEditor.createTitle') }}</h1>
          </div>
          <p class="muted">{{ i18n.t('profileEditor.description') }}</p>
        </header>

        @if (profileStore.error()) {
          <p class="alert profile-entry-alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
        }

        <div
          class="profile-editor-layout"
          [class.profile-editor-layout-with-sidebar]="isEditing"
        >
          <div class="profile-editor-main">
            <form id="profile-editor-form" class="profile-editor-form" (submit)="save($event)">
              <section class="profile-entry-panel profile-editor-section">
                <header class="profile-editor-section-heading">
                  <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
                  <h2>{{ i18n.t('dashboard.profileData.eyebrow') }}</h2>
                </header>

                <div class="form-grid">
                  <label class="field">
                    <span>{{ i18n.t('profileEditor.alias') }}</span>
                    <input
                      type="text"
                      autocomplete="off"
                      [placeholder]="i18n.t('common.optional')"
                      [formField]="profileForm.alias"
                    />
                    @if (profileForm.alias().touched() && profileForm.alias().invalid()) {
                      <small class="field-error">
                        {{ i18n.t('validation.alias.maxLength', { max: aliasMaxLength }) }}
                      </small>
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

              <app-physical-preferences-editor
                [value]="physicalPreferences()"
                [sex]="model().sex"
                [orientation]="model().orientation"
                (valueChange)="physicalPreferences.set($event)"
              />

              <section class="profile-entry-panel profile-editor-section">
                <header class="profile-editor-section-heading">
                  <p class="eyebrow">{{ i18n.t('dashboard.questionnaire.eyebrow') }}</p>
                  <h2>{{ i18n.t('dashboard.questionnaire.eyebrow') }}</h2>
                </header>

                <label class="check-field">
                  <input type="checkbox" [formField]="profileForm.filterQuestionnaireByMetadata" />
                  <span>
                    <strong>{{ i18n.t('profileEditor.filter.title') }}</strong>
                    <small>{{ i18n.t('profileEditor.filter.description') }}</small>
                  </span>
                </label>
                <p class="muted form-note">{{ i18n.t('profileEditor.filter.note') }}</p>
              </section>
            </form>

            @if (isEditing) {
              <details class="profile-entry-panel profile-editor-categories">
                <summary>
                  <span class="profile-editor-category-summary-copy">
                    <span class="eyebrow">{{ i18n.t('settings.eyebrow') }}</span>
                    <strong>{{ i18n.t('settings.categories.title') }}</strong>
                  </span>
                  <span class="profile-editor-category-count">
                    {{ visibleCategoryCount() }} / {{ categories().length }}
                  </span>
                  <span class="profile-editor-category-chevron" aria-hidden="true">⌄</span>
                </summary>

                <div class="profile-editor-category-body">
                  <div class="profile-editor-category-tools">
                    <p class="muted">{{ i18n.t('settings.categories.description') }}</p>
                    @if (hiddenCategoryIds().length > 0) {
                      <button
                        class="button secondary profile-editor-compact-action"
                        type="button"
                        (click)="showAllCategories()"
                      >
                        {{ i18n.t('settings.categories.showAll') }}
                      </button>
                    }
                  </div>

                  @if (categories().length > 0) {
                    <div
                      class="profile-editor-category-list"
                      [attr.aria-label]="i18n.t('settings.categories.aria')"
                    >
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
              </details>
            }

            <div class="form-actions profile-editor-save-actions">
              <a class="button secondary" [routerLink]="backLink">{{ i18n.t('common.cancel') }}</a>
              <button
                class="button"
                type="submit"
                form="profile-editor-form"
                [disabled]="profileStore.saving()"
              >
                {{ profileStore.saving()
                  ? i18n.t('common.saving')
                  : i18n.t(isEditing ? 'profileEditor.saveChanges' : 'common.createProfile') }}
              </button>
            </div>
          </div>

          @if (isEditing) {
            <aside class="profile-editor-sidebar" [attr.aria-label]="i18n.t('settings.danger.eyebrow')">
              <section class="panel profile-editor-management-card">
                <p class="eyebrow">{{ i18n.t('profileEditor.eyebrow') }}</p>
                <h2>{{ i18n.t('settings.danger.eyebrow') }}</h2>

                <div class="profile-editor-danger-zone">
                  <p class="profile-editor-danger-label">{{ i18n.t('settings.danger.zone') }}</p>
                  <h3>{{ i18n.t('settings.danger.title') }}</h3>
                  <p class="muted">{{ i18n.t('settings.danger.description') }}</p>
                  <button class="button danger" type="button" (click)="deleteDialogOpen.set(true)">
                    {{ i18n.t('settings.danger.action') }}
                  </button>
                </div>
              </section>
            </aside>
          }
        </div>
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
  readonly hiddenCategoryIds = computed(() =>
    this.profileId ? this.preferences.hiddenCategoryIds(this.profileId) : [],
  );
  readonly categories = computed(() =>
    [...(this.catalogueStore.snapshot()?.catalogue.categories ?? [])]
      .sort((left, right) => left.order - right.order),
  );
  readonly visibleCategoryCount = computed(() => {
    const hidden = new Set(this.hiddenCategoryIds());
    return this.categories().filter((category) => !hidden.has(category.id)).length;
  });

  readonly model = signal<ProfileFormModel>({
    alias: this.existingProfile?.metadata.alias ?? '',
    sex: this.existingProfile?.metadata.sex ?? '',
    orientation: this.existingProfile?.metadata.orientation ?? '',
    filterQuestionnaireByMetadata:
      this.existingProfile?.settings.filterQuestionnaireByMetadata ?? true,
  });
  readonly physicalPreferences = signal<PhysicalPreferences>(
    this.existingProfile?.physicalPreferences ?? {},
  );

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
      ? await this.profileStore.updateProfile(this.profileId, metadata, settings, this.physicalPreferences())
      : await this.profileStore.create(metadata, settings, this.physicalPreferences());

    if (saved) {
      await this.router.navigate(['/profiles', saved.id]);
    }
  }
}
