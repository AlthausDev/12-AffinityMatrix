import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PortableProfile } from '../../../application/profile/portable-profile';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { ProfileStore } from '../../core/profile.store';
import { PROFILE_CODE_CODEC } from '../../core/profile-codec.token';
import { TranslationService } from '../../i18n/translation.service';
import { TranslationKey } from '../../i18n/ui/es-ui.translations';
import { BrandMarkComponent } from '../../shared/brand-mark.component';

@Component({
  selector: 'app-profile-import-page',
  imports: [RouterLink, BrandMarkComponent],
  template: `
    <main class="page narrow-page profile-entry-page">
      <a class="back-link profile-entry-back" routerLink="/">{{ i18n.t('import.backProfiles') }}</a>

      <header class="page-header profile-entry-header">
        <p class="eyebrow">{{ i18n.t('import.eyebrow') }}</p>
        <div class="subpage-title-row">
          <app-brand-mark />
          <h1>{{ i18n.t('import.title') }}</h1>
        </div>
        <p class="muted">{{ i18n.t('import.description') }}</p>
      </header>

      <section class="profile-entry-panel form-grid">
        <label class="field">
          <span>{{ i18n.t('import.codeLabel') }}</span>
          <textarea
            class="profile-entry-code-box"
            [placeholder]="i18n.t('import.codePlaceholder')"
            [value]="code()"
            (input)="updateCode($event)"
          ></textarea>
        </label>

        @if (codeError(); as errorKey) {
          <p class="alert profile-entry-alert" role="alert">{{ i18n.t(errorKey) }}</p>
        }

        <div class="form-actions">
          <button class="button" type="button" [disabled]="!code().trim()" (click)="inspectCode()">
            {{ i18n.t('import.inspect') }}
          </button>
        </div>
      </section>

      @if (preview(); as portable) {
        <section class="profile-entry-panel profile-entry-preview" aria-labelledby="import-preview-title">
          <div>
            <p class="eyebrow">{{ i18n.t('import.validProfile') }}</p>
            <h2 id="import-preview-title">{{ portable.metadata.alias || i18n.t('common.untitledProfile') }}</h2>
            <p class="muted">{{ answerSummary(portable) }}</p>
          </div>

          <dl class="status-list">
            <div>
              <dt>{{ i18n.t('import.sex') }}</dt>
              <dd>{{ sexLabel(portable.metadata.sex) }}</dd>
            </div>
            <div>
              <dt>{{ i18n.t('import.orientation') }}</dt>
              <dd>{{ orientationLabel(portable.metadata.orientation) }}</dd>
            </div>
            <div>
              <dt>{{ i18n.t('import.localSettings') }}</dt>
              <dd>{{ i18n.t('import.localSettingsReset') }}</dd>
            </div>
          </dl>

          <div class="form-actions import-actions">
            <button class="button secondary" type="button" disabled>{{ i18n.t('import.compareWithoutSaving') }}</button>
            <button class="button" type="button" [disabled]="profileStore.saving()" (click)="saveProfile()">
              {{ profileStore.saving() ? i18n.t('common.saving') : i18n.t('import.saveBrowser') }}
            </button>
          </div>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImportPageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly i18n = inject(TranslationService);
  private readonly codec = inject(PROFILE_CODE_CODEC);
  private readonly router = inject(Router);

  readonly code = signal('');
  readonly preview = signal<PortableProfile | null>(null);
  readonly codeError = signal<TranslationKey | null>(null);

  updateCode(event: Event): void {
    this.code.set((event.target as HTMLTextAreaElement).value);
    this.preview.set(null);
    this.codeError.set(null);
  }

  inspectCode(): void {
    try {
      this.preview.set(this.codec.decode(this.code()));
      this.codeError.set(null);
    } catch {
      this.preview.set(null);
      this.codeError.set('import.error.read');
    }
  }

  async saveProfile(): Promise<void> {
    const portable = this.preview();
    if (!portable) return;
    const saved = await this.profileStore.importPortable(portable);
    if (saved) {
      await this.router.navigate(['/profiles', saved.id]);
      return;
    }
    this.codeError.set('import.error.save');
  }

  answerSummary(portable: PortableProfile): string {
    const count = Object.keys(portable.answers).length;
    return this.i18n.plural(count, 'import.answerCount.one', 'import.answerCount.other', {
      version: portable.catalogueVersion,
    });
  }

  sexLabel(sex: Sex | undefined): string {
    if (!sex) return this.i18n.t('common.notShared');
    return this.i18n.t(sex === 'male' ? 'profileEditor.sex.male' : 'profileEditor.sex.female');
  }

  orientationLabel(orientation: SexualOrientation | undefined): string {
    if (!orientation) return this.i18n.t('common.notShared');
    if (orientation === 'heterosexual') return this.i18n.t('profileEditor.orientation.heterosexual');
    if (orientation === 'homosexual') return this.i18n.t('profileEditor.orientation.homosexual');
    return this.i18n.t('profileEditor.orientation.bisexual');
  }
}
