import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { PROFILE_CODE_CODEC } from '../../core/profile-codec.token';
import { TranslationService } from '../../i18n/translation.service';
import { TranslationKey } from '../../i18n/ui/es-ui.translations';

@Component({
  selector: 'app-profile-export-page',
  imports: [RouterLink],
  template: `
    <main class="page narrow-page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id]">{{ i18n.t('export.backProfile') }}</a>
        <header class="page-header">
          <p class="eyebrow">{{ i18n.t('export.eyebrow') }}</p>
          <h1>{{ i18n.t('export.title') }}</h1>
          <p class="muted">{{ i18n.t('export.description') }}</p>
        </header>
        <section class="panel form-grid">
          @if (currentProfile.metadata.sex || currentProfile.metadata.orientation) {
            <label class="check-field">
              <input type="checkbox" [checked]="includeSensitiveMetadata()" (change)="toggleSensitiveMetadata($event)" />
              <span><strong>{{ i18n.t('export.includeMetadata.title') }}</strong><small>{{ i18n.t('export.includeMetadata.description') }}</small></span>
            </label>
          }
          <label class="field"><span>{{ i18n.t('export.codeLabel') }}</span><textarea class="code-box" readonly [value]="exportResult().code"></textarea></label>
          @if (exportResult().error) { <p class="alert" role="alert">{{ exportResult().error }}</p> }
          @if (copyStatus(); as status) { <p class="muted form-note" role="status">{{ i18n.t(status) }}</p> }
          <div class="form-actions"><button class="button" type="button" [disabled]="!exportResult().code" (click)="copyCode()">{{ i18n.t('export.copyCode') }}</button></div>
        </section>
        <p class="privacy-note"><strong>{{ i18n.t('export.privacy.title') }}</strong><span class="muted">{{ i18n.t('export.privacy.description') }}</span></p>
      } @else {
        <a class="back-link" routerLink="/">{{ i18n.t('dashboard.backProfiles') }}</a>
        <section class="panel"><h1>{{ i18n.t('common.profileNotFound.title') }}</h1><p class="muted">{{ i18n.t('common.profileNotFound.description') }}</p></section>
      }
    </main>
  `,
  styles: `
    .code-box { min-height: 14rem; resize: vertical; padding: 0.75rem; border: 1px solid var(--border-strong); border-radius: 0.5rem; background: var(--surface-elevated); color: var(--text-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.8rem; line-height: 1.45; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileExportPageComponent {
  readonly i18n = inject(TranslationService);
  private readonly profileStore = inject(ProfileStore);
  private readonly codec = inject(PROFILE_CODE_CODEC);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly includeSensitiveMetadata = signal(false);
  readonly copyStatus = signal<TranslationKey | null>(null);
  readonly exportResult = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return { code: '', error: '' };
    }
    try {
      return {
        code: this.codec.encode(profile, {
          includeSensitiveMetadata: this.includeSensitiveMetadata(),
        }),
        error: '',
      };
    } catch {
      return {
        code: '',
        error: this.i18n.t('export.error.generic'),
      };
    }
  });

  toggleSensitiveMetadata(event: Event): void {
    this.includeSensitiveMetadata.set((event.target as HTMLInputElement).checked);
    this.copyStatus.set(null);
  }

  async copyCode(): Promise<void> {
    const code = this.exportResult().code;
    if (!code) return;
    try {
      if (!navigator.clipboard) {
        this.copyStatus.set('export.clipboard.unavailable');
        return;
      }
      await navigator.clipboard.writeText(code);
      this.copyStatus.set('export.clipboard.copied');
    } catch {
      this.copyStatus.set('export.clipboard.error');
    }
  }
}
