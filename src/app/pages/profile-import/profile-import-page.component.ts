import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PortableProfile } from '../../../application/profile/portable-profile';
import { ProfileStore } from '../../core/profile.store';
import { PROFILE_CODE_CODEC } from '../../core/profile-codec.token';

@Component({
  selector: 'app-profile-import-page',
  imports: [RouterLink],
  template: `
    <main class="page narrow-page">
      <a class="back-link" routerLink="/">← Profiles</a>
      <header class="page-header"><p class="eyebrow">Portability</p><h1>Import profile</h1><p class="muted">Paste a profile code to inspect it before deciding whether to save it in this browser.</p></header>
      <section class="panel form-grid">
        <label class="field"><span>Profile code</span><textarea class="code-box" placeholder="Paste profile code" [value]="code()" (input)="updateCode($event)"></textarea></label>
        @if (codeError()) { <p class="alert" role="alert">{{ codeError() }}</p> }
        <div class="form-actions"><button class="button" type="button" [disabled]="!code().trim()" (click)="inspectCode()">Inspect profile</button></div>
      </section>

      @if (preview(); as portable) {
        <section class="panel import-preview" aria-labelledby="import-preview-title">
          <div><p class="eyebrow">Valid profile</p><h2 id="import-preview-title">{{ portable.metadata.alias || 'Untitled profile' }}</h2><p class="muted">{{ answerCount(portable) }} answered roles</p></div>
          <dl class="status-list">
            <div><dt>Sex</dt><dd>{{ portable.metadata.sex || 'Not specified' }}</dd></div>
            <div><dt>Orientation</dt><dd>{{ portable.metadata.orientation || 'Not specified' }}</dd></div>
            <div><dt>Local settings</dt><dd>Reset on import</dd></div>
          </dl>
          <div class="form-actions import-actions"><button class="button secondary" type="button" disabled>Compare without saving</button><button class="button" type="button" (click)="saveProfile()">Save in this browser</button></div>
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
  private readonly profileStore = inject(ProfileStore);
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
    } catch (error: unknown) {
      this.preview.set(null);
      this.codeError.set(error instanceof Error ? error.message : 'The profile code could not be read.');
    }
  }

  saveProfile(): void {
    const portable = this.preview();
    if (!portable) return;
    const saved = this.profileStore.importPortable(portable);
    if (saved) {
      void this.router.navigate(['/profiles', saved.id]);
      return;
    }
    this.codeError.set(this.profileStore.error() ?? 'The profile could not be saved.');
  }

  answerCount(portable: PortableProfile): number { return Object.keys(portable.answers).length; }
}
