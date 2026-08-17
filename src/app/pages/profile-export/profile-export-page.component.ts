import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { encodeProfileCode } from '../../../infrastructure/serialization/profile-codec';

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
          <p class="muted">
            This code contains the portable profile data. Keep it private and paste it into another
            browser to restore or compare the profile.
          </p>
        </header>

        <section class="panel form-grid">
          <label class="field">
            <span>Profile code</span>
            <textarea class="code-box" readonly [value]="code()"></textarea>
          </label>

          @if (copyStatus()) {
            <p class="muted form-note" role="status">{{ copyStatus() }}</p>
          }

          <div class="form-actions">
            <button class="button" type="button" (click)="copyCode()">Copy code</button>
          </div>
        </section>

        <p class="privacy-note">
          <strong>Nothing is uploaded.</strong>
          <span class="muted">The code is generated entirely in this browser.</span>
        </p>
      } @else {
        <a class="back-link" routerLink="/">← Profiles</a>
        <section class="panel">
          <h1>Profile not found</h1>
          <p class="muted">The requested profile is not available in local storage.</p>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileExportPageComponent {
  private readonly profileStore = inject(ProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly code = computed(() => {
    const profile = this.profile();
    return profile ? encodeProfileCode(profile) : '';
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
