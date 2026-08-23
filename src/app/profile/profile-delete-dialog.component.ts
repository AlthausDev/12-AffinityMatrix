import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ProfileStore } from '../core/profile.store';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-profile-delete-dialog',
  template: `
    <div class="delete-backdrop">
      <section
        class="delete-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-delete-title"
        aria-describedby="profile-delete-description"
      >
        <p class="eyebrow">{{ i18n.t('settings.danger.eyebrow') }}</p>
        <h2 id="profile-delete-title">{{ i18n.t('profileDeletion.title') }}</h2>
        <p id="profile-delete-description" class="muted">
          {{ i18n.t('profileDeletion.description', { alias: displayAlias() }) }}
        </p>
        <p class="delete-warning">{{ i18n.t('profileDeletion.warning') }}</p>

        @if (failed()) {
          <p class="alert delete-error" role="alert">{{ i18n.t('profileDeletion.failed') }}</p>
        }

        <div class="delete-actions">
          <button class="button danger" type="button" [disabled]="deleting()" (click)="confirmDeletion()">
            {{ i18n.t(deleting() ? 'profileDeletion.deleting' : 'profileDeletion.confirm') }}
          </button>
          <button class="button secondary" type="button" [disabled]="deleting()" (click)="cancel()">
            {{ i18n.t('common.cancel') }}
          </button>
        </div>
      </section>
    </div>
  `,
  styles: `
    .delete-backdrop {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(5, 7, 16, 0.86);
    }
    .delete-dialog {
      width: min(100%, 34rem);
      padding: clamp(1.25rem, 4vw, 2rem);
      border: 2px solid transparent;
      border-radius: 10px;
      background:
        linear-gradient(rgba(27, 34, 54, 0.99), rgba(36, 26, 43, 0.99)) padding-box,
        linear-gradient(135deg, var(--preference-boundary), #b84d94 58%, #6b3de8) border-box;
      box-shadow: 0 1.25rem 4rem rgba(0, 0, 0, 0.5);
    }
    .delete-dialog p { line-height: 1.55; }
    .delete-warning {
      margin: 1rem 0 1.35rem;
      padding: 0.9rem 1rem;
      border: 1px solid color-mix(in srgb, var(--preference-boundary) 52%, transparent);
      border-radius: 0.55rem;
      background: color-mix(in srgb, var(--preference-boundary) 10%, transparent);
      color: #ffe6e9;
    }
    .delete-error { margin-bottom: 1rem; }
    .delete-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }
    .delete-actions .button { width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDeleteDialogComponent {
  readonly profileId = input.required<string>();
  readonly alias = input('');
  readonly cancelled = output<void>();
  readonly deleted = output<void>();

  readonly i18n = inject(TranslationService);
  private readonly profileStore = inject(ProfileStore);

  readonly deleting = signal(false);
  readonly failed = signal(false);

  displayAlias(): string {
    return this.alias().trim() || this.i18n.t('common.untitledProfile');
  }

  cancel(): void {
    if (this.deleting()) return;
    this.cancelled.emit();
  }

  async confirmDeletion(): Promise<void> {
    if (this.deleting()) return;

    this.failed.set(false);
    this.deleting.set(true);
    const deleted = await this.profileStore.delete(this.profileId());
    this.deleting.set(false);

    if (deleted) {
      this.deleted.emit();
      return;
    }

    this.failed.set(true);
  }
}
