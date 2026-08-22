import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { TranslationService } from '../../i18n/translation.service';
import { ProfileDeleteDialogComponent } from '../../profile/profile-delete-dialog.component';

@Component({
  selector: 'app-settings-page',
  imports: [RouterLink, ProfileDeleteDialogComponent],
  template: `
    <main class="page narrow-page">
      <a class="back-link" [routerLink]="['/profiles', profileId]">{{ i18n.t('settings.backProfile') }}</a>

      <header class="page-header">
        <p class="eyebrow">{{ i18n.t('settings.eyebrow') }}</p>
        <h1>{{ i18n.t('settings.title') }}</h1>
        <p class="muted lead">{{ i18n.t('settings.description') }}</p>
      </header>

      <section class="panel settings-panel">
        <label class="check-field settings-option">
          <input
            type="checkbox"
            [checked]="preferences.confirmQuestionnaireExit()"
            (change)="toggleQuestionnaireExitConfirmation($event)"
          />
          <span>
            <strong>{{ i18n.t('settings.questionnaireExit.title') }}</strong>
            <small>{{ i18n.t('settings.questionnaireExit.description') }}</small>
          </span>
        </label>
        <p class="muted local-note">{{ i18n.t('settings.localOnly') }}</p>
      </section>

      <section class="panel danger-panel" aria-labelledby="delete-profile-title">
        <div>
          <p class="eyebrow">{{ i18n.t('settings.danger.eyebrow') }}</p>
          <h2 id="delete-profile-title">{{ i18n.t('settings.danger.title') }}</h2>
          <p class="muted">{{ i18n.t('settings.danger.description') }}</p>
        </div>
        <button class="button danger" type="button" [disabled]="!profile()" (click)="deleteDialogOpen.set(true)">
          {{ i18n.t('settings.danger.action') }}
        </button>
      </section>
    </main>

    @if (deleteDialogOpen()) {
      <app-profile-delete-dialog
        [profileId]="profileId"
        [alias]="profile()?.metadata?.alias ?? ''"
        (cancelled)="deleteDialogOpen.set(false)"
        (deleted)="onProfileDeleted()"
      />
    }
  `,
  styles: `
    .settings-panel { display: grid; gap: 1rem; }
    .settings-option { background: color-mix(in srgb, var(--surface-elevated) 70%, transparent); }
    .local-note { margin: 0; font-size: 0.85rem; }
    .danger-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      margin-top: 1rem;
      border-color: color-mix(in srgb, var(--preference-boundary) 36%, transparent);
    }
    .danger-panel p:last-child { margin-bottom: 0; line-height: 1.5; }
    .danger-panel .button { flex: 0 0 auto; }
    @media (max-width: 640px) {
      .danger-panel { align-items: stretch; flex-direction: column; }
      .danger-panel .button { width: 100%; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  readonly i18n = inject(TranslationService);
  readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileStore = inject(ProfileStore);

  readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly deleteDialogOpen = signal(false);

  toggleQuestionnaireExitConfirmation(event: Event): void {
    this.preferences.setConfirmQuestionnaireExit((event.target as HTMLInputElement).checked);
  }

  onProfileDeleted(): void {
    this.deleteDialogOpen.set(false);
    void this.router.navigate(['/']);
  }
}
