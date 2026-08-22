import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PortableProfile } from '../../../application/profile/portable-profile';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { ProfileStore } from '../../core/profile.store';
import { PROFILE_CODE_CODEC } from '../../core/profile-codec.token';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-profile-import-page',
  imports: [RouterLink],
  template: `
    <main class="page narrow-page">
      <a class="back-link" routerLink="/">{{ i18n.t('import.backProfiles') }}</a>
      <header class="page-header">
        <p class="eyebrow">{{ i18n.t('import.eyebrow') }}</p>
        <h1>{{ i18n.t('import.title') }}</h1>
        <p class="muted">{{ i18n.t('import.description') }}</p>
      </header>
      <section class="panel form-grid">
        <label class="field">
          <span>{{ i18n.t('import.codeLabel') }}</span>
          <textarea class="code-box" [placeholder]="i18n.t('import.codePlaceholder')" [value]="code()" (input)="updateCode($event)"></textarea>
        </label>
        @if (codeError()) { <p class="alert" role="alert">{{ codeError() }}</p> }
        <div class="form-actions"><button class="button" type="button" [disabled]="!code().trim()" (click)="inspectCode()">{{ i18n.t('import.inspect') }}</button></div>
      </section>

      @if (preview(); as portable) {
        <section class="panel import-preview" aria-labelledby="import-preview-title">
          <div>
            <p class="eyebrow">{{ i18n.t('import.validProfile') }}</p>
            <h2 id="import-preview-title">{{ portable.metadata.alias || i18n.t('common.untitledProfile') }}</h2>
            <p class="muted">{{ answerSummary(portable) }}</p>
          </div>
          <dl class="status-list">
            <div><dt>{{ i18n.t('import.sex') }}</dt><dd>{{ sexLabel(portable.metadata.sex) }}</dd></div>
            <div><dt>{{ i18n.t('import.orientation') }}</dt><dd>{{ orientationLabel(portable.metadata.orientation) }}</dd></div>
            <div><dt>{{ i18n.t('import.localSettings') }}</dt><dd>{{ i18n.t('import.localSettingsReset') }}</dd></div>
          </dl>
          <div class="form-actions import-actions">
            <button class="button secondary" type="button" disabled>{{ i18n.t('import.compareWithoutSaving') }}</button>
            <button class="button" type="button" [disabled]="profileStore.saving()" (click)="saveProfile()">{{ profileStore.saving() ? i18n.t('common.saving') : i18n.t('import.saveBrowser') }}</button>
          </div>
        </section>
      }
    </main>
  `,
  styles: `
    .code-box { min-height: 12rem; resize: vertical; padding: 0.75rem; border: 1px solid var(--border-strong); border-radius: 0.5rem; background: var(--surface-elevated); color: var(--text-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.8rem; line-height: 1.45; }
    .import-preview { margin-top: 1.5rem; }
    .import-actions { margin-top: 1.5rem; }
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
  readonly codeError = signal('');

  updateCode(event: Event): void {
    this.code.set((event.target as HTMLTextAreaElement).value);
    this.preview.set(null);
    this.codeError.set('');
  }

  inspectCode(): void {
    try {
      this.preview.set(this.codec.decode(this.code()));
      this.codeError.set('');
    } catch {
      this.preview.set(null);
      this.codeError.set(this.i18n.t('import.error.read'));
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
    this.codeError.set(this.i18n.t('import.error.save'));
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
