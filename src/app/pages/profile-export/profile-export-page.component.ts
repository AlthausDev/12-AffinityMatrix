import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { PROFILE_CODE_CODEC } from '../../core/profile-codec.token';

@Component({
  selector: 'app-profile-export-page',
  imports: [RouterLink],
  template: `
    <main class="page narrow-page">
      @if (profile(); as currentProfile) {
        <a class="back-link" [routerLink]="['/profiles', currentProfile.id]">← Profile</a>
        <header class="page-header">
          <p class="eyebrow">Portability</p>
          <h1>Export profile</h1>
          <p class="muted">Answers and the optional alias are included. Sex and orientation stay local unless you explicitly include them below.</p>
        </header>
        <section class="panel form-grid">
          @if (currentProfile.metadata.sex || currentProfile.metadata.orientation) {
            <label class="check-field">
              <input type="checkbox" [checked]="includeSensitiveMetadata()" (change)="toggleSensitiveMetadata($event)" />
              <span><strong>Include sex and orientation</strong><small>Only enable this when the recipient needs those profile details.</small></span>
            </label>
          }
          <label class="field"><span>Profile code</span><textarea class="code-box" readonly [value]="exportResult().code"></textarea></label>
          @if (exportResult().error) { <p class="alert" role="alert">{{ exportResult().error }}</p> }
          @if (copyStatus()) { <p class="muted form-note" role="status">{{ copyStatus() }}</p> }
          <div class="form-actions"><button class="button" type="button" [disabled]="!exportResult().code" (click)="copyCode()">Copy code</button></div>
        </section>
        <p class="privacy-note"><strong>Nothing is uploaded.</strong><span class="muted">The code is generated entirely in this browser, but Base64URL encoding and its checksum are not encryption.</span></p>
      } @else {
        <a class="back-link" routerLink="/">← Profiles</a><section class="panel"><h1>Profile not found</h1><p class="muted">The requested profile is not available in local storage.</p></section>
      }
    </main>
  `,
  styles: `
    .code-box { min-height: 14rem; resize: vertical; padding: 0.75rem; border: 1px solid var(--border-strong); border-radius: 0.5rem; background: var(--surface-elevated); color: var(--text-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.8rem; line-height: 1.45; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileExportPageComponent {
  private readonly profileStore = inject(ProfileStore);
  private readonly codec = inject(PROFILE_CODE_CODEC);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly includeSensitiveMetadata = signal(false);
  readonly copyStatus = signal('');
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
    } catch (error: unknown) {
      return {
        code: '',
        error: error instanceof Error ? error.message : 'The profile could not be exported.',
      };
    }
  });

  toggleSensitiveMetadata(event: Event): void {
    this.includeSensitiveMetadata.set((event.target as HTMLInputElement).checked);
    this.copyStatus.set('');
  }

  async copyCode(): Promise<void> {
    const code = this.exportResult().code;
    if (!code) return;
    try {
      if (!navigator.clipboard) {
        this.copyStatus.set('Clipboard access is unavailable. Select and copy the code manually.');
        return;
      }
      await navigator.clipboard.writeText(code);
      this.copyStatus.set('Profile code copied.');
    } catch {
      this.copyStatus.set('Could not access the clipboard. Select and copy the code manually.');
    }
  }
}
