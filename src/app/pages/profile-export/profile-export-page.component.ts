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
        <header class="page-header"><p class="eyebrow">Portability</p><h1>Export profile</h1><p class="muted">This code contains readable profile data encoded for portability. Treat it as private information.</p></header>
        <section class="panel form-grid">
          <label class="field"><span>Profile code</span><textarea class="code-box" readonly [value]="code()"></textarea></label>
          @if (copyStatus()) { <p class="muted form-note" role="status">{{ copyStatus() }}</p> }
          <div class="form-actions"><button class="button" type="button" (click)="copyCode()">Copy code</button></div>
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
  readonly code = computed(() => {
    const profile = this.profile();
    return profile ? this.codec.encode(profile) : '';
  });
  readonly copyStatus = signal('');

  async copyCode(): Promise<void> {
    try {
      if (!navigator.clipboard) {
        this.copyStatus.set('Clipboard access is unavailable. Select and copy the code manually.');
        return;
      }
      await navigator.clipboard.writeText(this.code());
      this.copyStatus.set('Profile code copied.');
    } catch {
      this.copyStatus.set('Could not access the clipboard. Select and copy the code manually.');
    }
  }
}
